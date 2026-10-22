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

- [ ] `docker version`, `node --version`, `bun --version` chạy được; Node đáp ứng
  yêu cầu hiện hành của quickstart.
- [ ] `git status --short` được kiểm tra và mọi thay đổi có sẵn của người dùng
  được giữ nguyên.
- [ ] `README.md`, `AGENTS.md`, `docs/` không bị đưa vào vùng generator có thể ghi đè.

**Verification:**

- [ ] Lưu output phiên bản vào implementation notes của phase.
- [ ] So sánh `rg --files` trước/sau scaffold để phát hiện file bị thay ngoài ý muốn.

**Dependencies:** Không  
**Files likely touched:** Không  
**Estimated scope:** XS

## Task P1.2 — Khởi động TideCloak dev container an toàn

**Mô tả:** Chạy image chính thức với named Docker volume, không bind repository
vào `/opt/keycloak/data/h2`, và giữ bootstrap credential ngoài source control.

**Acceptance criteria:**

- [ ] Container `rental-passport-tidecloak` chạy trên port 8080.
- [ ] Named volume chứa local state bên ngoài repository.
- [ ] Console phản hồi; password thật không xuất hiện trong tracked file hoặc log
  được đưa vào repository.

**Verification:**

- [ ] `docker ps` báo container healthy/running.
- [ ] Mở TideCloak console thành công.
- [ ] `git status --short` không xuất hiện local database hoặc secret file.

**Dependencies:** P1.1  
**Files likely touched:** Không  
**Estimated scope:** XS

## Task P1.3 — Scaffold ở vùng tạm và merge baseline

**Mô tả:** Kiểm tra help/behaviour của initializer hiện hành. Scaffold vào một
temporary directory an toàn, hoàn tất first-admin enrolment theo wizard, rồi merge
generated files có chủ đích vào repository root.

**Acceptance criteria:**

- [ ] Dùng `bun create @tidecloak/nextjs@latest <temporary-target>`; không chạy mù
  vào non-empty root.
- [ ] `package.json`, lockfile, generated provider, redirect, middleware, token
  verifier và adapter/config được giữ theo pattern của initializer.
- [ ] Không ghi đè tài liệu; `tidecloak.json` chỉ được track sau khi xác nhận không
  chứa client secret hay confidential material.

**Verification:**

- [ ] `bun install` hoàn tất theo generated `bun.lock`.
- [ ] `bun --bun run lint` pass nếu script tồn tại.
- [ ] `bun --bun run build` pass.
- [ ] `bun --bun run dev` mở được generated application.

**Dependencies:** P1.2  
**Files likely touched:** Generated Next.js baseline, `package.json`, lockfile,
`.gitignore`, optional safe `tidecloak.json`  
**Estimated scope:** M — ngoại lệ generated scaffold có thể tạo hơn năm file;
không refactor baseline trong task này.

## Task P1.4 — Khóa version và generated contract trong spec

**Mô tả:** Thay placeholder bằng bằng chứng từ project vừa sinh trước khi feature
code phụ thuộc vào SDK.

**Acceptance criteria:**

- [ ] Ghi exact Node/Next.js/React/`@tidecloak/nextjs` versions và scripts thật.
- [ ] Ghi exact provider, redirect path, middleware matcher, token verification và
  E2EE helper surface.
- [ ] Mọi sai khác với docs Tide được nêu rõ; spec được cập nhật trước code.

**Verification:**

- [ ] Cross-check với package/lockfile và generated source.
- [ ] Không còn câu nào tuyên bố `package.json` vắng mặt sau khi scaffold đã merge.

**Dependencies:** P1.3  
**Files likely touched:** `docs/specification.md`, `docs/tidecloak-integration.md`,
`README.md`  
**Estimated scope:** M

## Checkpoint Phase 1

- [ ] Generated app lint/build được bằng scripts thực tế.
- [ ] TideCloak container và console reachable.
- [ ] Generated auth/E2EE integration chưa bị thay bằng custom code.
- [ ] Repository không có secret hoặc local TideCloak database.
- [ ] Người triển khai có thể chỉ ra version và đường dẫn generated chính xác.

Không qua checkpoint nếu initializer khác tài liệu mà spec chưa được cập nhật.

