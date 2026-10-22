# Rental Application Passport

## Ý tưởng trong một câu

Rental Application Passport giúp người thuê nhà tái sử dụng hồ sơ thuê nhưng chỉ chia sẻ đúng nhóm thông tin mà từng quản lý bất động sản được phép xem.

## Vấn đề

Khi nộp hồ sơ thuê nhà, một người thường phải gửi nhiều dữ liệu nhạy cảm như thu nhập, nơi làm việc, giấy tờ nhận diện và thông tin chủ nhà cũ. Nếu họ nộp hồ sơ cho nhiều nơi, mỗi nơi lại nhận một bản sao đầy đủ qua email hoặc hệ thống riêng.

Người thuê gần như không biết:

- ai trong tổ chức có thể đọc hồ sơ;
- dữ liệu được giữ trong bao lâu;
- quản trị viên hệ thống có thể xem hoặc sao chép nội dung hay không;
- một nơi có đang nhận nhiều thông tin hơn mức cần thiết hay không.

Vấn đề chính không phải là thiếu một biểu mẫu thuê nhà khác. Vấn đề là người thuê phải trao quá nhiều niềm tin và quá nhiều dữ liệu cho mỗi lần ứng tuyển.

## Câu hỏi định hướng

> Làm thế nào để người thuê dùng lại bằng chứng thuê nhà, nhưng mỗi bên nhận chỉ mở được đúng gói thông tin dành cho họ và nền tảng không có chìa khóa chung để đọc mọi hồ sơ?

## Người dùng

### Người thuê

Muốn nộp hồ sơ nhanh, tránh gửi toàn bộ dữ liệu cá nhân cho mọi nơi, và hiểu rõ ai đang được phép xem phần nào.

### Quản lý bất động sản

Cần đủ bằng chứng để đánh giá hồ sơ, nhưng không nhất thiết phải nhận mọi dữ liệu mà người thuê đang có.

### Quản trị viên hệ thống

Cần quan sát trạng thái và lịch sử truy cập để hỗ trợ vận hành, nhưng không cần đọc nội dung tài liệu của người thuê.

## Hướng giải quyết đã chọn

Người thuê tạo hai gói dữ liệu tổng hợp:

1. **Income Pack** cho Manager A: thông tin việc làm, thu nhập tháng và phiếu lương giả lập.
2. **Reference Pack** cho Manager B: lịch sử thuê và thư tham chiếu giả lập.

Mỗi gói được mã hóa trong trình duyệt bằng TideCloak với một tag riêng. Quyền giải mã đi cùng tài khoản TideCloak thật của người nhận:

- Manager A mở được Income Pack nhưng bị từ chối khi mở Reference Pack.
- Manager B mở được Reference Pack nhưng bị từ chối khi mở Income Pack.
- Admin xem được metadata và lịch sử thao tác nhưng bị từ chối với cả hai gói.
- Người thuê có thể xem và quản lý hai gói của mình.

Ứng dụng chỉ giữ ciphertext và metadata cần cho màn hình demo. Nó không giữ khóa giải mã chung.

## Vì sao TideCloak cần thiết

Đăng nhập thông thường chỉ trả lời “người này là ai”. Nó không ngăn backend hoặc quản trị viên đọc dữ liệu sau khi đăng nhập thành công.

TideCloak được dùng cho ba việc khác nhau:

- xác thực bốn tài khoản thật;
- đưa quyền theo vai trò/tag vào phiên người dùng;
- mã hóa và giải mã dữ liệu ngay trong phiên trình duyệt được phép.

Nếu bỏ TideCloak và thay bằng một nút đổi vai trò trên giao diện, sản phẩm không còn chứng minh được ý tưởng cốt lõi.

## Khoảnh khắc chính của demo

Trong cùng một luồng ngắn, người xem thấy:

1. Người thuê tạo hai gói mã hóa.
2. Manager A mở được gói thu nhập và không mở được gói tham chiếu.
3. Manager B có kết quả ngược lại.
4. Admin nhìn thấy hai bản ghi chia sẻ nhưng không thể mở nội dung.

Các trạng thái từ chối phải hiện rõ. Đây là bằng chứng của sản phẩm, không phải một trường hợp lỗi cần giấu đi.

## Phạm vi MVP

MVP bao gồm:

- Next.js được tạo từ initializer chính thức của TideCloak;
- TideCloak dev container chạy thật;
- bốn tài khoản riêng: tenant, manager-a, manager-b và admin;
- hai gói JSON hoặc document preview dùng dữ liệu giả;
- mã hóa/giải mã theo tag;
- màn hình cho từng vai trò và trạng thái cho phép/từ chối;
- metadata/audit tối thiểu để Admin quan sát;
- một luồng demo có thể quay trong dưới hai phút.

## Không làm trong MVP

- **Không dùng dữ liệu thật** — không cần thiết để chứng minh quyền truy cập và tạo rủi ro riêng tư.
- **Không làm upload hoặc quản lý file hoàn chỉnh** — JSON và preview giả đã đủ để kiểm tra E2EE.
- **Không xây cơ sở dữ liệu production** — bộ nhớ cục bộ hoặc dữ liệu mock chứa ciphertext là đủ cho prototype.
- **Không làm marketplace bất động sản** — tìm nhà, thanh toán và ký hợp đồng không liên quan đến giả thuyết chính.
- **Không làm KYC hay chấm điểm tín dụng** — đây là các sản phẩm khác với độ phức tạp và trách nhiệm pháp lý lớn hơn.
- **Không dùng UI role switch** — bốn vai trò phải đăng nhập bằng bốn tài khoản TideCloak riêng.
- **Không tuyên bố thu hồi có thể xóa dữ liệu đã xem** — thu hồi chỉ ngăn các lần giải mã hợp lệ trong tương lai sau khi quyền và phiên đã được cập nhật.

## Giả định cần kiểm chứng

- [ ] TideCloak dev container, enrolment và Cybersecurity Fabric hoạt động ổn định trên máy demo.
- [ ] `@tidecloak/nextjs` hiện hành hỗ trợ provider, redirect, kiểm tra token và E2EE như tài liệu chính thức mô tả.
- [ ] Realm role E2EE có thể được gán riêng cho từng tài khoản và thay đổi được quản lý qua QEA.
- [ ] Hai tag độc lập đủ để ban giám khảo hiểu rõ selective disclosure trong thời gian dưới hai phút.
- [ ] Sau khi thay đổi quyền được commit và phiên được làm mới, lần giải mã tiếp theo phản ánh quyền mới.

## Tiêu chí thành công

Ý tưởng được chứng minh khi một người xem có thể tự trả lời “ai mở được gói nào?” chỉ bằng cách quan sát demo, đồng thời thấy rằng Admin không có đường tắt để đọc plaintext trong ứng dụng.

## Câu hỏi còn mở cho giai đoạn triển khai

- Phiên bản chính xác của Next.js và `@tidecloak/nextjs` sẽ được lấy từ initializer và khóa trong `bun.lock`.
- Nếu thời gian còn lại cho phép, có thể chuẩn bị tổng cộng ba tài khoản quản trị QEA để ngưỡng phê duyệt lớn hơn một. Bốn tài khoản nghiệp vụ lõi không tự chứng minh thuộc tính này.
