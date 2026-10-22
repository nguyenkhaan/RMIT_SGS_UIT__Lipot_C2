# Kịch bản demo Rental Application Passport

**Thời lượng mục tiêu:** 1 phút 50 giây  
**Đối tượng:** Nhà tuyển dụng và người đánh giá sản phẩm

> **Lưu ý trung thực:** TideCloak hiện đang gặp lỗi. Phiên bản prototype này
> đang mô phỏng đăng nhập, phân quyền và bảo vệ dữ liệu để trình bày luồng sản
> phẩm. Đây chưa phải bằng chứng về TideCloak E2EE hoặc kiểm soát truy cập bằng
> mật mã trong môi trường thực tế.

## Chuẩn bị trước khi quay

- Khởi động ứng dụng và dùng **Reset Data Fixtures** để đưa dữ liệu về trạng thái rỗng.
- Đóng thông báo, ẩn thông tin không liên quan và đặt trình duyệt ở mức thu phóng phù hợp.
- Chuẩn bị sẵn thứ tự đăng nhập: `tenant`, `manager-a`, `manager-b`, rồi `admin`.
- Thêm nhãn nhỏ **TideCloak integration temporarily simulated** trên video.
- Không sử dụng **Cross-Package Denial Test** vì luồng lấy gói đối nghịch hiện chưa hoạt động đúng.

## Kịch bản chi tiết

| Thời gian | Thao tác trên màn hình | Lời thuyết minh | Kết quả cần hiển thị |
| --- | --- | --- | --- |
| 0:00–0:12 | Hiển thị trang chủ và ma trận quyền. | “Rental Application Passport giúp người thuê chia hồ sơ thành từng gói dữ liệu riêng, thay vì gửi toàn bộ thông tin nhạy cảm cho mọi bên.” | Ma trận quyền của Tenant, Manager A, Manager B và Admin. |
| 0:12–0:20 | Nhấn **Sign In**, chọn **Alex Morgan – Tenant**. | “TideCloak hiện đang gặp lỗi, vì vậy prototype này mô phỏng danh tính và quyền truy cập để chứng minh luồng sản phẩm.” | Màn hình **Tenant Evidence Vault**. |
| 0:20–0:38 | Nhấn **Encrypt & Send to Manager A**, sau đó gửi Reference Pack cho Manager B. | “Người thuê tạo hai gói: thông tin thu nhập dành cho Manager A và lịch sử thuê nhà dành cho Manager B. Trong bản tích hợp hoàn chỉnh, dữ liệu sẽ được mã hóa trên trình duyệt trước khi gửi.” | Hai gói chuyển sang trạng thái đã xuất bản; mỗi gói có người nhận và tag riêng. |
| 0:38–0:58 | Đăng xuất, đăng nhập **Priya Shah – Manager A**, rồi mở Income Pack. | “Manager A chỉ nhận gói thu nhập. Khi mở gói được cấp quyền, hệ thống hiển thị đúng thông tin việc làm và thu nhập cần thiết để đánh giá hồ sơ.” | Alex Morgan, Northstar Studio và thu nhập 7.200 AUD. |
| 0:58–1:17 | Đăng xuất, đăng nhập **Noah Williams – Manager B**, rồi mở Reference Pack. | “Manager B nhận một phạm vi thông tin khác: lịch sử thuê nhà và đánh giá thanh toán, nhưng không cần xem dữ liệu thu nhập.” | 42 Example Lane, thời gian thuê, người tham chiếu và trạng thái **Paid on time**. |
| 1:17–1:38 | Đăng nhập **Jordan Lee – Admin**, chỉ vào bảng metadata và nhấn **Attempt Decrypt**. | “Admin có thể kiểm tra metadata phục vụ vận hành, như chủ sở hữu, người nhận và loại gói, nhưng không được xem nội dung riêng tư. Kết quả từ prototype hiện tại là mô phỏng chính sách dự kiến.” | Bảng metadata xuất hiện và thao tác giải mã trả về **Access Denied**. |
| 1:38–1:50 | Cuộn tới phần Governance và thực hiện thu hồi quyền của Manager A. | “Prototype cũng mô phỏng quy trình thu hồi quyền. Sau khi quyền bị thu hồi và phiên được làm mới, những lần truy cập tiếp theo sẽ bị từ chối.” | Trạng thái Manager A chuyển sang **REVOKED**. |
| 1:50–2:00 | Hiển thị lại ma trận quyền ở cuối trang. | “Kết quả là mỗi bên chỉ nhận đúng dữ liệu cần thiết: Manager A xem thu nhập, Manager B xem lịch sử thuê, còn Admin chỉ xem metadata. Đây là điểm tích hợp mà TideCloak sẽ thực thi bằng mật mã khi dịch vụ hoạt động trở lại.” | Ma trận Allow/Deny của bốn vai trò. |

## Phiên bản lời thoại liền mạch

“Rental Application Passport giúp người thuê chia hồ sơ thành từng gói dữ liệu
riêng, thay vì gửi toàn bộ thông tin nhạy cảm cho mọi bên.

TideCloak hiện đang gặp lỗi, vì vậy prototype này mô phỏng danh tính và quyền
truy cập để chứng minh luồng sản phẩm.

Đầu tiên, người thuê tạo hai gói: thông tin thu nhập dành cho Manager A và lịch
sử thuê nhà dành cho Manager B. Trong bản tích hợp hoàn chỉnh, dữ liệu sẽ được
mã hóa trên trình duyệt trước khi gửi.

Manager A chỉ nhận gói thu nhập. Khi mở gói được cấp quyền, hệ thống hiển thị
đúng thông tin việc làm và thu nhập cần thiết để đánh giá hồ sơ.

Manager B nhận một phạm vi thông tin khác: lịch sử thuê nhà và đánh giá thanh
toán, nhưng không cần xem dữ liệu thu nhập.

Admin có thể kiểm tra metadata phục vụ vận hành, như chủ sở hữu, người nhận và
loại gói, nhưng không được xem nội dung riêng tư. Kết quả từ prototype hiện tại
là mô phỏng chính sách dự kiến.

Prototype cũng mô phỏng quy trình thu hồi quyền. Sau khi quyền bị thu hồi và
phiên được làm mới, những lần truy cập tiếp theo sẽ bị từ chối.

Kết quả là mỗi bên chỉ nhận đúng dữ liệu cần thiết: Manager A xem thu nhập,
Manager B xem lịch sử thuê, còn Admin chỉ xem metadata. Đây là điểm tích hợp mà
TideCloak sẽ thực thi bằng mật mã khi dịch vụ hoạt động trở lại.”

## Phương án rút xuống 1 phút 30 giây

- Bỏ cảnh Governance và thu hồi quyền.
- Rút mỗi cảnh Manager xuống khoảng 12 giây.
- Giữ lại cảnh Admin bị từ chối vì đây là kết quả thể hiện rõ nhất nguyên tắc
  tách quyền vận hành khỏi quyền xem dữ liệu.
