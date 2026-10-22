# Demo and Acceptance Guide

## 1. Demo Goal

In under two minutes, prove one sentence:

> The renter can prepare different encrypted evidence packages, and each real TideCloak identity can decrypt only what it has been authorised to see — including an administrator who can inspect metadata but not the private content.

## 2. Preflight Checklist

Complete this before recording:

- [ ] TideCloak container is healthy and reachable.
- [ ] The Next.js production build succeeds.
- [ ] `tenant`, `manager-a`, `manager-b`, and `admin` can sign in.
- [ ] Each browser/profile visibly shows the current identity.
- [ ] Income and reference role mappings match the integration document.
- [ ] Both synthetic packages can be recreated from a clean application state.
- [ ] All four authorised/denied combinations have been tested.
- [ ] Admin metadata contains no sensitive plaintext.
- [ ] Notifications are muted and no credentials appear in the recording.
- [ ] The final video is under two minutes and under 100 MB.

## 3. Synthetic Demo Data

Use obviously fictional values.

### Income Pack

```json
{
  "applicantName": "Alex Morgan",
  "employer": "Northstar Studio",
  "employmentType": "Full-time",
  "monthlyIncome": 7200,
  "currency": "AUD",
  "payslipPeriod": "September 2026"
}
```

### Reference Pack

```json
{
  "applicantName": "Alex Morgan",
  "previousProperty": "42 Example Lane",
  "tenancyPeriod": "January 2024 to September 2026",
  "referenceName": "Jordan Lee",
  "paymentHistory": "Paid on time"
}
```

Do not add government ID numbers, bank account numbers, real addresses, or real contact details. They add risk without improving the proof.

## 4. Two-Minute Storyboard

| Time | Screen/action | Narration point |
| --- | --- | --- |
| 0:00–0:12 | Title plus one diagram/card | Rental applications create many readable copies of sensitive evidence. |
| 0:12–0:32 | Tenant signs in and creates two packages | The renter sends different encrypted packages for different needs. |
| 0:32–0:55 | Manager A opens Income Pack, then is denied Reference Pack | This is a real TideCloak identity with only the income decrypt permission. |
| 0:55–1:18 | Manager B opens Reference Pack, then is denied Income Pack | The second identity has the inverse permission. |
| 1:18–1:43 | Admin sees package metadata and fails to open both | Operational access does not imply access to private payloads. |
| 1:43–1:58 | Access matrix/result summary | TideCloak makes selective decryption the product capability; the app has no master decrypt key. |

The revocation flow is an acceptance test but is not required in the two-minute cut unless it is already stable and can replace, rather than extend, another scene.

## 5. Observable Acceptance Scenarios

### Scenario A — Tenant creates encrypted packages

**Given:** Tenant is signed in with both encrypt roles.

**When:** Tenant creates Income Pack and Reference Pack.

**Then:** Two ciphertext records appear with different tags and no persisted plaintext.

### Scenario B — Manager A selective access

**Given:** Manager A has only `_tide_income_manager_a.selfdecrypt`.

**When:** Manager A opens Income Pack.

**Then:** The fictional income data is shown.

**When:** Manager A opens Reference Pack.

**Then:** The application shows a TideCloak policy denial.

### Scenario C — Manager B selective access

**Given:** Manager B has only `_tide_reference_manager_b.selfdecrypt`.

**When:** Manager B opens Reference Pack.

**Then:** The fictional reference data is shown.

**When:** Manager B opens Income Pack.

**Then:** The application shows a TideCloak policy denial.

### Scenario D — Admin cannot inspect payloads

**Given:** Admin can view audit metadata but has no package decrypt role.

**When:** Admin views the package list.

**Then:** IDs, recipients, types, timestamps, and statuses are visible.

**When:** Admin attempts to open either package.

**Then:** Both attempts are denied and no plaintext appears in logs or network responses.

### Scenario E — Future access after revocation

**Given:** Manager A currently has the income decrypt role.

**When:** The role is removed, the QEA change is committed, and Manager A renews the session.

**Then:** A new Income Pack decrypt attempt is denied.

**And:** The UI explains that previously viewed content cannot be recalled.

## 6. Judge-Facing Proof Points

Keep these visible or easy to explain:

- active username/account;
- package tag or friendly policy label;
- ciphertext state before decryption;
- real success and real denial results;
- Admin's metadata-only view;
- absence of a backend/master decryption key;
- use of separate TideCloak logins, not role simulation.

## 7. Failure Policy

The submitted demonstration must not silently fall back to mock auth or fake encryption. If TideCloak or the Fabric is unavailable during preparation:

1. preserve the error state;
2. check the container, enrolment, realm roles, QEA commits, redirect URI, session freshness, and network;
3. fix and rerun the real flow;
4. record only after the full access matrix passes.

## 8. Final Submission Check

- [ ] README overview answers all five challenge prompts and stays under 300 words.
- [ ] Setup instructions match the implemented repository.
- [ ] `demo.mp4` is under two minutes and under 100 MB.
- [ ] The public repository contains no credentials, tokens, real PII, or local TideCloak state.
- [ ] Statements about QEA do not overclaim multi-party approval when using first-admin mode.
