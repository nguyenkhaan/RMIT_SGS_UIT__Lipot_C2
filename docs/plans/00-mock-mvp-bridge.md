# Phase 00 — Temporary mock-MVP bridge

## Purpose and boundary

This user-approved phase keeps delivery moving while a third party repairs
TideCloak. It builds a working Next.js frontend and route-handler backend
workflow, but it is **not** a TideCloak or E2EE implementation. By direct user
decision, the UI does not display a mock-mode label; no payload is called
ciphertext and no allow/deny outcome is called policy enforcement.

The phase is successful only when its adapters can be replaced by the official
SDK integration without changing the package domain model, API payloads, or UI
state model.

## M0.1 — Next.js baseline

Create the temporary App Router/TypeScript project through Bun in a safe
temporary directory, then merge the deliberate baseline into this repository.

**Acceptance criteria:**

- [ ] `package.json` and `bun.lock` exist; no `package-lock.json` exists.
- [ ] Frontend pages and App Router route handlers share one Next.js project.
- [ ] `.gitignore` excludes local state, environment files, build output, and
  `keycloakdb.*`.

**Verification:** User runs the generated Bun install, lint, build, and dev
commands and reports safe output.

## M0.2 — Stable contracts

Define `RentalPackage`, `PackageMetadata`, `AccessDecision`, `IdentitySession`,
`IdentityGateway`, `PackageProtectionGateway`, and server-side
`SessionVerifier`. Keep tags in one typed mapping.

**Acceptance criteria:**

- [ ] No UI component directly knows how identities or package protection work.
- [ ] The real TideCloak adapter has one replacement point for each gateway.
- [ ] No interface implies that mock output is encrypted or token-verified.

## M0.3 — Mock identity and API session

Implement a visible demo-account sign-in/sign-out flow for the four named demo
identities and a route-handler session verifier. The selector is only a
temporary identity seam and is replaced by TideCloak login when the real adapter
is available.

**Acceptance criteria:**

- [ ] The active demo identity is visible.
- [ ] Unauthenticated API requests fail.
- [ ] An opaque HTTP-only demo session has a single server-side verification
  boundary.

## M0.4 — Package workflow and simulated decisions

Let the tenant create synthetic package records; let all four mock identities
view the correct safe metadata and receive simulated grant/deny states through
the protection gateway.

**Acceptance criteria:**

- [ ] The matrix mirrors the intended tenant/manager/admin workflow.
- [ ] No temporary result is presented as a TideCloak result.
- [ ] No logging or browser persistence of draft plaintext is introduced.

## M0.5 — TideCloak swap checklist

Document the exact replacement points and defer exact SDK names/version until
the official integration can run.

**Acceptance criteria:**

- [ ] Provider, redirect, proxy/middleware, server verifier, `doEncrypt`, and
  `doDecrypt` replacement points are listed.
- [ ] Real integration verification remains unchecked.

## Exit criterion

Do not advance mock results into Phase 1–7 completion. On TideCloak recovery,
run the official integration and complete the real acceptance matrix.
