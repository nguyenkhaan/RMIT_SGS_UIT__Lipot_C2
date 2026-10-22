# ADR-002: Use a visibly marked mock bridge while TideCloak is repaired

## Status

Accepted as a temporary recovery decision on 2026-10-22.

## Context

The real TideCloak service is being repaired by a third party. The project must
continue building a small Next.js frontend and route-handler backend MVP without
presenting simulated access behaviour as the product's cryptographic proof.

## Decision

Build a minimal mock-MVP bridge with two replaceable contracts: identity and
package protection. The UI must permanently display `MOCK MODE — TideCloak
integration pending`. Domain models, API shapes, access-decision states, and
package tags remain compatible with the intended real integration.

Use a Bun-generated Next.js App Router baseline temporarily. When TideCloak is
healthy, use the official existing-Next.js tutorial to add the SDK and replace
the bridge with its provider, redirect route, proxy/middleware, server token
verification, and E2EE helper calls.

## Consequences

- The team can build and review the workflow, frontend, and backend boundaries
  without waiting for the service repair.
- The mock does not authenticate users, encrypt payloads, verify tokens, enforce
  policy, or satisfy the Challenge selective-decryption proof.
- The real TideCloak acceptance matrix remains mandatory before a compliant
  Challenge submission can be claimed.

## References

- <https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-tutorial>
- <https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-how-to-guide>
