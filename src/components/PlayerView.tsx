import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Maximize2,
  Gauge,
  LayoutGrid,
  Film,
  Columns,
  Expand,
} from 'lucide-react';
import { TierListComposition } from '../remotion/TierListComposition';
import { TierListCompositionProps, TierId } from '../types/tier';
import { TierBoard } from './TierBoard';

interface PlayerViewProps {
  compositionProps: TierListCompositionProps;
  fps: number;
  durationInFrames: number;
  width: number;
  height: number;
  currentFrame: number;
  onFrameUpdate: (frame: number) => void;
  jumpToFrameSignal?: { frame: number; timestamp: number } | null;
  playTriggerSignal?: number;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  selectedItemId: string | null;
  onSelectItem: (itemId: string | null) => void;
  onAssignItemToTier: (itemId: string, targetTier: TierId, targetIndex?: number) => void;
  onReorderWithinTier: (itemId: string, targetTier: TierId, newIndex: number) => void;
  onUnassignItem: (itemId: string) => void;
}

export type ViewMode = 'preview' | 'board' | 'split';

export const PlayerView: React.FC<PlayerViewProps> = ({
  compositionProps,
  fps,
  durationInFrames,
  width,
  height,
  currentFrame: externalCurrentFrame,
  onFrameUpdate,
  jumpToFrameSignal,
  playTriggerSignal,
  onPlayStateChange,
  selectedItemId,
  onSelectItem,
  onAssignItemToTier,
  onReorderWithinTier,
  onUnassignItem,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Default to 'preview' so user immediately sees the video canvas and playback
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [activeFrame, setActiveFrame] = useState(externalCurrentFrame);

  // Synchronize when external frame changes and not currently playing
  useEffect(() => {
    if (!isPlaying) {
      setActiveFrame(externalCurrentFrame);
    }
  }, [externalCurrentFrame, isPlaying]);

  // Bind player events for reliable frame tracking, play/pause state
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameUpdateListener = (e: { detail: { frame: number } }) => {
      const f = Math.round(e.detail.frame);
      setActiveFrame(f);
      onFrameUpdate(f);
    };

    const onPlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
    };

    const onPause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    const onEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
    };

    player.addEventListener('frameupdate', onFrameUpdateListener);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);
    player.addEventListener('ended', onEnded);

    return () => {
      player.removeEventListener('frameupdate', onFrameUpdateListener);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
      player.removeEventListener('ended', onEnded);
    };
  }, [onFrameUpdate, onPlayStateChange]);

  // Toggle play/pause handler
  const togglePlayPause = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (player.isPlaying()) {
      player.pause();
    } else {
      if (viewMode === 'board') {
        setViewMode('preview');
      }
      // If at end of video, loop back to start
      if (player.getCurrentFrame() >= durationInFrames - 1) {
        player.seekTo(0);
        setActiveFrame(0);
        onFrameUpdate(0);
      }
      player.play();
    }
  }, [viewMode, durationInFrames, onFrameUpdate]);

  // Handle external playTriggerSignal (from Top Header button or keyboard)
  useEffect(() => {
    if (playTriggerSignal !== undefined && playTriggerSignal > 0) {
      togglePlayPause();
    }
  }, [playTriggerSignal, togglePlayPause]);

  // Jump to frame when signaled externally (from Timeline seek button or asset click)
  useEffect(() => {
    if (jumpToFrameSignal) {
      const clamped = Math.max(0, Math.min(durationInFrames - 1, jumpToFrameSignal.frame));
      setActiveFrame(clamped);
      onFrameUpdate(clamped);
      playerRef.current?.seekTo(clamped);
    }
  }, [jumpToFrameSignal, durationInFrames, onFrameUpdate]);

  const seekToFrame = useCallback(
    (frame: number) => {
      const clamped = Math.max(0, Math.min(durationInFrames - 1, frame));
      setActiveFrame(clamped);
      onFrameUpdate(clamped);
      playerRef.current?.seekTo(clamped);
    },
    [durationInFrames, onFrameUpdate]
  );

  const stepFrames = useCallback(
    (delta: number) => {
      seekToFrame(activeFrame + delta);
    },
    [activeFrame, seekToFrame]
  );

  // Global hotkeys (Space to toggle, Left/Right arrow to step)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepFrames(-1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFrames(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stepFrames, togglePlayPause]);

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    seekToFrame(val);
  };

  const handleToggleMute = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isMuted) {
      player.unmute();
      player.setVolume(volume > 0 ? volume : 1);
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
      playerRef.current?.mute();
    } else {
      setIsMuted(false);
      playerRef.current?.unmute();
      playerRef.current?.setVolume(val);
    }
  };

  // Fullscreen trigger
  const handleFullscreen = useCallback(() => {
    const player = playerRef.current;
    if (player) {
      try {
        player.requestFullscreen();
        return;
      } catch (err) {
        console.warn('Player requestFullscreen fallback to container', err);
      }
    }
    if (playerContainerRef.current?.requestFullscreen) {
      playerContainerRef.current.requestFullscreen();
    }
  }, []);

  // Time formatting
  const formatTime = (frame: number) => {
    const totalSecs = frame / fps;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const millis = Math.floor((totalSecs % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const currentSeconds = formatTime(activeFrame);
  const totalSeconds = formatTime(durationInFrames);
  const progressPercent = (activeFrame / (durationInFrames - 1)) * 100;

  return (
    <div className="flex-1 h-full flex flex-col gap-4 overflow-hidden select-none p-4">
      {/* Top Card: Workspace Mode Switcher (Divided evenly into 3 equal tabs) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-1.5 flex-shrink-0">
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg border border-gray-200">
          <button
            onClick={() => setViewMode('preview')}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Preview (Remotion)</span>
          </button>

          <button
            onClick={() => setViewMode('board')}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              viewMode === 'board'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Bảng kéo thả (Tier Board)</span>
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Chia đôi (Split)</span>
          </button>
        </div>
      </div>

      {/* Main Center Content Area (Remotion Player is ALWAYS kept mounted so playback never breaks) */}
      <div className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        {/* Container for Player: Always in DOM */}
        <div
          ref={playerContainerRef}
          className={`flex-1 relative min-h-0 bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 ${
            viewMode === 'preview'
              ? 'flex items-center justify-center'
              : viewMode === 'split'
              ? 'h-[46%] flex items-center justify-center mb-3'
              : 'hidden'
          }`}
        >
          <div className="w-full max-w-[1100px] aspect-video max-h-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-slate-100 relative flex items-center justify-center">
            {/* Overlay Fullscreen Button directly on Canvas */}
            <button
              onClick={handleFullscreen}
              className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-blue-600 shadow-md border border-gray-200/80 backdrop-blur-sm transition cursor-pointer"
              title="Phóng to toàn màn hình"
            >
              <Expand className="w-4 h-4" />
            </button>

            <Player
              ref={playerRef}
              component={TierListComposition}
              inputProps={compositionProps}
              durationInFrames={durationInFrames}
              compositionWidth={width}
              compositionHeight={height}
              fps={fps}
              playbackRate={playbackRate}
              controls={false}
              allowFullscreen
              clickToPlay
              doubleClickToFullscreen
              spaceKeyToPlayOrPause
              loop
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>

        {/* Container for TierBoard */}
        <div
          className={`bg-white rounded-xl shadow-sm border border-gray-200/80 p-4 overflow-y-auto ${
            viewMode === 'board'
              ? 'flex-1 min-h-0'
              : viewMode === 'split'
              ? 'flex-1 min-h-0'
              : 'hidden'
          }`}
        >
          <TierBoard
            tiers={compositionProps.tiers}
            items={compositionProps.items}
            events={compositionProps.events}
            selectedItemId={selectedItemId}
            currentFrame={activeFrame}
            onSelectItem={onSelectItem}
            onAssignItemToTier={onAssignItemToTier}
            onReorderWithinTier={onReorderWithinTier}
            onUnassignItem={onUnassignItem}
          />
        </div>
      </div>

      {/* Persistent Playback & Scrubber Controls Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 px-5 py-3.5 flex flex-col gap-2.5 z-20 flex-shrink-0">
        {/* Scrubber Progress Bar - smoothly advances frame by frame during playback */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-blue-600 font-bold w-16 text-right">
            {currentSeconds}
          </span>

          <div className="flex-1 relative flex items-center group">
            {/* Background Track */}
            <div className="w-full h-2 rounded-full bg-slate-100 border border-gray-200 overflow-hidden relative pointer-events-none">
              <div
                className="h-full bg-blue-600 transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Range Input for Scrubbing */}
            <input
              type="range"
              min={0}
              max={durationInFrames - 1}
              value={activeFrame}
              onChange={handleScrubberChange}
              onMouseDown={() => setIsScrubbing(true)}
              onMouseUp={() => setIsScrubbing(false)}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 -top-1.5"
            />

            {/* Playhead Handle */}
            <div
              className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow border-2 border-blue-600 pointer-events-none -translate-x-1/2 transition-transform ${
                isScrubbing ? 'scale-125' : 'group-hover:scale-110'
              }`}
              style={{ left: `${progressPercent}%` }}
            />
          </div>

          <span className="font-mono text-xs text-slate-400 w-16">
            {totalSeconds}
          </span>
        </div>

        {/* Buttons and Tools Row */}
        <div className="flex items-center justify-between">
          {/* Frame Jump & Step controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => seekToFrame(0)}
              title="Về đầu video (Frame 0)"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => stepFrames(-fps)}
              title="Lùi 1 giây (30 frames)"
              className="px-2 py-1 rounded-lg text-[11px] font-mono text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer font-medium border border-gray-200"
            >
              -1s
            </button>

            <button
              onClick={() => stepFrames(-1)}
              title="Lùi 1 frame (Mũi tên trái)"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Play / Pause Central Button */}
            <button
              onClick={togglePlayPause}
              title={isPlaying ? 'Tạm dừng (Phím Space)' : 'Phát video (Phím Space)'}
              className={`mx-1 w-9 h-9 rounded-xl flex items-center justify-center transition cursor-pointer shadow-sm ${
                isPlaying
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => stepFrames(1)}
              title="Tiến 1 frame (Mũi tên phải)"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => stepFrames(fps)}
              title="Tiến 1 giây (30 frames)"
              className="px-2 py-1 rounded-lg text-[11px] font-mono text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer font-medium border border-gray-200"
            >
              +1s
            </button>

            <button
              onClick={() => seekToFrame(durationInFrames - 1)}
              title="Đến cuối video"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Frame Counter Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-gray-200 px-3 py-1 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Frame</span>
            <span className="font-mono text-xs font-bold text-blue-600">
              {activeFrame}
            </span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-xs text-slate-500">
              {durationInFrames}
            </span>
          </div>

          {/* Speed, Volume, Fullscreen */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Gauge className="w-3.5 h-3.5" />
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="bg-slate-50 border border-gray-200 text-xs text-slate-700 rounded-md px-1.5 py-1 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1.0x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2.0x</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleMute}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : (
                  <Volume2 className="w-4 h-4 text-slate-600" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1.5 rounded bg-slate-200 accent-blue-600 cursor-pointer"
              />
            </div>

            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 transition cursor-pointer shadow-sm"
              title="Toàn màn hình (Fullscreen)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
