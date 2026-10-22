# Phase 2 — Realm, identities và policy matrix

## Mục tiêu

Cấu hình real TideCloak realm, bốn demo account và các role/tag đúng matrix trước
khi xây UI nghiệp vụ. Đây là security dependency, không phải dữ liệu mock.

**Timebox:** 60 phút  
**Phụ thuộc:** Phase 1  
**Song song có kiểm soát:** Chuẩn bị checklist/tên role có thể song song với enrol
tài khoản; mọi assignment chỉ làm sau khi role creation đã được QEA commit.

## Task P2.1 — Xác nhận realm, client và QEA baseline

**Mô tả:** Kiểm tra realm/client do initializer tạo, redirect URI, web origin,
Tide IdP, license và trạng thái QEA thay vì tạo cấu hình trùng lặp.

**Acceptance criteria:**

- [ ] Realm và OIDC client trỏ đúng `http://localhost:3000` cùng exact redirect path.
- [ ] Tide IdP, dev license và QEA hoạt động.
- [ ] Mọi redirect/origin change request đã authorize/commit trước login test.

**Verification:**

- [ ] Tide console hiển thị app settings đã commit.
- [ ] Generated app hoàn tất login/redirect bằng first enrolled realm user.

**Dependencies:** Phase 1 checkpoint  
**Files likely touched:** Chỉ external TideCloak state; cập nhật
`docs/tidecloak-integration.md` nếu generated identifiers khác spec  
**Estimated scope:** S

### Temporary-MVP implementation note

While TideCloak is repaired, the app may simulate this matrix through the
temporary server-side session and access-decision adapters documented in
`plans/00-mock-mvp-bridge.md`. This helps implement and verify UI/API contracts,
but does **not** satisfy P2.1 or any Phase 2 acceptance criterion. The real
realm, client, Tide IdP, licence, QEA state, and redirect/origin approvals
remain unchecked until TideCloak is available.

## Task P2.2 — Tạo bốn demo account và business roles

**Mô tả:** Tạo/enrol `tenant`, `manager-a`, `manager-b`, `admin` như bốn realm
account riêng. Bootstrap master-admin credential không được dùng làm demo identity.

**Acceptance criteria:**

- [ ] Bốn username tồn tại và mỗi account có Tide enrolment/session riêng.
- [ ] Business role mapping là `renter`, `property-manager`, `property-manager`,
  `auditor` đúng requirement.
- [ ] Credential được lưu ngoài repository; không tạo role-switch trong app.

**Verification:**

- [ ] Đăng nhập từng account bằng separate profile hoặc logout/login cycle.
- [ ] Active token claims cho thấy đúng username và business role.

**Dependencies:** P2.1  
**Files likely touched:** Chỉ external TideCloak state  
**Estimated scope:** S

## Task P2.3 — Tạo và gán E2EE roles theo từng user

**Mô tả:** Tạo bốn realm role E2EE, authorize/commit change requests theo dependency,
rồi gán trực tiếp cho user. Không đưa role package vào `default-roles-<realm>`.

**Acceptance criteria:**

- [ ] Có đúng bốn role `_tide_income_manager_a.selfencrypt`,
  `_tide_income_manager_a.selfdecrypt`, `_tide_reference_manager_b.selfencrypt`,
  `_tide_reference_manager_b.selfdecrypt`.
- [ ] Tenant có cả bốn; Manager A chỉ có income decrypt; Manager B chỉ có reference
  decrypt; Admin không có role nào trong bốn role này.
- [ ] Role creation được commit trước assignment; mọi assignment QEA request được commit.

**Verification:**

- [ ] Kiểm tra effective realm roles của từng user trong console.
- [ ] Kiểm tra package roles không là child của default role.

**Dependencies:** P2.2  
**Files likely touched:** Chỉ external TideCloak state  
**Estimated scope:** S

## Task P2.4 — Làm mới session và chụp baseline matrix

**Mô tả:** Tạo session mới sau role assignment và lưu checklist không bí mật để
đối chiếu ở các phase feature.

**Acceptance criteria:**

- [ ] Tất cả affected sessions được logout/login hoặc refresh đúng generated flow.
- [ ] Claims/effective roles khớp matrix, không lộ raw token trong notes hay log.
- [ ] Một-admin QEA được mô tả đúng là threshold 1, không tuyên bố multi-party approval.

**Verification:**

- [ ] Manual matrix review bởi người triển khai.
- [ ] Search tracked files không thấy username kèm password, token hoặc exported session.

**Dependencies:** P2.3  
**Files likely touched:** Có thể cập nhật checklist trong
`docs/tidecloak-integration.md`; không lưu credential  
**Estimated scope:** XS

## Checkpoint Phase 2

- [ ] Bốn account thật đăng nhập được độc lập.
- [ ] Business roles và E2EE roles khớp docs.
- [ ] Admin không có decrypt role; default roles không chứa package role.
- [ ] Không còn pending QEA request cần cho core flow.
- [ ] Session đã renew sau assignment.

Không viết fallback mock nếu enrolment/Fabric lỗi; dùng 30 phút dự phòng để sửa
real integration hoặc dừng và báo blocker.

