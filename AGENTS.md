# AGENTS.md — TierRank Motion Studio

Tài liệu kiến trúc, quy ước code và cẩm nang vận hành dành cho các AI Agent khi làm việc trên repository này.

---

## 1. Tổng quan dự án

`tier-rank-motion-studio` là ứng dụng Web Studio tương tác kết hợp cùng video engine **Remotion**, cho phép người dùng tự tay dựng video xếp hạng (Tier List) chuyên nghiệp với animation mượt mà:
* **Mục tiêu ứng dụng**:
  * Người dùng tùy biến bảng xếp hạng 5 cấp độ (S, A, B, C, D).
  * Kéo thả logo/ảnh vào các tier, tự do điều chỉnh thời gian xuất hiện (`startFrame`) và thời lượng animation (`durationInFrames`).
  * Xem trước video thời gian thực (interactive preview) với thanh timeline scrubbing, tua frame, phóng to toàn màn hình.
  * Hỗ trợ xuất (render) video MP4 chất lượng cao bằng Remotion CLI.
* **Quy chuẩn Canvas Remotion**:
  * ID Composition: `TierRankVideo`
  * Độ phân giải: Full HD 1920×1080
  * Tốc độ khung hình (FPS): 30 FPS
  * Thời lượng chuẩn: 300 frames (10 giây)

---

## 2. Công nghệ & Thư viện chủ đạo

Mọi thông tin đã được kiểm chứng trực tiếp từ `package.json` và cấu hình:

| Thành phần | Công nghệ / Thư viện | Phiên bản | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Giao diện Web** | React, React DOM | `19.2.3` | React 19 mới nhất |
| **Ngôn ngữ** | TypeScript | `5.9.3` | Strict mode, target ES2020 |
| **Công cụ Build & Dev** | Vite | `8.3.5` | Plugin `@vitejs/plugin-react-swc` `4.3.3` |
| **Video Engine** | Remotion | `4.0.538` | Core animation engine |
| **Player Trực tiếp** | `@remotion/player` | `4.0.538` | Video canvas nhúng trong Web UI |
| **Remotion CLI** | `@remotion/cli` | `4.0.538` | Render video MP4 & still frames |
| **CSS Styling** | Tailwind CSS | `4.3.3` | `@tailwindcss/vite` v4 |
| **Icon** | Lucide React | `1.61.0` | Bộ icon giao diện |
| **Fonts** | Google Fonts (`Outfit`) | CDN | Nhúng qua `index.html` và cấu hình CSS |

> [!IMPORTANT]
> **Quy tắc phiên bản Remotion**: Mọi package liên quan đến Remotion (`remotion`, `@remotion/player`, `@remotion/cli`, `@remotion/eslint-config-flat`) bắt buộc phải dùng **đồng nhất phiên bản `4.0.538`**. Không tự ý nâng cấp riêng lẻ bất kỳ package nào để tránh xung đột API.

---

## 3. Cấu trúc thư mục & Vai trò thành phần

```text
tier-rank-motion-studio/
├── public/                 # Ảnh preview render mẫu và tài nguyên tĩnh
├── src/
│   ├── components/         # Các module giao diện Studio (Dashboard Web UI)
│   │   ├── Header.tsx          # Top bar: Tên dự án (inline edit), Xem trước/Tạm dừng, Nút Xuất Video
│   │   ├── Sidebar.tsx         # Cột điều hướng trái (250px, theme trắng, logo xanh, thông số kỹ thuật)
│   │   ├── PlayerView.tsx      # Workspace chính: 3 chế độ (Preview, TierBoard, Split), Player & thanh điều khiển timeline
│   │   ├── TierBoard.tsx       # Bảng kéo thả Tier tương tác (HTML5 Drag & Drop)
│   │   ├── AssetLibrary.tsx    # Quản lý kho ảnh: Tải ảnh PNG/JPG/WebP, xóa ảnh, reset mẫu
│   │   └── EventTimeline.tsx   # Danh sách sự kiện: Chỉnh startFrame, duration, nút tự động dãn cách (1.5s)
│   ├── remotion/           # Mã nguồn video compositions chạy trên Remotion engine
│   │   ├── TierListComposition.tsx # Layout video 1920x1080: Header title/time, 5 hàng TierRow, footer
│   │   └── TierRow.tsx         # Khối hàng Tier: Khối màu nhãn trái (S/A/B/C/D), vùng dot-matrix trắng phải, spring animation
│   ├── data/
│   │   └── sample-data.ts      # Dữ liệu khởi tạo (5 tiers, icon vector SVG data-url, danh sách sự kiện mẫu)
│   ├── types/
│   │   └── tier.ts             # Định nghĩa Type TypeScript: TierId, TierDefinition, TierItem, RankingEvent, CompositionProps
│   ├── hooks/
│   │   └── useCurrentPlayerFrame.ts # Hook đồng bộ frame hiện tại từ @remotion/player
│   ├── App.tsx             # Root Layout & State Manager: Kết nối dữ liệu giữa Web UI và Remotion props
│   ├── Root.tsx            # Entry point Remotion: Đăng ký Composition "TierRankVideo"
│   ├── main.tsx            # Entry point Vite Web App: Render App vào div#root
│   └── index.css           # Tailwind v4 import, font Outfit, tiện ích nền lưới .bg-dot-matrix
├── index.html              # HTML template cho Vite, load font Outfit
├── vite.config.ts          # Cấu hình Vite dev server (port 5173, React SWC, Tailwind v4)
├── remotion.config.ts      # Cấu hình Remotion CLI (Rspack, format jpeg, overwrite true)
├── tsconfig.json           # Cấu hình TypeScript compiler
└── package.json            # Scripts và dependencies của dự án
```

---

## 4. Cẩm nang lệnh phát triển (Developer Commands)

Các lệnh đã được kiểm chứng hoạt động chính xác từ `package.json`:

| Mục đích | Lệnh thực thi | Ghi chú |
| :--- | :--- | :--- |
| **Cài dependencies** | `npm install` | Cài đặt toàn bộ packages theo `package-lock.json` |
| **Chạy Web Studio** | `npm run dev` | Khởi chạy Vite dev server tại `http://localhost:5173` |
| **Chạy Remotion Studio** | `npm run studio` | Mở giao diện Remotion Studio riêng tại `http://localhost:3000` |
| **Kiểm tra TypeScript** | `npx tsc --noEmit` | Soát lỗi kiểu toàn bộ source code (exit 0 là đạt) |
| **Lint & Typecheck** | `npm run lint` | Chạy cả `eslint src` và `tsc` |
| **Build Web App** | `npm run build` | Thực hiện `tsc && vite build`, xuất bundle ra thư mục `dist/` |
| **Preview Web Build** | `npm run preview` | Khởi chạy máy chủ thử nghiệm cho bản build `dist/` |
| **Xuất Video MP4** | `npx remotion render TierRankVideo out/video.mp4` | Render video MP4 chuẩn Full HD 1920x1080 |
| **Xuất 1 Frame Tĩnh** | `npx remotion still TierRankVideo out/frame.png --frame=60` | Xuất frame thứ 60 để kiểm tra layout đồ họa |
| **Nâng cấp Remotion** | `npm run upgrade` | Chạy `remotion upgrade` để cập nhật đồng bộ các gói Remotion |

> [!NOTE]
> **Quy ước Port mạng**:
> * Port `5173`: Dành riêng cho Vite dev server (Web UI Studio).
> * Port `3000`: Dành riêng cho Remotion Studio / CLI rendering. Tuyệt đối không đặt trùng port để tránh xung đột headless fetch của Puppeteer.

---

## 5. Nguyên tắc bảo vệ chức năng cốt lõi (Core Invariants)

Khi chỉnh sửa bất kỳ phần nào của dự án, các AI Agent **bắt buộc** tuân thủ các nguyên tắc sau để không làm vỡ tính năng đang hoạt động:

### 5.1. Video Preview & Trình phát Remotion
1. **Không unmount `<Player />` trong DOM**:
   * Trong [PlayerView.tsx](file:///d:/code/tier-rank-motion-studio/src/components/PlayerView.tsx), component `<Player />` phải luôn tồn tại trong cây DOM. Khi người dùng chuyển sang tab `TierBoard` hoặc `Split`, chỉ dùng CSS (ví dụ: `hidden` hoặc layout chia đôi) để ẩn/hiện, tuyệt đối không conditional unmount (`{viewMode === 'preview' && <Player />}`) vì sẽ làm mất kết nối `playerRef` và gây lỗi khi seek frame.
2. **Ẩn controls mặc định**:
   * `<Player />` được cấu hình `controls={false}` để giữ khung hình sạch đẹp. Toàn bộ tính năng điều khiển được điều phối qua thanh scrubber và nút tua chuyên biệt ở thanh công cụ đáy.
   * Giữ nguyên hỗ trợ tương tác tự nhiên: click vào khung hình để Play/Pause (`clickToPlay`), double-click để phóng to toàn màn hình.

### 5.2. Tính xác định của Animation (Deterministic Rendering)
1. **Toán học hóa theo Frame**:
   * Trong [TierListComposition.tsx](file:///d:/code/tier-rank-motion-studio/src/remotion/TierListComposition.tsx) và [TierRow.tsx](file:///d:/code/tier-rank-motion-studio/src/remotion/TierRow.tsx), toàn bộ chuyển động bắt buộc phải là hàm thuần túy (pure function) dựa vào số `frame` do Remotion cung cấp thông qua `useCurrentFrame()`.
   * **Tuyệt đối không sử dụng**: `Date.now()`, `Math.random()`, `setTimeout`, `setInterval` hay CSS transitions/keyframes không đồng bộ. Những yếu tố này sẽ làm video bị nhảy giật hoặc đứng hình khi render video ra file MP4 bằng CLI.
2. **Animation chuẩn Remotion**:
   * Sử dụng hàm `spring()` và `interpolate()` của Remotion để tính toán scale, opacity và vị trí x/y.

### 5.3. Xử lý Ảnh & Tỷ lệ hiển thị (Aspect Ratio)
* Ảnh logo/asset có thể có nhiều tỷ lệ khác nhau (vuông 1:1, ngang 16:9, dọc 3:4).
* Tất cả thẻ `<img>` hiển thị item trong hàng tier hoặc asset library bắt buộc phải có thuộc tính `object-fit: contain` (`object-contain`), nền trong suốt hoặc trắng bo góc nhẹ, không kéo giãn làm biến dạng logo gốc.

### 5.4. Quy trình Kiểm tra Bắt buộc trước khi hoàn thành
Sau mỗi lần chỉnh sửa mã nguồn, bắt buộc phải chạy hai lệnh kiểm chứng:
1. `npx tsc --noEmit` — Đảm bảo 0 lỗi kiểu TypeScript.
2. `npm run build` — Đảm bảo bundler biên dịch thành công mà không có lỗi import hay cú pháp.

---

## 6. Quy ước Thiết kế Giao diện (UI Design System)

* **Phong cách tổng thể**: Dashboard SaaS chuyên nghiệp, hiện đại, tối giản.
* **Màu sắc chủ đạo**:
  * Nền chính ứng dụng: `bg-slate-50`
  * Nền khối nội dung: Thẻ Card màu trắng (`bg-white rounded-xl border border-gray-200/80 shadow-sm`)
  * Sidebar trái: Nền trắng (`bg-white border-r border-gray-200`), logo mang màu xanh điểm nhấn (`bg-blue-600 text-white`)
* **Màu sắc các Hàng Tier**:
  * **S**: Đỏ cam (`#ef4444`)
  * **A**: Cam (`#f97316`)
  * **B**: Vàng hổ phách (`#eab308`)
  * **C**: Xanh lá cây (`#22c55e`)
  * **D**: Xanh dương (`#3b82f6`)
* **Phần thân hàng Tier**: Nền trắng phối lớp lưới chấm dot-matrix mỏng (`.bg-dot-matrix`) tạo cảm giác phòng thu đồ họa hiện đại.

---

## 7. Phong cách phản hồi & Giao tiếp (Visual Cue & Response Style)

Khi tương tác và báo cáo với người dùng, AI Agent cần duy trì phong cách trực quan, mạch lạc và chuyên nghiệp:

1. **Bộ Icon điều hướng thị giác (Visual Cues)**:
   * 👉 **Hướng dẫn hành động**: Dùng cho các bước người dùng cần bấm, gõ lệnh hoặc thao tác ngay.
   * 📌 **Tóm tắt & Lưu vết**: Dùng cho phần tổng hợp trạng thái dự án, checkpoint hoặc ghi chú cốt lõi.
   * ✅ **Xác nhận hoàn thành**: Dùng khi liệt kê các tính năng đã sửa xong hoặc đã test thành công.
   * 💡 **Gợi ý & Mẹo**: Dùng cho giải pháp đề xuất, tối ưu hiệu năng hoặc mẹo dùng tool.
   * ⚠️ **Cảnh báo kỹ thuật**: Dùng khi có breaking change, xung đột version hoặc lỗi cần tránh.

2. **Quy chuẩn bố cục câu trả lời**:
   * Đi thẳng vào trọng tâm, giải thích ngắn gọn nguyên nhân và cách xử lý.
   * Phân cấp đầu mục (bullet points) rõ ràng, in đậm các từ khóa quan trọng.
   * Luôn gắn link file dạng GitHub Markdown (`[TênFile](file:///đường/dẫn/tuyệt/đối)`) để người dùng dễ theo dõi mã nguồn.
