# Requirements Specification

## 1. Context

- **Challenge:** UNLOCKED Challenge (RMIT x Tide)
- **Challenge page:** <https://tide.org/unlocked#start>
- **Product:** Rental Application Passport
- **Implementation timebox:** maximum seven hours
- **Current phase:** temporary mock-MVP implementation; real TideCloak
  integration is blocked while a third party repairs the local service

This document combines the supplied challenge requirements with the product decisions confirmed during discovery. Before submission, compare it once more with the live challenge page in case the organiser changes a rule.

## 2. Objective

Build a functional local prototype that demonstrates one trust bottleneck: renters currently give complete copies of sensitive evidence to every property manager and must trust each recipient and platform administrator with the plaintext.

The prototype must show that decryption authority comes from a real TideCloak identity and policy context. No application server, database operator, or UI administrator may hold a master capability to read all rental packages.

## 3. Binding Product Decisions

1. Use Next.js scaffolded from the official `@tidecloak/nextjs` initializer.
2. Run a real TideCloak dev container through Docker CLI. Docker Desktop is optional.
3. Use four separate TideCloak accounts: `tenant`, `manager-a`, `manager-b`, and `admin`.
4. Use only synthetic rental data.
5. Keep the prototype local-first. A production database and cloud deployment are not required.
6. Store or transport ciphertext plus non-sensitive metadata only.
7. Make denied access visible in the UI.
8. Do not create a role-switch control that impersonates another account.
9. Keep the frontend and backend in this single Next.js project. Deliver each
   capability as a vertical feature slice: shared contract first, then browser UI
   and server route/store work in parallel, followed by an integration checkpoint.
10. Use Bun as the project package manager and script runner. Commit `bun.lock`;
    do not create or commit `package-lock.json`.
11. Until TideCloak is available, build a minimal temporary MVP on the same
    Next.js frontend and route-handler backend architecture. Its
    identity and package-protection adapters must be replaceable by the real
    TideCloak SDK integration without changing domain, API, or UI contracts.
12. By direct user decision on 2026-10-22, the temporary UI must not display a
    `MOCK MODE` or equivalent mock-mode label. It must still avoid claiming
    real TideCloak authentication, E2EE, token verification, or policy
    enforcement until those operations are verified.

## 4. Functional Requirements

### FR-1 — Authentication

Each of the four demo users must sign in through TideCloak and receive its own session and role claims.

### FR-2 — Package creation

The tenant must be able to create two distinct synthetic packages:

- `income_manager_a`: employment, monthly income, and a fictional payslip preview;
- `reference_manager_b`: rental history and a fictional landlord reference.

Before encryption, package data must be serialized to a `string` or `Uint8Array`, matching TideCloak E2EE input requirements.

### FR-3 — Selective encryption

The tenant must encrypt each package with its matching TideCloak tag. Plaintext must not be persisted by the application.

### FR-4 — Selective decryption

- Tenant may decrypt both packages.
- Manager A may decrypt only `income_manager_a`.
- Manager B may decrypt only `reference_manager_b`.
- Admin may decrypt neither package.

The application must call the TideCloak decryption helper and surface its real result. A hidden UI control or client-only conditional is not an access-control implementation.

### FR-5 — Metadata view

Admin must be able to view non-sensitive metadata such as package ID, package type, owner, intended recipient, creation time, and status. Metadata must not contain the sensitive fields from either package.

### FR-6 — Audit feedback

The interface must visibly distinguish at least:

- authenticated and unauthenticated;
- encrypted and decrypted;
- access granted and access denied;
- role/policy mismatch;
- loading and integration failure.

### FR-7 — Revocation semantics

Removing a decrypt role is a governed administrative change. After the change is committed and the affected user renews their session, a future decrypt attempt must be denied. The product must state that revocation cannot erase plaintext already viewed or copied by a recipient.

## 5. TideCloak and Trust Requirements

### TR-1 — Real integration

Use the official Next.js SDK, TideCloak dev server, Tide enrolment, QEA-enabled realm, and E2EE helpers. Mock authentication or simulated cryptography cannot satisfy the core demo.

#### Temporary mock-MVP exception

The approved recovery MVP may simulate the four identities and allow/deny
outcomes only while the service is being repaired. It must not describe encoded
or simulated payloads as ciphertext, and must not be represented as satisfying
TR-1, FR-3, FR-4, TR-2, TR-3, or TR-5. The real TideCloak acceptance matrix is
still mandatory before a Challenge submission is claimed as compliant.

### TR-2 — Tag roles

For every E2EE tag, define matching realm roles:

- `_tide_<tag>.selfencrypt`
- `_tide_<tag>.selfdecrypt`

Package-specific decrypt roles must be assigned to individual demo users, not to `default-roles-<realm>`.

### TR-3 — No master decryptor

The application must not contain a server key, service account, administrator endpoint, or fallback path capable of decrypting every package.

### TR-4 — QEA claim boundary

The core four-account demo proves governed role changes and selective E2EE access. A one-admin development realm does **not** prove multi-party approval because its threshold is one. Claiming non-unilateral policy governance requires a multi-admin QEA configuration with a threshold greater than one.

### TR-5 — Server/API protection

If an API route serves ciphertext or metadata, it must verify the TideCloak token server-side. Client-side route guards are helpful for presentation but are not sufficient protection for an API.

## 6. Non-Functional Requirements

- **Time:** implementation and demo preparation must fit within seven hours.
- **Story:** the main interaction must be explainable and recordable in under two minutes.
- **Privacy:** no real identity, financial, employment, or rental-reference data.
- **Security:** no secrets, tokens, passwords, plaintext packages, or local TideCloak database files in version control.
- **Clarity:** an observer must be able to tell which identity is active and why an action succeeded or failed.
- **Reliability:** the demo must be preflighted with all four accounts and both positive and negative access cases.
- **Portability:** setup must work with Docker CLI; Docker Desktop must not be required.

## 7. Acceptance Matrix

| Actor | Income Pack | Reference Pack | Metadata | Expected result |
| --- | --- | --- | --- | --- |
| Tenant | Decrypt | Decrypt | Own records | Allowed |
| Manager A | Decrypt | Attempt decrypt | Assigned records | Income allowed; reference denied |
| Manager B | Attempt decrypt | Decrypt | Assigned records | Income denied; reference allowed |
| Admin | Attempt decrypt | Attempt decrypt | All audit metadata | Both denied |
| Signed-out user | Attempt access | Attempt access | None | Redirected or denied |

## 8. Deliverables

The final challenge repository must contain:

- runnable Next.js source code;
- a `package.json` with verified development and build scripts;
- the TideCloak adapter/configuration required for local development, excluding secrets;
- the official challenge overview at the top of `README.md`, under 300 words;
- setup instructions separate from the challenge overview;
- `demo.mp4`, under two minutes and under 100 MB;
- this SDD document set kept in sync with the implementation.

## 9. Out of Scope

- Real rental applications or real personal information.
- Production file storage, malware scanning, KYC, credit scoring, payments, leases, and e-signatures.
- A property-search marketplace.
- Mobile-native applications.
- Production deployment, high availability, or scale testing.
- Claims that revocation recalls information already viewed.

## 10. Official References

- UNLOCKED Challenge: <https://tide.org/unlocked#start>
- TideCloak quickstart: <https://docs.tide.org/get-started/Tidecloak%20Quickstart>
- Next.js SDK introduction: <https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-intro>
- Tide E2EE setup: <https://docs.tide.org/Admin/e2ee>
- Tide QEA setup: <https://docs.tide.org/Admin/SetupIGA>
- TideCloak integration whitepaper: <https://tide.org/whitepaper/tidecloak-integration>
