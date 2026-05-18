---
title: 'AI and productivity: the hidden cost of delegating control'
date: '2026-05-17'
excerpt: "I've been using AI intensively for months. The more I use it, the clearer a paradox becomes: it multiplies my productivity, but it can also make me lose control over what I'm building."
category: 'development'
tags: ['ai', 'productivity', 'enterprise', 'judgment']
author: 'Angel Batlles'
image: '/images/contents/ai-this-is-fine.png'
---

A few months ago my team shipped a change that worked perfectly. Everything looked fine until another team shipped something on their end and a bug appeared — nothing obvious, the kind that takes time to surface and doesn't point clearly to its origin.

When I started investigating, I delegated to the AI. It gave me four solutions. All coherent. All technically valid. None of them quite fit.

We got together with the other team for a pair programming session. In twenty minutes we found the real solution — one the AI never proposed, because it required understanding a design decision that neither team had documented separately.

That experience left me thinking about something I've been seeing more clearly for months: AI multiplies productivity, but it can also make you lose control over what you're building. I don't think the problem is AI. I think the problem is how and when we choose to delegate to it.

> The AI always gravitates toward the most obvious option. Technically valid, but not always correct for your context.

The gap between what we expect and what actually happens:

![Expectations vs Reality: AI will understand the full context of the system vs AI doesn't know what was decided in a meeting back in 2019](/images/contents/ai-expectations-vs-reality.png)

## When AI works incredibly well

There are tasks where the improvement is absurd: boilerplate, refactors, tests, documentation, initial debugging, quickly exploring solutions.

**AI amplifies when...**
- You understand the system well
- The problem is documented
- You can evaluate the output

**AI fails when...**
- Context is cross-team
- The decision isn't written down
- "Valid" feels like enough

## The real risk isn't AI failing

The real risk is more uncomfortable: trusting solutions we don't fully understand. AI produces responses that are coherent and technically valid, and now you can produce enormous changes in minutes. But you modify things fast without truly understanding them, and that generates a false sense of comprehension.

> "Valid" doesn't always mean "correct for your context." And the less you understand the system, the more you depend on AI's judgment to know the difference.

Me, merging PRs at 11pm:

![This is fine: me accepting AI-generated changes while production burns](/images/contents/ai-this-is-fine.png)

## What AI doesn't see

AI can read code, but it doesn't understand why certain decisions exist, what technical debt can't be touched, or what the team next door knows that was never documented.

That knowledge lives in people, conversations, and past incidents. In complex systems, the best decision isn't usually the most elegant one — it's the one that fits everything that isn't written down.

## The new value isn't writing faster

> It's understanding better.

AI automates, accelerates, and proposes. But judgment is human: deciding what to build, what not to touch, what risks to take on.

When context is fuzzy, you start accepting answers too quickly. You delegate decisions without realizing it.

The cost of producing software drops. The cost of understanding the problem doesn't. And that context still lives primarily in people. Sometimes, at the intersection of two teams in a twenty-minute meeting.

---

*By the way: this post was written with AI. The irony isn't lost on me.*
