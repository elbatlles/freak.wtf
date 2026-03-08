---
title: "Diseñando checks de gas y rebalances de emergencia que puedan decir que no"
date: 2026-03-08T09:00:00+02:00
slug: gas-runway-emergency-rebalances
---

Estos días por fin he atacado algo que llevaba tiempo molestando en segundo plano: lo frágil que se vuelve el rebalanceo automático cuando las wallets de gas son un detalle secundario. La semana ha ido de convertir el gas en una señal de primera clase y conectarlo con un flujo de rebalanceo de emergencia que pueda —y deba— decir "no" cuando las condiciones no son seguras.

## Contexto: automatización que depende de wallets invisibles

El sistema gestiona pools que a veces necesitan un rebalanceo de emergencia: retirar de un vault, mover fondos y redeplegar en un pool más sano. Sobre el papel, la lógica de "qué" hacer ya existía.

Lo que faltaba era el "¿podemos realmente permitirnos hacer esto ahora mismo?" — no en términos de TVL o yield, sino en gas puro y duro.

Antes, el gas vivía en el fondo del sistema:

- Los balances de las wallets no se modelaban explícitamente como parte de la salud.
- No había una noción compartida de "runway" (cuántos rebalances nos podemos permitir).
- Los fallos de RPC se trataban como "meh, ya reintentará" en vez de bloqueantes duros.

Ese enfoque funciona… hasta que deja de funcionar. Un glitch de red o una wallet vacía pueden convertir una decisión de rebalanceo perfectamente razonable en un desastre medio ejecutado.

## Decisión: el gas como señal de salud, no como nota al margen

La primera decisión fue subir el gas al modelo de salud:

- Introducir un servicio que revise periódicamente los balances de gas en todas las chains.
- Expresar esos balances como **runway**, no como cantidades crudas de tokens.
- Alimentar esa señal tanto al scheduler como a la lógica de rebalanceo de emergencia.

La fórmula de runway es deliberadamente simple y opinada:

> runway = balance ÷ (350k gas × gasPrice × 2 rebalances/día)

Esto fija varios supuestos:

- ~350k gas por rebalance es un upper bound conservador.
- Dos rebalances al día por chain bastan para reaccionar a la mayoría de emergencias.
- Nos importa más hablar en "días de seguridad" que en número exacto de transacciones.

A partir de ahí, los umbrales se definen en términos humanos:

- **WARNING** cuando el runway < 7 días.
- **CRITICAL** cuando el runway < 3 días.
- El sistema recomienda hacer top-up hasta un objetivo de 14 días.

La clave es que nada de esto intenta ser ultra preciso. El objetivo es evitar degradaciones silenciosas, no exprimir cada gota de eficiencia del gas.

## Trade-off: bloquear despliegues vs ser "amable"

Una vez el gas se convierte en señal de primera clase, aparece la pregunta incómoda: ¿qué hace el sistema cuando el gas es bajo?

Hay dos opciones obvias:

1. Loguear un warning y dejar que todo siga.
2. Tratar la falta de gas como **fallo duro** y bloquear acciones.

He elegido (2) para todo lo crítico:

- Si el runway de gas de una chain es CRITICAL, los despliegues en esa chain se bloquean.
- Los rebalances de emergencia en esa chain se marcan como skip con un motivo explícito `insufficient_gas`.

Esto es intencionadamente poco amigable desde el punto de vista de DX. Se traduce en luces rojas y acciones bloqueadas en lugar de reintentos best-effort. Pero es mucho más honesto:

- Los operadores ven inmediatamente cuándo el sistema no es seguro para actuar.
- Evitamos flujos medio ejecutados por quedarnos sin gas a mitad.
- Hay una única fuente de verdad para "¿es seguro tocar esta chain ahora mismo?".

El trade-off contrario habría hecho los incidentes más silenciosos pero más feos: todo "parece bien" hasta que las tx empiezan a fallar o quedarse atascadas sin un motivo claro.

## Cache y modos de fallo: cuando "sin datos" significa "no"

Otra decisión sutil: qué hacer cuando el propio check de gas falla.

Las llamadas RPC no son gratis ni perfectas. Para evitar convertir el sistema en un spammer de RPC, los resultados de los checks se cachean unos minutos cuando se decide si es seguro desplegar.

Más importante todavía: los fallos de RPC se tratan como **CRITICAL** para esa chain:

- Si no podemos leer el balance de gas, asumimos lo peor.
- Eso bloquea despliegues y rebalances de emergencia en esa chain.

Esta postura es muy opinada: "sin datos" se interpreta como "inseguro", no como "desconocido". La consecuencia práctica es que hay menos edge cases raros:

- No aprobamos un rebalance basándonos en datos obsoletos o inexistentes.
- Cualquier problema de infraestructura upstream (caídas de RPC, malas configs) se manifiesta como bloqueo duro.

El precio es que issues transitorios de RPC pueden parar el mundo un rato. Me parece un buen intercambio: prefiero debuggear "¿por qué está bloqueado esto?" que "¿por qué tocamos esta chain a ciegas?".

## Rebalances de emergencia: apretar el contrato

Encima de los checks de gas, el flujo de rebalanceo de emergencia también se ha endurecido:

- Operaciones como retirar de un vault o redeplegar fondos ahora tienen timeouts explícitos.
- La selección de pools de reemplazo es más restrictiva (por ejemplo, preferir misma chain entre pools en estado CRITICAL).
- Los rebalances saltados registran motivos estructurados (`rate_limit`, `no_replacement`, `insufficient_gas`, etc.) en lugar de strings ad-hoc.

El patrón común es hacer que la superficie de decisión de la automatización sea más estrecha y explícita:

- O bien nos podemos permitir actuar, y lo intentamos dentro de límites claros.
- O bien no, y lo decimos de forma clara.

Esto también hace que los tests sean mucho más útiles: en vez de comprobar mensajes de log frágiles, asertan sobre campos y transiciones de estado bien definidos.

## Dudas que quedan

Quedan varias preguntas abiertas:

- ¿Son los umbrales de WARNING/CRITICAL lo bastante agresivos para la volatilidad real?
- ¿Deberían distintas chains tener supuestos de runway diferentes (coste de gas, actividad típica)?
- ¿Cuánto ruido generará esto en la práctica? ¿acabará la gente ignorando los warnings?

De momento los umbrales son deliberadamente conservadores. Prefiero sobre-alertar sobre posible agotamiento de gas y afinar hacia abajo más adelante, a partir de incidentes reales.

Otra duda es dónde exponer estas señales: los logs no son suficientes. Probablemente esto tenga que acabar en el sistema de monitorización/dashboarding que envuelve al sistema.

## Idea clave

La lección de la semana: **la automatización necesita permiso para decir "no"**.

Al convertir el gas de restricción invisible en señal de salud de primera clase —y engancharla a los flujos de emergencia como bloqueante duro— el sistema pierde un poco de magia pero gana mucha más confianza. Prefiero un "me niego a rebalancear" ruidoso y cabezota que un "he intentado salvarte" que se queda a medias en la oscuridad.