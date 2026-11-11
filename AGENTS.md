# Quy tắc xử lý lỗi FE

- Các tính năng gọi API qua `src/lib/apiClient.ts` và HTTP client dùng chung.
- Lỗi API, lỗi mạng và phản hồi không hợp lệ chỉ hiển thị `GENERIC_API_ERROR_MESSAGE` từ `src/base/api/httpClient.ts`.
- Không đưa thông báo lỗi từ backend/provider, stack trace, API key, model, billing hoặc quota lên UI. Không tự ánh xạ mã HTTP thành thông báo chi tiết trong từng feature.
- Có thể dùng status/class lỗi để điều khiển nội bộ (ví dụ chặn gửi lại khi chưa xác định kết quả lưu), nhưng thông báo vẫn dùng câu chung.
- Thông báo kiểm tra form ở client và kết quả nghiệp vụ thành công như `needs_input` có thể hướng dẫn người dùng bổ sung dữ liệu; đây không phải chi tiết exception hệ thống.
- Chi tiết chẩn đoán hệ thống được giữ trong log backend.
