import React, { useState } from 'react';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { Header } from './components/Header';
import { PlayerView } from './components/PlayerView';
import { AssetLibrary } from './components/AssetLibrary';
import { EventTimeline } from './components/EventTimeline';
import { INITIAL_COMPOSITION_PROPS, SAMPLE_ITEMS, SAMPLE_EVENTS } from './data/sample-data';
import { TierListCompositionProps, TierId, TierItem, RankingEvent } from './types/tier';

export const App: React.FC = () => {
  const [compositionProps, setCompositionProps] = useState<TierListCompositionProps>(
    INITIAL_COMPOSITION_PROPS
  );
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTriggerSignal, setPlayTriggerSignal] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [jumpSignal, setJumpSignal] = useState<{ frame: number; timestamp: number } | null>(null);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('overview');
  const [rightPanelTab, setRightPanelTab] = useState<'timeline' | 'assets'>('timeline');

  const fps = 30;
  const durationInFrames = 300; // 10 seconds at 30 fps
  const width = 1920;
  const height = 1080;

  // Sync sidebar tab selection with right panel when appropriate
  const handleSelectSidebarTab = (tab: SidebarTab) => {
    setSidebarTab(tab);
    if (tab === 'assets') {
      setRightPanelTab('assets');
    } else if (tab === 'timeline') {
      setRightPanelTab('timeline');
    }
  };

  // Toggle play/pause via playTriggerSignal
  const handleTogglePlay = () => {
    setPlayTriggerSignal((prev) => prev + 1);
  };

  // Assign or move item to a tier
  const handleAssignItemToTier = (
    itemId: string,
    targetTier: TierId,
    targetIndex?: number
  ) => {
    setCompositionProps((prev) => {
      const existingEventsInTier = prev.events.filter((e) => e.targetTier === targetTier);
      const computedIndex =
        targetIndex !== undefined ? targetIndex : existingEventsInTier.length;

      const existingEventIndex = prev.events.findIndex((e) => e.itemId === itemId);

      let newEvents: RankingEvent[];
      if (existingEventIndex >= 0) {
        newEvents = prev.events.map((e, idx) =>
          idx === existingEventIndex
            ? { ...e, targetTier, targetIndex: computedIndex }
            : e
        );
      } else {
        const newEvent: RankingEvent = {
          id: `event-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          itemId,
          targetTier,
          targetIndex: computedIndex,
          startFrame: currentFrame,
          durationInFrames: 20,
        };
        newEvents = [...prev.events, newEvent];
      }

      return {
        ...prev,
        events: newEvents,
      };
    });
  };

  // Reorder items within the same tier
  const handleReorderWithinTier = (
    itemId: string,
    targetTier: TierId,
    newIndex: number
  ) => {
    setCompositionProps((prev) => {
      const tierEvents = prev.events
        .filter((e) => e.targetTier === targetTier)
        .sort((a, b) => a.targetIndex - b.targetIndex);

      const movingEventIndex = tierEvents.findIndex((e) => e.itemId === itemId);
      if (movingEventIndex < 0) return prev;

      const [movingEvent] = tierEvents.splice(movingEventIndex, 1);
      tierEvents.splice(newIndex, 0, movingEvent);

      const updatedTierEvents = tierEvents.map((e, idx) => ({
        ...e,
        targetIndex: idx,
      }));

      const newEvents = prev.events.map((e) => {
        if (e.targetTier === targetTier) {
          const updated = updatedTierEvents.find((u) => u.id === e.id);
          return updated || e;
        }
        return e;
      });

      return {
        ...prev,
        events: newEvents,
      };
    });
  };

  // Unassign item from tier
  const handleUnassignItem = (itemId: string) => {
    setCompositionProps((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.itemId !== itemId),
    }));
  };

  // Upload new images
  const handleUploadImages = (newItems: TierItem[]) => {
    setCompositionProps((prev) => ({
      ...prev,
      items: [...prev.items, ...newItems],
    }));
  };

  // Delete item from library and remove associated events
  const handleDeleteItem = (itemId: string) => {
    setCompositionProps((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
      events: prev.events.filter((e) => e.itemId !== itemId),
    }));
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    }
  };

  // Reset to initial sample items and events
  const handleResetSamples = () => {
    setCompositionProps((prev) => ({
      ...prev,
      items: SAMPLE_ITEMS,
      events: SAMPLE_EVENTS,
    }));
  };

  // Update event timing or tier
  const handleUpdateEvent = (updatedEvent: RankingEvent) => {
    setCompositionProps((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    }));
  };

  // Delete event
  const handleDeleteEvent = (eventId: string) => {
    setCompositionProps((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== eventId),
    }));
  };

  // Auto-space events at fixed interval (e.g. 1.5s = 45 frames)
  const handleAutoSpaceEvents = (intervalSeconds: number) => {
    const intervalFrames = Math.round(intervalSeconds * fps);
    setCompositionProps((prev) => {
      const sorted = [...prev.events].sort((a, b) => a.startFrame - b.startFrame);
      const spaced = sorted.map((ev, index) => ({
        ...ev,
        startFrame: index * intervalFrames,
      }));
      return {
        ...prev,
        events: spaced,
      };
    });
  };

  const handleSeekToFrame = (frame: number) => {
    setJumpSignal({ frame, timestamp: Date.now() });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      {/* 1. Fixed Left Sidebar (250px) with clean white theme */}
      <Sidebar
        activeTab={sidebarTab}
        onSelectTab={handleSelectSidebarTab}
        assetCount={compositionProps.items.length}
        eventCount={compositionProps.events.length}
      />

      {/* 2. Main Container with Top Header and 2-column Grid Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top White Header */}
        <Header
          title={compositionProps.title}
          onUpdateTitle={(title) => setCompositionProps((prev) => ({ ...prev, title }))}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
        />

        {/* Workspace: CSS Grid (Main 1fr, Right Panel 350px) */}
        <div className="flex-1 grid grid-cols-[1fr_350px] overflow-hidden bg-slate-50 min-h-0">
          {/* Main 1fr Workspace: Contains TierBoard or PlayerView and Controls */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <PlayerView
              compositionProps={compositionProps}
              fps={fps}
              durationInFrames={durationInFrames}
              width={width}
              height={height}
              currentFrame={currentFrame}
              onFrameUpdate={setCurrentFrame}
              jumpToFrameSignal={jumpSignal}
              playTriggerSignal={playTriggerSignal}
              isPlaying={isPlaying}
              onPlayStateChange={setIsPlaying}
              selectedItemId={selectedItemId}
              onSelectItem={setSelectedItemId}
              onAssignItemToTier={handleAssignItemToTier}
              onReorderWithinTier={handleReorderWithinTier}
              onUnassignItem={handleUnassignItem}
            />
          </div>

          {/* Right Panel 350px: Cards for Timeline or Assets */}
          <aside className="w-[350px] h-full p-4 pl-0 flex flex-col gap-3 overflow-hidden select-none">
            {/* Tab switch between Timeline and Asset Library */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-1 flex items-center gap-1">
              <button
                onClick={() => setRightPanelTab('timeline')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                  rightPanelTab === 'timeline'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Timeline sự kiện ({compositionProps.events.length})
              </button>
              <button
                onClick={() => setRightPanelTab('assets')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                  rightPanelTab === 'assets'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Kho ảnh Assets ({compositionProps.items.length})
              </button>
            </div>

            {/* Active Card in Right Panel */}
            <div className="flex-1 min-h-0">
              {rightPanelTab === 'timeline' ? (
                <EventTimeline
                  events={compositionProps.events}
                  items={compositionProps.items}
                  tiers={compositionProps.tiers}
                  currentFrame={currentFrame}
                  fps={fps}
                  onUpdateEvent={handleUpdateEvent}
                  onDeleteEvent={handleDeleteEvent}
                  onSeekToFrame={handleSeekToFrame}
                  onAutoSpaceEvents={handleAutoSpaceEvents}
                />
              ) : (
                <AssetLibrary
                  items={compositionProps.items}
                  events={compositionProps.events}
                  selectedItemId={selectedItemId}
                  onSelectItem={setSelectedItemId}
                  onUploadImages={handleUploadImages}
                  onDeleteItem={handleDeleteItem}
                  onResetSamples={handleResetSamples}
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;
