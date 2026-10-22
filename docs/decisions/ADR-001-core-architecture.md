# ADR-001: Use Next.js with real TideCloak and browser-side E2EE

## Status

Accepted

## Date

2026-10-22

## Context

The UNLOCKED Challenge prototype must demonstrate a trust bottleneck that ordinary centralised authentication does not solve. The selected idea requires four real identities to receive different decryption capabilities while the application administrator has no master key.

The repository currently contains documentation only. The implementation and demo must fit within seven hours, run locally with Docker CLI, use synthetic data, and tell a complete story in under two minutes.

## Decision

1. Scaffold the application from the official `@tidecloak/nextjs` initializer.
2. Run the official TideCloak dev container locally with a QEA-enabled realm.
3. Use four separate accounts for Tenant, Manager A, Manager B, and Admin.
4. Encrypt and decrypt rental-package strings in the browser through TideCloak tag-based E2EE.
5. Assign package-specific E2EE roles to individual users.
6. Store only ciphertext and non-sensitive metadata in the prototype.
7. Use no production database, file-upload pipeline, or cloud deployment in the MVP.

## Why This Decision

The official Next.js initializer is Tide's reference path and already addresses authentication, redirects, middleware, token verification, and E2EE integration. Starting there reduces integration risk within the timebox.

Browser-side E2EE is the capability that makes TideCloak essential to the idea. It lets the demo show that possession of application data or administrator access does not automatically grant plaintext access.

Separate accounts make the permission boundary observable. A UI role switch would demonstrate presentation logic, not identity or cryptographic authorization.

Minimal storage keeps effort focused on the risk the prototype must test: whether different recipients can open different encrypted packages.

## Alternatives Considered

### React with Vite

- **Advantages:** small frontend and familiar client-only structure.
- **Disadvantages:** more manual integration work; fewer generated server-side protection examples for this prototype.
- **Rejected because:** Next.js is the official reference implementation and gives a safer path inside seven hours.

### Mocked authentication and encryption

- **Advantages:** fastest UI implementation and reliable offline demo.
- **Disadvantages:** does not prove TideCloak criticality or the absence of a master decrypt key.
- **Rejected because:** it fails the central challenge requirement.

### Traditional OAuth provider with application-managed encryption

- **Advantages:** broad ecosystem and familiar tooling.
- **Disadvantages:** the application would still need to hold or control decryption keys and privileged overrides.
- **Rejected because:** it recreates the trust bottleneck the product is meant to remove.

### Production database and document upload

- **Advantages:** closer to a complete rental platform.
- **Disadvantages:** consumes time on persistence, file handling, and security concerns unrelated to the core proof.
- **Rejected because:** synthetic JSON/document previews are sufficient for the prototype.

### Multi-admin QEA as a mandatory core flow

- **Advantages:** directly demonstrates a policy change requiring more than one approver.
- **Disadvantages:** requires extra governance identities, enrolment, setup, and demo time beyond the four business accounts.
- **Deferred because:** selective E2EE is the primary proof. Multi-admin governance may be added only if the core loop is already stable.

## Consequences

### Positive

- TideCloak is materially required by the product.
- The architecture has no application-level universal decryptor.
- The access matrix is simple to test and easy to explain.
- The implementation can remain small enough for the challenge timebox.

### Negative

- The demo depends on Docker, Tide enrolment, network connectivity, and Fabric availability.
- Four real account sessions require preparation and careful recording.
- Revocation tests require governance completion and session renewal.
- The prototype does not prove production durability, upload security, or scale.

### Important limitation

With one `tide-realm-admin`, QEA has an approval threshold of one. The project must not describe that setup as multi-party approval. A future ADR must supersede this decision if multi-admin governance becomes mandatory.

## References

- <https://docs.tide.org/get-started/Tidecloak%20Quickstart>
- <https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-intro>
- <https://docs.tide.org/Admin/e2ee>
- <https://docs.tide.org/Admin/SetupIGA>
- <https://tide.org/whitepaper/tidecloak-integration>
