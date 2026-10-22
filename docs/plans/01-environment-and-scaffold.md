Tạm

# Phase 1 — Environment và official scaffold

## Mục tiêu

Từ repository chỉ có tài liệu, tạo baseline Next.js bằng initializer chính thức
trong khi giữ nguyên `README.md`, `AGENTS.md` và `docs/`. Fail fast với Docker,
Node, enrolment, generated SDK surface và build trước khi viết feature code.

**Timebox:** 45 phút
**Phụ thuộc:** Không
**Không song song:** container phải sẵn sàng trước initializer; generated contract
phải được xác nhận trước mọi task ứng dụng.

## Task P1.1 — Preflight môi trường và bảo toàn repository

**Mô tả:** Xác nhận công cụ, working tree và trạng thái “docs-only”; ghi lại file
cần bảo toàn trước khi generator chạy.

**Acceptance criteria:**

- [X] `docker version`, `node --version`, `bun --version` chạy được; Node đáp ứng
  yêu cầu hiện hành của quickstart.
- [X] `git status --short` được kiểm tra và mọi thay đổi có sẵn của người dùng
  được giữ nguyên.
- [X] `README.md`, `AGENTS.md`, `docs/` không bị đưa vào vùng generator có thể ghi đè.

**Verification:**

- [X] Lưu output phiên bản vào implementation notes của phase.
- [X] So sánh `rg --files` trước/sau scaffold để phát hiện file bị thay ngoài ý muốn.

### P1.1 execution record — 2026-10-22

- Docker client/server: `29.9.1` / `29.9.1`
- Node.js: `v26.12.0`
- Bun: `1.3.14`
- Initial `git status --short`: clean.
- Baseline manifest contains documentation only; `package.json`, `bun.lock`,
  `package-lock.json`, `node_modules/`, and `vendor/` are absent.
- Preserve `README.md`, `AGENTS.md`, and `docs/` when P1.3 merges the generated
  scaffold from its temporary directory.

**Dependencies:** Không
**Files likely touched:** Không
**Estimated scope:** XS

## Task P1.2 — Khởi động TideCloak dev container an toàn

**Mô tả:** User chạy service khai báo trong `docker-compose.yaml` với named Docker
volume, không bind repository vào `/opt/keycloak/data/h2`, và giữ bootstrap
credential ngoài source control. Một init service dùng chính image TideCloak sẽ
cấp quyền ghi volume cho UID chạy server trước khi service chính khởi động.

**Acceptance criteria:**

- [X] Init service kết thúc `exited (0)` và container `rental-passport-tidecloak`
  từ `docker-compose.yaml` chạy trên port 8080.
- [X] Named volume chứa local state bên ngoài repository.
- [X] Console phản hồi; password thật không xuất hiện trong tracked file hoặc log
  được đưa vào repository.

**Verification:**

- [X] User reports `docker compose -f docker-compose.yaml ps` báo container running.
- [X] Mở TideCloak console thành công.
- [X] `git status --short` không xuất hiện local database hoặc secret file.

### P1.2 execution record — 2026-10-22

- User confirmed that Docker Compose started successfully and the TideCloak
  console is reachable.
- The local realm-creation flow is available from the `master` realm.
- Local H2 data remains in the named Docker volume
  `rental-passport-tidecloak-data`, not in the repository.
- The final Git-status check is deferred to the P1.3 scaffold review so it covers
  all generated files as well.

**Dependencies:** P1.1
**Files likely touched:** Không
**Estimated scope:** XS

## Task P1.3 — Scaffold baseline mock ở vùng tạm và giữ seam TideCloak

**Mô tả:** Trong lúc TideCloak được sửa, scaffold một Next.js App Router baseline
vào temporary directory an toàn rồi merge có chủ đích vào repository root. Tạo
mock MVP qua adapter seam; không giả vờ tạo realm, enrolment, token hay E2EE.
Khi TideCloak sẵn sàng, tích hợp SDK theo `docs/tidecloak-integration.md`.

**Acceptance criteria:**

- [ ] Dùng `bun create next-app@latest <temporary-target>`; không chạy mù vào
  non-empty root.
- [ ] `package.json`, `bun.lock`, App Router, TypeScript và route handlers được
  giữ theo baseline sinh ra.
- [ ] Mock identity/protection chỉ đi qua seam có thể thay bằng provider,
  redirect, middleware/proxy, verifier và E2EE SDK sau này.
- [ ] Banner `MOCK MODE — TideCloak integration pending` hiện cố định; không có
  claim ciphertext, token verification hoặc E2EE thật.
- [ ] Không ghi đè tài liệu; `tidecloak.json` chỉ được track sau khi xác nhận không
  chứa client secret hay confidential material.

**Verification:**

- [ ] `bun install` hoàn tất theo generated `bun.lock`.
- [ ] `bun --bun run lint` pass nếu script tồn tại.
- [ ] `bun --bun run build` pass.
- [ ] `bun --bun run dev` mở được generated application.

**Dependencies:** P1.2
**Files likely touched:** Generated Next.js baseline, `package.json`, lockfile,
`.gitignore`, mock adapter seam; không có `tidecloak.json` trước khi real
integration sẵn sàng
**Estimated scope:** M — ngoại lệ generated scaffold có thể tạo hơn năm file;
không refactor baseline trong task này.

## Task P1.4 — Khóa version và mock-to-TideCloak contract trong spec

**Mô tả:** Thay placeholder bằng bằng chứng từ Next.js baseline và ghi rõ contract
adapter mà SDK TideCloak sẽ thay thế. Không bịa version hay API của SDK trước
official integration.

**Acceptance criteria:**

- [ ] Ghi exact Node/Next.js/React versions và scripts thật.
- [ ] Ghi mock adapter contract, banner bắt buộc và các điểm thay thế bằng SDK.
- [ ] Để trống version/API cụ thể của `@tidecloak/nextjs` cho đến khi official
  existing-app integration hoàn tất.

**Verification:**

- [ ] Cross-check với package/lockfile và generated source.
- [ ] Không còn câu nào tuyên bố `package.json` vắng mặt sau khi scaffold đã merge.
- [ ] Không có câu nào xem mock output là bằng chứng TideCloak.

**Dependencies:** P1.3
**Files likely touched:** `docs/specification.md`, `docs/tidecloak-integration.md`,
`README.md`
**Estimated scope:** M

## Checkpoint Phase 1

- [ ] Generated app lint/build được bằng scripts thực tế.
- [ ] TideCloak container và console reachable.
- [ ] Mock bridge có thể được thay bằng real auth/E2EE integration mà không đổi
  domain/API/UI contract.
- [ ] Repository không có secret hoặc local TideCloak database.
- [ ] Người triển khai có thể chỉ ra version và đường dẫn generated chính xác.

Không qua checkpoint nếu initializer khác tài liệu mà spec chưa được cập nhật.
