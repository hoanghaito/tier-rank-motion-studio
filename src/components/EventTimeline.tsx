import React from 'react';
import { RankingEvent, TierItem, TierDefinition, TierId } from '../types/tier';
import {
  Clock,
  Play,
  Trash2,
  MapPin,
  Calendar,
} from 'lucide-react';

interface EventTimelineProps {
  events: RankingEvent[];
  items: TierItem[];
  tiers: TierDefinition[];
  currentFrame: number;
  fps: number;
  onUpdateEvent: (updatedEvent: RankingEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onSeekToFrame: (frame: number) => void;
  onAutoSpaceEvents: (intervalSeconds: number) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  items,
  tiers,
  currentFrame,
  fps,
  onUpdateEvent,
  onDeleteEvent,
  onSeekToFrame,
  onAutoSpaceEvents,
}) => {
  const itemsMap = new Map<string, TierItem>();
  items.forEach((item) => itemsMap.set(item.id, item));

  // Sort events chronologically by startFrame
  const sortedEvents = [...events].sort((a, b) => a.startFrame - b.startFrame);

  const formatTime = (frame: number) => {
    const sec = frame / fps;
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 flex flex-col h-full overflow-hidden select-none">
      {/* Card Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-wide font-['Outfit'] flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Timeline sự kiện</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {events.length} mốc xuất hiện theo frame
          </p>
        </div>

        {/* Auto-space 1.5s button */}
        <button
          onClick={() => onAutoSpaceEvents(1.5)}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 transition cursor-pointer flex items-center gap-1.5 font-medium shadow-sm"
          title="Chia đều các sự kiện cách nhau 1.5 giây (45 frames)"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Cách 1.5s</span>
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {sortedEvents.map((ev) => {
          const item = itemsMap.get(ev.itemId);
          if (!item) return null;

          const tier = tiers.find((t) => t.id === ev.targetTier);
          const isCurrent =
            currentFrame >= ev.startFrame &&
            currentFrame < ev.startFrame + ev.durationInFrames;
          const isPassed = currentFrame >= ev.startFrame + ev.durationInFrames;

          return (
            <div
              key={ev.id}
              className={`p-3 rounded-lg border transition-all ${
                isCurrent
                  ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-1 ring-amber-300'
                  : isPassed
                  ? 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                  : 'border-gray-200/80 bg-slate-50/70 opacity-90'
              }`}
            >
              {/* Event Title Row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Fixed-size image thumbnail */}
                  <div className="w-8 h-8 rounded bg-slate-100 border border-gray-200 flex items-center justify-center p-0.5 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {item.name}
                  </span>
                </div>

                {/* Target Tier Selector */}
                <select
                  value={ev.targetTier}
                  onChange={(e) =>
                    onUpdateEvent({
                      ...ev,
                      targetTier: e.target.value as TierId,
                    })
                  }
                  className="text-xs font-bold px-2 py-0.5 rounded border border-gray-300 bg-white text-slate-800 cursor-pointer shadow-sm"
                  style={{ color: tier?.color }}
                >
                  {tiers.map((t) => (
                    <option key={t.id} value={t.id}>
                      Tier {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timing Controls Row */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <label className="text-slate-500 block mb-0.5 text-[10px] font-semibold uppercase">
                    Start Frame
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      value={ev.startFrame}
                      onChange={(e) =>
                        onUpdateEvent({
                          ...ev,
                          startFrame: Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                      }
                      className="w-16 px-1.5 py-1 rounded bg-slate-50 border border-gray-200 text-xs font-mono font-bold text-blue-600 text-center"
                    />
                    <span className="text-slate-400 font-mono text-[11px]">
                      {formatTime(ev.startFrame)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 block mb-0.5 text-[10px] font-semibold uppercase">
                    Duration
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={5}
                      max={120}
                      value={ev.durationInFrames}
                      onChange={(e) =>
                        onUpdateEvent({
                          ...ev,
                          durationInFrames: Math.max(5, parseInt(e.target.value, 10) || 20),
                        })
                      }
                      className="w-14 px-1.5 py-1 rounded bg-slate-50 border border-gray-200 text-xs font-mono text-slate-700 text-center"
                    />
                    <span className="text-slate-400 text-[11px]">frames</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 text-xs">
                <button
                  onClick={() => onSeekToFrame(ev.startFrame)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer font-medium"
                  title="Tua đến frame này"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Tua ({ev.startFrame}f)</span>
                </button>

                <button
                  onClick={() =>
                    onUpdateEvent({
                      ...ev,
                      startFrame: currentFrame,
                    })
                  }
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  title="Gán frame bắt đầu bằng playhead hiện tại"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Gán playhead</span>
                </button>

                <button
                  onClick={() => onDeleteEvent(ev.id)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                  title="Xóa sự kiện"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {sortedEvents.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            Chưa có sự kiện nào. Hãy kéo ảnh vào hàng S, A, B, C, D để tạo sự kiện.
          </div>
        )}
      </div>
    </div>
  );
};
