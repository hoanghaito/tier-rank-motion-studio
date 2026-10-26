import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TierListCompositionProps, TierItem } from '../types/tier';
import { TierRow } from './TierRow';

export const TierListComposition: React.FC<TierListCompositionProps> = ({
  title = 'TIER LIST RANKING',
  tiers,
  items,
  events,
  itemDisplaySize = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Map items by ID for fast lookup
  const itemsMap = new Map<string, TierItem>();
  items.forEach((item) => itemsMap.set(item.id, item));

  const currentSeconds = (frame / fps).toFixed(2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f1f5f9',
        color: '#0f172a',
        fontFamily: "'Inter', -apple-system, sans-serif",
        overflow: 'hidden',
        width,
        height,
        padding: '36px 48px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Clean Minimal Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: 14,
          marginBottom: 16,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#1e293b',
            fontFamily: "'Outfit', 'Inter', sans-serif",
          }}
        >
          {title}
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 14,
            color: '#64748b',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <span>
            TIME: <strong style={{ color: '#2563eb' }}>{currentSeconds}s</strong>
          </span>
          <span>•</span>
          <span>
            FRAME: <strong style={{ color: '#0f172a' }}>{frame}</strong>
          </span>
        </div>
      </div>

      {/* Main 5 Tier Rows (S, A, B, C, D) Stacked Cleanly */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 10, // Uniform fixed gap matching reference Image 2
          justifyContent: 'center',
        }}
      >
        {tiers.map((tier) => (
          <TierRow
            key={tier.id}
            tier={tier}
            events={events}
            itemsMap={itemsMap}
            frame={frame}
            itemDisplaySize={itemDisplaySize}
          />
        ))}
      </div>

      {/* Compact Status Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e2e8f0',
          paddingTop: 12,
          marginTop: 14,
          fontSize: 12,
          color: '#94a3b8',
        }}
      >
        <span>1920 × 1080 • 30 FPS • TIERRANK MOTION STUDIO</span>
        <span>REMOTION ENGINE</span>
      </div>
    </AbsoluteFill>
  );
};
