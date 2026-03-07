---
title: 'Building a Safety Net Around DeFi Automation'
date: '2026-03-08'
excerpt: 'Some notes from building a safety layer around DeFi automation: what problem it tries to solve, what I’m willing to trade off, and what I’m not ready to show yet.'
category: 'architecture'
tags: ['defi', 'automation', 'risk', 'architecture', 'typescript']
author: 'Angel Batlles'
---

# Building a Safety Net Around DeFi Automation

For the last months I’ve been building a safety layer around DeFi automation.

It doesn’t farm, it doesn’t chase yields, it doesn’t try to be “smart money”. Its only job is much more boring: **watch things, connect a few dots, and say “this is safe enough to act” or “please stop”**.

This post is a small introduction to what I’m building and, more importantly, how I’m thinking about it. I’m *not* going to show you everything – on purpose.

## What problem am I trying to solve?

If you’ve been around DeFi automation for a while, you’ve probably seen at least one of these patterns:

- Scripts that keep running happily long after the original assumptions are dead.
- “Health checks” that only verify that a process is up, not that it’s safe.
- Bots that will try to rebalance or harvest in environments that are clearly hostile: no gas, bad pricing, broken RPCs.

What I want from this safety layer is simple:

> Before you touch funds on-chain, answer one question:  
> **“Is it actually responsible to act right now?”**

Sometimes the answer should be “yes, go ahead”.  
Sometimes the answer should be “no, and here’s why”.  
And sometimes the answer should be “I have no idea, so I’m going to block you”.

That last case is the one I care about the most.

## A tiny bit about how it works (without giving away everything)

Very high level:

- It watches different kinds of signals:  
  balances, gas availability, strategy health, exit conditions…
- It combines them into **explicit decisions**:
  - “act now”,
  - “wait and re-check later”,
  - “refuse to act under current conditions”.
- It tries to make the **reasons** visible:
  - not just “failed”, but “skipped because insufficient gas runway”,
  - not just “error”, but “RPC is blind, treating this as unsafe”.

Under the hood it’s just TypeScript, a bunch of services, and more tests than I’d like to admit. The interesting part is not the framework, it’s the questions I force the code to answer.

There are parts I’m not going to describe in detail:

- exact thresholds and combinations of signals,
- operational internals,
- some of the production wiring.

Think of this series as **field notes**, not a full spec.

## What this blog series will focus on

I don’t want to turn this into a changelog of features. I’d rather write about the decisions behind them, for example:

- When should an automated system **refuse** to act, even if it technically can?
- How do you decide what “enough runway” means before you’re being irresponsible?
- Where do you consciously trade developer comfort for user safety?
- How do you encode those ideas in code so future-you can’t silently ignore them?

Each post will probably zoom into a small piece of the system:

- a service,
- a pattern,
- a specific check or threshold,

and treat it as an excuse to talk about **good vs bad code, and good vs bad decisions**.

You’ll see real snippets from the codebase, but always with a bit of blur where I don’t want to go into operational details.

## What I’m willing to show (and what I’m not)

I *am* willing to show:

- how I design health checks that do more than “is the process up?”,
- how I think about failing *closed* vs failing *open*,
- how I keep myself honest with tests and explicit contracts.

I’m *not* going to show:

- everything that can be configured and how,
- every single signal and threshold,
- anything that would meaningfully leak operational posture.

If sometimes a piece of code looks a bit redacted or simplified, assume it’s deliberate.

## What’s coming next

In the next post I’ll zoom into a piece that sounds trivial and really isn’t:

> how I decide whether there’s “enough gas” for the system to act at all.

On paper it looks like “just check the balance”.  
In practice it becomes a conversation about **runway, RPC failures, and when being blind should mean a hard stop**.
