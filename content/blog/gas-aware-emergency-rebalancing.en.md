---
title: "Designing Gas-Aware Emergency Rebalancing"
date: 2026-03-08T09:00:00+02:00
slug: gas-aware-emergency-rebalancing
---

When you start wiring critical automation to move real funds, the scary questions are never about syntax. They are about what happens on the bad days: clogged networks, spiking gas, flaky RPCs, or a bug that decides "today is a great day to rebalance everything".

This week I focused on gas-aware emergency rebalancing: how to let the system react quickly when something drifts into a dangerous state, without turning it into a trigger-happy robot that burns gas and trust.

## The minimum context

The system already had periodic health checks for on-chain positions and the ability to trigger corrective actions. Two missing pieces had become increasingly uncomfortable:

- There was no dedicated view of gas balance health, just scattered checks.
- The logic for emergency rebalancing was evolving in multiple places and was tightly coupled to other health checks.

In practice this meant I could not clearly answer two questions:

1. "Given current gas conditions, is it safe and sensible to fire this emergency action now?"
2. "If we abstain for gas-related reasons, how do we make sure we revisit the situation soon enough?"

The work this week was about carving out explicit responsibilities for gas monitoring and for emergency rebalancing, and then gluing them together in a way that is both testable and conservative.

## Separating monitoring from action

The first design decision was to pull gas monitoring into its own service with its own tests.

Before this, gas considerations were mostly implicit: a few spots checked balances or limits just before sending a transaction. That works until you need to reason about trends ("have we been close to empty for hours?") or aggregate state across multiple actors.

By extracting a dedicated gas monitoring component, I get:

- A single place to encode what "healthy" and "degraded" gas conditions mean.
- A clear API for other parts of the system: they do not care how gas health is computed, just whether it's safe to proceed or not.
- Tests that describe realistic scenarios: slow drains, sudden spikes, and the boundary cases where we should say "no".

The trade-off is another moving piece in the health pipeline, but the payoff is that decisions around gas become explainable instead of being scattered precondition checks.

## Being explicit about emergencies

The second decision was to treat emergency rebalancing as its own domain, with explicit entry points and invariants.

Previously, the logic for deciding when to rebalance in an emergency was intertwined with regular health checks and background tasks. That made it too easy to accidentally change behaviour when touching something seemingly unrelated, and too hard to simulate disaster scenarios.

By introducing an explicit emergency rebalance service and updating the scheduler to call it in clearly defined situations, I now have:

- A specific place where the "when" and "how" of emergency actions live.
- Room for richer decision logic: combining pool health signals with gas health and other constraints.
- Tests that cover the scary paths: "what if multiple pools are unhealthy and gas is marginal?".

The cost here is more abstraction boundary to maintain, but it buys the ability to harden behaviour with tests instead of just hoping integration tests cover the right angles.

## Gas as a first-class constraint

The most interesting part was wiring gas health into the emergency path.

Naively, you might say "if something is unhealthy, always rebalance". But if gas prices are extreme or balances are low, that policy can be worse than doing nothing: you spend a lot to slightly improve a bad situation, and you may not have enough budget left for the truly critical move that comes five minutes later.

So the design moved to treating gas as a first-class constraint:

- Emergency actions ask the gas monitor whether conditions are acceptable.
- If gas is unhealthy, the system records the need for action but defers the transaction.
- The scheduler revisits pending emergencies, so "not now" does not silently become "never".

There is a subtle trade-off here:

- **Pros:** fewer pointless transactions in hostile gas conditions, and stronger guarantees that gas is available when it really matters.
- **Cons:** more cases where the system intentionally stays in a degraded state for a bit longer, which is uncomfortable when you are risk-averse.

That discomfort is useful: it forces me to be explicit about thresholds and timings instead of pretending that "always act" is free.

## Testing the scary edges

Most of the interesting work landed in tests.

Unit tests for the gas monitor simulate scenarios like:

- Slow but steady gas depletion across multiple actors.
- Short-lived gas spikes where waiting a few blocks is the right choice.
- Borderline cases where we should allow a single emergency transaction but nothing more.

On the emergency side, tests exercise combinations of unhealthy pools, gas conditions, and scheduler timings. The goal is not to cover every edge case perfectly, but to lock down a handful of representative "oh no" stories and make sure they stay boring.

This also surfaced some integration flakiness in the test harness, which had to be tightened so failures are about behaviour, not about the environment. That is unglamorous, but necessary if you want to trust automation that touches real money.

## What still feels fuzzy

There are still open questions:

- The exact thresholds for calling gas "unhealthy" are partly intuition and partly historical observation. They will likely need tuning once this runs against real conditions.
- The scheduler's cadence and backoff for revisiting deferred emergencies is conservative for now; it might be too slow in some scenarios.
- There is no feedback loop yet from real-world failures back into the thresholds and policies.

I am intentionally biasing toward caution. It is better to learn that the system hesitated too often than to discover it eagerly burned gas in a cascade of marginal emergencies.

## Takeaway

Making gas a first-class input into emergency behaviour turned a fuzzy worry ("what if gas is weird when we really need to act?") into something concrete I can design and test around. The code changes are not huge, but the ability to reason about emergencies as "subject to explicit constraints" instead of "fire and pray" feels like a step in the right direction.