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
## Detailed Demo Script

| Time | On-screen Action | Voiceover Script | Expected Display / Output |
| --- | --- | --- | --- |
| 0:00–0:12 | Show the home page and permission matrix. | "Rental Application Passport helps tenants split their profile into separate data packs, instead of sharing all sensitive information with everyone." | Permission matrix for Tenant, Manager A, Manager B, and Admin. |
| 0:12–0:20 | Click **Sign In**, select **Alex Morgan – Tenant**. | "TideCloak is currently down, so this prototype simulates user identities and permissions to show the product workflow." | **Tenant Evidence Vault** screen. |
| 0:20–0:38 | Click **Encrypt & Send to Manager A**, then send the Reference Pack to Manager B. | "The tenant creates two packs: income details for Manager A and rental history for Manager B. In the full version, all data will be encrypted right in the browser before sending." | Two packs switch to published status; each pack has its own recipient and tag. |
| 0:38–0:58 | Log out, log in as **Priya Shah – Manager A**, then open the Income Pack. | "Manager A only receives the income pack. When opening an authorized pack, the system shows only the job and income details needed to review the application." | Alex Morgan, Northstar Studio, and income of 7,200 AUD. |
| 0:58–1:17 | Log out, log in as **Noah Williams – Manager B**, then open the Reference Pack. | "Manager B receives different information: rental history and payment records, without seeing any income data." | 42 Example Lane, rental period, reference contact, and **Paid on time** status. |
| 1:17–1:38 | Log in as **Jordan Lee – Admin**, point to the metadata table, and click **Attempt Decrypt**. | "Admin can check system metadata like owner, recipient, and pack type, but cannot read private content. This prototype simulates our planned access policy." | Metadata table is displayed, and the decrypt attempt returns **Access Denied**. |
| 1:38–1:50 | Scroll down to Governance and revoke access for Manager A. | "The prototype also demonstrates permission revocation. Once access is revoked and the session is refreshed, all future access attempts are blocked." | Manager A's status changes to **REVOKED**. |
| 1:50–2:00 | Show the permission matrix again at the bottom of the page. | "In summary, each party only sees what they need: Manager A views income, Manager B views rental history, and Admin only views metadata. TideCloak will enforce this using cryptography once the service is restored." | Allow/Deny matrix for all four roles. |

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
