# Documentation Index

This directory is the source of truth for the Specify phase of Rental Application Passport. It contains eight documents, below the project limit of ten. No `plans/` or task breakdown has been created.

## Recommended Reading Order

| Order | Document | Purpose |
| --- | --- | --- |
| 1 | [idea.md](idea.md) | Explains the problem, proposed experience, MVP, assumptions, and non-goals in plain language. |
| 2 | [requirement.md](requirement.md) | Converts the challenge brief and confirmed user decisions into binding requirements. |
| 3 | [specification.md](specification.md) | Defines the SDD specification: objective, stack, commands, structure, style, testing, boundaries, and success criteria. |
| 4 | [architecture.md](architecture.md) | Describes components, trust boundaries, data flow, roles, tags, and the target project structure. |
| 5 | [tidecloak-integration.md](tidecloak-integration.md) | Gives the official-doc-backed TideCloak setup and integration contract. |
| 6 | [demo-guide.md](demo-guide.md) | Defines the two-minute story, preflight checks, and observable acceptance scenarios. |
| 7 | [decisions/ADR-001-core-architecture.md](decisions/ADR-001-core-architecture.md) | Records why Next.js, real TideCloak, browser E2EE, and minimal storage were chosen. |
| 8 | This document | Provides navigation and document governance. |

Root-level supporting documents:

- [`../README.md`](../README.md) — public project and challenge overview.
- [`../AGENTS.md`](../AGENTS.md) — operating rules for coding agents and contributors.

## Source-of-Truth Precedence

When two documents disagree, resolve the conflict in this order:

1. Direct user decisions recorded in `requirement.md`.
2. The official UNLOCKED Challenge rules linked from `requirement.md`.
3. `specification.md` acceptance criteria and boundaries.
4. `architecture.md` and `tidecloak-integration.md` technical contracts.
5. `demo-guide.md` presentation details.
6. The ADR, which explains decisions but does not override newer requirements.

For TideCloak API behaviour, current official Tide documentation overrides remembered or inferred behaviour. If the docs and generated project differ, stop, record the mismatch, and update the specification before proceeding.

## Document Status

| Document | Status | Update trigger |
| --- | --- | --- |
| `idea.md` | Confirmed | Product intent or scope changes. |
| `requirement.md` | Confirmed | Challenge rule or user decision changes. |
| `specification.md` | Ready for review | A success criterion, command, or engineering boundary changes. |
| `architecture.md` | Proposed | Scaffolding reveals a different generated structure or verified SDK constraint. |
| `tidecloak-integration.md` | Proposed | Tide documentation or generated SDK surface differs. |
| `demo-guide.md` | Proposed | Implemented UI flow or video constraint changes. |
| `ADR-001` | Accepted | A superseding architectural decision is approved. |

## SDD Phase Gate

This repository is currently at **Specify**.

- Completed: intent discovery and direction confirmation.
- In this phase: requirements, specification, architecture, integration contract, and acceptance story.
- Not created: `plans/`, task lists, implementation code, or deployment assets.
- Next gate: the user reviews and approves this document set before planning begins.
