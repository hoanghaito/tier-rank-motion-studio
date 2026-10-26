import React from 'react';
import {
  LayoutDashboard,
  Images,
  Layers,
  Clock,
  Film,
  Sparkles,
} from 'lucide-react';

export type SidebarTab = 'overview' | 'assets' | 'tiers' | 'timeline';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  assetCount: number;
  eventCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  assetCount,
  eventCount,
}) => {
  return (
    <aside className="w-[250px] h-full bg-white text-slate-800 border-r border-gray-200 flex flex-col justify-between flex-shrink-0 select-none shadow-xs z-30">
      <div>
        {/* Brand Header: Clean white with highlighted logo frame */}
        <div className="h-16 px-5 border-b border-gray-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide font-['Outfit'] block leading-none text-slate-900">
              TierRank
            </span>
            <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-1 block">
              Motion Studio
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="p-4 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
              Menu chính
            </span>
            <nav className="space-y-1">
              <button
                onClick={() => onSelectTab('overview')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-4 h-4 ${activeTab === 'overview' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Tổng quan</span>
                </div>
              </button>

              <button
                onClick={() => onSelectTab('assets')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeTab === 'assets'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Images className={`w-4 h-4 ${activeTab === 'assets' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Quản lý Assets</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    activeTab === 'assets'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-gray-200'
                  }`}
                >
                  {assetCount}
                </span>
              </button>

              <button
                onClick={() => onSelectTab('tiers')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeTab === 'tiers'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className={`w-4 h-4 ${activeTab === 'tiers' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Cấu hình Tier</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-gray-200 font-mono">
                  5 Tiers
                </span>
              </button>

              <button
                onClick={() => onSelectTab('timeline')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${activeTab === 'timeline' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>Timeline sự kiện</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                    activeTab === 'timeline'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 border border-gray-200'
                  }`}
                >
                  {eventCount}
                </span>
              </button>
            </nav>
          </div>

          {/* Quick Specs */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
              Thông số render
            </span>
            <div className="px-3.5 py-3 rounded-xl bg-slate-50 border border-gray-200/80 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Độ phân giải:</span>
                <span className="font-mono font-bold text-slate-800">1920 × 1080</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Frame rate:</span>
                <span className="font-mono font-bold text-blue-600">30 FPS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Thời lượng:</span>
                <span className="font-mono font-bold text-slate-800">10.0s (300f)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 text-xs text-slate-500 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Remotion v4.0</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-gray-200 font-mono text-slate-600">
          Studio v1.0
        </span>
      </div>
    </aside>
  );
};
