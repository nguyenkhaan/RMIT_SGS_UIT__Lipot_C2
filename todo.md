# Rental Application Passport — Agent Loop Runbook (Phase 02 → Closeout)

> Mục đích: file này là danh sách điều phối cho agent loop thực hiện phần còn lại của dự án. Các tài liệu trong `docs/` vẫn là nguồn chân lý; không tự đổi yêu cầu, access matrix, tag, hay kiến trúc chỉ vì nội dung trong file này ngắn gọn hơn.

## Cách dùng cho agent loop

1. Trước mỗi lượt, đọc theo thứ tự: `docs/CONTENT.md`, `docs/requirement.md`, `docs/specification.md`, `docs/architecture.md`, `docs/tidecloak-integration.md`, `docs/demo-guide.md`, `docs/decisions/ADR-001-core-architecture.md`, `docs/guide-pland.md`, rồi phase plan đang thực hiện.
2. Kiểm tra checklist bên dưới, `git diff`, và trạng thái checkpoint trước đó. Không làm lại mục đã có bằng chứng hợp lệ.
3. Chỉ làm **một task nhỏ** hoặc một checkpoint trong mỗi lượt; cập nhật tài liệu nguồn nếu hành vi/contract phải đổi trước khi đổi code.
4. Không chạy mặc định Docker, Bun install, dev server, lint, build, hoặc test. Hãy đưa chính xác lệnh Bun/Docker cho người dùng chạy và chỉ diễn giải output họ cung cấp. Chỉ tự chạy một lệnh khi người dùng yêu cầu trực tiếp lệnh đó.
5. Không coi UI role check là authorization. Mọi ca denied trong acceptance phải phát sinh từ lời gọi kiểm tra tag/role tại integration seam.
6. Không commit hoặc log password, token, session export, plaintext nhạy cảm, local TideCloak data, hay client configuration bí mật. Dùng dữ liệu giả hoàn toàn.

## Nguyên tắc không được vi phạm

- Duy trì bốn account riêng: `tenant`, `manager-a`, `manager-b`, `admin`; không role switch/impersonation trong UI.
- Tag cố định: `income_manager_a` và `reference_manager_b`.
- Realm roles bắt buộc là `_tide_<tag>.selfencrypt` và `_tide_<tag>.selfdecrypt`; không đưa package decrypt role vào `default-roles-<realm>`.
- Tenant encrypt/decrypt cả hai; Manager A chỉ decrypt Income; Manager B chỉ decrypt Reference; Admin decrypt không gói nào nhưng xem được safe metadata.
- Browser là nơi duy nhất plaintext tạm thời tồn tại. Server/store/API chỉ xử lý protected payload + metadata không nhạy cảm; không có server key, admin bypass, hay decrypt API.
- Sau mọi thay đổi role, commit thay đổi rồi renew session trước khi kiểm tra lại.
- Khi TideCloak thực chưa sẵn sàng, giữ trạng thái Mock MVP Bridge (plans/00-mock-mvp-bridge.md); KHÔNG gọi kết quả mock là real authentication, ciphertext, hay real QEA/acceptance.

---

## Phase 00 — Temporary Mock-MVP Bridge Status (Hoàn thành)

- [x] **M0.1 — Next.js baseline:** App Router, TypeScript, package.json và bun.lock tồn tại; lint script đã được thiết lập và kiểm tra thành công.
- [x] **M0.2 — Stable contracts:** Đã đóng băng RentalPackage, PackageMetadata, AccessDecision, IdentitySession, và SessionVerifier trong lib/rental-passport/contracts.ts.
- [x] **M0.3 — Mock identity & opaque session:** Quản lý 4 danh tính demo độc lập qua HTTP-only cookie không chứa fake token; giới hạn môi trường non-production.
- [x] **M0.4 — Package workflow & simulated decisions:** Tenant bảo vệ payload; Manager A/B có thể thử cả gói được phép và gói bị từ chối; Admin chỉ thấy safe metadata; store từ chối lưu plaintext.
- [x] **M0.5 — TideCloak swap checklist:** Khớp nối provider, redirect route, và các hàm bảo vệ payload sẵn sàng hoán đổi khi dev container được khôi phục.

---

## Điều kiện vào Phase 02 (Real Integration)

- [x] Phase 01 checkpoint đã được người dùng xác nhận: Next.js baseline đã được kiểm tra; package.json và bun.lock tồn tại.
- [ ] TideCloak dev container, realm baseline, Tide enrolment và console thực sẵn sàng để làm việc. (Đang chờ bên thứ ba sửa chữa).
- [ ] Không còn thay đổi chưa xử lý trong source-of-truth docs có thể làm lệch realm name, client, redirect URI, tag, hoặc account matrix.

---

## Phase 02 — Realm, identities, and policy matrix (Chờ Real TideCloak)

### P2.1 — Confirm realm, client, and QEA baseline

- [ ] Xác minh realm/client trỏ đúng `http://localhost:3000` và exact generated redirect path.
- [ ] Xác minh Tide IdP, dev licence và QEA đang hoạt động.
- [ ] Bảo đảm mọi thay đổi redirect URI/web origin đã được authorize và commit trước login test.
- [ ] Ghi lại chỉ các identifier/steps không bí mật cần thiết trong `docs/tidecloak-integration.md` nếu generated setup khác tài liệu.

**Done when:** first enrolled realm user hoàn tất login/redirect bằng generated flow; console hiển thị app settings đã commit.

### P2.2 — Create the four demo accounts and business roles

- [ ] Tạo/enrol riêng `tenant`, `manager-a`, `manager-b`, `admin`; giữ credential ngoài repository.
- [ ] Gán business roles: `tenant` → `renter`; hai manager → `property-manager`; `admin` → `auditor` (và chỉ quyền quản trị tối thiểu cần để setup).
- [ ] Xác minh từng account bằng browser profile riêng hoặc logout/login, không bằng state trong app.
- [ ] Xác minh claims hiển thị đúng username/business role mà không lưu hay render raw token.

### P2.3 — Create and assign per-user E2EE roles

- [ ] Tạo/commit bốn role realm: `_tide_income_manager_a.selfencrypt`, `_tide_income_manager_a.selfdecrypt`, `_tide_reference_manager_b.selfencrypt`, `_tide_reference_manager_b.selfdecrypt`.
- [ ] Gán Tenant cả bốn role.
- [ ] Gán Manager A chỉ `_tide_income_manager_a.selfdecrypt`; Manager B chỉ `_tide_reference_manager_b.selfdecrypt`; Admin không có E2EE package role.
- [ ] Commit QEA role-creation và assignment requests trước khi tiếp tục.
- [ ] Kiểm tra effective realm roles của từng user và xác nhận package roles không là default/child role.

### P2.4 — Renew sessions and capture the baseline matrix

- [ ] Logout/login hoặc dùng đúng generated refresh flow cho toàn bộ session bị ảnh hưởng.
- [ ] Kiểm tra claims/effective roles khớp matrix, không đưa raw token vào notes/logs.
- [ ] Ghi rõ một-admin QEA là threshold 1, không gọi là multi-party approval.
- [ ] Search tracked files để chắc không có password, token, hay exported session.

### Checkpoint Phase 02

- [ ] Bốn account thực đăng nhập độc lập.
- [ ] Business/E2EE role matrix đúng; Admin không có decrypt role; default roles không chứa package role.
- [ ] Không còn QEA request pending cần cho core flow; session đã renew sau assignment.
- [ ] Chỉ sau checkpoint này mới được bắt đầu Phase 03.

---

## Phase 03 — Authenticated full-stack shell (Chờ Real TideCloak)

### P3.1 — Freeze shared domain and API contract

- [ ] Định nghĩa/chuẩn hoá các type rõ nghĩa: `RentalPackage`, `PackageMetadata`, `AccessDecision`, `recipientId`, identity và error payload.
- [ ] Contract transport chỉ gồm ciphertext và safe metadata; không có salary, employer, reference, hoặc plaintext field.
- [ ] Quy ước status: `401` cho missing/invalid token, `403` cho business-policy denial; map Tide/E2EE error sang `AccessDecision` an toàn.

### P3.2 — Implement authenticated UI shell

- [ ] Dùng provider, redirect route, proxy/middleware và silent-SSO assets do TideCloak generate.
- [ ] Hiển thị active identity từ session thật; phân biệt loading, initialization error, signed-out và signed-in.
- [ ] Không tạo role-switch; không render/log raw token.

### P3.3 — Implement token-verified API/store boundary

- [ ] Bảo vệ `GET /api/packages` và `POST /api/packages` bằng TideCloak bearer-token verification phía server.
- [ ] Tạo in-memory ciphertext store rỗng, không seed plaintext và không dùng browser storage làm store.
- [ ] Bảo đảm route không import/gọi decrypt helper, không dùng admin/service account bypass, và error không lộ SDK response/token.

### P3.4 — Join authenticated fetch

- [ ] FE gọi protected API với token thật mà không persist token.
- [ ] Signed-out UI không gọi/không hiển thị protected package data.
- [ ] Xử lý `401`, `403`, stale/expired session theo P3.1, không tự suy đoán access từ UI role.

### Checkpoint Phase 03

- [ ] Bốn account hiển thị identity thật; protected API được enforce ở server.
- [ ] FE/BE dùng chung typed contract; backend chưa có plaintext hay universal decrypt path.
- [ ] Yêu cầu người dùng chạy và cung cấp output: `bun --bun run lint` và `bun --bun run build`.

---

## Phase 04 — Tenant creates encrypted packages (Chờ Real TideCloak)

### P4.1 — Lock serialization and tag mapping

- [ ] Tạo mapping exhaustive: Income → `income_manager_a`/Manager A; Reference → `reference_manager_b`/Manager B.
- [ ] Chỉ gửi `string` hoặc `Uint8Array` vào E2EE helper; không truyền object trực tiếp.
- [ ] Dùng payload synthetic khớp `docs/demo-guide.md`; không dùng real PII.

### P4.2 — Tenant browser encryption interaction

- [ ] Presentation-gate create action cho signed-in Tenant, sau đó serialize → TideCloak `doEncrypt` với exact tag.
- [ ] Chỉ POST ciphertext + safe metadata; reset plaintext working state sau successful POST.
- [ ] Không lưu plaintext vào source, local/session storage hay console; preview sau create chỉ được đến từ decrypt thành công ở Phase 05.

### P4.3 — Ciphertext-only package persistence

- [ ] `POST /api/packages` verify token và Tenant role, allowlist fields, server-generate safe metadata.
- [ ] Reject plaintext-shaped/unknown fields và tag-recipient mismatch.
- [ ] Record chỉ có ID, type, owner, recipient, tag, ciphertext, createdAt, status.

### P4.4 — Join the two-package creation flow

- [ ] Tenant tạo được đúng hai records/ciphertexts/tags riêng trong một flow tái lập được.
- [ ] Inspect network, store và logs: chỉ ciphertext + safe metadata; ciphertext không đọc như JSON/plaintext.
- [ ] Xác minh browser profile/session khác chỉ thấy records theo scope trong vòng đời in-memory store.

### Checkpoint Phase 04

- [ ] Tenant encrypt được Income và Reference bằng TideCloak E2EE thực; tag/recipient đúng matrix.
- [ ] Plaintext chỉ tạm ở authorised browser; backend, network persistence và logs không có plaintext.
- [ ] Không có mock-crypto fallback; yêu cầu người dùng chạy lint/build và báo output.

---

## Phase 05 — Selective decryption for Tenant and Managers (Chờ Real TideCloak)

### P5.1 — Authenticated ciphertext retrieval

- [ ] Hoàn thiện GET routes với server-side token verification; signed-out luôn nhận `401`.
- [ ] Trả về ciphertext/safe metadata cần thiết để thực hiện positive và cross-package negative E2EE test; không trả plaintext.
- [ ] Review routes để xác nhận không có decrypt import, admin key hay service-account bypass.

### P5.2 — Package card and `AccessDecision` UI

- [ ] Package card hiển thị các trạng thái: encrypted, decrypting, granted, policy denied, role mismatch, stale session, integration unavailable.
- [ ] Nút decrypt luôn gọi generated `doDecrypt` với ciphertext và **exact stored tag**.
- [ ] Chỉ render plaintext từ result thành công; clear khi logout, đổi account hoặc component teardown; không lộ raw SDK error/token.

### P5.3 — Verify Tenant and Manager A

- [ ] Tenant decrypt Income và Reference thành công.
- [ ] Manager A decrypt Income thành công và thử Reference phải bị TideCloak policy deny.
- [ ] Xác minh denial vẫn xảy ra khi gọi decrypt trực tiếp thay vì tin UI role hint; không log giá trị đã decrypt.

### P5.4 — Verify Manager B inverse path

- [ ] Bằng session/account riêng, Manager B decrypt Reference thành công và Income bị policy deny.
- [ ] Khi đổi account, plaintext state của account trước không còn hiển thị.

### Checkpoint Phase 05

- [ ] Tenant: Income allow, Reference allow.
- [ ] Manager A: Income allow, Reference deny.
- [ ] Manager B: Income deny, Reference allow.
- [ ] Mọi wrong-user denial do TideCloak/E2EE trả về.
- [ ] Yêu cầu người dùng chạy lint/build sau targeted fixes.

---

## Phase 06 — Admin metadata, revocation, and hardening (Chờ Real TideCloak)

### P6.1 — Admin safe-metadata scope

- [ ] Server-side auditor policy cho phép Admin xem cả hai record với ID, type, owner, recipient, tag/policy label, createdAt, status và opaque ciphertext nếu cần để test.
- [ ] Không có plaintext fields, plaintext endpoint, decrypt helper, decrypt key hay bypass trong admin route/store.

### P6.2 — Admin UI and two real denials

- [ ] Admin thấy all safe metadata nhưng không thấy sensitive plaintext trước decrypt.
- [ ] Cả Income và Reference action đều gọi `doDecrypt`, rồi nhận policy denial thật — không hidden/disabled button hay hard-coded result.
- [ ] Copy UI nói rõ operational metadata access không đồng nghĩa payload access.

### P6.3 — Revocation acceptance

- [ ] Baseline: Manager A decrypt Income thành công.
- [ ] Qua Tide Console/QEA, remove Income decrypt role, đạt threshold và commit change request.
- [ ] Renew Manager A session, xác minh future decrypt bị deny và UI nêu rõ không thể thu hồi plaintext đã xem/copy.
- [ ] Nếu final demo cần matrix gốc, re-grant role, commit, renew session, rồi xác minh lại.

### P6.4 — Security and failure-state hardening

- [ ] Xử lý an toàn unauthenticated, loading, denied, role mismatch, stale session, invalid tag, Tide/Fabric unavailable.
- [ ] Review UI/log/network/browser storage/server state: không password, token, plaintext hay raw sensitive SDK response.
- [ ] Cập nhật `.gitignore` khi cần cho `.env*`, local TideCloak data, build output và key files; không xoá/sửa file người dùng không liên quan.

### Checkpoint Phase 06

- [ ] Admin metadata đúng; hai decrypt attempts bị TideCloak từ chối.
- [ ] Revocation chỉ được xem là pass sau committed role change + fresh session + future deny.
- [ ] Core matrix đã khôi phục nếu cần final demo; errors không lộ chi tiết nhạy cảm.
- [ ] Repository không tracked secret/plaintext/local TideCloak state; yêu cầu người dùng chạy lint/build.

---

## Phase 07 — Acceptance, documentation, and submission (Chờ Real TideCloak)

### P7.1 — Clean acceptance run

- [ ] Từ documented clean local state, tạo lại hai package và chạy matrix bốn account với fresh sessions.
- [ ] Signed-out user không lấy được protected metadata/ciphertext.
- [ ] Yêu cầu người dùng chạy `bun --bun run lint` và `bun --bun run build`, rồi ghi nhận output pass.

### P7.2 — Synchronize source-of-truth docs and README

- [ ] README giữ challenge overview dưới 300 từ và có Quick Start thực thi được.
- [ ] Cập nhật specification, architecture, tidecloak-integration, CONTENT.md theo implementation.
- [ ] Giữ official source URLs cho quyết định TideCloak không hiển nhiên; không đưa secret vào setup docs.

### P7.3 — Finalize the demo guide

- [ ] Đồng bộ `docs/demo-guide.md` theo UI thật.
- [ ] Storyboard tối đa 1:58; rehearsal theo documented reset flow.

### P7.4 — Record and validate `demo.mp4`

- [ ] Record bằng separate sessions/profiles. Video phải < 2 phút, < 100 MB.
- [ ] Kiểm tra full video có audio/hình rõ, không lộ credential hay real PII.
- [ ] Final `git status` sạch, không có `.env` hay build output thừa.

## Final project gate

- [ ] Bốn account TideCloak thực pass matrix sau fresh sessions.
- [ ] Ciphertext không thể đọc ngoài authorised browser session.
- [ ] API verifies TideCloak token; denied results originate at E2EE boundary.
- [ ] Role revocation passes only with commit + session renewal.
- [ ] User has provided successful output for `bun --bun run lint` and `bun --bun run build` on final tree.
- [ ] Ready for final Challenge submission.
