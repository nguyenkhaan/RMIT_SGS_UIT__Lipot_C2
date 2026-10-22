# Phase 7 — Acceptance, documentation và demo submission

## Mục tiêu

Đóng dự án bằng một clean run có bằng chứng, tài liệu khớp code và video kể trọn
selective-decryption story dưới hai phút. Không thêm feature mới trong phase này.

**Timebox:** 50 phút  
**Phụ thuộc:** Phase 6  
**Song song:** Sau clean acceptance run, README/setup và demo storyboard có thể
được cập nhật song song; final recording chỉ làm khi docs/commands đã khớp.

## Task P7.1 — Chạy clean full acceptance matrix

**Mô tả:** Restart về documented local state, tạo lại hai packages và chạy toàn bộ
allow/deny matrix bằng bốn accounts trước khi quay.

**Acceptance criteria:**

- [ ] Tenant tạo/encrypt và decrypt cả hai packages.
- [ ] Manager A chỉ decrypt Income; Manager B chỉ decrypt Reference.
- [ ] Admin thấy all safe metadata và decrypt cả hai đều fail; signed-out user không
  lấy được protected data.

**Verification:**

- [ ] `bun --bun run lint` pass.
- [ ] `bun --bun run build` pass.
- [ ] Manual matrix trong `docs/demo-guide.md` được tick/reproduced từ clean state.
- [ ] Không chạy/báo test script không tồn tại.

**Dependencies:** Phase 6 checkpoint  
**Files likely touched:** Không, trừ targeted fixes quay lại owner phase tương ứng  
**Estimated scope:** S

## Task P7.2 — Đồng bộ README và source-of-truth docs

**Mô tả:** Thay placeholder bằng commands, paths, versions và behaviour đã được
chứng minh. Tài liệu mô tả “what/why”; không chép lại generated code.

**Acceptance criteria:**

- [ ] README challenge overview vẫn dưới 300 words và có Quick Start thực thi được.
- [ ] README liệt kê exact container, install, dev, lint, build và reset/recreate data steps.
- [ ] `specification.md`, `architecture.md`, `tidecloak-integration.md` phản ánh exact
  generated SDK surface, API/storage choice và known limitations.

**Verification:**

- [ ] Một người khác có thể đi theo setup docs từ zero mà không cần secret trong repo.
- [ ] Không còn status “specification only” hoặc claim prototype chưa scaffold.
- [ ] Link nội bộ và official source URLs hợp lệ.

**Dependencies:** P7.1  
**Files likely touched:** `README.md`, `docs/specification.md`,
`docs/architecture.md`, `docs/tidecloak-integration.md`, `docs/CONTENT.md`  
**Estimated scope:** M

## Task P7.3 — Hoàn thiện demo guide theo UI thật

**Mô tả:** Cập nhật storyboard, screen/action names, preflight, reset flow, exact
account sequence và recovery notes theo implementation cuối.

**Acceptance criteria:**

- [ ] Storyboard có thể diễn trong tối đa 1:58 để chừa tolerance encode.
- [ ] Trình tự rõ: Tenant create → Manager A allow/deny → Manager B allow/deny →
  Admin metadata/double deny → result summary.
- [ ] Revocation giữ ở acceptance appendix trừ khi thay thế được scene mà không
  vượt hai phút; guide nhắc không lộ credential/notification.

**Verification:**

- [ ] Rehearse hai lần liên tiếp không reset thủ công ngoài documented steps.
- [ ] Mọi screen label/click target trong guide tồn tại trong app.
- [ ] Narration không overclaim one-admin QEA là multi-party approval.

**Dependencies:** P7.1  
**Files likely touched:** `docs/demo-guide.md`  
**Estimated scope:** S

## Task P7.4 — Record và validate submission artifact

**Mô tả:** Quay clean run bằng separate sessions/profiles, encode video và kiểm tra
artifact trước khi đưa vào repository theo challenge requirement.

**Acceptance criteria:**

- [ ] `demo.mp4` dưới hai phút và dưới 100 MB.
- [ ] Video thấy rõ active account, ciphertext state, success/denial và Admin metadata-only.
- [ ] Không lộ password, token, console chứa sensitive data, notification hoặc real PII.

**Verification:**

- [ ] Kiểm tra duration và file size bằng local media tooling.
- [ ] Xem lại toàn bộ video có audio/hình rõ, không cắt mất denial state.
- [ ] Final `git status` chỉ chứa intended source/docs/artifact; không có `.env`,
  local DB, sessions hoặc build output.

**Dependencies:** P7.2, P7.3  
**Files likely touched:** `demo.mp4`  
**Estimated scope:** S

## Final checkpoint

- [ ] Tất cả tiêu chí trong `docs/plans/README.md` Definition of Done đạt.
- [ ] Lint và production build pass trên final tree.
- [ ] Bốn-account real TideCloak access matrix pass sau fresh sessions.
- [ ] Ciphertext không đọc được ngoài authorised browser session.
- [ ] README, setup, architecture, integration và demo guide khớp code.
- [ ] Video đạt giới hạn và repository không chứa secret/plaintext.
- [ ] Human review xác nhận dự án sẵn sàng nộp.

