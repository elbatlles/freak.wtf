---
title: "Diseñando un rebalanceo de emergencia consciente del gas"
date: 2026-03-08T09:00:00+02:00
slug: gas-aware-emergency-rebalancing
---

Cuando empiezas a conectar automatismos críticos que mueven fondos reales, las preguntas que dan miedo nunca van de sintaxis. Van de qué pasa en los días malos: redes saturadas, gas disparado, RPCs inestables o un bug que decide que "hoy es un gran día para rebalancearlo todo".

Esta semana me he centrado en el rebalanceo de emergencia consciente del gas: cómo dejar que el sistema reaccione rápido cuando algo se va a un estado peligroso, sin convertirlo en un robot nervioso que quema gas y confianza.

## El contexto mínimo

El sistema ya tenía chequeos periódicos de salud para las posiciones on-chain y la capacidad de lanzar acciones correctivas. Faltaban dos piezas que cada vez molestaban más:

- No había una visión dedicada del estado de salud del gas, solo chequeos dispersos.
- La lógica de rebalanceo de emergencia estaba evolucionando en varios sitios y muy acoplada a otros chequeos de salud.

En la práctica, esto significaba que no podía responder con claridad a dos preguntas:

1. "Dadas las condiciones actuales de gas, ¿es seguro y razonable disparar esta acción de emergencia ahora mismo?"
2. "Si nos abstenemos por motivos de gas, ¿cómo nos aseguramos de volver a mirar la situación a tiempo?"

El trabajo de esta semana ha ido de separar responsabilidades para el monitoreo de gas y para el rebalanceo de emergencia, y luego pegarlas de forma que sea testeable y conservadora.

## Separar monitoreo de acción

La primera decisión de diseño fue extraer el monitoreo de gas a un servicio propio, con sus propios tests.

Antes de esto, las consideraciones de gas eran sobre todo implícitas: algunos puntos comprobaban balances o límites justo antes de enviar una transacción. Eso funciona hasta que necesitas razonar sobre tendencias ("¿llevamos horas cerca de quedarnos secos?") o sobre el estado agregado de varios actores.

Al extraer un componente dedicado al monitoreo de gas, consigo:

- Un único sitio donde codificar qué significan condiciones de gas "saludables" y "degradadas".
- Una API clara para el resto del sistema: no les importa cómo se calcula la salud del gas, solo si es seguro continuar o no.
- Tests que describen escenarios realistas: drenajes lentos, picos bruscos y los casos frontera donde deberíamos decir "no".

El trade-off es tener otra pieza en la tubería de salud, pero la ganancia es que las decisiones alrededor del gas pasan de ser precondiciones dispersas a ser algo explicable.

## Ser explícitos con las emergencias

La segunda decisión fue tratar el rebalanceo de emergencia como su propio dominio, con puntos de entrada e invariantes explícitos.

Antes, la lógica para decidir cuándo rebalancear en emergencia estaba mezclada con chequeos de salud normales y tareas en background. Eso hacía demasiado fácil cambiar el comportamiento sin querer al tocar algo aparentemente independiente, y demasiado difícil simular escenarios de desastre.

Al introducir un servicio explícito de rebalanceo de emergencia y actualizar el scheduler para llamarlo en situaciones bien definidas, ahora tengo:

- Un lugar concreto donde viven el "cuándo" y el "cómo" de las acciones de emergencia.
- Espacio para lógica de decisión más rica: combinar señales de salud de los pools con el estado del gas y otras restricciones.
- Tests que cubren los caminos que dan respeto: "¿qué pasa si varios pools están mal y el gas está en el límite?".

El coste aquí es tener otra frontera de abstracción que mantener, pero a cambio puedo endurecer el comportamiento con tests en vez de solo confiar en que los tests de integración toquen los ángulos correctos.

## El gas como restricción de primera clase

La parte más interesante ha sido cablear la salud del gas en el camino de emergencia.

De forma ingenua, podrías decir "si algo está mal, siempre rebalancea". Pero si el gas está por las nubes o los balances son bajos, esa política puede ser peor que no hacer nada: gastas mucho para mejorar solo un poco una situación mala, y quizá no te quede presupuesto para el movimiento realmente crítico de dentro de cinco minutos.

Así que el diseño ha pasado a tratar el gas como una restricción de primera clase:

- Las acciones de emergencia preguntan al monitor de gas si las condiciones son aceptables.
- Si la salud del gas es mala, el sistema registra la necesidad de actuar pero difiere la transacción.
- El scheduler revisita emergencias pendientes, de forma que un "ahora no" no se convierta silenciosamente en un "nunca".

Aquí hay un trade-off sutil:

- **Pros:** menos transacciones inútiles en condiciones de gas hostiles, y más garantías de que hay gas disponible cuando realmente importa.
- **Contras:** más casos en los que el sistema se queda de forma intencionada en un estado degradado durante algo más de tiempo, lo cual incomoda si eres muy averso al riesgo.

Esa incomodidad es útil: obliga a ser explícito con umbrales y tiempos en lugar de fingir que "actuar siempre" sale gratis.

## Testear los bordes que dan miedo

La mayor parte del trabajo interesante ha acabado en tests.

Los tests unitarios del monitor de gas simulan escenarios como:

- Agotamiento lento pero constante de gas entre varios actores.
- Picos cortos de gas en los que esperar unos pocos bloques es la decisión correcta.
- Casos frontera donde deberíamos permitir una única transacción de emergencia pero nada más.

En la parte de emergencias, los tests ejercitan combinaciones de pools en mala salud, condiciones de gas y ritmos del scheduler. El objetivo no es cubrir todos los bordes a la perfección, sino fijar unas cuantas historias representativas de "oh no" y asegurarse de que se vuelven aburridas.

Esto también ha destapado cierta fragilidad en el entorno de tests de integración, que ha habido que apretar para que los fallos vayan de comportamiento y no de entorno. No es glamuroso, pero es necesario si quieres fiarte de automatismos que tocan dinero real.

## Lo que sigue siendo borroso

Quedan varias preguntas abiertas:

- Los umbrales exactos para declarar que el gas está "malo" son en parte intuición y en parte observación histórica. Probablemente necesitarán ajuste cuando esto se enfrente a condiciones reales.
- La cadencia y el backoff con el que el scheduler revisita emergencias diferidas es conservadora por ahora; puede que sea demasiado lenta en algunos escenarios.
- Todavía no hay un bucle de feedback desde fallos reales hacia los umbrales y las políticas.

Estoy sesgando intencionadamente hacia la cautela. Es mejor aprender que el sistema dudó demasiado a menudo que descubrir que se dedicó a quemar gas en una cascada de emergencias marginales.

## Idea clave

Convertir el gas en una entrada de primera clase para el comportamiento de emergencia ha transformado una preocupación difusa ("¿y si el gas está raro justo cuando tenemos que actuar?") en algo concreto sobre lo que se puede diseñar y testear. Los cambios de código no son enormes, pero poder razonar sobre emergencias como "sujetas a restricciones explícitas" en vez de "dispara y reza" se siente como un paso en la dirección correcta.