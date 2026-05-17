---
title: 'AI and productivity: the hidden cost of delegating control'
date: '2026-05-17'
excerpt: "I've been using AI intensively for months. The more I use it, the clearer a paradox becomes: it multiplies my productivity, but it can also make me lose control over what I'm building."
category: 'development'
tags: ['ai', 'productivity', 'enterprise', 'judgment']
author: 'Angel Batlles'
image: '/images/contents/ai-this-is-fine.png'
---

A few months ago, my team shipped a change that worked perfectly.

Everything looked fine until another team shipped something on their end.

An unexpected side effect — an unintended consequence of the other team's change that affected ours without anyone anticipating it. Nothing obvious. The kind of bug that takes time to surface and, when it does, doesn't point clearly to its origin.

When I started investigating, I delegated to the AI. It gave me four different solutions. All coherent. All technically valid. But something felt off — none of them quite fit what I knew about the system.

Until we got together with the other team for a pair programming session.

In twenty minutes, we found the real solution. One the AI never proposed, because it required understanding a design decision that neither team had documented separately.

That experience left me thinking about something I've been seeing more clearly for months:

> The AI always gravitates toward the most obvious option. Technically valid, but not always correct for your context.

The gap between what we expect and what actually happens:

![Expectations vs Reality: AI will understand the full context of the system vs AI doesn't know what was decided in a meeting back in 2019](/images/contents/ai-expectations-vs-reality.png)

## The paradox that doesn't go away

I've been using AI intensively for software development for months.

And the more I use it, the clearer a paradox becomes:

AI multiplies my productivity. But it can also make me lose control over what I'm building.

I don't think the problem is AI. I think the problem is how and when we choose to delegate to it.

## When AI works incredibly well

There are tasks where the improvement is absurd: boilerplate, refactors, tests, documentation, initial debugging, quickly exploring solutions.

When you understand the system well, AI becomes a brutal force multiplier.

It doesn't replace your work. It amplifies your execution capacity.

**AI amplifies when...**
- You understand the system well
- The problem is documented
- You can evaluate the output

**AI fails when...**
- Context is cross-team
- The decision isn't written down
- "Valid" feels like enough

## The real risk isn't AI failing

The real risk is more uncomfortable: trusting solutions we don't fully understand.

AI produces responses that are coherent, reasonable, and technically valid.

Now you can produce enormous changes in minutes.

That's spectacular. But it can also generate a false sense of comprehension.

You modify something very quickly without truly understanding it.

> "Valid" doesn't always mean "correct for your context." And the less you understand the system, the more you depend on AI's judgment to know the difference.

Me, merging PRs at 11pm:

![This is fine: me accepting AI-generated changes while production burns](/images/contents/ai-this-is-fine.png)

## What AI doesn't see

AI can read code.

But it doesn't understand why certain decisions exist. It doesn't know what technical debt can't be touched. It doesn't know the edge cases that have already blown up. It can't see the invisible dependencies holding the system together.

And there's something else it can't see: what the team next door knows, which was never documented.

That knowledge lives distributed across people, conversations, past incidents, and years of system evolution.

The real solution to our bug existed at the intersection of what my team knew and what the other team knew.

AI didn't have access to that intersection.

In enterprise, the same pattern plays out at scale.

In theory, many architectures are better. In practice, real systems live constrained by costs, compliance, legacy, incomplete migrations, and business priorities that nobody has time to document properly.

AI will gravitate toward the elegant solution, the standard pattern, the reasonable simplification.

But in complex environments, the best decision is often not the most elegant one. It's the one that fits everything that isn't written down.

## Automating execution is not the same as delegating judgment

This is the important line.

AI is excellent at automating, accelerating, proposing, and optimizing. But judgment remains human.

Because in engineering the problem is rarely just writing code. The problem is usually deciding what to build, what not to touch, what tradeoffs to accept, and what risks to take on.

That still depends on context.

When you understand the domain and can evaluate consequences, AI multiplies your impact.

When context is fuzzy, you start accepting answers too quickly. You delegate decisions without realizing it.

And that's where the hard problems appear.

## The new value isn't writing faster

> It's understanding better.

Producing software is becoming increasingly cheap.

The genuinely scarce knowledge is starting to be context, judgment, and the ability to make good decisions.

AI reduces the cost of producing solutions enormously. But it doesn't reduce the cost of understanding the problem.

And in enterprise software, that context still lives primarily in people.

Sometimes, at the intersection of two teams in a twenty-minute meeting.

---

*By the way: this post was written with AI. The irony isn't lost on me.*
