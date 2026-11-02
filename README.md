# Vun Vén — Frontend preview

Giao diện quản lý chi tiêu cá nhân. React + TypeScript + Vite, shadcn/ui (Radix), Tailwind CSS, TanStack Query, React Router, Lucide và Recharts. Theme sáng/tối tùy chọn trong Cài đặt, màu xanh teal chủ đạo; font Chakra Petch.

## Chạy

```bash
npm install
npm run dev
```

Mở URL Vite hiển thị. Camera cần localhost hoặc HTTPS; mở URL HTTP qua IP LAN trên điện thoại có thể không dùng được camera. Upload ảnh QR vẫn có đường riêng.

```bash
npm run lint
npm run build
npm run format:check
```

## Xem gì trước?

1. **Trang chủ:** thẻ tổng chi tháng, ẩn/hiện tiền, thu nhập và chi tiêu tháng, ghi thủ công, ngân sách và lịch sử gần đây.
2. **Thanh dưới:** 5 vị trí, QR chỉ có icon và mở thẳng màn hình quét; tab active đi theo URL. Thống kê gộp ngân sách/báo cáo; tab cuối là Cài đặt.
3. **Giao dịch:** thêm thu/chi, tìm ghi chú/danh mục/ví, lọc khoản thu/chi. Danh sách nhóm theo ngày, mỗi nhóm có tiêu đề ngày ở trên; tìm kiếm và lọc loại cập nhật cả nhóm. Form có validation và trạng thái lưu/lỗi.
4. **Ngân sách trong Thống kê (Tiền ra):** đổi tháng, sửa hạn mức, xem phần còn lại và mức chi trung bình mỗi ngày. Có hạn mức riêng cho 6 danh mục, tiến độ, phần còn lại và cảnh báo vượt. Tổng hạn mức danh mục được đối chiếu với tổng ngân sách; sửa danh mục không tự sửa tổng. Dữ liệu cũ chưa có hạn mức danh mục vẫn đọc được. Chưa có dự báo tốc độ/khoản cố định.
5. **Thống kê:** biểu đồ phân bổ và chi theo ngày, dùng các màu trong theme teal. Có số liệu chữ tương ứng.
6. **QR:** xin camera khi mở màn hình; đọc mã trên camera hoặc ảnh. Có tùy chọn tải ảnh và chụp hóa đơn. QR là dữ liệu chưa xác minh, không tự mở liên kết hoặc ghi tiền.
7. **Cài đặt:** thông tin demo và xuất dữ liệu JSON.

Ví dụ kiểm tra: thêm khoản chi 65.000 → tổng chi tháng tăng 65.000 → danh sách và báo cáo cùng cập nhật → reload vẫn còn.

## Hiểu cấu trúc

```text
src/
  app/                  # Provider, layout và thanh điều hướng
  components/ui/        # Component shadcn/ui từ registry, đã custom
  features/
    home/               # Trang chủ và số liệu tổng hợp
    transactions/       # Types, API adapter, hooks, form, danh sách
    budgets/            # Ngân sách
    reports/            # Báo cáo và biểu đồ
    scan/               # Camera, QR và chọn ảnh
    settings/           # Cài đặt, xuất dữ liệu
  shared/ui/            # Component dùng chung theo quy ước của Vun Vén
  shared/utils/         # Tiền, ngày, múi giờ
  styles/theme.css      # Nguồn màu duy nhất
  styles/spacing.css    # Khoảng cách header, đầu trang, section và nhóm nội dung
  index.css             # Tailwind và bố cục responsive
```

### Vì sao dùng shadcn/ui?

shadcn/ui đưa source component vào dự án, cho phép sửa trực tiếp để phù hợp sản phẩm. Các component tương tác như Dialog, Select và Tabs dùng Radix bên dưới, giúp có hành vi focus, bàn phím, portal và ARIA. Button/Input cuối cùng vẫn render thành HTML — đây là cách trình duyệt hiển thị UI, không phải bỏ qua thư viện.

`components/ui` giữ các primitive. `shared/ui` bổ sung quy tắc của Vun Vén: Button có `isLoading`; Input buộc có label và liên kết lỗi; IconButton buộc có tên truy cập; Modal có tiêu đề/mô tả và nội dung tùy trang. Chưa xây BasePage/BaseService tổng quát.

### Bộ icon của project

`src/assets/icons.svg` giữ nguyên đường nét của 5 SVG người dùng cung cấp, tổ chức thành sprite. `shared/ui/AppIcon.tsx` dùng chung kích thước và `currentColor`, nên tự nhận màu active, hover và sáng/tối. Home → Trang chủ, time-past → Giao dịch, qr-scan → Quét QR, piggy-bank-budget → Ngân sách, stats → Báo cáo. Các biểu tượng thao tác chưa có SVG tương ứng tiếp tục dùng Lucide.

### Một theme, nhiều nơi sử dụng

Chọn Sáng hoặc Tối trong Cài đặt. `useTheme` lưu `hu.theme` riêng với dữ liệu sổ, áp dụng class `dark` trước khi React render, cập nhật màu thanh trình duyệt và đồng bộ lựa chọn giữa các tab đang mở Cài đặt. Cả hai palette nằm trong `theme.css`; font Chakra Petch giữ nguyên.

`styles/theme.css` định nghĩa `--primary`, `--background`, `--card`, `--border`, `--chart-1`…`--chart-6`. Các màu chart được định nghĩa trong theme; loại thu/chi còn được phân biệt bằng dấu và nhãn, không chỉ màu. `index.css` và component dùng `var(--...)`, không thêm palette riêng. Muốn đổi sắc teal chủ đạo, sửa token tại đây.

Tailwind cung cấp utilities, shadcn dùng utilities và biến theme để tạo primitive, còn lớp CSS của Vun Vén tổ chức bố cục và nhận diện riêng. `cn()` ghép class có điều kiện và giải quyết utility trùng nhau.

### Hook giải quyết việc gì?

- `useBook`: đăng ký query dữ liệu sổ, theo dõi loading/error/cache.
- `useCreateTransaction` và `useUpdateBudget`: mutation ghi dữ liệu; thành công thì `setQueryData` cập nhật cache chung. Vì Trang chủ, Giao dịch, Ngân sách và Báo cáo cùng quan sát query này, chúng nhận cùng snapshot mới.
- `useOverview`: tính số liệu hiển thị từ snapshot, không giữ thêm một bản tổng tiền trong state. Tránh việc lưu giao dịch mới nhưng quên cập nhật số tổng.
- `useTransactionForm`: state nhập liệu, validation và luồng submit; component form tập trung trình bày.
- `useAmountVisibility`: state UI local; không đưa vào TanStack Query vì không phải dữ liệu server.
- `useQrScanner`: xin camera, đọc frame, giải mã QR, dừng media tracks/animation khi đọc xong hoặc rời màn hình. Có cleanup cho trường hợp quyền camera trả về sau khi component đã unmount.

Custom hook chia sẻ cách xử lý, không tự chia sẻ state. Cache TanStack Query được chia sẻ do cùng QueryClient và query key. API adapter local chỉ là nơi giả lập nguồn dữ liệu trước khi có server.

### Luồng ghi một khoản chi

```text
TransactionForm
  → useTransactionForm: giữ input, kiểm tra
  → useCreateTransaction: mutation
  → bookApi: kiểm tra dữ liệu, ghi localStorage
  → setQueryData: cập nhật snapshot cache
  → useOverview / danh sách / báo cáo render lại
```

MoneyInput dùng chung hiển thị dấu phẩy nhóm hàng nghìn (10,000,000), giữ vị trí con trỏ khi sửa; giá trị đưa về form và lưu vẫn là chuỗi số nguyên. Tiền cộng/trừ bằng BigInt. Chỉ chuyển sang Number ở dữ liệu trực quan của chart; số tiền chữ vẫn định dạng từ BigInt. Helper `shared/utils/date.ts` tập trung validation, ghép/lấy ngày giờ, định dạng, nhóm ngày, sắp xếp và xử lý tháng theo Asia/Ho_Chi_Minh. Form có ngày và giờ/phút (mặc định giờ Việt Nam hiện tại); giao dịch mới lưu một trường `date` ISO đầy đủ, ví dụ `2026-11-02T15:48:00+07:00`. Dữ liệu cũ `YYYY-MM-DD` vẫn đọc được, hiển thị “Chưa có giờ”, không tự thêm giờ giả. Giao dịch cùng ngày được xếp giờ mới nhất trước, bản thiếu giờ đứng cuối. Thống kê và ngân sách lấy ngày/tháng qua helper, không cắt chuỗi UTC trực tiếp. Calendar dùng Date cục bộ để biểu diễn ô ngày; helper chuyển ô ngày thành YYYY-MM-DD rồi ghép giờ Việt Nam khi lưu. Dữ liệu đầu tiên gồm 3 khoản mẫu, tổng chi 183.000 và hạn mức 10 triệu trong tháng hiện tại; màn hình ghi rõ bản dùng thử.

### Dev và build khác nhau thế nào?

`npm run dev` chạy Vite để phục vụ source và cập nhật khi sửa file. `npm run build` chạy `tsc -b` kiểm tra TypeScript rồi `vite build` tạo HTML/CSS/JS trong `dist`. Báo cáo và QR dùng `React.lazy` để tải thư viện biểu đồ/giải mã khi mở màn hình tương ứng, giảm JS tải ban đầu. Build không đồng nghĩa đã deploy hoặc đã trở thành PWA offline hoàn chỉnh.

## Calendar và component dùng chung

`components/ui/calendar.tsx` tùy biến source Calendar shadcn/ui, dùng React DayPicker. `popover.tsx` dùng Radix để quản lý focus, Escape và vị trí popup. `shared/ui/DatePicker.tsx` ghép hai component này cho form giao dịch, dùng tiếng Việt và tuần bắt đầu từ thứ Hai. Chọn ngày trả về chuỗi `YYYY-MM-DD` theo lịch địa phương, không chuyển UTC làm lệch ngày.

`shared/ui/MonthPicker.tsx` dùng Button, Select và Popover shadcn/ui để chọn tháng/năm chung trên màn Thống kê. Chuyển Tiền ra/Tiền vào cập nhật biểu đồ vòng, biểu đồ theo ngày và danh sách danh mục; hạn mức chỉ xuất hiện ở Tiền ra. Desktop dùng hai cột, mobile xếp dọc. `/budgets` chuyển về `/reports`. Giá trị vẫn là `YYYY-MM`, giới hạn 2000–2100. Popup tự tránh mép màn hình và trả focus về nút khi đóng. Button, Input, Select, Dialog, Tabs và các component nền dùng cùng theme teal, font và trạng thái focus/disabled. Form ghép Field/FieldLabel/FieldError; search dùng InputGroup. Card dùng trực tiếp CardHeader/CardTitle/CardContent/CardAction, không bọc lại qua shared Card. Thông báo dùng Alert; trạng thái trống dùng Empty; tải dữ liệu dùng Spinner. Danh sách giao dịch và danh mục dùng Item; điều hướng dùng NavigationMenu (ngang trên mobile, dọc trên desktop). Biểu đồ dùng ChartContainer/ChartTooltipContent trên Recharts; phần số liệu mở rộng dùng Collapsible. Tiêu đề trang h1, landmark và các phần tử bố cục HTML giữ ngữ nghĩa, không tạo wrapper chỉ để thay tên thẻ.

## Giới hạn của bản này

- Giao dịch/ngân sách demo lưu trong localStorage của trình duyệt. Chưa có tài khoản, NestJS/MySQL, đồng bộ đa thiết bị hoặc IndexedDB/outbox. Chưa xử lý xung đột ghi giữa nhiều tab. Không nhập dữ liệu tài chính quan trọng vào bản demo.
- Upload hóa đơn chưa chạy OCR, chưa giữ ảnh sau khi xử lý và không gửi ảnh đi. Có thể nhập tay sau khi chọn ảnh. Không gán trạng thái OCR thành công giả.
- QR đọc được payload, chưa xác minh người nhận, chưa parse đầy đủ VietQR, chưa mở app bank hoặc xác nhận thanh toán. Chỉ tạo khoản sau khi người dùng điền và lưu form.
- Camera cần kiểm tra trên điện thoại thật; bộ test tự động hiện kiểm tra nhánh từ chối quyền và phương án tải ảnh.
- Ngân sách hiện tính ngưỡng và mức còn lại/ngày; chưa triển khai toàn bộ dự báo linh động, khoản cố định, hoàn tiền/chuyển ví trong plan.
- Xuất hiện tại là JSON; CSV, PWA cài đặt/offline và Web Push thuộc các mốc sau.

Đọc tiếp: [plan sản phẩm](../../docs/hu-final-plan.md), [shadcn/ui](https://ui.shadcn.com/docs), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview).
