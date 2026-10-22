
[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

## Project overview

Rental Application Passport lets renters reuse sensitive application evidence while disclosing only the package intended for each property manager.

Built with [TideCloak](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked).

### 1. Vision & originality

Renters repeatedly send payslips, identity details, and references to organisations they may never work with again. This project turns those documents into reusable, encrypted application packages. The renter chooses which package is intended for each recipient instead of sending one complete dossier to everyone.

### 2. Trust constraint insight

Today, every application creates another readable copy of highly sensitive data in an inbox, database, or administrator-controlled system. Renters must trust every recipient and platform operator not to inspect, leak, or misuse it. Removing that central reading capability makes selective disclosure practical.

### 3. Value & impact

A renter can send income evidence to one property manager and rental references to another. Each manager receives enough information to assess their application without gaining access to the other package. The renter shares less data, while managers still receive verifiable access to what they need.

### 4. Why TideCloak matters

TideCloak provides real identities, governed permissions, and tag-based end-to-end encryption. Decryption happens only in an authorised user session. The application and its administrator store ciphertext and metadata but do not hold a master decryption key, which ordinary login-only OAuth integrations do not guarantee.

### 5. Prototype & storytelling

The prototype uses four separate TideCloak accounts: renter, Manager A, Manager B, and administrator. Manager A can open only the income package; Manager B can open only the reference package; the administrator can inspect audit metadata but cannot decrypt either package. Denied attempts remain visible so the trust boundary is easy to verify.

## Status

The repository is currently in the planning phase. The implementation plan is
under [`docs/plans/`](docs/plans/README.md); application code has not been
scaffolded yet.

## Setup

The implementation will use the official TideCloak Next.js initializer and a local TideCloak dev container. Until scaffolding is complete, use [docs/CONTENT.md](docs/CONTENT.md) as the entry point for requirements, architecture, integration, and acceptance criteria.

Prerequisites:

- Docker CLI; Docker Desktop is optional.
- Node.js 20.9 or later, as required by the current TideCloak quickstart.
- Bun; this repository uses Bun for scaffolding, installing dependencies and
  running project scripts. See [docs/guide-pland.md](docs/guide-pland.md).
- Internet access for Tide enrolment and Cybersecurity Fabric operations.

The local TideCloak service is declared in `docker-compose.yaml`. Follow the
password-safe startup instructions in [docs/tidecloak-integration.md](docs/tidecloak-integration.md);
do not put a bootstrap password in the repository.

Do not treat the repository as runnable until `package.json` exists and the setup instructions have been verified against it.
