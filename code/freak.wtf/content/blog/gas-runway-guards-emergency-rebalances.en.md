---
title: "Designing Gas Runway Guards for Automated Emergency Rebalances"
date: 2026-03-08T09:00:00+02:00
slug: gas-runway-guards-emergency-rebalances
---

Over the last few days I’ve been wiring together something that felt missing from the automation stack: a way to treat gas balance as a first‑class risk input, not just an annoying operational detail you notice when transactions start failing.

The concrete problem: there is an emergency rebalance pipeline that can reshuffle capital when pools become unhealthy. That pipeline assumes it can always deploy transactions on the chains it cares about. In practice, gas wallets are finite, RPC can fail, and monitoring is noisy. I wanted a safety layer that makes those constraints explicit and forces the automation to behave conservatively when gas is low or the view of the chain is unreliable.

## Modeling gas as runway, not as a number

The first design choice was how to even talk about “enough gas”. Raw balances are useless in isolation: 0.5 ETH might be plenty on a cheap L2 and hopeless on a congested L1.

Instead I modelled gas as **runway in days**:

> `runwayDays = balance / (350k gas × gasPrice × 2 rebalances per day)`

A few deliberate decisions are hidden in that formula:

- **350k gas** is a pessimistic upper bound per rebalance, including approvals and vault interactions.
- **2 rebalances/day** assumes a small but non‑trivial incident rate. If reality is quieter, we get extra safety margin for free.
- Using **today’s gas price** makes the signal adaptive: same balance, different market conditions → different runway.

This gave me a scalar I can reason about: “how many days could we keep reacting to bad pools if nothing else changed?” It also plays nicely with human expectations; saying “we have ~3 days of runway on Arbitrum” is a lot clearer than “the hot wallet has 0.12 ETH”.

Thresholds then become policy, not infrastructure:

- **WARNING** when runway < 7 days
- **CRITICAL** when runway < 3 days

Those numbers are arbitrary but defensible: they buy time for humans to top up and for automation to start refusing new work before it’s forced into a corner.

## Blocking automation instead of “best effort”

The next question was what to do with a CRITICAL runway.

The tempting answer is “just log it and keep going” — which is what most monitoring systems do by default. But for emergency rebalances this is exactly backwards: the riskiest operations should be the first ones we stop doing when our ability to pay for them is at risk.

So the rule became:

- When a chain’s gas runway is **CRITICAL**, that chain is **not allowed** to accept new emergency rebalances.

Technically this shows up as a new `skipReason` on rebalance results (`insufficient_gas`), but the interesting part isn’t the enum value; it’s the intent:

- The system is **explicit** about why it refused to act.
- The refusal happens **early**, before we even attempt to build transactions.

This choice trades off availability for predictability. In the worst case, a genuinely unhealthy pool might stay unhealthy slightly longer because the wallet is low. But the alternative is worse: partially executed flows, stuck orders, and a scheduler that thinks it “tried” when in reality it never had a chance to succeed.

## RPC failures as hard failures

Another uncomfortable edge case is when the view of the chain is broken: RPC timeouts, provider errors, or inconsistent data.

Here the failure mode is subtle: you might think you have a healthy gas balance because the last cached value was fine, while the actual wallet is empty. Or worse, different checks observe different states and disagree.

The conservative design I ended up with:

- If gas balance cannot be fetched for a chain, that chain is treated as **CRITICAL**.
- A CRITICAL status here has the same consequence as a true low‑gas condition: it **blocks deployments** on that chain.

This is harsh, but deliberate. When the automation can’t see, I’d rather it **stops** than act on stale assumptions. It’s the same principle as failing closed on auth: inconvenience beats silent unsafe behaviour.

To soften the impact, there’s a small cache (~5 minutes) around the “can we deploy to this chain?” decision. This avoids hammering RPC providers on every scheduler tick while still ensuring that a gas top‑up or provider fix propagates quickly.

## Wiring gas checks into the scheduler

None of this matters unless it actually influences behaviour.

The health scheduler already runs every 15 minutes to scan pools and trigger emergency rebalances for critical ones. The new gas monitor hooks into that loop:

- On each cycle, it **checks all chains** and stores their gas runway status.
- When deciding whether to rebalance a critical pool, the scheduler now asks: “is the target chain allowed to accept deployments?”

This keeps the mental model simple:

- Health checks decide **what** needs to move.
- Gas checks decide **whether** we’re currently allowed to move it.

By separating the two, it’s easier to test each piece in isolation (there’s a dedicated test suite around gas monitoring) and to evolve the policy later without rewriting all the health logic.

## How this interacts with emergency rebalances

The emergency rebalance flow itself got a few quality‑of‑life improvements while I was here:

- Reads of on‑chain balances and vault shares now have **timeouts** and proper cleanup instead of relying on implicit provider behaviour.
- The `skipReason` field was promoted from free‑form strings to an explicit enum, so the rest of the system can rely on stable reasons instead of brittle text matching.
- The lifecycle of an emergency order is now explicit (`PENDING → EXECUTED/FAILED` with timestamps), which makes partial executions and retries easier to reason about.

The interesting part is the interaction surface:

- Gas monitoring can mark a chain as unavailable.
- Emergency rebalance logic then uses that information to decide whether a pool is even a candidate.

I like this separation because it scales: today the blocker is “insufficient gas”, tomorrow it could be “RPC provider degraded”, “vault paused”, or something more exotic. As long as the decision is expressed as a structured `skipReason`, the rest of the system doesn’t have to know the details.

## Open questions and next steps

A few things I’m still not sure about:

- The **runway formula** is intentionally simple. In reality, rebalance frequency and gas usage per chain are not uniform. At some point it might make sense to learn per‑chain baselines instead of using a single constant.
- The **thresholds** (7 and 3 days) are gut‑feel numbers. I expect they’ll need tuning once there’s more real‑world data.
- The current policy is binary: either a chain accepts deployments or it doesn’t. There’s probably a middle ground where we still allow **manual** or **high‑urgency** actions when gas is low, but block everything else.

For now, I’m erring on the conservative side. If this layer ever fires in production, I want it to be crystal clear why it did and what needs to change (usually: “top up the wallet” or “fix RPC”).

## Takeaway

Treating gas as runway — and wiring that signal into whether automation is even allowed to act — turns a vague operational concern into an explicit safety guardrail. It’s a small piece of code, but it shifts the system’s default from “do your best, even when blind” to “stop when you can’t see or can’t pay”.
