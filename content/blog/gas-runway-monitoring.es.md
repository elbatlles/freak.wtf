---
title: 'Diseñando la Monitorización de Gas Runway para Beefy Guardian'
date: '2026-03-08'
excerpt: 'Una mirada entre bastidores a cómo diseñé la monitorización del balance de gas, las alertas y los cortafuegos de despliegue para rebalances de emergencia multi‑cadena.'
category: 'architecture'
tags: ['ethereum', 'defi', 'gas', 'monitorización', 'arquitectura', 'typescript']
author: 'Angel Batlles'
---

# Diseñando la Monitorización de Gas Runway para Beefy Guardian

Hace poco entregué una funcionalidad en **Beefy Guardian** que, vista desde fuera, parece muy simple: *«monitoriza el balance de gas del hot wallet y avisa cuando esté bajo»*.

La implementación real fue bastante más profunda. Me obligó a pensar en cómo quemamos gas durante los **rebalances de emergencia**, qué significa realmente "poco" gas en ese contexto y hasta qué punto quiero que el sistema sea agresivo bloqueando despliegues cuando voy a ciegas.

Este post es un paseo por el razonamiento detrás de [`GasMonitorService`](https://github.com/elbatlles/beefy-guardian/blob/main/backend/src/services/health/GasMonitorService.ts), no solo por el código.

## De "mira el balance" a "cuántos días de runway tenemos"

La versión ingenua de esta feature habría sido:

- leer el balance nativo del hot wallet en cada cadena,
- loguearlo,
- y quizá mandar una alerta cuando baje de un número arbitrario, por ejemplo `0.05 ETH`.

Ese tipo de umbral sirve para hacer capturas de pantalla bonitas, pero no refleja cómo se comporta realmente el sistema.

Lo que me importa de verdad es **cuántos días de rebalances de emergencia puedo pagar con el balance actual**, no el número bruto de ETH/MATIC. Es decir: *runway*.

Así que acabé codificando un modelo de la realidad en unas pocas constantes:

```ts
/** Gas medio consumido por un ciclo completo de emergency rebalance (withdraw ≈ 170k + deposit ≈ 180k) */
const AVG_GAS_PER_REBALANCE = 350_000n;

/** Rebalances de emergencia estimados por día (cota superior conservadora) */
const REBALANCES_PER_DAY = 2n;

/** Runway objetivo que usamos para calcular la recarga recomendada (14 días) */
const TARGET_RUNWAY_DAYS = 14n;
```

¿Es exacto? No. Pero codifica una suposición mucho más cercana a cómo se usa el sistema:

- «En el peor caso podríamos necesitar rebalancing dos veces al día por cadena».
- «Quiero ~dos semanas de gas runway por defecto».

Cuando aceptas que estos números son **decisiones de negocio**, no solo detalles de implementación, el resto de la lógica se vuelve mucho más clara.

## Definiendo WARNING y CRITICAL en términos humanos

Con el modelo de runway en la mano, el siguiente paso fue definir **niveles de alerta**:

```ts
export type GasAlertLevel = 'OK' | 'WARNING' | 'CRITICAL';

const WARNING_RUNWAY_DAYS = 7;
const CRITICAL_RUNWAY_DAYS = 3;
```

Deliberadamente elegí los umbrales en *días* en lugar de balances brutos:

- **WARNING**: menos de 7 días de runway
- **CRITICAL**: menos de 3 días de runway

Eso me permite frases humanas como:

> «Polygon tiene 2 días de runway de gas».

mucho más fáciles de razonar que:

> «Polygon tiene 0.0213 MATIC».

El código refleja directamente esa idea:

```ts
const alertLevel: GasAlertLevel =
  runwayDays < CRITICAL_RUNWAY_DAYS
    ? 'CRITICAL'
    : runwayDays < WARNING_RUNWAY_DAYS
      ? 'WARNING'
      : 'OK';
```

¿Es perfecto? No. Cada cadena tiene su propio mercado de gas y patrones de uso. Pero lo importante es que **los umbrales se expresan en las mismas unidades que el modelo mental que me importa**.

## Recomendar cuánto recargar en vez de solo gritar

Otra decisión pequeña pero importante: si me voy a decir a mí mismo «el gas está bajo», mejor que también me diga **cuánto tengo que recargar**.

De eso va este bloque:

```ts
// Recarga recomendada para alcanzar TARGET_RUNWAY_DAYS desde ahora
const neededBalance =
  AVG_GAS_PER_REBALANCE * gasPrice * REBALANCES_PER_DAY * TARGET_RUNWAY_DAYS;
const recommendedTopUpWei = neededBalance > balanceWei ? neededBalance - balanceWei : 0n;
```

En lugar de una alerta tipo:

> «Gas bajo en arbitrum: 0.0150 ETH»

puedo loguear / alertar algo como:

> «arbitrum: 0.0150 ETH (2d runway — Need 0.0840 ETH)»

Eso convierte una advertencia ambigua en una **acción clara**.

## Fallar *cerrado* cuando los RPC se rompen

Una de las partes más delicadas de esta feature fue decidir qué hacer cuando la **llamada RPC falla**.

Opciones que me planteé:

1. **Saltar esa cadena en silencio** y seguir.
2. **Tratar los datos ausentes como "OK"** y dejar pasar despliegues.
3. **Tratar los datos ausentes como "CRITICAL"** y bloquear despliegues.

Elegí la opción 3:

```ts
logger.error('Failed to check gas balance — treating as CRITICAL', { ... });

// Fail-safe: devolvemos CRITICAL con balance 0 para que se bloqueen despliegues
const report: ChainGasReport = {
  chain,
  nativeSymbol: '???',
  balanceWei: 0n,
  balanceFormatted: `0.0000 ??? on ${chain}`,
  gasPriceGwei: 0,
  runwayDays: 0,
  alertLevel: 'CRITICAL',
  recommendedTopUpWei: 0n,
  recommendedTopUpFormatted: 'Unable to check balance — top up recommended',
  checkedAt: new Date(),
};
```

Eso significa:

- Si estoy **ciego** en una cadena, asumo lo peor.
- Los rebalances de emergencia y nuevos despliegues quedan **bloqueados** hasta que vuelva a ver.

¿Es molesto durante incidentes? Sí.

¿Es más barato que drenar sin querer un hot wallet porque *asumí* que había gas? También sí.

Este es uno de esos sitios donde cambio explícitamente **comodidad del desarrollador** por **seguridad operativa**.

## Cache vs frescura: por qué 5 minutos

Otra decisión de diseño fue cada cuánto pegar a los RPC. El scheduler de salud corre cada 15 minutos, pero otros servicios (como la lógica de emergency rebalance) pueden preguntar «¿puedo desplegar en esta cadena?» con más frecuencia.

Para no machacar a los proveedores, añadí una caché en memoria muy simple con TTL de 5 minutos:

```ts
/** Los informes de caché expiran a los 5 minutos */
const CACHE_TTL_MS = 5 * 60 * 1_000;

async canDeployToChain(chain: string): Promise<boolean> {
  const cached = this.cachedReports.get(chain);
  const isFresh = cached !== undefined && Date.now() - cached.checkedAt.getTime() < CACHE_TTL_MS;

  const report = isFresh ? cached : await this.checkChain(chain);
  return report.alertLevel !== 'CRITICAL';
}
```

¿Por qué 5 minutos?

- Es suficientemente corto para que una recarga se detecte rápido.
- Es suficientemente largo para reducir de forma drástica llamadas RPC redundantes cuando varios servicios consultan la misma cadena.

¿Podría ser más sofisticado (TTL por cadena, caché compartida, etc.)? Por supuesto. Pero por ahora, la **simplicidad** es una feature.

## Integración con el resto del sistema

`GasMonitorService` no vive aislado. Está conectado a:

- `HealthCheckScheduler`: llama a `checkAllChains()` cada 15 minutos.
- `EmergencyRebalanceService`: llama a `canDeployToChain()` antes de ejecutar un rebalance, y ahora puede saltárselo con un `skipReason = 'insufficient_gas'` explícito.

Ese último punto es importante: la decisión de **no actuar** ahora es explícita y trazable.

En lugar de que un rebalance falle a mitad por falta de gas, el sistema puede decir:

> «Ni siquiera he intentado hacer rebalance en la cadena X porque el gas estaba en CRITICAL».

Ese es un modo de fallo mucho más sano.

## Qué me gusta y qué no me termina de convencer

Lo que me deja tranquilo:

- La feature codifica un **modelo de dominio** (días de runway, runway objetivo, niveles de alerta) en lugar de números mágicos.
- El sistema falla **cerrado** cuando va a ciegas, que es el default correcto cuando hay dinero de por medio.
- Los logs/alertas se expresan en términos que le importan a humanos (días de runway, recarga recomendada).

Lo que aún me hace ruido:

- Las constantes están hard‑codeadas. En algún momento deberían ser configurables por cadena o entorno.
- Cada cadena tiene volatilidad y uso distintos; un `2 rebalances/día` global puede ser demasiado burdo.
- La caché en memoria está bien para un solo proceso, pero no escala bien en horizontal.

Y está bien. Esta es una de esas features donde tener una **v1 clara y opinada** es mejor que un sistema sobre‑ingenierizado que nadie entiende.

## Preguntas que te haría sobre tus propios sistemas

Si estás ejecutando algo on‑chain (o incluso off‑chain con dependencias externas caras), plantéate:

- ¿Cuál es tu unidad real de "runway"? ¿Días? ¿Rebalances? ¿Peticiones?
- ¿Sabes para cuántas operaciones al día estás diseñando?
- ¿Qué pasa cuando tu telemetría/proveedor RPC se cae?
- ¿Tu sistema falla **abierto** o **cerrado** cuando va a ciegas?

`GasMonitorService` es mi respuesta actual a esas preguntas para Beefy Guardian. Probablemente evolucione a medida que el sistema crezca, pero al menos ahora las suposiciones están **escritas en código**, no solo en mi cabeza.
