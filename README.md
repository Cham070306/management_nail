# Tiệm — Quản lý nail, salon và dịch vụ

Mã nguồn đầy đủ tại `/Users/hoangthingoctram/job_remote/management_nail`.

## Chạy trên máy

Cần Node.js >=22.13.0. Thư viện đã được cài trong project.

```sh
npm run dev -- --port 4173 --hostname 127.0.0.1
```

- Trang giới thiệu: `http://127.0.0.1:4173/`
- Quản lý tiệm: `http://127.0.0.1:4173/app.html`
- Đăng nhập local được giả lập bằng tài khoản `seedy@sites.test`. Trên Sites online dùng xác thực ChatGPT thật.
- Có thể cài dạng PWA từ Chrome/Edge. Chưa có bộ cài Windows/macOS độc lập.

## Chức năng hiện có

- Tạo tiệm theo ngành, danh mục dịch vụ gợi ý, nhiều chi nhánh; ca làm, ngày làm và kỹ năng nhân viên.
- Một phiếu có nhiều dịch vụ, phân công từng nhân viên, xếp nối tiếp theo thời lượng. Lịch từng người và toàn chi nhánh; kiểm tra trùng, đổi lịch, hủy, gia hạn giữ lịch, đánh dấu không đến.
- Giá/thời lượng/hoa hồng được chụp tại thời điểm đặt, không thay đổi theo danh mục sau đó.
- Hồ sơ khách, ghi chú, lịch sử dịch vụ, tìm kiếm và gợi ý khách quen.
- Cọc, thu nhiều lần, tiền mặt/banking, ghi nhận hoàn tiền; chia tip, tip nhận trực tiếp, ghi nhận trả tip và đối soát tiền mặt cuối ca.
- Phiếu dịch vụ có tên nhân viên, in phiếu và QR điền sẵn số tiền nếu cấu hình tài khoản nhận.
- Lưu dữ liệu tài khoản D1, phiên bản chống ghi đè, tải bản mới từ máy chủ, sao lưu JSON và báo cáo CSV.
- Mời đúng email, vai trò chủ tiệm / lễ tân / nhân viên. Nhân viên dùng trang cá nhân, chỉ nhận dữ liệu của mình; quyền được kiểm tra ở máy chủ.
- Webhook SePay có API Key, chống trùng theo ID ngân hàng, kiểm tra số tài khoản, giao dịch chưa khớp chờ đối chiếu. Tiền dư không tự chuyển thành tip.
- Sáng/tối, desktop/tablet/mobile. Giữ nguyên bộ giao diện hiện tại của project.

## Phân quyền

Chủ tiệm có toàn quyền. Lễ tân được quản lý lịch, khách, thu tiền và xem báo cáo; không được sửa cấu hình, nhân viên, dịch vụ hay ngân hàng. Nhân viên chỉ xem dịch vụ/thu nhập được phân công và cập nhật tiến độ phần việc của mình. Quyền nhân viên gắn với ID hồ sơ, không chuyển sang người mới khi tái sử dụng vị trí trong danh sách.

Chủ tiệm lưu dữ liệu lên tài khoản trước, vào **Quyền truy cập** tạo liên kết mời, rồi tự gửi cho người được mời. Liên kết một lần, hạn 7 ngày, yêu cầu đúng email. Website Sites vẫn giữ nguyên phạm vi riêng tư hiện có: người được mời cần được cấp quyền mở website ở lớp hosting trước khi sử dụng.

## Kết nối thanh toán thật

1. Trong Cài đặt → Ngân hàng & QR, nhập tài khoản, mã ngân hàng/BIN và tên chủ tài khoản.
2. Bật tạo QR qua VietQR.io nếu chấp thuận gửi thông tin nhận tiền, số tiền và mã phiếu tới nhà cung cấp ảnh QR. Không gửi tên/số điện thoại khách.
3. Liên kết tài khoản ngân hàng trong SePay. Trong project, tạo khóa webhook và URL ở mục Webhook / Đối soát.
4. Cấu hình SePay gửi JSON tiền vào, xác thực `Authorization: Apikey <khóa>` tới URL đã cấp.
5. Với Sites riêng tư, cấu hình quyền truy cập máy chủ phù hợp cho nhà cung cấp webhook trước khi bật. Không đổi audience hoặc công khai khóa tự động.
6. Thử giao dịch giá trị nhỏ: đúng tiền, thiếu, dư, gửi lại nhiều lần và nội dung sai. Chỉ dùng thật sau khi kiểm tra đối chiếu với ngân hàng.

QR không tự chứng minh đã thanh toán. Chỉ webhook được xác thực hoặc thao tác đối soát thủ công rõ ràng mới ghi nhận tiền. Có thể tiếp tục dùng mô phỏng để trải nghiệm. Phần mềm không tự chuyển tiền khi ghi hoàn tiền hoặc trả tip.

Tài liệu nhà cung cấp: [VietQR Quick Link](https://www.vietqr.io/qr-dong), [SePay webhook](https://developer.sepay.vn/vi/sepay-webhooks/tich-hop-webhook).

## Kiểm thử và build

```sh
node --test tests/workspace-validation.test.mjs tests/permissions.test.mjs
npx tsc --noEmit
npm run build
```

`tests/fullstack-local.test.mjs` chạy với bản build Wrangler riêng ở `127.0.0.1:4176`, tạo tài khoản giả lập tách biệt để kiểm tra phân quyền, nhận lời mời, webhook, chống trùng và xung đột phiên bản. Chỉ dùng trên localhost, tuyệt đối không coi header kiểm thử là cơ chế xác thực khi tự host công khai.

Các migration trong `drizzle/` là bất biến sau khi đã áp dụng. Local và online có cơ sở dữ liệu riêng. Các thư mục `.wrangler`, `.sites-runtime`, `work`, `node_modules`, `dist` và tệp môi trường được bỏ qua trong Git.

## Những việc cần tài khoản / quyết định kinh doanh trước khi mở bán

- Kích hoạt ngân hàng và webhook thật, thử đối soát; bộ QR chỉ hoạt động khi có thông tin tài khoản đúng.
- Chọn nhà cung cấp và tài khoản SMS/Zalo để gửi nhắc lịch. Hiện có lịch nhắc và ghi nhận nhắn/gọi, chưa gửi tự động.
- Chốt giá thương mại, điều khoản dịch vụ/chính sách riêng tư và cổng thanh toán thuê bao. Bảng giá trên trang chủ vẫn là đề xuất, chưa thu phí.
- Cấp quyền hosting cho những người cần tham gia; chạy thử ở một tiệm thực tế trước khi bán rộng rãi.

Phạm vi hiện tại: một chủ tài khoản có một doanh nghiệp với nhiều chi nhánh; mỗi dịch vụ một người thực hiện và các dịch vụ nối tiếp. Chưa có lịch phòng/giường, liệu trình, hay phân công đồng thời nhiều người cho cùng một dịch vụ. Phiếu dịch vụ không phải hóa đơn điện tử thuế.
