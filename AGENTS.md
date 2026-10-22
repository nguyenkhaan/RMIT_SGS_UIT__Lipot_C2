# AGENTS.md

## Mission

Build the smallest credible UNLOCKED Challenge prototype of Rental Application Passport. The demo must prove selective decryption with TideCloak, not merely display different UI states for different roles.

## Read Before Changing Code

Read these documents in order:

1. `docs/CONTENT.md`
2. `docs/requirement.md`
3. `docs/specification.md`
4. `docs/architecture.md`
5. `docs/tidecloak-integration.md`
6. `docs/demo-guide.md`
7. `docs/decisions/ADR-001-core-architecture.md`

If documents conflict, follow the precedence defined in `docs/CONTENT.md`. Update the relevant specification before changing behaviour.

## Current Phase

- The project is in the SDD Specify phase.
- Do not create `plans/`, task breakdowns, or application code unless the user explicitly advances the project to planning or implementation.
- Do not claim the prototype is runnable while `package.json` is absent.

## Fixed Product Decisions

- Framework: Next.js using the official `@tidecloak/nextjs` initializer.
- Identity system: a real TideCloak dev container, not mocked authentication.
- Core identities: `tenant`, `manager-a`, `manager-b`, and `admin`, each with a separate TideCloak account.
- Sensitive payloads: synthetic data only, encrypted in the browser with TideCloak E2EE.
- Storage: ciphertext plus non-sensitive metadata only; no production database is required for the prototype.
- Demo scope: Manager A decrypts only the income package, Manager B decrypts only the reference package, and Admin decrypts neither.
- Timebox: the implementation and demo must fit within seven hours.

## TideCloak Rules

- Follow current official Tide documentation and record source URLs for non-obvious integration decisions.
- Preserve the generated TideCloak provider, redirect, middleware, token verification, and adapter patterns unless official documentation requires a change.
- Pass only `string` or `Uint8Array` payloads to E2EE helpers.
- Use matching `_tide_<tag>.selfencrypt` and `_tide_<tag>.selfdecrypt` realm roles.
- Assign E2EE roles to individual demo users. Do not add package-specific decrypt roles to the realm's default roles.
- Treat UI role checks as presentation only. Access must ultimately fail at the TideCloak/E2EE boundary when the user lacks the decrypt role.
- Never add a backend decryption key, administrator bypass, shared test identity, or hidden role-switch control.
- After a role change, renew the affected session before testing the new permission state.

## Data and Security Rules

- Use fictional names, addresses, salaries, employers, references, and document contents.
- Never commit passwords, tokens, client secrets, exported sessions, real PII, or local TideCloak data.
- Keep `tidecloak.json` only if the generated configuration is confirmed safe for a public repository. Ask before committing any confidential client configuration.
- Do not log plaintext sensitive payloads, access tokens, or decrypted values.
- Revocation prevents future authorised decryption after the change is committed and the session is renewed; it cannot erase content already viewed or copied.

## Engineering Boundaries

Always:

- Keep the core demo loop working before adding polish.
- Use TypeScript and explicit domain names such as `RentalPackage`, `AccessDecision`, and `recipientId`.
- Validate role/tag mappings against `docs/tidecloak-integration.md`.
- Run the repository's actual lint and build commands before declaring a change complete.
- Update README setup instructions when commands become executable.

Ask first:

- Adding a database, file upload, cloud deployment, or a new runtime dependency.
- Changing the four core identities, E2EE tags, or the demo access matrix.
- Adding extra governance administrators for a multi-admin QEA demonstration.
- Automating TideCloak administrative changes through a service account.

Never:

- Replace TideCloak with mocked auth, Firebase, Auth0, or plain Keycloak for the submitted demo.
- Store plaintext application packages in server state, browser storage, source files, or logs.
- Present first-admin QEA as proof of multi-party approval.
- Expand into a property marketplace, KYC service, document management platform, or production tenancy workflow.

## Verification Standard

A feature is complete only when:

- the authorised path succeeds with the correct real TideCloak account;
- the unauthorised path fails with the wrong account and with Admin;
- ciphertext remains unreadable outside an authorised browser session;
- `npm run lint` and `npm run build` pass once those scripts exist;
- affected documentation reflects the implemented behaviour.
