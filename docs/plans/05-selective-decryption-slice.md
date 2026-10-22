# Phase 5 — Selective decryption cho Tenant và Managers

## Mục tiêu

Chứng minh core product bằng real `doDecrypt`: cùng hai ciphertext nhưng Tenant mở
được cả hai, Manager A chỉ mở Income, Manager B chỉ mở Reference. Negative cases
phải thật sự đi tới E2EE boundary.

**Timebox:** 70 phút  
**Phụ thuộc:** Phase 4  
**Song song:** P5.1 (BE retrieval) và P5.2 (FE decrypt UI) dùng contract Phase 3/4
và có thể làm đồng thời; P5.3–P5.4 là integration tuần tự theo account.

## Task P5.1 — BE lane: authenticated ciphertext retrieval

**Mô tả:** Hoàn thiện GET contract để authenticated demo accounts nhận safe
metadata/ciphertext cần cho cả positive và explicit cross-package negative test.
Danh sách có thể nhấn mạnh assigned/owned records, nhưng ciphertext của package
đối chiếu phải đến được wrong user để denial được chứng minh ở E2EE boundary.

**Acceptance criteria:**

- [ ] Mọi retrieval route xác minh TideCloak token server-side.
- [ ] Response không chứa plaintext; access scope/shape khớp spec đã cập nhật.
- [ ] Signed-out user không lấy được metadata hoặc ciphertext.

**Verification:**

- [ ] Valid Tenant/Manager tokens lấy được records cần cho acceptance matrix.
- [ ] Missing/invalid token nhận `401`.
- [ ] Review route không có decrypt import, admin key hoặc service-account bypass.

**Dependencies:** Phase 4 checkpoint  
**Files likely touched:** `src/app/api/packages/route.ts`, optional
`src/app/api/packages/[id]/route.ts`, package policy file  
**Estimated scope:** M

## Task P5.2 — FE lane: package card và AccessDecision states

**Mô tả:** Render safe package card/ciphertext state và explicit decrypt action.
Action luôn gọi `doDecrypt` với exact stored tag; business roles chỉ điều chỉnh
copy/navigation, không trả trước kết quả authorization.

**Acceptance criteria:**

- [ ] States gồm encrypted, decrypting, granted, policy denied, role mismatch,
  stale session và integration unavailable.
- [ ] Plaintext chỉ render từ successful TideCloak result và bị clear khi logout,
  account change hoặc component teardown phù hợp.
- [ ] Không có role conditional nào giả lập success/denial thay cho E2EE call.

**Verification:**

- [ ] Instrument/manual inspection xác nhận button gọi real generated `doDecrypt`.
- [ ] Exact stored tag được truyền cùng ciphertext.
- [ ] Error copy không hiển thị raw SDK response/token.

**Dependencies:** Phase 4 checkpoint  
**Files likely touched:** `src/components/packages/package-card.tsx`,
`src/lib/tidecloak/e2ee-client.ts`, package list page  
**Estimated scope:** M

## Task P5.3 — Join: Tenant và Manager A matrix

**Mô tả:** Chạy integration với session mới và packages thật từ Phase 4.

**Acceptance criteria:**

- [ ] Tenant decrypt Income và Reference thành công.
- [ ] Manager A decrypt Income thành công.
- [ ] Manager A attempt Reference và nhận TideCloak policy denial rõ ràng.

**Verification:**

- [ ] Kết quả khớp synthetic values trong demo guide.
- [ ] Network/server logs không chứa decrypted values.
- [ ] Denial vẫn xảy ra nếu UI role hint bị bỏ qua và decrypt được gọi trực tiếp.

**Dependencies:** P5.1, P5.2  
**Files likely touched:** Chỉ sửa integration mapping/error handling nếu test phát
hiện sai; không thêm bypass  
**Estimated scope:** S

## Task P5.4 — Join: Manager B inverse matrix

**Mô tả:** Chạy inverse access path bằng account riêng, không đổi role bằng UI.

**Acceptance criteria:**

- [ ] Manager B decrypt Reference thành công.
- [ ] Manager B attempt Income và nhận TideCloak policy denial.
- [ ] Switching account dùng logout/login hoặc separate browser profile; decrypted
  state của account trước không còn hiển thị.

**Verification:**

- [ ] Ghi checklist allow/deny của ba identities mà không lưu token/plaintext.
- [ ] `bun --bun run lint` và `bun --bun run build` pass sau mọi fix.

**Dependencies:** P5.3  
**Files likely touched:** Không, trừ targeted fix trong files P5.1/P5.2  
**Estimated scope:** XS

## Checkpoint Phase 5

- [ ] Tenant: Income allow, Reference allow.
- [ ] Manager A: Income allow, Reference deny.
- [ ] Manager B: Income deny, Reference allow.
- [ ] Wrong-user denials do TideCloak/E2EE trả về.
- [ ] Ciphertext/plaintext lifecycle và session switching an toàn; lint/build pass.

Nếu wrong manager decrypt được, dừng ngay: kiểm tra default roles, exact tags,
effective roles và session freshness trước khi sửa UI.

