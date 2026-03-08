---
title: "Designing gas runway checks and emergency rebalances that can safely say no"
date: 2026-03-08T09:00:00+02:00
slug: gas-runway-emergency-rebalances
---

Over the last few days I finally tackled something that had been quietly bothering me for a while: how fragile automated rebalancing becomes when gas wallets are an afterthought. This week was about making gas a first-class signal, and wiring it into an emergency rebalance flow that is allowed — and expected — to say "no" when conditions aren’t safe.

## Context: automation that depends on invisible wallets

The system manages pools that occasionally need emergency rebalancing: withdrawing from one vault, moving funds, and redeploying into a healthier pool. On paper, the logic for "what" to do was already there.

The missing piece was "can we actually afford to do this right now?" — not in terms of TVL or yield, but in terms of plain old gas.

Previously, gas lived in the background:

- Wallet balances weren’t explicitly modelled as part of system health.
- There was no shared notion of "runway" (how many rebalances we can afford).
- RPC failures were treated as "shrug, try later" rather than hard blockers.

That setup works until it doesn’t. A network glitch or a depleted wallet can turn a perfectly reasonable rebalance decision into a half-executed mess.

## Decision: gas as a health signal, not a side note

The first decision was to promote gas into the health model:

- Introduce a service that periodically checks gas balances across chains.
- Express those balances as **runway**, not raw token amounts.
- Feed that signal into both the scheduler and the emergency rebalance logic.

The runway formula is deliberately simple and opinionated:

> runway = balance ÷ (350k gas × gasPrice × 2 rebalances/day)

This bakes in assumptions:

- ~350k gas per rebalance is a conservative upper bound.
- Two rebalances per day per chain is enough to respond to most emergencies.
- We care more about "days of safety" than about the exact number of transactions.

From there, thresholds are defined in human terms:

- **WARNING** when runway < 7 days.
- **CRITICAL** when runway < 3 days.
- The system recommends topping up back to a 14-day target.

The key design choice is that nothing in here is trying to be maximally precise. The goal is to avoid silent degradation, not to squeeze every last bit of efficiency out of gas.

## Trade-off: blocking deployments vs being "nice"

Once gas became a first-class signal, the uncomfortable question surfaced: what should the system do when gas is low?

Two obvious options:

1. Log a warning and let everything continue.
2. Treat insufficient gas as a **hard failure** and block actions.

I chose (2) for anything critical:

- If a chain’s gas runway is CRITICAL, deployments on that chain are blocked.
- Emergency rebalances on that chain are skipped with an explicit `insufficient_gas` reason.

This is intentionally unfriendly from a "developer experience" point of view. It surfaces as red lights and blocked actions instead of best-effort retries. But it’s much more honest:

- Operators see immediately when the system is unsafe to act.
- We avoid half-executed flows caused by running out of gas mid-flight.
- There’s a single source of truth for "is it safe to touch this chain right now?".

The opposite trade-off would have made incidents quieter but nastier: everything "seems fine" until txs mysteriously fail or get stuck.

## Caching and failure modes: when "no data" means "no"

Another subtle decision: what to do when the gas checks themselves fail.

RPC calls are not free and not perfectly reliable. To avoid turning the system into an RPC spammer, the gas check results are cached for a few minutes when deciding whether it’s safe to deploy.

More importantly, RPC failures are treated as **CRITICAL** for that chain:

- If we can’t read the gas balance, we assume the worst.
- That blocks deployments and emergency rebalances on that chain.

This is a very opinionated stance: "no data" is interpreted as "unsafe", not "unknown". The practical consequence is fewer mysterious edge cases:

- We don’t accidentally approve a rebalance based on stale or missing data.
- Any upstream infra issues (RPC outages, misconfigurations) show up as hard blocks.

The price is that transient RPC issues can stop the world for a bit. I’m fine with that: I’d rather debug "why is this blocked?" than "why did we touch this chain while blind?".

## Emergency rebalances: tightening the contract

On top of the gas checks, the emergency rebalance flow itself got stricter:

- Operations like withdrawing from a vault or redeploying funds now run with explicit timeouts.
- Replacement pools are selected in a more constrained way (e.g. prefer same chain among CRITICAL pools).
- Skipped rebalances record structured reasons (`rate_limit`, `no_replacement`, `insufficient_gas`, etc.) instead of ad-hoc strings.

The common theme is to make the automation’s decision surface narrower and more explicit:

- Either we can afford to act, in which case we try within strict bounds.
- Or we can’t, and we say so clearly.

This also makes tests much more meaningful: instead of checking brittle log messages, they assert on well-defined fields and state transitions.

## What I’m still unsure about

A few open questions remain:

- Are the WARNING/CRITICAL thresholds aggressive enough for real-world volatility?
- Should different chains have different runway assumptions (gas cost, typical activity)?
- How noisy will this be in practice — will operators start ignoring warnings?

Right now the thresholds are deliberately conservative. I’d rather over-alert on potential gas exhaustion and tune it down later, based on real incidents.

Another question is where to surface these signals: logs are not enough. This probably needs to end up in whatever monitoring/dashboarding exists around the system.

## Takeaway

The main lesson from this week is that **automation needs permission to say "no"**.

By turning gas from an invisible constraint into a first-class health signal — and wiring that into emergency flows as a hard blocker — the system becomes less magical but much more trustworthy. I’d rather deal with a loud, stubborn "I refuse to rebalance" than quietly ship a half-broken rescue tx in the dark.