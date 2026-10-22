# Phase 4 — Tenant tạo và lưu encrypted packages

## Mục tiêu

Hoàn thành vertical slice đầu tiên có dữ liệu: Tenant tạo hai synthetic payload,
encrypt trong browser bằng hai TideCloak tags khác nhau, rồi backend chỉ nhận và
lưu ciphertext cùng safe metadata.

**Timebox:** 65 phút  
**Phụ thuộc:** Phase 3  
**Song song:** Sau P4.1, P4.2 (FE encryption) và P4.3 (BE create route) có thể làm
đồng thời; P4.4 tích hợp bằng TideCloak thật.

## Task P4.1 — Chốt serialization và tag mapping

**Mô tả:** Định nghĩa synthetic payload factories, serializer và single typed
mapping từ package type sang recipient/tag. Plaintext type không được dùng làm
store/API transport type.

**Acceptance criteria:**

- [ ] Income dùng tag `income_manager_a`; Reference dùng `reference_manager_b`.
- [ ] E2EE input là `string` hoặc `Uint8Array`, không truyền object trực tiếp.
- [ ] Synthetic values khớp `docs/demo-guide.md` và không có real PII.

**Verification:**

- [ ] Type-check mapping exhaustively cho cả hai package types.
- [ ] Nếu generated toolchain có test script, test serialization/tag selection;
  nếu không, chạy manual inspection và không tuyên bố `bun test`.

**Dependencies:** Phase 3 checkpoint  
**Files likely touched:** `src/lib/rental-packages/payloads.ts`,
`src/lib/rental-packages/serialize.ts`, tag mapping file từ P3.1  
**Estimated scope:** M

## Task P4.2 — FE lane: Tenant create/encrypt interaction

**Mô tả:** Tạo tenant screen/card dùng `useTideCloak()` theo generated SDK để gọi
`doEncrypt` trong browser. UI thể hiện plaintext draft, encrypting, encrypted và
integration-error states.

**Acceptance criteria:**

- [ ] Chỉ signed-in Tenant được presentation-gated vào create action.
- [ ] Mỗi payload được serialize và encrypt với exact matching tag.
- [ ] Sau successful POST, working plaintext state được reset; không lưu vào
  localStorage/sessionStorage/cache fixture.

**Verification:**

- [ ] Tenant nhận ciphertext cho cả hai payload bằng real E2EE call.
- [ ] Browser storage inspection không thấy plaintext.
- [ ] Console không log payload, ciphertext response internals hoặc token.

**Dependencies:** P4.1  
**Files likely touched:** `src/components/tenant/package-creator.tsx`, tenant feature
page, `src/lib/tidecloak/e2ee-client.ts` nếu cần thin adapter  
**Estimated scope:** M

## Task P4.3 — BE lane: validate và persist ciphertext record

**Mô tả:** Hoàn thiện `POST /api/packages`: xác minh token/business role, allowlist
transport fields, tự sinh server metadata cần thiết và ghi in-memory store.

**Acceptance criteria:**

- [ ] Server chỉ nhận encrypted payload, type, tag và recipient identifier cần thiết.
- [ ] Server reject plaintext-shaped/unknown fields và tag-recipient mismatch.
- [ ] Chỉ verified Tenant business role tạo package; record có ID, owner, recipient,
  createdAt, status mà không có sensitive fields.

**Verification:**

- [ ] Invalid/missing token, wrong role, unknown field và mismatched tag đều fail.
- [ ] Valid ciphertext tạo một record đúng contract.
- [ ] Store/log inspection không thấy serialized plaintext.

**Dependencies:** P4.1  
**Files likely touched:** `src/app/api/packages/route.ts`,
`src/lib/rental-packages/store.ts`, `src/lib/rental-packages/validation.ts`  
**Estimated scope:** M

## Task P4.4 — Join: tạo hai package end-to-end

**Mô tả:** Kết nối create UI với POST route và chạy real Tenant session từ draft
đến shared backend store.

**Acceptance criteria:**

- [ ] Một thao tác/reproducible flow tạo đúng hai records với hai ciphertext/tag khác nhau.
- [ ] UI chỉ preview sau create bằng decrypt ở phase sau, không giữ plaintext copy.
- [ ] Refresh/browser profile khác vẫn lấy được records trong vòng đời local server
  theo giới hạn của in-memory store.

**Verification:**

- [ ] Inspect network request body và server state: ciphertext + safe metadata only.
- [ ] Ciphertext không đọc được như JSON/plaintext.
- [ ] `bun --bun run lint` và `bun --bun run build` pass.

**Dependencies:** P4.2, P4.3  
**Files likely touched:** Tenant page/component và API client từ Phase 3  
**Estimated scope:** S

## Checkpoint Phase 4

- [ ] Tenant tạo được cả Income và Reference Pack bằng real TideCloak E2EE.
- [ ] Tags/recipients đúng matrix.
- [ ] Plaintext chỉ tồn tại tạm trong authorised browser session.
- [ ] Backend, network persistence và logs không có plaintext.
- [ ] Không có mock crypto fallback; lint/build pass.

