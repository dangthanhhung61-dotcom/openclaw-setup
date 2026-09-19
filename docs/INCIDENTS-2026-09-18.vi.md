# Tổng hợp lỗi OpenClaw 2026.9.4 / bộ cài 5.16.6

Các kết luận dưới đây dựa trên log, cấu hình đã lược bỏ bí mật và thử nghiệm thực tế ngày 18–19/09/2026. Chúng không có nghĩa mọi bản OpenClaw hoặc mọi plugin đều không còn lỗi.

| Triệu chứng | Nguyên nhân gốc rễ | Bản sửa trong repository |
| --- | --- | --- |
| Giao diện `ERR_EMPTY_RESPONSE` / gateway không mở | OpenClaw mở rồi đổi tên tệp trên thư mục `.openclaw` bind-mount từ Windows. Docker Desktop trả `ENOENT` khi `fstat` descriptor cũ; cùng thao tác trên filesystem Linux chạy bình thường. | Không tự đổi volume của project cũ vì có thể mất liên kết với dữ liệu hoặc làm Setup không tìm được cấu hình. Xem hướng dẫn di chuyển bên dưới. |
| Đăng nhập Zalo không hiện QR, tiến trình thoát 1 | Project nhiều agent nhưng lệnh `channels login` của Setup không truyền agent sở hữu kênh; OpenClaw từ chối discovery khi không có owner rõ ràng. | Setup suy ra agent từ lựa chọn/binding/System Agent, yêu cầu chọn khi còn mơ hồ, và truyền `--agent` bằng argv (không ghép chuỗi shell). |
| `9router/smart-route`: `Provider 9router has auth issue` | 9Router có API key hợp lệ, nhưng cấu hình provider của OpenClaw chưa bật Bearer Authorization; API trả 401 “API key required for remote API access”. | Provider mới khai `auth: api-key`, `authHeader: true`. Migration chỉ điền hai trường nếu còn thiếu, không đổi key hoặc tùy chọn xác thực do người dùng tự đặt. |
| Zalo đã đăng nhập nhưng `/readyz` trả 503, `Already started` | Monitor cũ kết thúc mà không đóng WebSocket/invalidate API cache. Monitor mới tái sử dụng listener đang chạy, không nhận sự kiện `connected` mới và bị health monitor khởi động lại. | Bản vá có checksum cho đúng bundle `openclaw-zalo-connect` 3.1.5: dừng socket cũ, bỏ cache đúng chủ sở hữu, chặn callback trễ và chỉ báo connected sau sự kiện thật. Bản khác không bị sửa. |
| Khởi động lại chậm, cài DuckDuckGo lặp lại | Entrypoint chỉ tìm `extensions/duckduckgo`, còn plugin do npm quản lý nằm trong `npm/projects/.../node_modules`. | Nhận diện cả hai vị trí trước khi cài. |

## Trạng thái đã kiểm chứng

Trên máy kiểm tra, sau khi sửa và khởi động lại đúng container OpenClaw: Control UI và `/readyz` trả HTTP 200; gateway báo Zalo `running=true`, `connected=true`, không có lastError. Một lượt gọi nội bộ tới `9router/smart-route` trả lời `OK`; không gửi tin nhắn Zalo ra ngoài. Các lượt kiểm tra này chứng minh lỗi đã hết trong thời gian quan sát, không phải cam kết ổn định dài hạn.

## Lưu ý riêng cho Windows Docker

Bản sửa `ERR_EMPTY_RESPONSE` trên máy kiểm tra đã chuyển toàn bộ OpenClaw home sang Docker named volume Linux và giữ Setup nhìn thấy dữ liệu qua đường dẫn WSL. Đây là **thao tác di chuyển dữ liệu có sao lưu**, không phải thay đổi Compose an toàn cho mọi máy. Repository **vẫn sinh Windows bind mount cho project mới và chưa tự động di chuyển project cũ**; cả hai trường hợp cần đánh giá/di chuyển thủ công nếu gặp lỗi filesystem này. Không thay bind mount bằng volume trống hoặc xóa volume cũ nếu chưa kiểm kê dữ liệu, sao lưu và xác minh đường dẫn Setup. Khi dùng liên kết WSL, cần mở Docker Desktop trước OpenClaw và chạy các lệnh OpenClaw ghi cấu hình bên trong container Linux.

## Phạm vi bản vá Zalo

Bản vá chỉ chạy với đúng phiên bản 3.1.5 và SHA-256 của bundle đã kiểm thử; tạo tệp `.openclaw-setup-lifecycle.before` trước khi sửa. Plugin khác phiên bản/layout sẽ được bỏ qua và cần kiểm thử lại sau khi nâng cấp. Trong một số đường cập nhật plugin, Setup cũng chạy bản vá trước khi khởi động lại. Không có cookie, QR, API key, cấu hình riêng hay bản sao lưu nào trong commit công khai.
