import React, { useState } from 'react';
import { TierDefinition, TierItem, RankingEvent, TierId } from '../types/tier';
import { X, GripVertical } from 'lucide-react';

interface TierBoardProps {
  tiers: TierDefinition[];
  items: TierItem[];
  events: RankingEvent[];
  selectedItemId: string | null;
  currentFrame: number;
  onSelectItem: (itemId: string | null) => void;
  onAssignItemToTier: (itemId: string, targetTier: TierId, targetIndex?: number) => void;
  onReorderWithinTier: (itemId: string, targetTier: TierId, newIndex: number) => void;
  onUnassignItem: (itemId: string) => void;
}

export const TierBoard: React.FC<TierBoardProps> = ({
  tiers,
  items,
  events,
  selectedItemId,
  currentFrame,
  onSelectItem,
  onAssignItemToTier,
  onReorderWithinTier,
  onUnassignItem,
}) => {
  const [dragOverTier, setDragOverTier] = useState<TierId | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const itemsMap = new Map<string, TierItem>();
  items.forEach((i) => itemsMap.set(i.id, i));

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.setData('text/plain', itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, tierId: TierId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverTier !== tierId) {
      setDragOverTier(tierId);
    }
  };

  const handleDragLeave = (tierId: TierId) => {
    if (dragOverTier === tierId) {
      setDragOverTier(null);
    }
  };

  const handleDropOnTier = (e: React.DragEvent, tierId: TierId) => {
    e.preventDefault();
    setDragOverTier(null);
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    onAssignItemToTier(itemId, tierId);
    setDraggedItemId(null);
  };

  const handleDropOnItem = (e: React.DragEvent, tierId: TierId, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTier(null);
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (!itemId) return;

    onReorderWithinTier(itemId, tierId, targetIndex);
    setDraggedItemId(null);
  };

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      {tiers.map((tier) => {
        // Collect events targeting this tier
        const tierEvents = events
          .filter((ev) => ev.targetTier === tier.id)
          .sort((a, b) => a.targetIndex - b.targetIndex);

        const isOver = dragOverTier === tier.id;

        return (
          <div
            key={tier.id}
            onDragOver={(e) => handleDragOver(e, tier.id)}
            onDragLeave={() => handleDragLeave(tier.id)}
            onDrop={(e) => handleDropOnTier(e, tier.id)}
            className="flex items-stretch min-h-[92px] w-full"
          >
            {/* 1. Left Label Block: Solid colored rectangle, rounded on left corners */}
            <div
              className="w-20 flex items-center justify-center font-extrabold text-3xl text-white flex-shrink-0 rounded-l-lg font-['Outfit'] select-none shadow-sm"
              style={{ backgroundColor: tier.color }}
            >
              {tier.label}
            </div>

            {/* 2. Right Body: White background, border-gray-200, rounded-r-lg with dot grid pattern */}
            <div
              className={`flex-1 flex items-center gap-2.5 p-3 flex-wrap min-w-0 bg-white border border-gray-200 border-l-0 rounded-r-lg transition-all shadow-sm ${
                isOver ? 'ring-2 ring-blue-500 bg-blue-50/20' : ''
              }`}
              style={{
                backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
              }}
            >
              {tierEvents.map((ev, index) => {
                const item = itemsMap.get(ev.itemId);
                if (!item) return null;

                const isSelected = selectedItemId === item.id;
                const isPassed = currentFrame >= ev.startFrame;
                const isCurrentlyActive =
                  currentFrame >= ev.startFrame &&
                  currentFrame < ev.startFrame + ev.durationInFrames;

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropOnItem(e, tier.id, index)}
                    onClick={() => onSelectItem(item.id)}
                    className={`group relative w-16 h-16 rounded-lg bg-slate-50 border flex items-center justify-center cursor-grab active:cursor-grabbing p-1.5 transition-all shadow-sm ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-400 bg-blue-50/40'
                        : isCurrentlyActive
                        ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/40'
                        : 'border-gray-200 hover:border-gray-400 hover:bg-white'
                    }`}
                    title={`${item.name} (Xuất hiện ở frame ${ev.startFrame})`}
                  >
                    {/* Fixed aspect-ratio preserved image */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />

                    {/* Drag Handle Indicator */}
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition text-slate-400">
                      <GripVertical className="w-3 h-3" />
                    </div>

                    {/* Remove from Tier Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnassignItem(item.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-white border border-gray-300 text-slate-400 hover:text-white hover:bg-red-500 hover:border-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer shadow"
                      title="Xóa khỏi tier"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>

                    {/* Timeline Start Frame Badge */}
                    <div
                      className={`absolute bottom-0.5 right-0.5 text-[9px] font-mono px-1 rounded ${
                        isPassed
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-700 font-semibold'
                      }`}
                    >
                      {ev.startFrame}f
                    </div>
                  </div>
                );
              })}

              {tierEvents.length === 0 && (
                <div className="text-xs text-slate-400 italic px-2">
                  Kéo thả ảnh vào đây để xếp hạng
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
