# TideCloak Integration Contract

## 1. Purpose

This document defines the minimum real TideCloak integration required by the prototype. It is based on official Tide documentation checked on 2026-10-22. Generated code and current official documentation must be rechecked during implementation because no `package.json` exists yet.

## 2. Official Starting Point

The project uses the official Next.js initializer through Bun:

```powershell
bun create @tidecloak/nextjs@latest rental-application-passport
```

The official quickstart publishes `npm init @tidecloak/nextjs@latest`. Bun's
documented `bun create <template>` runs the corresponding `create-<template>`
package, so this project uses the Bun form above for Tide's
`@tidecloak/create-nextjs` initializer. Phase 1 must verify it in a temporary
directory before merge. The initializer creates the realm and clients, configures
the Tide identity provider, activates licensing, assigns the first administrator,
and enables Quorum-Enforced Authorization. It pauses while the first administrator
completes Tide enrolment.

Because this repository already contains documentation, do not run a generator that overwrites the root. First check the initializer's current help/behaviour, then preserve and merge the generated files deliberately.

## 3. Local TideCloak Server

Prerequisites from the current quickstart:

- Docker running;
- Node.js 20.9 or later;
- Bun, internet connectivity, and a browser for Tide enrolment.

Use the committed `docker-compose.yaml` and its dedicated named volume so local
TideCloak state never lands in the repository. The bootstrap password is required
from the shell environment and is never written to YAML, `.env`, or version control.

For Bash or Zsh:

```bash
read -rs -p 'TideCloak local bootstrap password: ' TIDECLOAK_BOOTSTRAP_ADMIN_PASSWORD
printf '\n'
export TIDECLOAK_BOOTSTRAP_ADMIN_PASSWORD
docker compose -f docker-compose.yaml up -d --force-recreate
docker compose -f docker-compose.yaml ps
unset TIDECLOAK_BOOTSTRAP_ADMIN_PASSWORD
```

For fish:

```fish
read -s -P 'TideCloak local bootstrap password: ' TIDECLOAK_BOOTSTRAP_ADMIN_PASSWORD
echo
set -gx TIDECLOAK_BOOTSTRAP_ADMIN_PASSWORD $TIDECLOAK_BOOTSTRAP_ADMIN_PASSWORD
docker compose -f docker-compose.yaml up -d --force-recreate
docker compose -f docker-compose.yaml ps
set -e TIDECLOAK_BOOTSTRAP_ADMIN_PASSWORD
```

The named volume uses the same container data path as the official quickstart
without binding the repository root. The current TideCloak image runs as UID 1000,
whereas Docker creates a new named volume as root-owned. The one-shot
`tidecloak-storage-init` service therefore corrects ownership before TideCloak
starts; it should finish as `exited (0)`. The main
`rental-passport-tidecloak` service must show `running`.

`--force-recreate` replaces only the failed container configuration. It does not
remove the named volume, so it does not discard existing local realm state. Per
`AGENTS.md`, the user runs these commands and reports the output; agents do not
start or inspect local containers by default.

Expected console location after realm creation:

```text
http://localhost:8080/realms/<realm>/tide-console/
```

## 4. Realm and Application

Use clear identifiers unless the initializer generates equivalent names:

- Realm: `rental-passport`
- OIDC application/client: `rental-passport-web`
- App origin: `http://localhost:3000`
- Redirect path: use the exact generated/default path, commonly `/auth/redirect`

Redirect URIs and web origins are governed changes when QEA is enabled. Approve and commit them before diagnosing the application as broken.

## 5. Demo Accounts

Create and enrol four different users:

| Username | Purpose | Business role |
| --- | --- | --- |
| `tenant` | Creates and opens owned packages | `renter` |
| `manager-a` | Receives Income Pack | `property-manager` |
| `manager-b` | Receives Reference Pack | `property-manager` |
| `admin` | Views safe metadata and denial states | `auditor` plus only the admin capability needed for setup |

Credentials must remain outside version control. Use separate browser profiles or complete logout/login cycles; never simulate these users with application state.

## 6. E2EE Roles

Create the following realm roles under the advanced TideCloak console:

```text
_tide_income_manager_a.selfencrypt
_tide_income_manager_a.selfdecrypt
_tide_reference_manager_b.selfencrypt
_tide_reference_manager_b.selfdecrypt
```

Each role creation is a QEA change request. Authorize/commit role creation before assigning roles to users.

### Individual assignments

| User | Roles to assign |
| --- | --- |
| `tenant` | all four E2EE roles |
| `manager-a` | `_tide_income_manager_a.selfdecrypt` |
| `manager-b` | `_tide_reference_manager_b.selfdecrypt` |
| `admin` | none of the four E2EE roles |

Every grant or removal is also governed through QEA. Assign these roles per user under People/Role mapping. Do not attach them to `default-roles-rental-passport`; the official E2EE tutorial uses defaults for a basic same-user example, but that would destroy this project's selective access matrix.

## 7. Next.js SDK Contract

Keep the interfaces created by the current initializer. The implementation must cover these responsibilities:

1. A TideCloak provider wraps the appropriate application boundary.
2. The documented/generated redirect route exists and matches client configuration.
3. Authentication state, login/logout, role helpers, and E2EE helpers come from `@tidecloak/nextjs`.
4. Middleware protects private routes where the generated SDK supports it.
5. API routes verify TideCloak access tokens before returning protected metadata or ciphertext.
6. Encryption and decryption occur in the browser, not in a server route holding a master key.

Do not copy API signatures from this document into code without comparing them to the generated package version.

## 8. Encryption Contract

Tide documentation requires E2EE input data to be a `string` or `Uint8Array`. Rental package objects must therefore be serialized first.

Conceptual call shape:

```ts
const plaintext = JSON.stringify(syntheticIncomePackage);
const [encryptedPayload] = await doEncrypt([
  { data: plaintext, tags: ['income_manager_a'] },
]);
```

Persist only `encryptedPayload` and the safe metadata described in `architecture.md`. Remove plaintext from component state when it is no longer needed.

## 9. Decryption Contract

Use the exact tag used during encryption:

```ts
const [plaintext] = await doDecrypt([
  {
    encrypted: rentalPackage.encryptedPayload,
    tags: [rentalPackage.tag],
  },
]);
```

The UI may check business roles to choose a landing page, but it must still call TideCloak for the decrypt attempt. Tide's E2EE protocol matches the ciphertext's signed tag set against the permission tags in the signed-in user's session-bound Doken. A different account can therefore decrypt only when its governed permissions contain every required tag; otherwise it must reach a visible denied state.

## 10. QEA and Revocation

- Creating roles, assigning/removing roles, and changing application settings can create QEA change requests.
- With only one `tide-realm-admin`, the approval threshold is one. This is useful for development but is not multi-party governance.
- To demonstrate a threshold greater than one, use enough separate governance administrators for the configured QEA formula to require multiple distinct approvals. This is optional unless the user adds it to MVP scope.
- After a decrypt role is removed and the change is committed, refresh or replace the recipient's session before retrying. Do not use a stale token as evidence that revocation failed.

Revocation affects future decrypt attempts. It cannot recall plaintext already displayed or copied.

## 11. Error Handling

Map integration outcomes to user-facing states without exposing sensitive details:

| Condition | UI state |
| --- | --- |
| Not signed in | Prompt to sign in |
| SDK still initialising | Loading identity |
| Wrong business role | Explain the intended recipient |
| Missing E2EE decrypt role | Access denied by policy |
| TideCloak/Fabric unavailable | Integration unavailable; retry after checking service |
| Invalid/mismatched tag | Package configuration error |
| Expired/stale session | Ask the user to sign in again |

Do not log token contents, decrypted package content, passwords, or raw SDK responses that may contain sensitive values.

## 12. Integration Verification

- [ ] Dev container is healthy on port 8080.
- [ ] `docker compose -f docker-compose.yaml ps` shows `rental-passport-tidecloak` running.
- [ ] Realm is licensed, Tide IdP is linked, and QEA is enabled.
- [ ] Next.js client origin and redirect URI are committed.
- [ ] Four distinct accounts can sign in.
- [ ] Effective user roles match the matrix above.
- [ ] Tenant encrypts both package strings.
- [ ] Tenant decrypts both packages.
- [ ] Manager A decrypts only the income tag.
- [ ] Manager B decrypts only the reference tag.
- [ ] Admin decrypts neither tag.
- [ ] A role removal is reflected after governance and session renewal.
- [ ] No plaintext package or secret exists in tracked files or logs.

## 13. Official Sources

- Quickstart and initializer: <https://docs.tide.org/get-started/Tidecloak%20Quickstart>
- Next.js SDK: <https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-intro>
- Bun project creation: <https://bun.sh/docs/runtime/templating/create>
- Bun install and lockfile: <https://bun.sh/docs/pm/cli/install>
- Bun with Next.js: <https://bun.sh/guides/ecosystem/nextjs>
- Next.js authentication and E2EE flow: <https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-discussion>
- E2EE roles and helper requirements: <https://docs.tide.org/Admin/e2ee>
- QEA setup and user role changes: <https://docs.tide.org/Admin/SetupIGA>
- TideCloak integration model: <https://tide.org/whitepaper/tidecloak-integration>
- Hermetic E2EE protocol and tag matching: <https://tide.org/whitepaper/authority-in-action/hermetic-e2ee>
