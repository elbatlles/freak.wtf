---
title: "Redes de seguridad en capas para la automatización: coverage gates, health checks y pruebas de realidad"
date: 2026-03-09T11:00:00+02:00
slug: layered-ci-safety-nets
---

Últimamente estoy pensando menos en *funcionalidades* y más en *consecuencias*.

Cuando montas automatización que puede mover dinero, rebalancear posiciones o tocar sistemas externos, la pregunta importante no es "¿funciona?", sino "¿cómo me entero cuando deja de funcionar en silencio?". Y una todavía más incómoda: "¿qué tan fácil es que me autoengañe pensando que todo va bien?".

Estos días he intentado tomar esa incomodidad en serio y he reordenado cómo se conectan tests y validación en el proyecto: una pipeline de CI con umbrales de cobertura explícitos, un test dedicado para un grupo de servicios especialmente sensibles y un script de validación local que mira el sistema vivo, no solo el verde de los unit tests.

Este post es un pequeño diario de esas decisiones y de sus trade‑offs.

## ¿Por qué molestarse con un coverage gate?

Hay dos formas bastante habituales de fallar con la cobertura de tests:

1. **Ignorarla por completo.** Los tests se van pudriendo, el código nuevo sale sin cubrir y el panel de métricas se convierte en un panel de mentiras.
2. **Tratar el porcentaje como un trofeo.** Se persigue un número arbitrario porque lo exige una política o un badge, no porque proteja nada real.

Yo quería algo intermedio: un número que sea *aburrido* casi siempre, pero que se vuelva innegociable justo en las piezas de lógica que pueden hacer daño.

Eso me llevó a una combinación de:

- Un job de CI que ejecuta la batería de unit tests con cobertura y aplica un suelo global (configurado vía los thresholds de Vitest).
- Un test específico que lee el informe de cobertura y exige que un conjunto concreto de servicios "épicos" se mantenga por encima del 85 % de líneas cubiertas.

La idea clave: en lugar de fingir que todas las líneas importan lo mismo, aceptar que hay servicios donde vive el riesgo real, y cablear las herramientas para que tu yo futuro no pueda erosionar esa red de seguridad sin darse cuenta.

## Hacer la cobertura más concreta: testear el propio arnés de tests

El test de cobertura especial hace algo un poco opinado:

- Lee el resumen de cobertura en JSON que genera la ejecución de unit tests.
- Agrega la cobertura de una lista curada de servicios: monitorización, health checks, acciones de emergencia, lógica de consenso / validación, etc.
- Imprime un pequeño informe (líneas totales, cubiertas, porcentaje) y falla si el agregado baja del 85 %.

Esto tiene varias consecuencias prácticas:

- **Lo importante no puede degradarse en silencio.** Añadir un servicio de monitorización sin tests se ve inmediatamente como una caída de cobertura.
- **La configuración de cobertura se convierte en documentación ejecutable.** La lista de rutas funciona como un índice vivo de "si esto rompe, algo serio puede pasar".
- **Los refactors están obligados a ser honestos.** No puedes colar reescrituras grandes de estos servicios sin llevarte los tests contigo.

El trade‑off es obvio: iterar sobre esos ficheros es más pesado. Pero justo ahí es donde quiero fricción: en las zonas donde el riesgo de regresión es más alto.

## CI como portero, no como sugerencia

Encima de ese check de cobertura, el workflow de CI ahora tiene una forma más opinada:

- **Unit tests + coverage gate** se ejecutan primero en cada push y cada pull request contra la rama principal.
- **Verificación de build** solo corre si los unit tests pasan; no tiene sentido construir artefactos desde un árbol roto.
- **Tests end‑to‑end sobre Anvil** (que dependen de un RPC de archivo y de claves privadas) solo se ejecutan en pushes a la rama principal, no en cada PR.

Este último punto es una renuncia consciente:

- Desde el punto de vista de seguridad, lo ideal sería correr los E2E en cada PR.
- En la práctica dependen de una cadena forkeada, infraestructura externa de RPC y pueden ser lentos y frágiles bajo límites de tasa.

Así que, en lugar de convertir cada PR en rehén de servicios externos, la pipeline trata la cobertura de unit + integración como el gate duro, y los E2E como una "prueba de realidad" periódica sobre la rama por defecto.

¿Es perfecto? No. Un PR puede seguir introduciendo una regresión que solo aparezca hablando con datos reales de cadena. Pero es una mejora real comparada con los dos extremos:

- Sin E2E (falsa sensación de seguridad basada en tests rápidos), o
- E2E en cada cambio (una CI poco fiable que la gente aprende a ignorar).

El diseño intenta sesgarse hacia señales *fiables*, aunque sean imperfectas.

## Validar el sistema, no solo el código

La otra mitad del trabajo está fuera de CI: un script `validate.sh` que intenta responder a una pregunta más humana:

> "Si ejecuto este comando y dice ✅, ¿me siento cómodo dejando que el sistema corra sin supervisión?"

En lugar de volver a ejecutar los mismos tests que ya cubre la CI, el script se centra en señales vivas:

- Saneamiento del entorno (¿existe el fichero de configuración?, ¿las URLs RPC y claves críticas no son placeholders?).
- Salud de la base de datos (¿existe el fichero de SQLite?, ¿las tablas de dominio principales tienen datos?).
- Estado del backend (¿responde el endpoint de health?, ¿el scheduler está realmente activo?).
- Estado del algoritmo (cómo han sido los últimos health checks y decisiones, si hay estados críticos o flags de error recientes).
- Flujo de órdenes (cuántas se han ejecutado, fallado o quedado atascadas, y cómo se ven las últimas).
- Conectividad RPC a cada cadena, con una llamada mínima a `eth_blockNumber`.

Cada check es intencionadamente independiente: el script no hace `set -e`, y los fallos en un área no ocultan información de las demás. La salida es una checklist compacta con contadores de checks OK, fallidos y en warning, seguida de comandos muy concretos que puedes ejecutar después.

Los trade‑offs aquí son sobre todo de **alcance**:

- He evitado convertirlo en otro runner de tests más.
- No intenta ser una plataforma de observabilidad; es solo una foto rápida que puedes lanzar en local o antes de tocar producción.

En resumen, quiere ser más "tranquilidad que puedes grepear" que un sistema de monitoring.

## Hasta aquí hemos llegado (y lo que sigue molestando)

Visto en conjunto, la red de seguridad actual tiene tres capas:

1. **Validación local** para responder "¿esta instancia está en un estado razonable ahora mismo?".
2. **Coverage gate + test de cobertura focalizado** para responder "¿los servicios de mayor riesgo siguen bien cubiertos por tests?".
3. **Workflow de CI** para aplicar esos checks de forma consistente y cazar cambios patológicos pronto.

Es bastante mejor que lo que había hace una semana, pero hay huecos evidentes:

- Los umbrales de cobertura siguen siendo herramientas bastas; no distinguen entre "código pegamento trivial" y "ramas algorítmicas delicadas".
- El script de validación asume un esquema y un conjunto de checks relativamente estáticos; habrá que podarlo a medida que el dominio evolucione.
- Los tests sobre Anvil solo corren en la rama principal; seguir mejorando su velocidad y fiabilidad hasta poder ejecutarlos en cada PR sigue siendo un objetivo abierto.

La lección de esta semana, para mí, es que el trabajo de seguridad solo parece sobrecarga cuando es abstracto. En cuanto lo conectas con consecuencias concretas —alertas que no saltan, rebalanceos malos, capital atascado— se vuelve evidente dónde quieres que viva la fricción.

**Idea clave:** los coverage gates y los scripts de validación no van de hacer subir un número; van de decidir *dónde* te puedes permitir ser perezoso y dónde, simplemente, no.
