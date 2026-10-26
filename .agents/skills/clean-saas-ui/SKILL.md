---
name: clean-saas-ui
description: >-
  Hệ thống nguyên tắc thiết kế, bảng màu, typography, tokens và quy chuẩn styling giao diện Clean SaaS / Professional Studio tối giản, hiện đại và tinh tế.
  Kích hoạt và sử dụng khi thiết kế giao diện frontend, viết CSS/Tailwind, xây dựng UI dashboard, công cụ sáng tạo hoặc khi người dùng yêu cầu phong cách giao diện tinh giản, chuyên nghiệp, không đại trà.
---

# Clean SaaS & Studio UI Design System

Hệ thống thiết kế giao diện chuyên nghiệp lấy cảm hứng từ các sản phẩm SaaS cao cấp (Linear, Raycast, Vercel, Figma). Hướng dẫn này tập trung vào **thị giác, màu sắc, typography và tính tinh giản** có thể tái sử dụng cho bất kỳ dự án web nào.

---

## 1. Từ khóa phong cách (Style Archetype & Keywords)

Khi mô tả hoặc thiết kế theo phong cách này, sử dụng các từ khóa sau:
* **Clean SaaS Dashboard / Modern Studio Tool**: Giao diện công cụ làm việc tinh gọn, trực quan, chuyên nghiệp.
* **Curated Slate Neutrals**: Tương phản nhẹ nhàng giữa xám phấn bảng (`slate-50`) và thẻ Card trắng tinh khiết (`white`).
* **Soft Card Elevation**: Bo góc mềm mại kết hợp đổ bóng siêu nhẹ và đường viền siêu mỏng bán trong suốt.
* **Single Accent Color Discipline**: Kỷ luật chỉ dùng một màu chủ đạo làm điểm nhấn, tránh lạm dụng quá nhiều màu sắc.
* **Micro-interactions & Subtle Texture**: Họa tiết dot-matrix mờ, thanh cuộn mỏng, chuyển động nhạy nhưng êm ái.

---

## 2. Bảng màu chuẩn (Curated Color System)

### 2.1. Nền & Bề mặt (Surfaces)
* **Nền tổng thể ứng dụng**: `bg-slate-50` (`#f8fafc`) — Tạo cảm giác mềm mắt, không bị chói như nền trắng toát toàn màn hình.
* **Thẻ Card & Bảng điều khiển**: `bg-white` (`#ffffff`) — Tạo sự nổi bật tự nhiên trên nền `slate-50`.
* **Nền phụ / Vùng nhóm con**: `bg-slate-100/70` hoặc `bg-slate-50` bo góc bên trong thẻ trắng.

### 2.2. Đường viền & Đổ bóng (Borders & Shadows)
* **Viền Card chuẩn**: `border border-gray-200/80` hoặc `border-slate-200` (viền mỏng 1px, độ đậm vừa phải).
* **Viền phân cách hàng/cột**: `border-b border-gray-200` hoặc `divide-y divide-gray-100`.
* **Đổ bóng (Shadows)**:
  * Thẻ Card và Thanh điều hướng: `shadow-sm` hoặc `shadow-xs`.
  * Tuyệt đối tránh: Đổ bóng đen đậm (`shadow-xl`, `shadow-2xl`) gây cảm giác nặng nề.

### 2.3. Màu nhấn chủ đạo (Accent Color)
Chọn **duy nhất 1 màu nhấn** (trong dự án mẫu là Electric Blue):
* **Nút hành động chính (Primary Button)**: `bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm`.
* **Mục đang chọn (Active State)**: Nền xanh phấn `bg-blue-50`, chữ xanh đậm `text-blue-700 font-semibold`, viền nhẹ `border border-blue-100`.
* **Khung biểu tượng nhận diện (Logo / Accent Frame)**: Khối vuông bo góc `w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center`.
* **Focus Ring**: `focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none`.

### 2.4. Màu ngữ nghĩa phụ (Semantic Accents - Dùng có chừng mực)
Chỉ dùng cho status, tier, badge cảnh báo:
* Đỏ / Cao cấp: `#ef4444` (`bg-red-500`, `text-red-600`)
* Cam / Khá: `#f97316` (`bg-orange-500`, `text-orange-600`)
* Vàng hổ phách / Trung bình: `#eab308` (`bg-amber-500`, `text-amber-600`)
* Xanh lá cây / Thành công: `#22c55e` (`bg-emerald-500`, `text-emerald-600`)
* Xanh dương / Tiêu chuẩn: `#3b82f6` (`bg-blue-500`, `text-blue-600`)

---

## 3. Typography & Phân cấp thị giác (Visual Hierarchy)

Dùng font hiện đại hình học sạch sẽ: **Outfit** (cho Tiêu đề) và **Inter** (cho Body & Data).

| Cấp bậc | Cỡ chữ & Thuộc tính | Lớp Tailwind đề xuất | Ví dụ ứng dụng |
| :--- | :--- | :--- | :--- |
| **Tiêu đề thương hiệu** | 16px - 18px, Bold 800, Font Outfit | `font-extrabold text-base font-['Outfit'] text-slate-900 tracking-wide` | Tên app trên Sidebar / Logo |
| **Tiêu đề khối / Dự án** | 14px - 16px, Semi-bold 700 | `text-base font-bold text-slate-800` | Header title, Card title |
| **Nhãn phân nhóm (Meta Label)** | 10px, Bold, IN HOA, dãn chữ | `text-[10px] font-bold text-slate-400 uppercase tracking-wider` | "MENU CHÍNH", "THÔNG SỐ RENDER" |
| **Nội dung văn bản (Body)** | 13px - 14px, Medium 500 | `text-sm font-medium text-slate-600 hover:text-slate-900` | Menu link, mô tả ngắn |
| **Số liệu kỹ thuật (Numbers)** | 11px - 13px, Monospace, Bold | `font-mono font-bold text-slate-800` | Tọa độ, FPS, Frame counter, kích thước |

---

## 4. Bo góc & Cấu trúc Card (Radius & Card Anatomy)

* **Thẻ Card chính**: `rounded-xl` (12px) hoặc `rounded-2xl` (16px) — Tạo cảm giác hiện đại, thanh thoát.
* **Nút bấm / Input / Tab item**: `rounded-lg` (8px) — Giữ sự vuông vức công thái học của phần mềm công cụ, tránh bo tròn vo như viên thuốc (`rounded-full`) trên nút chính.
* **Huy hiệu số đếm (Badge Counter)**: `rounded-full px-2 py-0.5 text-xs font-mono font-bold` — Để phân biệt rõ ràng với các nút bấm.
* **Nút bấm nhỏ / Chip thông số**: `rounded-md text-[11px] px-2 py-0.5 bg-slate-100 border border-gray-200`.

---

## 5. Mẫu thành phần giao diện đặc trưng (Reusable UI Patterns)

### 5.1. Segmented Mode Switcher (Thanh chuyển đổi chế độ phẳng)
Bao bọc các nút chuyển đổi trong một khung nền trắng mỏng:
```tsx
<div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-1 flex items-center gap-1">
  <button className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 shadow-xs transition">
    Chế độ 1
  </button>
  <button className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 transition">
    Chế độ 2
  </button>
</div>
```

### 5.2. Info Spec Box (Hộp thông số kỹ thuật gọn gàng)
Trình bày thông số rõ ràng với sự phối hợp nhãn xám và giá trị font-mono:
```tsx
<div className="p-3.5 rounded-xl bg-slate-50 border border-gray-200/80 text-xs space-y-2">
  <div className="flex justify-between items-center">
    <span className="text-slate-500">Độ phân giải:</span>
    <span className="font-mono font-bold text-slate-800">1920 × 1080</span>
  </div>
  <div className="flex justify-between items-center">
    <span className="text-slate-500">Tốc độ:</span>
    <span className="font-mono font-bold text-blue-600">30 FPS</span>
  </div>
</div>
```

### 5.3. Dot-Matrix Grid Texture (Lưới chấm phòng thu tinh tế)
Dùng cho canvas hoặc vùng preview sáng tạo, tạo chiều sâu mà không gây rối mắt:
```css
.dot-grid-pattern {
  background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
  background-size: 16px 16px;
}
```

### 5.4. Minimalist Scrollbar (Thanh cuộn mỏng tinh tế)
```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.8);
}
::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 225, 0.9);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.9);
}
```

---

## 6. Các lỗi cần tránh (Anti-Patterns)

1. ❌ **Không dùng nền đen thuần hoặc dark gradient hào nhoáng kiểu web crypto** khi đang dựng Dashboard công cụ quản lý / phòng thu chuyên nghiệp.
2. ❌ **Không dùng drop-shadow quá đậm** (`shadow-xl` / màu đen mờ lớn) vì sẽ làm giao diện lem nhem và mất vẻ phẳng tinh tế.
3. ❌ **Không lạm dụng nhiều màu nổi cùng lúc**: Menu, nền, viền và thanh công cụ phải giữ trung tính (`slate`/`gray`), chỉ dành màu nổi (`blue`, `emerald`, `amber`) cho các vị trí có chủ đích (active tab, primary action, alert).
4. ❌ **Không để tỷ lệ ảnh bị biến dạng**: Luôn dùng `object-fit: contain` (`object-contain`) cho hình ảnh đại diện, logo sản phẩm hoặc item tải lên.
