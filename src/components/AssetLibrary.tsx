import React, { useRef } from 'react';
import { TierItem, RankingEvent } from '../types/tier';
import { Upload, Trash2, GripVertical, CheckCircle2, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface AssetLibraryProps {
  items: TierItem[];
  events: RankingEvent[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string | null) => void;
  onUploadImages: (newItems: TierItem[]) => void;
  onDeleteItem: (itemId: string) => void;
  onResetSamples: () => void;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  items,
  events,
  selectedItemId,
  onSelectItem,
  onUploadImages,
  onDeleteItem,
  onResetSamples,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const newItems: TierItem[] = [];
    let loadedCount = 0;

    fileList.forEach((file) => {
      if (!file.type.match(/^image\/(png|jpeg|jpg|webp|svg\+xml)/)) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (!dataUrl) return;

        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          newItems.push({
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: file.name.replace(/\.[^/.]+$/, ''),
            imageUrl: dataUrl,
            aspectRatio,
          });

          loadedCount++;
          if (loadedCount === fileList.length) {
            onUploadImages(newItems);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const assignedItemIds = new Set(events.map((ev) => ev.itemId));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 flex flex-col h-full overflow-hidden select-none">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-wide font-['Outfit'] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Kho ảnh (Assets)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {items.length} ảnh ({assignedItemIds.size} đã vào bảng)
          </p>
        </div>

        <button
          onClick={onResetSamples}
          className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          title="Khôi phục ảnh mẫu"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Zone */}
      <div className="p-4 border-b border-gray-200 bg-slate-50/50">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Tải ảnh từ máy (PNG, JPG, WebP)</span>
        </button>
      </div>

      {/* Assets Grid List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block mb-1">
          Kéo ảnh vào bảng xếp hạng
        </span>

        <div className="space-y-1.5">
          {items.map((item) => {
            const isAssigned = assignedItemIds.has(item.id);
            const assignedEvent = events.find((ev) => ev.itemId === item.id);
            const isSelected = selectedItemId === item.id;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onClick={() => onSelectItem(item.id)}
                className={`p-2 rounded-lg border flex items-center gap-2.5 cursor-grab active:cursor-grabbing transition-all ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50/40 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-slate-50 shadow-sm'
                }`}
                title="Kéo thả vào hàng S, A, B, C, D"
              >
                <GripVertical className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />

                {/* Fixed-size visual container preserving aspect ratio */}
                <div className="w-10 h-10 rounded-md bg-slate-50 border border-gray-200 flex items-center justify-center p-1 flex-shrink-0 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain pointer-events-none"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] mt-0.5">
                    {isAssigned && assignedEvent ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tier {assignedEvent.targetTier} ({assignedEvent.startFrame}f)</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Chưa xếp</span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              Chưa có ảnh nào. Nhấp Tải ảnh để bắt đầu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
