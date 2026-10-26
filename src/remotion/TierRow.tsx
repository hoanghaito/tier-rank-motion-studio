import React from 'react';
import { interpolate, Easing } from 'remotion';
import { TierDefinition, TierItem, RankingEvent } from '../types/tier';

interface TierRowProps {
  tier: TierDefinition;
  events: RankingEvent[];
  itemsMap: Map<string, TierItem>;
  frame: number;
  itemDisplaySize?: number;
}

export const TierRow: React.FC<TierRowProps> = ({
  tier,
  events,
  itemsMap,
  frame,
  itemDisplaySize = 80,
}) => {
  // Filter events belonging to this tier and sort by targetIndex
  const tierEvents = events
    .filter((ev) => ev.targetTier === tier.id)
    .sort((a, b) => a.targetIndex - b.targetIndex);

  // Check if an item is currently entering this tier
  const isTierActive = tierEvents.some(
    (ev) => frame >= ev.startFrame && frame < ev.startFrame + ev.durationInFrames
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 110,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Left Label Block: Solid colored rectangle, rounded on left corners */}
      <div
        style={{
          width: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: tier.color,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          flexShrink: 0,
          userSelect: 'none',
          boxShadow: isTierActive ? `0 0 16px ${tier.color}44` : 'none',
        }}
      >
        <span
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1,
            fontFamily: "'Outfit', 'Inter', sans-serif",
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* 2. Right Body: Pure white background, gray-200 border, rounded on right corners with dot grid pattern */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 20px',
          backgroundColor: '#ffffff',
          border: isTierActive ? `2px solid ${tier.color}` : '1px solid #e2e8f0',
          borderLeft: 'none', // seamlessly connect with left label
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
          backgroundSize: '16px 16px',
          flexWrap: 'wrap',
          alignContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        {tierEvents.map((ev: RankingEvent) => {
          const item = itemsMap.get(ev.itemId);
          if (!item) return null;

          // Hidden before startFrame
          if (frame < ev.startFrame) {
            return null;
          }

          const isAnimating =
            frame >= ev.startFrame && frame < ev.startFrame + ev.durationInFrames;

          let progress = 1;
          if (isAnimating) {
            progress = interpolate(
              frame,
              [ev.startFrame, ev.startFrame + ev.durationInFrames],
              [0, 1],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              }
            );
          }

          const scale = isAnimating
            ? interpolate(progress, [0, 0.6, 1], [0.4, 1.06, 1])
            : 1;

          const opacity = isAnimating
            ? interpolate(progress, [0, 0.25], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 1;

          const translateY = isAnimating
            ? interpolate(progress, [0, 1], [24, 0])
            : 0;

          return (
            <div
              key={item.id}
              style={{
                width: itemDisplaySize,
                height: itemDisplaySize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: 8,
                border: isAnimating ? `2px solid ${tier.color}` : '1px solid #cbd5e1',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                padding: 6,
                boxSizing: 'border-box',
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                flexShrink: 0,
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  margin: 'auto',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
