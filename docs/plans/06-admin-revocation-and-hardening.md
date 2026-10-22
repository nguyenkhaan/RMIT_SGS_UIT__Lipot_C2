# Phase 6 — Admin metadata, revocation và hardening

## Mục tiêu

Hoàn tất trust-boundary story: Admin vận hành được trên safe metadata nhưng không
đọc plaintext; role removal ngăn future decrypt sau QEA commit và session renewal;
mọi failure state an toàn và quan sát được.

**Timebox:** 50 phút  
**Phụ thuộc:** Phase 5  
**Song song:** P6.1 (BE metadata scope) và P6.2 (FE Admin view) có thể làm đồng
thời trên shared contract; P6.3 revocation và P6.4 hardening chạy sau integration.

## Task P6.1 — BE lane: Admin metadata scope

**Mô tả:** Hoàn thiện policy để verified Admin nhận toàn bộ safe metadata/ciphertext
cần cho audit và negative decrypt, nhưng không có plaintext endpoint hoặc decrypt key.

**Acceptance criteria:**

- [ ] Admin response chỉ gồm ID, type, owner, recipient, tag/policy label,
  createdAt, status và opaque ciphertext nếu decrypt test cần nó.
- [ ] Token verifier và `auditor` business-role check chạy server-side.
- [ ] Plaintext fields và decrypt operations không tồn tại trong admin route/store.

**Verification:**

- [ ] Admin request hợp lệ trả cả hai records; non-admin request không nhận admin-only
  audit projection nếu contract phân biệt projection.
- [ ] Signed-out/invalid token bị từ chối.
- [ ] Search route/store source không thấy synthetic salary/reference values.

**Dependencies:** Phase 5 checkpoint  
**Files likely touched:** package policy/projection file,
`src/app/api/packages/route.ts` hoặc dedicated metadata route  
**Estimated scope:** S

## Task P6.2 — FE lane: Admin metadata và double denial

**Mô tả:** Tạo Admin view hiển thị operational metadata, ciphertext state và hai
decrypt actions. Mỗi action gọi E2EE thật dù UI biết Admin không có decrypt role.

**Acceptance criteria:**

- [ ] Admin thấy cả hai records và không thấy sensitive plaintext trước decrypt.
- [ ] Income và Reference decrypt đều đi tới `doDecrypt` rồi hiển thị policy denial.
- [ ] UI copy giải thích operational access không đồng nghĩa payload access.

**Verification:**

- [ ] Test bằng real `admin` account không có package roles.
- [ ] Hai denial không do disabled/hidden button hoặc hard-coded role result.
- [ ] Log/network response không chứa plaintext.

**Dependencies:** Phase 5 checkpoint  
**Files likely touched:** `src/components/admin/metadata-table.tsx`, admin page,
shared package card nếu cần presentation variant  
**Estimated scope:** M

## Task P6.3 — Join: revocation acceptance

**Mô tả:** Dùng Manager A làm revocation case. Xác nhận allow trước thay đổi, remove
income decrypt role qua Tide console/QEA, commit, renew session, rồi xác nhận future
decrypt bị từ chối.

**Acceptance criteria:**

- [ ] Baseline Manager A Income decrypt thành công trước role removal.
- [ ] Role removal change request đạt threshold và commit.
- [ ] Sau logout/login hoặc documented refresh, decrypt mới bị từ chối; UI nói rõ
  nội dung đã xem/copy không thể bị thu hồi.

**Verification:**

- [ ] Kiểm tra effective roles và session mới trước retest.
- [ ] Re-grant role và commit sau acceptance nếu demo matrix cuối cần khôi phục.
- [ ] Không dùng stale token làm bằng chứng revocation.

**Dependencies:** P6.1, P6.2  
**Files likely touched:** Có thể cập nhật `docs/demo-guide.md` nếu exact renewal
steps khác dự kiến; role state nằm ngoài repository  
**Estimated scope:** S

## Task P6.4 — Security và failure-state hardening

**Mô tả:** Kiểm tra các lỗi thực tế và loại bỏ mọi đường rò plaintext/secret trước
khi đóng feature work.

**Acceptance criteria:**

- [ ] UI phân biệt unauthenticated, loading, denied, role mismatch, stale session,
  invalid tag và Tide/Fabric unavailable.
- [ ] Không log token, password, plaintext hoặc raw sensitive SDK response.
- [ ] `.gitignore` chặn `.env*` phù hợp, local TideCloak data, build output và key files.

**Verification:**

- [ ] Search tracked diff cho `password|secret|token` và review từng match có chủ đích.
- [ ] Inspect browser storage, network payloads và server logs sau full access flow.
- [ ] `bun --bun run lint` và `bun --bun run build` pass.

**Dependencies:** P6.3  
**Files likely touched:** shared error mapper, affected UI components, `.gitignore`
  
**Estimated scope:** M

## Checkpoint Phase 6

- [ ] Admin metadata view đúng và cả hai decrypt attempts bị TideCloak từ chối.
- [ ] Revocation làm future decrypt fail sau commit + session renewal.
- [ ] Core role matrix được khôi phục cho final demo nếu đã remove role.
- [ ] Error states không lộ sensitive detail.
- [ ] Không có secret/plaintext/local TideCloak state trong tracked files; lint/build pass.

