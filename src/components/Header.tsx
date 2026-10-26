import React from 'react';
import {
  Play,
  Pause,
  Download,
} from 'lucide-react';

interface HeaderProps {
  title: string;
  onUpdateTitle: (title: string) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onUpdateTitle,
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between select-none z-20">
      {/* Left: Breadcrumbs & Project Title */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Dự án
        </span>
        <span className="text-slate-300">/</span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="text-base font-bold text-slate-800 hover:bg-slate-50 focus:bg-slate-50 border border-transparent focus:border-blue-400 rounded-lg px-2 py-1 focus:outline-none transition font-['Outfit']"
            title="Nhấp để đổi tên dự án"
          />
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Quick Play/Pause button */}
        <button
          onClick={onTogglePlay}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border shadow-sm ${
            isPlaying
              ? 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600'
              : 'bg-white border-gray-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Tạm dừng</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
              <span>Xem trước</span>
            </>
          )}
        </button>

        {/* Export / Render Video Button */}
        <button
          onClick={() => {
            alert('Để render video MP4 chất lượng cao, bạn có thể chạy: npx remotion render TierRankVideo out/video.mp4');
          }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất Video</span>
        </button>
      </div>
    </header>
  );
};
