# Documentation Index

This directory is the source of truth for the Specify and Plan phases of Rental
Application Passport. The compact specification set remains eight documents;
phase-by-phase implementation plans live under `plans/`.

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
| 8 | [decisions/ADR-002-temporary-mock-mvp-bridge.md](decisions/ADR-002-temporary-mock-mvp-bridge.md) | Records the temporary mock bridge and its TideCloak replacement boundary. |
| 9 | [plans/README.md](plans/README.md) | Maps dependencies, timebox, phase order, full-stack delivery model, and project-wide Definition of Done. |
| 10 | [guide-pland.md](guide-pland.md) | Assigns the two-person team, defines Bun commands, and records cross-phase handoffs. |
| 11 | This document | Provides navigation and document governance. |

Read the temporary bridge first when TideCloak is blocked, then the seven real
integration phase files in numeric order after the plan index:

1. [`plans/00-mock-mvp-bridge.md`](plans/00-mock-mvp-bridge.md)
2. [`plans/01-environment-and-scaffold.md`](plans/01-environment-and-scaffold.md)
3. [`plans/02-realm-identities-and-policies.md`](plans/02-realm-identities-and-policies.md)
4. [`plans/03-authenticated-full-stack-shell.md`](plans/03-authenticated-full-stack-shell.md)
5. [`plans/04-tenant-encryption-slice.md`](plans/04-tenant-encryption-slice.md)
6. [`plans/05-selective-decryption-slice.md`](plans/05-selective-decryption-slice.md)
7. [`plans/06-admin-revocation-and-hardening.md`](plans/06-admin-revocation-and-hardening.md)
8. [`plans/07-acceptance-documentation-and-demo.md`](plans/07-acceptance-documentation-and-demo.md)

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
7. `plans/`, which sequences implementation but never overrides the documents above.

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
| `plans/` | Ready for review | Scope, dependency, timebox, generated SDK contract, or implementation outcome changes. |
| `guide-pland.md` | Ready for review | Team assignment, Bun workflow, or cross-phase handoff changes. |

## SDD Phase Gate

This repository is in **temporary mock-MVP implementation**. The user approved
this recovery path on 2026-10-22 while a third party repairs TideCloak.

- The mock MVP uses the intended Next.js/TypeScript/Bun frontend and backend
  technologies, with an explicit TideCloak integration seam.
- By direct user decision, the UI does not show a mock-mode label. It still must
  not claim real TideCloak authentication, E2EE, policy enforcement, or
  submission evidence.
- Real TideCloak enrolment, generated configuration, token verification, and
  E2EE remain required before claiming the Challenge acceptance criteria.
- The mock-MVP plan is [`plans/00-mock-mvp-bridge.md`](plans/00-mock-mvp-bridge.md).
