---
id: project-travelport
title: Travelport platform work
type: project
period: 2022-present
themes: [api-design, sdk, ci, reliability, travelport, career, work, typescript, marketplace, search, micro-frontend, refactoring]
signals: [technical, product]
priority: 5
confidence: high
---
At Travelport (2022 – present), I work as Software Development Engineer. I've been part of three teams:

**Marketplace team (first team):** Mostly a backend team — I was the only frontend engineer. One of the main goals we shipped was the Marketplace service: a platform where clients could upload a micro-frontend, and our service would analyse it via SonarQube and other CI pipelines. Once all checks passed, the micro-frontend was automatically promoted to production. I owned the frontend integration and the pipeline-facing UI layer.

**Cars & Trains team:** Worked on the booking flow for cars and trains, adding new features to existing workflows. Where I had the most impact was introducing TypeScript across several repos that were still in plain JS, refactoring large sections of the codebase, and improving overall code quality — the kind of foundational work that pays off long-term.

**Search team (current):** Working on the search flow, improving it and adding new capabilities — both on-demand features requested by clients and internal roadmap items driven by Travelport. Mix of product feature work and platform-level improvements.

A recurring tradeoff across all three teams: strict contracts and typed boundaries improve long-term stability but can slow short-term iteration. The best outcomes came from explicit versioning, clearer partner-facing APIs, and pushing for TypeScript earlier rather than later.
