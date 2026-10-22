# Guide triển khai hai người và chuẩn Bun

## Mục đích

> **Temporary mock-MVP override (2026-10-22):** Khi TideCloak được bên thứ ba
> sửa, nhóm được phép thực hiện `plans/00-mock-mvp-bridge.md` trên Next.js App
> Router. Đây không phải kết quả security hoặc acceptance. Theo quyết định của
> user, UI không hiển thị nhãn mock-mode. Khi service sẵn sàng, quay lại
> sequence real TideCloak bên dưới.

File này là guide vận hành duy nhất bổ sung cho bộ phase plan hiện có. Nó phân
công hai người theo module/feature, chỉ ra dependency bằng **Chờ**, và thiết lập
Bun là package manager chuẩn. Các phase trong `docs/plans/` giữ nguyên scope và
thứ tự; khi một command trong phase còn ghi `npm`, quyết định Bun trong guide này
và `docs/requirement.md` được ưu tiên.

## Chuẩn Bun

- Dùng Bun để scaffold, cài package và chạy scripts; commit `bun.lock`, không tạo
  hoặc commit `package-lock.json`.
- Node.js vẫn là prerequisite của TideCloak initializer; Bun không thay thế Node.
- Vì Tide quickstart chỉ công bố `npm init @tidecloak/nextjs@latest`, Phase 1 phải
  xác minh Bun adapter trong temporary directory trước khi merge vào repository:

```bash
bun --version
bun create @tidecloak/nextjs@latest rental-passport-scaffold
cd rental-passport-scaffold
bun install
bun --bun run dev
bun --bun run lint
bun --bun run build
```

`bun create` sử dụng package `create-<template>` tương ứng; với template
`@tidecloak/nextjs`, initializer thực tế là `@tidecloak/create-nextjs`. Nếu
generated project yêu cầu command/script khác, dừng, ghi sai khác vào
`docs/tidecloak-integration.md` và cập nhật specification trước khi viết feature
code. Không quay về npm để lách lỗi.

Nguồn: <https://bun.sh/docs/runtime/templating/create>,
<https://bun.sh/docs/pm/cli/install>,
<https://bun.sh/guides/ecosystem/nextjs>,
<https://docs.tide.org/get-started/Tidecloak%20Quickstart>.

## Vai trò

- **Người A — TideCloak và Backend:** Docker/realm/QEA, typed contract, token
  verification, route handlers, ciphertext store và security review.
- **Người B — Frontend và Demo:** generated UI integration, browser E2EE UX,
  presentation states, manual account flows, documentation/demo artifact.
- Cả hai chỉ code song song sau khi owner của shared contract đã chốt types,
  payload/error shapes. Không tự đổi tags, users, role matrix hoặc generated
  TideCloak pattern.

## Phân công theo phase

| Phase - Task | Người | Song song / Chờ |
| --- | --- | --- |
| P1.1 — Preflight môi trường, Bun và bảo toàn repository | A | Bắt đầu; không phụ thuộc. |
| P1.2 — Khởi động TideCloak dev container bằng named volume | A | **Chờ** P1.1. |
| P1.3 — Scaffold mock Next.js baseline ở temporary directory, merge và `bun.lock` | B | **Mock-mode exception** khi TideCloak bị chặn. |
| P1.4 — Ghi version, mock-to-Tide contract và Bun commands thật vào spec | A | **Chờ** P1.3. |
| P2.1 — Xác nhận realm, client, redirect URI, license và QEA | A | **Chờ** checkpoint Phase 1. |
| P2.2 — Tạo/enrol `tenant`, `manager-a`, `manager-b`, `admin` và business roles | B | **Chờ** P2.1. Không dùng bootstrap master-admin làm demo account. |
| P2.3 — Tạo/commit/gán bốn E2EE realm roles theo từng user | A | **Chờ** P2.2. Không đưa role vào `default-roles-<realm>`. |
| P2.4 — Renew session và kiểm tra effective-role matrix | B | **Chờ** P2.3. |
| P3.1 — Chốt shared types và API/error contract | A | **Chờ** checkpoint Phase 2; đây là contract gate cho P3.2/P3.3. |
| P3.2 — FE auth shell, active identity, loading/signed-out/error state | B | **Song song** với P3.3, sau P3.1. |
| P3.3 — BE token verifier, empty in-memory ciphertext store và protected API | A | **Song song** với P3.2, sau P3.1. |
| P3.4 — Authenticated fetch, FE/BE join và 401/stale-session check | A + B | **Chờ** P3.2 và P3.3; A owns API evidence, B owns UI evidence. |
| P4.1 — Serializer, synthetic payload factories và typed tag mapping | A | **Chờ** checkpoint Phase 3; contract gate cho P4.2/P4.3. |
| P4.2 — Tenant UI: draft, browser `doEncrypt`, clear plaintext state | B | **Song song** với P4.3, sau P4.1. |
| P4.3 — `POST /api/packages`: token/role/field/tag validation và ciphertext persistence | A | **Song song** với P4.2, sau P4.1. |
| P4.4 — Tenant tạo hai package end-to-end, inspect network/store | A + B | **Chờ** P4.2 và P4.3; A checks backend plaintext absence, B checks browser state. |
| P5.1 — Authenticated ciphertext retrieval cho positive và negative E2EE tests | A | **Song song** với P5.2, sau checkpoint Phase 4. |
| P5.2 — Package card, real `doDecrypt`, `AccessDecision` presentation states | B | **Song song** với P5.1, sau checkpoint Phase 4. |
| P5.3 — Tenant + Manager A allow/deny integration | A + B | **Chờ** P5.1 và P5.2; A runs backend/log evidence, B runs account/UI evidence. |
| P5.4 — Manager B inverse allow/deny integration | B | **Chờ** P5.3; dùng session/profile riêng. |
| P6.1 — Admin safe-metadata projection và server-side policy | A | **Song song** với P6.2, sau checkpoint Phase 5. |
| P6.2 — Admin metadata UI và hai real denied decrypt attempts | B | **Song song** với P6.1, sau checkpoint Phase 5. |
| P6.3 — QEA role removal, commit, session renewal và revocation test | A + B | **Chờ** P6.1 và P6.2; A thực hiện governed change, B ghi nhận UI result. |
| P6.4 — Failure-state/security hardening, secret/plaintext/log review | A | **Chờ** P6.3; B review UI copy/error states cùng A. |
| P7.1 — Clean full acceptance matrix và Bun lint/build | A + B | **Chờ** checkpoint Phase 6; A owns server/build, B owns browser matrix. |
| P7.2 — Đồng bộ README, specification, architecture, integration setup | A | **Song song** với P7.3, sau P7.1. |
| P7.3 — Cập nhật demo guide theo UI thật và rehearsal 1:58 | B | **Song song** với P7.2, sau P7.1. |
| P7.4 — Record/validate `demo.mp4` và final repository check | A + B | **Chờ** P7.2 và P7.3. |

## Quy tắc handoff

1. Người hoàn tất task ghi lại command Bun đã chạy, commit/hash liên quan và
   acceptance evidence không chứa token, password hoặc plaintext.
2. Task đánh dấu **Chờ** chỉ bắt đầu sau khi owner gửi contract/checkpoint đã pass.
3. Với task **Song song**, A và B không cùng sửa một file shared. A sở hữu
   `src/lib/` và `src/app/api/`; B sở hữu `src/components/` và UI pages. Generated
   TideCloak files chỉ được sửa sau review chung.
4. Mọi access denial phải được xác nhận bằng real TideCloak E2EE call; không thay
   bằng role conditional trên UI.
5. Trước final demo, B sign out/in sau mỗi role change; A xác nhận QEA request đã
   commit và backend không log plaintext.

