---
title: 'Construyendo una Red de Seguridad alrededor de la Automatización DeFi'
date: '2026-03-08'
excerpt: 'Algunas notas de construir una capa de seguridad alrededor de la automatización en DeFi: qué problema intenta resolver, qué estoy dispuesto a sacrificar y qué aún no quiero enseñar.'
category: 'architecture'
tags: ['defi', 'automatización', 'riesgo', 'arquitectura', 'typescript']
author: 'Angel Batlles'
---

# Construyendo una Red de Seguridad alrededor de la Automatización DeFi

En los últimos meses he estado construyendo una capa de seguridad alrededor de la automatización en DeFi.

No farmea, no persigue yields, no intenta ser “smart money”. Su trabajo es mucho más aburrido: **vigilar cosas, conectar algunos puntos y decir “es lo bastante seguro para actuar” o “mejor párate”**.

Este post es una pequeña introducción a lo que estoy construyendo y, sobre todo, a cómo lo estoy pensando. No voy a enseñarlo todo; eso es intencional.

## Qué problema intento resolver

Si llevas un tiempo cerca de la automatización en DeFi, probablemente has visto al menos uno de estos patrones:

- Scripts que siguen corriendo felices mucho después de que las suposiciones originales hayan muerto.
- “Health checks” que solo verifican que el proceso está arriba, no que sea seguro.
- Bots que intentan hacer rebalance o harvest en entornos claramente hostiles: sin gas, con precios malos, con RPC rotos.

Lo que quiero de esta capa de seguridad es sencillo:

> Antes de tocar fondos on-chain, responde una pregunta:  
> **«¿Es realmente responsable actuar ahora mismo?»**

A veces la respuesta debería ser “sí, adelante”.  
A veces la respuesta debería ser “no, y aquí está el motivo”.  
Y a veces la respuesta debería ser “no tengo ni idea, así que te voy a bloquear”.

Ese último caso es el que más me preocupa.

## Un poco de cómo funciona (sin contarlo todo)

Muy a alto nivel:

- Vigila distintos tipos de señales:  
  balances, disponibilidad de gas, salud de estrategias, condiciones de salida…
- Las combina en **decisiones explícitas**:
  - “actúa ahora”,
  - “espera y vuelve a mirar luego”,
  - “me niego a actuar en estas condiciones”.
- Intenta que los **motivos** sean visibles:
  - no solo “failed”, sino “skipped porque no hay suficiente gas runway”,
  - no solo “error”, sino “el RPC está ciego, trato esto como inseguro”.

Por debajo no es más que TypeScript, unos cuantos servicios y más tests de los que me gustaría admitir. Lo interesante no es el framework, son las preguntas que obligo al código a contestar.

Hay partes que no voy a describir en detalle:

- umbrales concretos y combinaciones de señales,
- internals operativos,
- parte del cableado de producción.

Piensa en esta serie como **notas de campo**, no como una especificación completa.

## En qué se va a centrar esta serie

No quiero convertir esto en un changelog de features. Prefiero escribir sobre las decisiones que hay detrás, por ejemplo:

- Cuándo debería un sistema automatizado **negarse** a actuar, incluso si técnicamente puede.
- Cómo decides qué significa “suficiente runway” antes de que empiece a ser irresponsable.
- Dónde cambias conscientemente comodidad del desarrollador por seguridad del usuario.
- Cómo codificas esas ideas para que tu yo del futuro no pueda ignorarlas en silencio.

Cada post probablemente se centrará en una pieza pequeña del sistema:

- un servicio,
- un patrón,
- un check o umbral concreto,

y lo usará como excusa para hablar de **buen vs mal código, y buenas vs malas decisiones**.

Verás fragmentos reales del código, pero siempre con un pequeño desenfoque donde no quiero entrar en detalles operativos.

## Qué estoy dispuesto a enseñar (y qué no)

Estoy dispuesto a enseñar:

- cómo diseño health checks que hacen algo más que “¿el proceso está arriba?”,
- cómo pienso en fallar *cerrado* vs fallar *abierto*,
- cómo me obligo a ser honesto con tests y contratos explícitos.

No voy a enseñar:

- todo lo que se puede configurar ni cómo,
- todas y cada una de las señales y umbrales,
- nada que realmente filtre postura operativa.

Si alguna vez algo de código parece un poco redactado o simplificado, asume que es a propósito.

## Qué viene después

En el siguiente post voy a entrar en una pieza que suena trivial y no lo es:

> cómo decido si hay “suficiente gas” como para dejar que el sistema actúe.

Sobre el papel parece “solo mira el balance”.  
En la práctica se convierte en una conversación sobre **runway, fallos de RPC y cuándo ir a ciegas debería significar un stop duro**.
