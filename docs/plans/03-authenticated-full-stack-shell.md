# Phase 3 — Authenticated full-stack shell

## Mục tiêu

Tạo slice đầu tiên nối FE và BE trong cùng Next.js project: người dùng nhìn thấy
identity thật, còn package API từ chối request không có TideCloak token hợp lệ.
Chưa xử lý plaintext hoặc E2EE package trong phase này.

**Timebox:** 50 phút  
**Phụ thuộc:** Phase 2  
**Song song:** Sau P3.1, P3.2 (FE) và P3.3 (BE) có thể làm đồng thời; P3.4 là
điểm join bắt buộc.

## Task P3.1 — Chốt shared domain và API contract

**Mô tả:** Định nghĩa typed contract nhỏ nhất dùng chung cho package metadata,
ciphertext record, access result và API errors. Không sao chép Tide SDK types hoặc
đặt plaintext fields vào transport type.

**Acceptance criteria:**

- [ ] Có types rõ nghĩa: `RentalPackage`, `PackageMetadata`, `AccessDecision`,
  `recipientId` và literal tags đúng docs.
- [ ] Transport contract chỉ chứa ciphertext và safe metadata.
- [ ] API contract xác định `401` cho token thiếu/sai, `403` cho business-policy
  mismatch, `4xx` cho invalid shape và safe `5xx` cho integration failure.

**Verification:**

- [ ] TypeScript compile/build không lỗi.
- [ ] Review type definitions không thấy salary, employer, reference hoặc plaintext field.

**Dependencies:** Phase 2 checkpoint  
**Files likely touched:** `src/lib/rental-packages/types.ts`,
`src/lib/rental-packages/policy.ts` hoặc generated-path equivalents  
**Estimated scope:** S

## Task P3.2 — FE lane: auth shell và active identity

**Mô tả:** Giữ generated TideCloak provider/redirect pattern, thêm shell hiển thị
loading, signed-out, signed-in identity, business role, login và logout.

**Acceptance criteria:**

- [ ] Không có role-switch; username/role đến từ signed-in TideCloak session.
- [ ] Loading, initialization error, signed-out và signed-in states phân biệt rõ.
- [ ] Provider, redirect và silent-SSO assets generated không bị viết lại nếu không
  có bằng chứng từ official docs.

**Verification:**

- [ ] Đăng nhập/logout thành công với cả bốn account.
- [ ] Redirect trở về đúng app origin và active identity đổi theo account thật.
- [ ] Không render raw token hoặc ghi token vào console.

**Dependencies:** P3.1  
**Files likely touched:** generated root layout/provider file,
`src/components/active-identity.tsx`, `src/app/page.tsx`  
**Estimated scope:** M

## Task P3.3 — BE lane: token-verified store boundary

**Mô tả:** Tạo in-memory ciphertext repository và package route handlers dùng
generated/official token verifier. Store rỗng ở phase này và chỉ chấp nhận contract
từ P3.1.

**Acceptance criteria:**

- [ ] `GET /api/packages` và `POST /api/packages` xác minh bearer token phía server.
- [ ] In-memory repository không có seed plaintext và không dùng browser storage.
- [ ] Route không import/call decrypt helper; error response không lộ token hoặc raw SDK result.

**Verification:**

- [ ] Signed-out/invalid-token request nhận `401`.
- [ ] Request bằng valid TideCloak token đi qua verifier và nhận response rỗng/an toàn.
- [ ] `bun --bun run lint` và `bun --bun run build` pass.

**Dependencies:** P3.1  
**Files likely touched:** `src/lib/tidecloak/verify-access-token.ts`,
`src/lib/rental-packages/store.ts`, `src/app/api/packages/route.ts` hoặc generated
equivalents  
**Estimated scope:** M

## Task P3.4 — Join FE/BE bằng authenticated fetch

**Mô tả:** FE lấy access token theo generated SDK flow và gọi package API; chuẩn
hóa presentation state cho loading, unauthorized và integration unavailable.

**Acceptance criteria:**

- [ ] Signed-in shell gọi được API với token thật và không persist token.
- [ ] Signed-out UI không gọi protected data hoặc hiển thị package content.
- [ ] FE mapping khớp status/error contract P3.1, không suy đoán denial từ role UI.

**Verification:**

- [ ] Test signed-out, valid user và expired/stale session.
- [ ] Network inspection cho thấy API rejects missing token.
- [ ] Lint/build pass sau integration.

**Dependencies:** P3.2, P3.3  
**Files likely touched:** `src/lib/rental-packages/client.ts`, feature page/component
từ P3.2  
**Estimated scope:** S

## Checkpoint Phase 3

- [ ] Bốn account hiển thị identity thật.
- [ ] Protected API enforcement nằm ở server, không chỉ ở UI.
- [ ] FE và BE dùng cùng typed contract.
- [ ] Backend state chưa có plaintext và chưa có universal decrypt path.
- [ ] Lint/build pass.

