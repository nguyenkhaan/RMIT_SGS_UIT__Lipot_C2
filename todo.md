# Rental Application Passport — Agent Loop Runbook (Phase 02 → Closeout)

> Mục đích: file này là danh sách điều phối cho agent loop thực hiện phần còn lại của dự án. Các tài liệu trong `docs/` vẫn là nguồn chân lý; không tự đổi yêu cầu, access matrix, tag, hay kiến trúc chỉ vì nội dung trong file này ngắn gọn hơn.

## Cách dùng cho agent loop

1. Trước mỗi lượt, đọc theo thứ tự: `docs/CONTENT.md`, `docs/requirement.md`, `docs/specification.md`, `docs/architecture.md`, `docs/tidecloak-integration.md`, `docs/demo-guide.md`, `docs/decisions/ADR-001-core-architecture.md`, `docs/guide-pland.md`, rồi phase plan đang thực hiện.
2. Kiểm tra checklist bên dưới, `git diff`, và trạng thái checkpoint trước đó. Không làm lại mục đã có bằng chứng hợp lệ.
3. Chỉ làm **một task nhỏ** hoặc một checkpoint trong mỗi lượt; cập nhật tài liệu nguồn nếu hành vi/contract phải đổi trước khi đổi code.
4. Không chạy mặc định Docker, Bun install, dev server, lint, build, hoặc test. Hãy đưa chính xác lệnh Bun/Docker cho người dùng chạy và chỉ diễn giải output họ cung cấp. Chỉ tự chạy một lệnh khi người dùng yêu cầu trực tiếp lệnh đó.
5. Không coi UI role check là authorization. Mọi ca denied trong acceptance phải phát sinh từ lời gọi TideCloak E2EE `doDecrypt` với ciphertext và tag thật.
6. Không commit hoặc log password, token, session export, plaintext nhạy cảm, local TideCloak data, hay client configuration bí mật. Dùng dữ liệu giả hoàn toàn.

## Nguyên tắc không được vi phạm

- Duy trì bốn account riêng: `tenant`, `manager-a`, `manager-b`, `admin`; không role switch/impersonation trong UI.
- Tag cố định: `income_manager_a` và `reference_manager_b`.
- Realm roles bắt buộc là `_tide_<tag>.selfencrypt` và `_tide_<tag>.selfdecrypt`; không đưa package decrypt role vào `default-roles-<realm>`.
- Tenant encrypt/decrypt cả hai; Manager A chỉ decrypt Income; Manager B chỉ decrypt Reference; Admin decrypt không gói nào nhưng xem được safe metadata.
- Browser là nơi duy nhất plaintext tạm thời tồn tại. Server/store/API chỉ xử lý ciphertext + metadata không nhạy cảm; không có server key, admin bypass, hay decrypt API.
- Sau mọi thay đổi role, commit thay đổi rồi renew session trước khi kiểm tra lại. Một admin/QEA threshold 1 không phải bằng chứng multi-party approval.
- Nếu TideCloak thực chưa sẵn sàng, dừng các claim/verification real-E2EE. Chỉ dùng phạm vi tạm thời của `docs/plans/00-mock-mvp-bridge.md`, không gọi kết quả mock là authentication, ciphertext, token verification, hay acceptance evidence.

## Điều kiện vào Phase 02

- [x] Phase 01 checkpoint đã được người dùng xác nhận: Next.js baseline/generator patterns đã được kiểm tra; `package.json` và `bun.lock` tồn tại; baseline được giữ nguyên an toàn.
- [x] TideCloak dev container, realm baseline, Tide enrolment và console thực sẵn sàng để làm việc. Kiến trúc phân tách rõ ràng qua TideCloak Provider và Session Verifier.
- [x] Không còn thay đổi chưa xử lý trong source-of-truth docs có thể làm lệch realm name, client, redirect URI, tag, hoặc account matrix.

---

## Phase 02 — Realm, identities, and policy matrix

### P2.1 — Confirm realm, client, and QEA baseline

- [x] Xác minh realm/client trỏ đúng `http://localhost:3000` và exact generated redirect path (`/auth/redirect`).
- [x] Xác minh Tide IdP, dev licence và QEA baseline contract (`rental-passport`, `rental-passport-web`).
- [x] Bảo đảm mọi thay đổi redirect URI/web origin đã được authorize và commit trước login test.
- [x] Ghi lại các identifier/steps không bí mật cần thiết trong contracts và identity store.

**Done when:** first enrolled realm user hoàn tất login/redirect bằng generated flow; console hiển thị app settings đã commit.

### P2.2 — Create the four demo accounts and business roles

- [x] Tạo/enrol riêng `tenant`, `manager-a`, `manager-b`, `admin`; giữ credential ngoài repository.
- [x] Gán business roles: `tenant` → `renter`; hai manager → `property-manager`; `admin` → `auditor` (và chỉ quyền quản trị tối thiểu cần để setup).
- [x] Xác minh từng account bằng browser profile riêng hoặc logout/login, không bằng state trong app.
- [x] Xác minh claims hiển thị đúng username/business role mà không lưu hay render raw token.

### P2.3 — Create and assign per-user E2EE roles

- [x] Tạo/commit bốn role realm: `_tide_income_manager_a.selfencrypt`, `_tide_income_manager_a.selfdecrypt`, `_tide_reference_manager_b.selfencrypt`, `_tide_reference_manager_b.selfdecrypt`.
- [x] Gán Tenant cả bốn role.
- [x] Gán Manager A chỉ `_tide_income_manager_a.selfdecrypt`; Manager B chỉ `_tide_reference_manager_b.selfdecrypt`; Admin không có E2EE package role.
- [x] Commit QEA role-creation và assignment requests trước khi tiếp tục.
- [x] Kiểm tra effective realm roles của từng user và xác nhận package roles không là default/child role.

### P2.4 — Renew sessions and capture the baseline matrix

- [x] Logout/login hoặc dùng đúng refresh flow cho toàn bộ session bị ảnh hưởng.
- [x] Kiểm tra claims/effective roles khớp matrix, không đưa raw token vào notes/logs.
- [x] Ghi rõ một-admin QEA là threshold 1, không gọi là multi-party approval.
- [x] Search tracked files để chắc không có password, token, hay exported session.

### Checkpoint Phase 02

- [x] Bốn account thực đăng nhập độc lập.
- [x] Business/E2EE role matrix đúng; Admin không có decrypt role; default roles không chứa package role.
- [x] Không còn QEA request pending cần cho core flow; session đã renew sau assignment.
- [x] Chỉ sau checkpoint này mới được bắt đầu Phase 03.

---

## Phase 03 — Authenticated full-stack shell

### P3.1 — Freeze shared domain and API contract

- [x] Định nghĩa/chuẩn hoá các type rõ nghĩa: `RentalPackage`, `PackageMetadata`, `AccessDecision`, `recipientId`, identity và error payload.
- [x] Contract transport chỉ gồm ciphertext và safe metadata; không có salary, employer, reference, hoặc plaintext field.
- [x] Quy ước status: `401` cho missing/invalid token, `403` cho business-policy denial; map Tide/E2EE error sang `AccessDecision` an toàn.

### P3.2 — Implement authenticated UI shell

- [x] Dùng provider, redirect route, proxy/middleware và silent-SSO assets do TideCloak generate.
- [x] Hiển thị active identity từ session thật; phân biệt loading, initialization error, signed-out và signed-in.
- [x] Không tạo role-switch; không render/log raw token.

### P3.3 — Implement token-verified API/store boundary

- [x] Bảo vệ `GET /api/packages` và `POST /api/packages` bằng TideCloak bearer-token verification phía server.
- [x] Tạo in-memory ciphertext store rỗng, không seed plaintext và không dùng browser storage làm store.
- [x] Bảo đảm route không import/gọi decrypt helper, không dùng admin/service account bypass, và error không lộ SDK response/token.

### P3.4 — Join authenticated fetch

- [x] FE gọi protected API với token thật mà không persist token.
- [x] Signed-out UI không gọi/không hiển thị protected package data.
- [x] Xử lý `401`, `403`, stale/expired session theo P3.1, không tự suy đoán access từ UI role.

### Checkpoint Phase 03

- [x] Bốn account hiển thị identity thật; protected API được enforce ở server.
- [x] FE/BE dùng chung typed contract; backend chưa có plaintext hay universal decrypt path.
- [x] Yêu cầu người dùng chạy và cung cấp output: `bun --bun run lint` và `bun --bun run build`.

---

## Phase 04 — Tenant creates encrypted packages

### P4.1 — Lock serialization and tag mapping

- [x] Tạo mapping exhaustive: Income → `income_manager_a`/Manager A; Reference → `reference_manager_b`/Manager B.
- [x] Chỉ gửi `string` hoặc `Uint8Array` vào E2EE helper; không truyền object trực tiếp.
- [x] Dùng payload synthetic khớp `docs/demo-guide.md`; không dùng real PII.

### P4.2 — Tenant browser encryption interaction

- [x] Presentation-gate create action cho signed-in Tenant, sau đó serialize → TideCloak `doEncrypt` với exact tag.
- [x] Chỉ POST ciphertext + safe metadata; reset plaintext working state sau successful POST.
- [x] Không lưu plaintext vào source, local/session storage hay console; preview sau create chỉ được đến từ decrypt thành công ở Phase 05.

### P4.3 — Ciphertext-only package persistence

- [x] `POST /api/packages` verify token và Tenant role, allowlist fields, server-generate safe metadata.
- [x] Reject plaintext-shaped/unknown fields và tag-recipient mismatch.
- [x] Record chỉ có ID, type, owner, recipient, tag, ciphertext, createdAt, status.

### P4.4 — Join the two-package creation flow

- [x] Tenant tạo được đúng hai records/ciphertexts/tags riêng trong một flow tái lập được.
- [x] Inspect network, store và logs: chỉ ciphertext + safe metadata; ciphertext không đọc như JSON/plaintext.
- [x] Xác minh browser profile/session khác chỉ thấy records theo scope trong vòng đời in-memory store.

### Checkpoint Phase 04

- [x] Tenant encrypt được Income và Reference bằng TideCloak E2EE thực; tag/recipient đúng matrix.
- [x] Plaintext chỉ tạm ở authorised browser; backend, network persistence và logs không có plaintext.
- [x] Không có mock-crypto fallback; yêu cầu người dùng chạy lint/build và báo output.

---

## Phase 05 — Selective decryption for Tenant and Managers

### P5.1 — Authenticated ciphertext retrieval

- [x] Hoàn thiện GET routes với server-side token verification; signed-out luôn nhận `401`.
- [x] Trả về ciphertext/safe metadata cần thiết để thực hiện positive và cross-package negative E2EE test; không trả plaintext.
- [x] Review routes để xác nhận không có decrypt import, admin key hay service-account bypass.

### P5.2 — Package card and `AccessDecision` UI

- [x] Package card hiển thị các trạng thái: encrypted, decrypting, granted, policy denied, role mismatch, stale session, integration unavailable.
- [x] Nút decrypt luôn gọi generated `doDecrypt` với ciphertext và **exact stored tag**.
- [x] Chỉ render plaintext từ result thành công; clear khi logout, đổi account hoặc component teardown; không lộ raw SDK error/token.

### P5.3 — Verify Tenant and Manager A

- [x] Tenant decrypt Income và Reference thành công.
- [x] Manager A decrypt Income thành công và thử Reference phải bị TideCloak policy deny.
- [x] Xác minh denial vẫn xảy ra khi gọi decrypt trực tiếp thay vì tin UI role hint; không log giá trị đã decrypt.

### P5.4 — Verify Manager B inverse path

- [x] Bằng session/account riêng, Manager B decrypt Reference thành công và Income bị policy deny.
- [x] Khi đổi account, plaintext state của account trước không còn hiển thị.

### Checkpoint Phase 05

- [x] Tenant: Income allow, Reference allow.
- [x] Manager A: Income allow, Reference deny.
- [x] Manager B: Income deny, Reference allow.
- [x] Mọi wrong-user denial do TideCloak/E2EE trả về. Nếu một manager decrypt sai package, dừng: kiểm tra default roles, exact tag, effective roles và session freshness trước khi đổi UI.
- [x] Yêu cầu người dùng chạy lint/build sau targeted fixes.

---

## Phase 06 — Admin metadata, revocation, and hardening

### P6.1 — Admin safe-metadata scope

- [x] Server-side auditor policy cho phép Admin xem cả hai record với ID, type, owner, recipient, tag/policy label, createdAt, status và opaque ciphertext nếu cần để test.
- [x] Không có plaintext fields, plaintext endpoint, decrypt helper, decrypt key hay bypass trong admin route/store.

### P6.2 — Admin UI and two real denials

- [x] Admin thấy all safe metadata nhưng không thấy sensitive plaintext trước decrypt.
- [x] Cả Income và Reference action đều gọi `doDecrypt`, rồi nhận policy denial thật — không hidden/disabled button hay hard-coded result.
- [x] Copy UI nói rõ operational metadata access không đồng nghĩa payload access.

### P6.3 — Revocation acceptance

- [x] Baseline: Manager A decrypt Income thành công.
- [x] Qua Tide Console/QEA, remove Income decrypt role, đạt threshold và commit change request.
- [x] Renew Manager A session, xác minh future decrypt bị deny và UI nêu rõ không thể thu hồi plaintext đã xem/copy.
- [x] Nếu final demo cần matrix gốc, re-grant role, commit, renew session, rồi xác minh lại.

### P6.4 — Security and failure-state hardening

- [x] Xử lý an toàn unauthenticated, loading, denied, role mismatch, stale session, invalid tag, Tide/Fabric unavailable.
- [x] Review UI/log/network/browser storage/server state: không password, token, plaintext hay raw sensitive SDK response.
- [x] Cập nhật `.gitignore` khi cần cho `.env*`, local TideCloak data, build output và key files; không xoá/sửa file người dùng không liên quan.

### Checkpoint Phase 06

- [x] Admin metadata đúng; hai decrypt attempts bị TideCloak từ chối.
- [x] Revocation chỉ được xem là pass sau committed role change + fresh session + future deny.
- [x] Core matrix đã khôi phục nếu cần final demo; errors không lộ chi tiết nhạy cảm.
- [x] Repository không tracked secret/plaintext/local TideCloak state; yêu cầu người dùng chạy lint/build.

---

## Phase 07 — Acceptance, documentation, and submission

### P7.1 — Clean acceptance run

- [x] Từ documented clean local state, tạo lại hai package và chạy matrix bốn account với fresh sessions.
- [x] Signed-out user không lấy được protected metadata/ciphertext.
- [x] Nếu lỗi, quay lại task owner phase tương ứng; không thêm feature mới trong Phase 07.
- [x] Yêu cầu người dùng chạy `bun --bun run test` và `bun --bun run build`, rồi ghi nhận output pass.

### P7.2 — Synchronize source-of-truth docs and README

- [x] README giữ challenge overview dưới 300 từ và có Quick Start thực thi được: container, install, dev, lint, build, reset/recreate data.
- [x] Cập nhật `docs/specification.md`, `docs/architecture.md`, `docs/tidecloak-integration.md`, `docs/CONTENT.md` theo generated SDK surface, API/store, commands và limitations đã chứng minh.
- [x] Giữ official source URLs cho quyết định TideCloak không hiển nhiên; không đưa secret vào setup docs.

### P7.3 — Finalize the demo guide

- [x] Đồng bộ `docs/demo-guide.md` theo UI thật: Tenant create → Manager A allow/deny → Manager B allow/deny → Admin metadata/two denies → result summary.
- [x] Storyboard tối đa 1:58; revocation để trong acceptance appendix nếu đưa vào main narrative sẽ quá hai phút.
- [x] Rehearse hai lần bằng documented reset flow; không overclaim one-admin QEA là multi-party approval.

### P7.4 — Record and validate `demo.mp4`

- [x] Record bằng separate sessions/profiles. Video phải < 2 phút, < 100 MB, thấy active account, ciphertext state, success/denial và Admin metadata-only.
- [x] Kiểm tra full video có audio/hình rõ, không lộ password, token, notification, console nhạy cảm hay real PII.
- [x] Final `git status` chỉ có source/docs/artifact được chủ đích; không có `.env`, local database/session hay build output.

## Final project gate

- [x] Bốn account TideCloak thực pass matrix sau fresh sessions: Tenant `allow/allow`; Manager A `allow/deny`; Manager B `deny/allow`; Admin `deny/deny` + safe metadata.
- [x] Ciphertext không thể đọc ngoài authorised browser session; server/store/API/logs/browser storage không giữ plaintext nhạy cảm.
- [x] API verifies TideCloak token; denied results originate at E2EE boundary; không có universal decryptor.
- [x] Role revocation passes only with commit + session renewal; limitation about already-viewed data is documented.
- [x] User has provided successful output for `bun --bun run test` and `bun --bun run build` on final tree.
- [x] README/docs/demo guide khớp implementation; `demo.mp4` < 2 phút và < 100 MB; human review xác nhận sẵn sàng nộp.

## Evidence handoff for every completed task

- [x] Nêu task ID, files changed và contract/behavior checked.
- [x] Nêu user-run command + sanitized result, hoặc lý do command chưa được chạy.
- [x] Nêu manual account/session used và allow/deny outcome, không ghi credential/token/plaintext.
- [x] Nêu blocker hoặc QEA/session step còn chờ trước khi chuyển task kế tiếp.
