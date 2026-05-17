---
title: 'IA y productividad: el precio oculto de delegar el control'
date: '2026-05-17'
excerpt: 'Llevo meses usando IA de forma intensiva. Cuanto más la uso, más clara veo una paradoja: multiplica mi productividad, pero también puede hacer que pierda el control sobre lo que estoy construyendo.'
category: 'development'
tags: ['ia', 'productividad', 'enterprise', 'criterio']
author: 'Angel Batlles'
image: '/images/contents/ia-this-is-fine.png'
---

Hace unos meses, mi equipo publicó un cambio que funcionaba perfectamente.

Todo iba bien hasta que otro equipo publicó algo por su lado.

Un side effect inesperado — una consecuencia no intencionada del cambio del otro equipo que afectó al nuestro sin que nadie lo anticipara. Nada obvio. El tipo de bug que tarda en manifestarse y que, cuando lo hace, no apunta claramente a su origen.

Cuando llegué a investigarlo, delegué a la IA. Me dio cuatro soluciones diferentes. Todas coherentes. Todas técnicamente válidas. Pero algo se sentía raro — ninguna cuadraba del todo con lo que yo sabía del sistema.

Hasta que nos reunimos con el otro equipo a hacer pair programming.

En veinte minutos encontramos la solución real. Una que la IA nunca propuso, porque requería entender una decisión de diseño que ninguno de los dos equipos había documentado por separado.

Esa experiencia me dejó pensando en algo que llevo meses viendo con más claridad:

> La IA siempre tiende hacia la opción más obvia. Técnicamente válida, pero no siempre correcta para tu contexto.

La diferencia entre lo que esperamos y lo que pasa:

![Expectativa: la IA entenderá todo el contexto del sistema. Realidad: la IA no sabe lo que se decidió en una reunión de 2019](/images/contents/ia-expectativa-vs-realidad.png)

## La paradoja que no desaparece

Llevo meses usando IA de forma intensiva para desarrollar software.

Y cuanto más la uso, más clara veo una paradoja:

La IA multiplica mi productividad. Pero también puede hacer que pierda control sobre lo que estoy construyendo.

No creo que el problema sea la IA. Creo que el problema es cómo y cuándo decidimos delegar en ella.

## Cuando la IA funciona increíblemente bien

Hay tareas donde la mejora es absurda: boilerplate, refactors, tests, documentación, debugging inicial, exploración rápida de soluciones.

Cuando entiendes bien el sistema, la IA se convierte en un multiplicador brutal.

No reemplaza tu trabajo. Amplifica tu capacidad de ejecución.

**La IA amplifica cuando...**
- Entiendes bien el sistema
- El problema está documentado
- Puedes evaluar el resultado

**La IA falla cuando...**
- El contexto es cross-team
- La decisión no está escrita
- El "válido" parece suficiente

## El verdadero riesgo no es que la IA falle

El riesgo real es más incómodo: confiar en soluciones que no entendemos del todo.

La IA produce respuestas coherentes, razonables y técnicamente válidas.

Ahora puedes producir cambios enormes en minutos.

Eso es espectacular. Pero también puede generar una falsa sensación de comprensión.

Modificas algo muy rápido sin llegar a entenderlo realmente.

> "Válido" no siempre significa "correcto para tu contexto". Y cuanto menos entiendes el sistema, más dependes del criterio de la IA para saberlo.

Yo, mergeando PR a las 11pm:

![This is fine: yo aceptando cambios generados por la IA mientras producción arde](/images/contents/ia-this-is-fine.png)

## Lo que la IA no ve

La IA puede leer código.

Pero no entiende por qué ciertas decisiones existen. No sabe qué deuda técnica no puede tocarse. No conoce los edge cases que ya han explotado. No ve las dependencias invisibles que sostienen el sistema.

Y hay algo más que no puede ver: lo que sabe el equipo de al lado, que nunca llegó a documentarse.

Ese conocimiento vive repartido entre personas, conversaciones, incidentes pasados y años de evolución del sistema.

La solución real a nuestro bug existía en la intersección de lo que sabía mi equipo y lo que sabía el otro.

La IA no tenía acceso a esa intersección.

En enterprise ocurre lo mismo a mayor escala.

En teoría, muchas arquitecturas son mejores. En práctica, los sistemas reales viven condicionados por costes, compliance, legacy, migraciones incompletas y prioridades de negocio que nadie tiene tiempo de documentar bien.

La IA tenderá hacia la solución elegante, el patrón estándar, la simplificación razonable.

Pero en entornos complejos, la mejor decisión muchas veces no es la más elegante. Es la que encaja con todo lo que no está escrito.

## Automatizar ejecución no es lo mismo que delegar criterio

Aquí está la línea importante.

La IA es excelente automatizando, acelerando, proponiendo y optimizando. Pero el criterio sigue siendo humano.

Porque en ingeniería el problema rara vez es solo escribir código. El problema suele ser decidir qué construir, qué no tocar, qué tradeoffs aceptar y qué riesgos asumir.

Eso sigue dependiendo del contexto.

Cuando entiendes el dominio y puedes evaluar consecuencias, la IA multiplica tu impacto.

Cuando el contexto es difuso, empiezas a aceptar respuestas demasiado rápido. Delegas decisiones sin darte cuenta.

Y ahí es donde aparecen los problemas difíciles.

## El nuevo valor no es escribir más rápido

> Es entender mejor.

Producir software cada vez es más barato.

El conocimiento realmente escaso empieza a ser el contexto, el criterio y la capacidad de tomar buenas decisiones.

La IA reduce enormemente el coste de producir soluciones. Pero no reduce el coste de entender el problema.

Y en software enterprise, ese contexto todavía sigue estando principalmente en las personas.

A veces, en la intersección entre dos equipos en una reunión de veinte minutos.

---

*Por cierto: este post está hecho con IA. La ironía no se me escapa.*
