---
title: "Layered safety nets for automation: coverage gates, health checks, and reality checks"
date: 2026-03-09T11:00:00+02:00
slug: layered-ci-safety-nets
---

Lately I've been thinking less about *features* and more about *consequences*.

When you wire up automation that can move money, rebalance positions, or poke external systems, the real question isn't "does it work?" but "how do I know when it quietly stops working?" And even more uncomfortable: "how hard is it for me to lie to myself that it's fine?"

Over the last few days I leaned into that discomfort and reworked how tests and validation are wired into the project: a CI pipeline with explicit coverage gates, a dedicated coverage test for a risky group of services, and a local validation script that inspects the live system instead of just green unit tests.

This post is a quick journal of those decisions and their trade‑offs.

## Why bother with a coverage gate at all?

There are two common failure modes around code coverage:

1. **Ignoring it completely.** Tests slowly rot, new code ships untested, and the metrics dashboard becomes a dashboard of lies.
2. **Treating the percentage as a vanity metric.** Teams chase an arbitrary number because a policy or a badge says so, not because it actually protects anything.

I wanted something in between: a number that is *boring* most of the time, but becomes non‑negotiable around the pieces of logic that can hurt you.

That led to a combination of:

- A CI job that runs the unit test suite with coverage and enforces a global floor (configured via Vitest thresholds).
- A dedicated test that loads the coverage report and asserts that a specific cluster of "epic" services stays above 85% line coverage.

The key idea: instead of pretending every line is equally important, acknowledge that some services are where the real risk lives, and wire the tooling so future you cannot accidentally erode that safety margin without noticing.

## Making coverage concrete: testing the test harness itself

The special‑case coverage test does something slightly opinionated:

- It reads the JSON coverage summary produced by the unit test run.
- It aggregates coverage across a curated list of services: monitoring, health checks, emergency actions, consensus / validation logic, etc.
- It prints a small report (lines, covered lines, percentage) and then fails if the aggregate dips below 85%.

This has a few practical consequences:

- **The important stuff can never silently drift.** Adding a new monitoring service without tests immediately shows up as a coverage drop.
- **Coverage configuration becomes executable documentation.** The list of paths is effectively a living index of "if this breaks, something serious can happen".
- **Refactors are forced to be honest.** You can't sneak in large rewrites of these services without bringing tests along.

The trade‑off is obvious: it's more annoying to iterate on those files. But that's the whole point — I *want* friction exactly where regression risk is highest.

## CI as a gatekeeper, not a suggestion

On top of that coverage check, the CI workflow now has a more opinionated shape:

- **Unit tests + coverage gate** run first on every push and pull request targeting the main branch.
- **Build verification** only runs if unit tests pass; there's no point building artifacts from a failing tree.
- **Anvil‑based end‑to‑end tests** (which depend on an archive RPC endpoint and private keys) only run on pushes to the main branch, not on every PR.

The last point was a conscious compromise:

- Running heavy E2E tests on every PR would be the ideal from a safety perspective.
- In practice, they depend on a forked chain, external RPC infrastructure, and can be both slow and flaky under rate limits.

So instead of making PRs hostage to outside services, the pipeline treats unit + integration coverage as the strict gate, and E2E as a periodic "reality check" on the default branch.

Is that perfect? No. A PR can still introduce a regression that only shows up when talking to real chain data. But it's a meaningful improvement over both extremes:

- No E2E at all (false sense of safety from fast tests), or
- E2E on every change (unreliable CI that people learn to ignore).

The design intentionally biases toward *reliable* signals, even if they are imperfect.

## Validating the system, not just the code

The other half of the work was outside CI: a `validate.sh` script meant to answer a simpler, more human question:

> "If I run this command and it says ✅, do I feel comfortable letting the system run unattended?"

Instead of re‑running the same tests CI already covers, the script focuses on live signals:

- Environment sanity (is the configuration file present, are critical RPC URLs and keys non‑placeholder values?).
- Database health (does the SQLite file exist, do the main domain tables contain data?).
- Backend status (does the health endpoint respond, is the scheduler actually running?).
- Algorithm state (what have the last health checks and decisions looked like, are there any recent critical statuses or error flags?).
- Order flow (how many orders have executed, failed, or are stuck, and what did the last few look like?).
- RPC connectivity to each chain, via a trivial `eth_blockNumber` call.

Each check is intentionally independent: the script never `set -e`, and failures in one area don't hide information from the others. The output is a compact checklist with counters for passed, failed, and warning‑level checks, followed by concrete commands you can run next.

The trade‑offs here are mostly about **scope**:

- I resisted the temptation to turn it into yet another test runner.
- It doesn't try to be a full observability stack; it's just a snapshot you can run locally or before touching production.

In other words, it's "grep‑able peace of mind" rather than a monitoring system.

## Where this leaves things (and what still bothers me)

Putting this all together, the current safety net has three layers:

1. **Local validation** to answer "is this instance in a sane state right now?"
2. **Coverage gate + focused coverage test** to answer "are the high‑risk services still well exercised by tests?"
3. **CI workflow** to enforce those checks consistently and catch pathological changes early.

This is better than what existed a week ago, but there are obvious gaps:

- The coverage thresholds are still blunt instruments; they don't distinguish between "trivial glue code" and "subtle algorithmic branches".
- The validation script assumes a fairly static schema and set of checks; it will need pruning as the domain evolves.
- Anvil‑based tests only run on main; improving their speed and reliability enough to run on PRs is still an open goal.

The main lesson for me this week is that safety work only feels like overhead when it's abstract. As soon as you attach it to specific consequences — missed alerts, bad rebalances, stuck capital — it becomes obvious where the friction should live.

**Takeaway:** coverage gates and validation scripts aren't about making numbers go up; they're about deciding *where* you're allowed to be lazy, and where you absolutely are not.
