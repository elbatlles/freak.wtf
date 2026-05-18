---
title: 'IA y productividad: el precio oculto de delegar el control'
date: '2026-05-17'
excerpt: 'Llevo meses usando IA de forma intensiva. Cuanto más la uso, más clara veo una paradoja: multiplica mi productividad, pero también puede hacer que pierda el control sobre lo que estoy construyendo.'
category: 'development'
tags: ['ia', 'productividad', 'enterprise', 'criterio']
author: 'Angel Batlles'
image: '/images/contents/ia-this-is-fine.png'
---

Hace unos meses mi equipo publicó un cambio que funcionaba perfectamente. Todo iba bien hasta que otro equipo publicó algo por su lado y apareció un bug — nada obvio, del tipo que tarda en manifestarse y no apunta a su origen.

Cuando llegué a investigarlo, delegué a la IA. Me dio cuatro soluciones. Todas coherentes. Todas técnicamente válidas. Ninguna cuadraba del todo.

Nos reunimos con el otro equipo a hacer pair programming. En veinte minutos encontramos la solución real — una que la IA nunca propuso, porque requería entender una decisión de diseño que ninguno de los dos equipos había documentado por separado.

Esa experiencia me dejó pensando en algo que llevo meses viendo con más claridad: la IA multiplica la productividad, pero también puede hacer que pierdas el control sobre lo que estás construyendo. No creo que el problema sea la IA. Creo que el problema es cómo y cuándo decidimos delegar en ella.

> La IA siempre tiende hacia la opción más obvia. Técnicamente válida, pero no siempre correcta para tu contexto.

La diferencia entre lo que esperamos y lo que pasa:

![Expectativa: la IA entenderá todo el contexto del sistema. Realidad: la IA no sabe lo que se decidió en una reunión de 2019](/images/contents/ia-expectativa-vs-realidad.png)

## Cuando la IA funciona increíblemente bien

Hay tareas donde la mejora es absurda: boilerplate, refactors, tests, documentación, debugging inicial, exploración rápida de soluciones.

**La IA amplifica cuando...**
- Entiendes bien el sistema
- El problema está documentado
- Puedes evaluar el resultado

**La IA falla cuando...**
- El contexto es cross-team
- La decisión no está escrita
- El "válido" parece suficiente

## El verdadero riesgo no es que la IA falle

El riesgo real es más incómodo: confiar en soluciones que no entendemos del todo. La IA produce respuestas coherentes y técnicamente válidas, y ahora puedes producir cambios enormes en minutos. Pero modificas rápido sin entender de verdad, y eso genera una falsa sensación de comprensión.

> "Válido" no siempre significa "correcto para tu contexto". Y cuanto menos entiendes el sistema, más dependes del criterio de la IA para saberlo.

Yo, mergeando PR a las 11pm:

![This is fine: yo aceptando cambios generados por la IA mientras producción arde](/images/contents/ia-this-is-fine.png)

## Lo que la IA no ve

La IA puede leer código, pero no entiende por qué ciertas decisiones existen, qué deuda técnica no puede tocarse, ni lo que sabe el equipo de al lado que nunca se documentó.

Ese conocimiento vive en personas, conversaciones e incidentes pasados. En sistemas complejos, la mejor decisión no suele ser la más elegante: es la que encaja con todo lo que no está escrito.

## El nuevo valor no es escribir más rápido

> Es entender mejor.

La IA automatiza, acelera y propone. Pero el criterio es humano: decidir qué construir, qué no tocar, qué riesgos asumir.

Cuando el contexto es difuso, aceptas respuestas demasiado rápido. Delegas decisiones sin darte cuenta.

El coste de producir software baja. El coste de entender el problema, no. Y ese contexto sigue estando principalmente en las personas. A veces, en la intersección entre dos equipos en una reunión de veinte minutos.

---

*Por cierto: este post está hecho con IA. La ironía no se me escapa.*
