---
title: 'Designing Gas Runway Monitoring for Beefy Guardian'
date: '2026-03-08'
excerpt: 'A behind-the-scenes look at how I designed gas balance monitoring, alerts, and deployment guardrails for multi-chain emergency rebalances.'
category: 'architecture'
tags: ['ethereum', 'defi', 'gas', 'monitoring', 'architecture', 'typescript']
author: 'Angel Batlles'
---

# Designing Gas Runway Monitoring for Beefy Guardian

Recently I shipped a feature in **Beefy Guardian** that looks deceptively simple on the surface: *"monitor the hot wallet gas balance and alert when it gets low"*.

The actual implementation went much deeper than that. It forced me to think about how we burn gas during **emergency rebalances**, what "low" really means in that context, and how aggressive I want the system to be in blocking deployments when I'm blind.

This post is a walkthrough of the thinking behind [`GasMonitorService`](https://github.com/elbatlles/beefy-guardian/blob/main/backend/src/services/health/GasMonitorService.ts), not just the code.

## From "check the balance" to "how many days of runway do we have?"

The naïve version of this feature would have been:

- read the native balance of the hot wallet on each chain,
- log it,
- maybe send an alert when it's below some arbitrary number, e.g. `0.05 ETH`.

That kind of threshold works for screenshots, but it's not how the system actually behaves.

What I care about is **how many days of emergency rebalances the current balance can buy me**, not the raw ETH/MATIC number. In other words: *runway*.

So I ended up codifying a model of reality in a few constants:

```ts
/** Average gas consumed by one full emergency rebalance cycle (withdraw ≈ 170k + deposit ≈ 180k) */
const AVG_GAS_PER_REBALANCE = 350_000n;

/** Estimated emergency rebalances per day (conservative upper bound) */
const REBALANCES_PER_DAY = 2n;

/** Runway target used when calculating the recommended top-up amount (14 days) */
const TARGET_RUNWAY_DAYS = 14n;
```

Is this exact? No. But it encodes an assumption that is much closer to how the system is actually used:

- "In the worst case, we might need to rebalance twice a day per chain."
- "I want ~two weeks of gas runway by default."

Once you accept that these numbers are *business decisions*, not just implementation details, the rest of the logic becomes a lot clearer.

## Defining WARNING and CRITICAL in human terms

With the runway model in place, the next step was to define **alert levels**:

```ts
export type GasAlertLevel = 'OK' | 'WARNING' | 'CRITICAL';

const WARNING_RUNWAY_DAYS = 7;
const CRITICAL_RUNWAY_DAYS = 3;
```

I deliberately chose the thresholds in *days* instead of raw balances:

- **WARNING**: less than 7 days of runway
- **CRITICAL**: less than 3 days of runway

That gives me human sentences like:

> "Polygon has 2 days of runway left."

which are much easier to reason about than:

> "Polygon has 0.0213 MATIC."

The code reflects that idea directly:

```ts
const alertLevel: GasAlertLevel =
  runwayDays < CRITICAL_RUNWAY_DAYS
    ? 'CRITICAL'
    : runwayDays < WARNING_RUNWAY_DAYS
      ? 'WARNING'
      : 'OK';
```

Is this perfect? No. Different chains have different gas markets and different actual usage patterns. But the important part is that **the thresholds are expressed in the same units as the mental model I care about**.

## Recommending a top-up instead of just shouting

Another small but important decision: if I'm going to tell myself "gas is low", I might as well tell myself **how much to top up by**.

That's what this block is about:

```ts
// Recommended top-up to reach TARGET_RUNWAY_DAYS from now
const neededBalance =
  AVG_GAS_PER_REBALANCE * gasPrice * REBALANCES_PER_DAY * TARGET_RUNWAY_DAYS;
const recommendedTopUpWei = neededBalance > balanceWei ? neededBalance - balanceWei : 0n;
```

Instead of an alert like:

> "Low gas on arbitrum: 0.0150 ETH"

I can log / alert something like:

> "arbitrum: 0.0150 ETH (2d runway — Need 0.0840 ETH)"

That turns an ambiguous warning into a **clear action**.

## Failing *closed* when RPCs break

One of the trickiest parts of this feature was deciding what to do when the **RPC call fails**.

Options I considered:

1. **Silently skip that chain** and keep going.
2. **Treat the missing data as "OK"** and let deployments proceed.
3. **Treat the missing data as "CRITICAL"** and block deployments.

I chose option 3:

```ts
logger.error('Failed to check gas balance — treating as CRITICAL', { ... });

// Fail-safe: return CRITICAL with 0 balance so deployments are blocked
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

That means:

- If I'm **blind** on a chain, I assume the worst.
- Emergency rebalances and new deployments are **blocked** until I can see again.

Is that annoying during incidents? Yes.

Is it cheaper than accidentally draining a hot wallet because I *assumed* there was gas? Also yes.

This is one of those places where I'm explicitly trading **developer convenience** for **operational safety**.

## Caching vs freshness: why 5 minutes?

Another design choice was how often to hit the RPC endpoints. The health scheduler runs every 15 minutes, but other services (like the emergency rebalance logic) might ask "can I deploy to this chain?" more frequently.

To avoid hammering providers, I added a simple in-memory cache with a 5‑minute TTL:

```ts
/** Cached reports expire after 5 minutes */
const CACHE_TTL_MS = 5 * 60 * 1_000;

async canDeployToChain(chain: string): Promise<boolean> {
  const cached = this.cachedReports.get(chain);
  const isFresh = cached !== undefined && Date.now() - cached.checkedAt.getTime() < CACHE_TTL_MS;

  const report = isFresh ? cached : await this.checkChain(chain);
  return report.alertLevel !== 'CRITICAL';
}
```

Why 5 minutes?

- It’s short enough that a top-up will be picked up quickly.
- It’s long enough to drastically reduce redundant RPC calls when multiple services are checking the same chain.

Could this be smarter (per-chain TTLs, shared cache, etc.)? Absolutely. But for now, the **simplicity** is a feature.

## Integrating with the rest of the system

`GasMonitorService` doesn’t live in isolation. It’s wired into:

- `HealthCheckScheduler`: calls `checkAllChains()` every 15 minutes.
- `EmergencyRebalanceService`: calls `canDeployToChain()` before executing a rebalance, and can now skip with a specific `skipReason = 'insufficient_gas'`.

That last part is important: the decision to **not act** is now explicit and traceable.

Instead of a rebalance silently failing halfway through due to insufficient gas, the system can say:

> "I didn’t even try to rebalance on chain X because gas was CRITICAL."

That’s a much better failure mode.

## What I like and what I’m not fully happy with

What I feel good about:

- The feature encodes a **domain model** (runway days, target runway, alert levels) instead of magic numbers.
- The system fails **closed** when blind, which is the right default for anything touching funds.
- The logs/alerts are phrased in terms humans care about (days of runway, recommended top‑up).

What I’m still unsure about:

- The constants are hard‑coded. At some point they probably need to be configurable per chain or per environment.
- Different chains have different volatility and actual usage; a global `2 rebalances/day` might be too coarse.
- The in‑memory cache is fine for a single process, but not great for a horizontally scaled setup.

But that’s fine. This is one of those features where having a **clear, opinionated v1** is better than an over‑engineered system nobody understands.

## Questions I’d ask you about your own systems

If you’re running anything on-chain (or even off-chain with expensive external dependencies), ask yourself:

- What’s your real unit of "runway"? Days? Rebalances? Requests?
- Do you know how many operations per day you’re designing for?
- What happens when your telemetry/RPC provider goes dark?
- Does your system fail **open** or **closed** when it’s blind?

The `GasMonitorService` is my current answer to those questions for Beefy Guardian. It will probably evolve as the system grows, but at least the assumptions are now **written down in code**, not just in my head.
