---
title: "Diseñando guardarraíles de gas para rebalanceos de emergencia automatizados"
date: 2026-03-08T09:00:00+02:00
slug: gas-runway-guards-emergency-rebalances
---

Estos días he estado conectando una pieza que echaba de menos en la capa de automatización: una forma de tratar el balance de gas como un riesgo de primer nivel, no como un detalle operativo molesto que solo aparece cuando las transacciones empiezan a fallar.

El problema concreto: hay un pipeline de rebalanceo de emergencia que puede mover capital cuando ciertos pools se vuelven poco saludables. Ese pipeline asume que siempre podrá desplegar transacciones en las cadenas que le interesan. En la práctica, los monederos de gas son finitos, el RPC puede fallar y el monitoreo es ruidoso. Quería una capa de seguridad que hiciera explícitas esas restricciones y forzara a la automatización a comportarse de forma conservadora cuando el gas es bajo o la visión de la cadena es poco fiable.

## Modelar el gas como runway, no como número

La primera decisión de diseño fue cómo hablar siquiera de “suficiente gas”. Los balances en bruto son inútiles en aislamiento: 0,5 ETH pueden ser más que suficiente en una L2 barata y totalmente insuficiente en una L1 congestionada.

En su lugar, modelé el gas como **runway en días**:

> `runwayDays = balance / (350k gas × gasPrice × 2 rebalanceos al día)`

Hay varias decisiones deliberadas escondidas en esa fórmula:

- **350k gas** es un límite superior pesimista por rebalanceo, incluyendo approvals e interacciones con el vault.
- **2 rebalanceos/día** asumen una tasa de incidentes pequeña pero no trivial. Si la realidad es más tranquila, ganamos margen de seguridad gratis.
- Usar el **gas price actual** hace que la señal sea adaptativa: mismo balance, condiciones de mercado distintas → runway distinta.

Esto me da un escalar con el que sí puedo razonar: “¿cuántos días podríamos seguir reaccionando a pools problemáticos si nada más cambiara?”. También encaja mejor con las expectativas humanas; decir “tenemos ~3 días de runway en Arbitrum” es mucho más claro que “el hot wallet tiene 0,12 ETH”.

A partir de aquí, los umbrales pasan a ser política, no infraestructura:

- **WARNING** cuando la runway < 7 días
- **CRITICAL** cuando la runway < 3 días

Los números son arbitrarios pero defendibles: compran tiempo para que humanos hagan top‑up y para que la automatización empiece a rechazar trabajo nuevo antes de verse acorralada.

## Bloquear automatización en vez de "best effort"

La siguiente pregunta era qué hacer con una runway en estado CRITICAL.

La respuesta tentadora es “lo registramos en logs y seguimos” — que es lo que hace la mayoría de sistemas de monitoreo por defecto. Pero para rebalanceos de emergencia esto está justo al revés: las operaciones más arriesgadas deberían ser las primeras que dejamos de hacer cuando nuestra capacidad de pagar por ellas está en duda.

Así que la regla quedó:

- Cuando la runway de gas de una cadena está en **CRITICAL**, esa cadena **no puede** aceptar nuevos rebalanceos de emergencia.

Técnicamente esto se refleja como un nuevo `skipReason` en los resultados de rebalanceo (`insufficient_gas`), pero lo interesante no es el valor del enum sino la intención:

- El sistema es **explícito** sobre por qué ha decidido no actuar.
- La negativa ocurre **temprano**, antes incluso de intentar construir transacciones.

Esta decisión sacrifica disponibilidad a cambio de previsibilidad. En el peor caso, un pool realmente poco saludable puede tardar algo más en corregirse porque el monedero está bajo de gas. Pero la alternativa es peor: flujos parcialmente ejecutados, órdenes atascadas y un scheduler que cree que “lo ha intentado” cuando en realidad nunca tuvo una oportunidad real de éxito.

## Tratar los fallos de RPC como fallos duros

Otro caso incómodo es cuando la vista de la cadena está rota: timeouts del RPC, errores del proveedor o datos inconsistentes.

Aquí el modo de fallo es sutil: puedes creer que tienes un balance de gas sano porque el último valor cacheado era bueno, mientras que el monedero real está vacío. O peor, diferentes checks observan estados distintos y se contradicen.

El diseño conservador que he acabado implementando es:

- Si no se puede obtener el balance de gas de una cadena, esa cadena se trata como **CRITICAL**.
- Un estado CRITICAL aquí tiene la misma consecuencia que una condición real de gas bajo: **bloquea despliegues** en esa cadena.

Es duro, pero deliberado. Cuando la automatización no ve, prefiero que **pare** a que actúe con suposiciones obsoletas. Es el mismo principio que hacer *fail closed* en autenticación: la incomodidad gana a un comportamiento silenciosamente inseguro.

Para amortiguar el impacto, hay una pequeña caché (~5 minutos) alrededor de la decisión de “podemos desplegar en esta cadena”. Esto evita martillear a los proveedores de RPC en cada tick del scheduler, pero sigue garantizando que un top‑up de gas o una reparación del proveedor se propaguen rápido.

## Conectar los checks de gas con el scheduler

Nada de esto importa si no influye realmente en el comportamiento.

El scheduler de salud ya corría cada 15 minutos para escanear pools y disparar rebalanceos de emergencia para los críticos. El nuevo monitor de gas se cuelga de ese mismo bucle:

- En cada ciclo **revisa todas las cadenas** y almacena su estado de runway.
- Al decidir si rebalancear un pool crítico, el scheduler ahora se pregunta: “¿la cadena de destino está autorizada a aceptar despliegues?”.

Esto mantiene el modelo mental sencillo:

- Los checks de salud deciden **qué** necesita moverse.
- Los checks de gas deciden **si** hoy podemos permitirnos moverlo.

Al separar ambas cosas, es más fácil testear cada pieza en aislamiento (hay una batería específica de tests alrededor del monitor de gas) y evolucionar la política más adelante sin reescribir toda la lógica de salud.

## Cómo interactúa esto con los rebalanceos de emergencia

El propio flujo de rebalanceo de emergencia también ha recibido algunas mejoras aprovechando el contexto:

- Las lecturas de balances on‑chain y *shares* en el vault ahora tienen **timeouts** y limpieza adecuada, en lugar de confiar en el comportamiento implícito del proveedor.
- El campo `skipReason` ha pasado de ser cadenas libres a un enum explícito, de forma que el resto del sistema puede depender de razones estables en lugar de hacer *string matching* frágil.
- El ciclo de vida de una orden de emergencia ahora es explícito (`PENDING → EXECUTED/FAILED` con timestamps), lo que hace más fácil razonar sobre ejecuciones parciales y reintentos.

Lo interesante es la superficie de interacción:

- El monitor de gas puede marcar una cadena como no disponible.
- La lógica de rebalanceo de emergencia usa esa información para decidir si un pool es siquiera candidato.

Me gusta esta separación porque escala: hoy el bloqueante es “insufficient gas”, mañana podría ser “RPC provider degradado”, “vault pausado” o algo más exótico. Mientras la decisión se exprese como un `skipReason` estructurado, el resto del sistema no necesita conocer los detalles.

## Dudas abiertas y siguientes pasos

Hay varias cosas que aún no tengo claras:

- La **fórmula de runway** es intencionadamente simple. En realidad, la frecuencia de rebalanceo y el gas consumido por cadena no son uniformes. En algún momento puede tener sentido aprender baselines por cadena en lugar de usar una única constante.
- Los **umbrales** (7 y 3 días) son números de gut‑feeling. Seguramente haya que afinarlos cuando haya más datos de producción.
- La política actual es binaria: o una cadena acepta despliegues o no los acepta. Probablemente haya un punto intermedio donde sigamos permitiendo acciones **manuales** o **de alta urgencia** con gas bajo, pero bloqueemos el resto.

Por ahora prefiero pecar de conservador. Si esta capa dispara en producción, quiero que sea cristalino por qué lo ha hecho y qué tiene que cambiar (normalmente: “recargar el monedero” o “arreglar el RPC”).

## Idea clave

Tratar el gas como runway — y conectar esa señal con la decisión de si la automatización puede actuar siquiera — convierte una preocupación operativa difusa en un guardarraíl de seguridad explícito. Es poco código, pero cambia el *default* del sistema de “haz lo que puedas, incluso a ciegas” a “para cuando no puedes ver o no puedes pagar".
