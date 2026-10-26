# AGENTS.md — TierRank Motion Studio

Hướng dẫn kiến trúc, quy ước code và workflow dành cho các AI Agent khi làm việc trên repository này.

---

## 1. Tổng quan dự án

`tier-rank-motion-studio` là ứng dụng web tương tác (React 19 + TypeScript + Vite + Remotion) cho phép người dùng tự tay dựng video xếp hạng (Tier List) chuyên nghiệp với animation mượt mà:
* **Mục tiêu**: Người dùng tự căn thời gian (startFrame/duration), kéo thả logo AI vào các tier (S, A, B, C, D), ứng dụng tự động dựng video animation, đồng bộ phát và cho phép xuất file MP4.
* **Canvas Remotion**: Độ phân giải chuẩn 1920×1080 @ 30 FPS, thời lượng mặc định 10 giây (300 frames).

---

## 2. Công nghệ & Thư viện chủ đạo

* **Core**: React 19, TypeScript 5, Vite 8.
* **Video Engine**: Remotion `4.0.538`, `@remotion/player` `4.0.538`.
* **Styling**: TailwindCSS v4, Google Fonts (`Outfit`), Lucide React icons.
* **State & Persistence**: In-memory React state, hỗ trợ tải ảnh local (PNG, JPG, WebP qua DataURL).

> [!IMPORTANT]
> **Quy tắc phiên bản Remotion**: Mọi package Remotion (`remotion`, `@remotion/player`, `@remotion/cli`) phải dùng **cùng phiên bản `4.0.538`**. Tuyệt đối không tự ý nâng cấp hay trộn version khác nhau.

---

## 3. Cấu trúc thư mục & Thành phần

```text
tier-rank-motion-studio/
├── public/                 # Ảnh logo mẫu (ChatGPT, Claude, Gemini, Midjourney...)
├── src/
│   ├── components/         # Các khối giao diện Studio (Dashboard Web UI)
│   │   ├── Header.tsx          # Top bar: Tên dự án, nút Xem trước / Tạm dừng, Xuất Video
│   │   ├── Sidebar.tsx         # Sidebar trái (250px, theme trắng, logo xanh, menu & specs)
│   │   ├── PlayerView.tsx      # Main workspace: 3 tab chế độ, video preview & timeline bar
│   │   ├── TierBoard.tsx       # Bảng kéo thả Tier (S, A, B, C, D) trực quan
│   │   ├── AssetLibrary.tsx    # Kho ảnh: Upload PNG/JPG/WebP, danh sách asset kéo thả
│   │   └── EventTimeline.tsx   # Timeline sự kiện: Chỉnh startFrame, duration, auto-space 1.5s
│   ├── remotion/           # Remotion Video Compositions & Components
│   │   ├── TierRow.tsx         # Hàng tier (cột chữ S/A/B/C/D khối màu, nền trắng dot-matrix)
│   │   ├── TierListComposition.tsx # Composition video 1920x1080 chính thức
│   │   └── Root.tsx            # Đăng ký Composition với Remotion CLI/Studio
│   ├── data/
│   │   └── sample-data.ts      # Dữ liệu khởi tạo (5 tiers, mẫu AI items & ranking events)
│   ├── types/
│   │   └── tier.ts             # Định nghĩa Type: TierItem, RankingEvent, TierConfig...
│   ├── App.tsx             # Root layout: Sidebar (250px) | Main (1fr) | Right Panel (350px)
│   └── index.css           # Design tokens, dot-matrix pattern, font definitions
├── vite.config.ts          # Vite port: 5173
└── remotion.config.ts      # Remotion CLI port: 3000
```

---

## 4. Các lệnh phát triển (Commands)

| Lệnh | Chức năng |
| :--- | :--- |
| `npm run dev` | Chạy Vite dev server tại `http://localhost:5173` (chạy nền) |
| `npx tsc --noEmit` | Kiểm tra toàn bộ kiểu TypeScript |
| `npm run build` | Build production bundle (`tsc && vite build`) |
| `npx remotion still TierRankVideo out/preview.png --frame=60` | Render 1 ảnh tĩnh từ video Remotion tại frame chỉ định |
| `npx remotion render TierRankVideo out/video.mp4` | Render video MP4 hoàn chỉnh bằng Remotion CLI |

> [!NOTE]
> **Phân chia Port**: Vite dev server chạy trên port `5173`. Port `3000` dành riêng cho Remotion Studio/CLI để tránh xung đột headless fetch.

---

## 5. Quy tắc thiết kế UI & Trải nghiệm

1. **Dashboard chuyên nghiệp (SaaS Style)**:
   * Nền ứng dụng màu xám nhẹ (`bg-slate-50`).
   * Các khối giao diện được đóng khung trong thẻ trắng bo góc (`bg-white rounded-xl border border-gray-200/80 shadow-sm`).
   * Sidebar bên trái dùng theme nền trắng (`bg-white border-r`), chỉ khung logo mang màu nền xanh (`bg-blue-600 text-white`) làm điểm nhấn.
2. **Khung Video Preview sạch sẽ**:
   * `<Player />` luôn được gắn sẵn trong DOM (không unmount khi chuyển tab, chỉ ẩn bằng CSS) để giữ kết nối `playerRef`.
   * Đặt `controls={false}` trên `<Player />` để không bị thanh đen che video; click vào video để Play/Pause (`clickToPlay`), double-click để Fullscreen.
   * Thanh điều khiển timeline bên dưới đảm nhiệm việc tua frame (-1s, -1f, +1f, +1s), scrubber, đếm frame (`x / 300`), tốc độ phát và nút phóng to.
3. **Quy chuẩn Canvas Remotion (Image 2)**:
   * Hàng Tier gồm 2 phần:
     * Cột chữ trái: Khối chữ nhật bo góc trái (`rounded-l-lg`), màu nhận diện rõ rệt: S (`#ef4444`), A (`#f97316`), B (`#f59e0b`), C (`#10b981`), D (`#3b82f6`).
     * Khung chứa item phải: Nền trắng (`bg-white`), lưới chấm dot-matrix nhẹ, bo góc phải (`rounded-r-lg`).
   * Ảnh logo luôn hiển thị `object-fit: contain`, không làm biến dạng tỷ lệ gốc của logo.
   * Chuyển động animation dùng Remotion `spring` và `interpolate` thuần tuý, bảo đảm tính xác định (deterministic) theo số frame.

---

## 6. Phong cách phản hồi & Giao tiếp (Visual Cue & Response Style)

Khi tương tác và trả lời người dùng, AI Agent cần tuân theo phong cách trực quan, mạch lạc và chuyên nghiệp:

1. **Bộ Icon điều hướng thị giác (Visual Cues)**:
   * 👉 **Hướng dẫn hành động**: Dùng cho các bước người dùng cần bấm, gõ lệnh hoặc thao tác ngay (VD: `👉 Bạn chỉ cần gõ /compact...`).
   * 📌 **Tóm tắt & Lưu vết**: Dùng cho phần tổng hợp trạng thái dự án, checkpoint hoặc ghi chú cốt lõi (VD: `📌 Tóm tắt trạng thái dự án...`).
   * ✅ **Xác nhận hoàn thành**: Dùng khi liệt kê các tính năng đã sửa xong hoặc đã test thành công.
   * 💡 **Gợi ý & Mẹo**: Dùng cho giải pháp đề xuất, tối ưu hiệu năng hoặc mẹo dùng tool.
   * ⚠️ **Cảnh báo kỹ thuật**: Dùng khi có breaking change, xung đột version hoặc lỗi cần tránh.

2. **Quy chuẩn bố cục câu trả lời**:
   * Đi thẳng vào trọng tâm, giải thích ngắn gọn nguyên nhân và cách xử lý.
   * Phân cấp đầu mục (bullet points) rõ ràng, in đậm các từ khóa quan trọng.
   * Luôn gắn link file dạng GitHub Markdown (`[TênFile](file:///đường/dẫn/tuyệt/đối#Lđầu-Lcuối)`) để người dùng dễ theo dõi code thay đổi.

