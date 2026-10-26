import { TierDefinition, TierItem, RankingEvent, TierListCompositionProps } from '../types/tier';

export const DEFAULT_TIERS: TierDefinition[] = [
  { id: 'S', label: 'S', color: '#ef4444' },
  { id: 'A', label: 'A', color: '#f97316' },
  { id: 'B', label: 'B', color: '#eab308' },
  { id: 'C', label: 'C', color: '#22c55e' },
  { id: 'D', label: 'D', color: '#3b82f6' },
];

// Helper to generate crisp SVG data URLs with defined aspect ratios
const svgToDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

export const SAMPLE_ITEMS: TierItem[] = [
  {
    id: 'item-1',
    name: 'Square Icon (1:1)',
    aspectRatio: 1,
    imageUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <rect width="120" height="120" rx="16" fill="#0284c7" />
        <circle cx="60" cy="60" r="32" fill="#38bdf8" />
        <path d="M48 60 L56 68 L74 50" stroke="#082f49" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </svg>
    `),
  },
  {
    id: 'item-2',
    name: 'Landscape Asset (16:9)',
    aspectRatio: 16 / 9,
    imageUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90">
        <rect width="160" height="90" rx="12" fill="#8b5cf6" />
        <text x="80" y="52" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">16:9 WIDE</text>
      </svg>
    `),
  },
  {
    id: 'item-3',
    name: 'Portrait Asset (3:4)',
    aspectRatio: 3 / 4,
    imageUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="90" height="120" viewBox="0 0 90 120">
        <rect width="90" height="120" rx="14" fill="#10b981" />
        <rect x="25" y="20" width="40" height="50" rx="6" fill="#047857" />
        <text x="45" y="96" fill="#ffffff" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">PORTRAIT</text>
      </svg>
    `),
  },
  {
    id: 'item-4',
    name: 'Transparent Badge',
    aspectRatio: 1,
    imageUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#f59e0b" stroke="#b45309" stroke-width="3" />
      </svg>
    `),
  },
  {
    id: 'item-5',
    name: 'Banner Logo (2:1)',
    aspectRatio: 2,
    imageUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="160" height="80" viewBox="0 0 160 80">
        <rect width="160" height="80" rx="10" fill="#f43f5e" />
        <circle cx="40" cy="40" r="20" fill="#ffffff" />
        <text x="100" y="47" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">BANNER</text>
      </svg>
    `),
  },
  {
    id: 'item-6',
    name: 'Camera Asset',
    aspectRatio: 1,
    imageUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <rect width="120" height="120" rx="16" fill="#475569" />
        <circle cx="60" cy="62" r="26" fill="#0f172a" stroke="#94a3b8" stroke-width="4" />
        <circle cx="60" cy="62" r="14" fill="#38bdf8" />
        <rect x="42" y="24" width="36" height="10" rx="3" fill="#334155" />
      </svg>
    `),
  },
  {
    id: 'item-7',
    name: 'Microphone Asset',
    aspectRatio: 1,
    imageUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <rect width="120" height="120" rx="16" fill="#334155" />
        <rect x="46" y="26" width="28" height="46" rx="14" fill="#a855f7" />
        <path d="M36 54 C36 72 84 72 84 54" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round" fill="none" />
        <line x1="60" y1="72" x2="60" y2="92" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round" />
        <line x1="44" y1="92" x2="76" y2="92" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round" />
      </svg>
    `),
  },
];

// Default sample timeline events:
export const SAMPLE_EVENTS: RankingEvent[] = [
  {
    id: 'event-1',
    itemId: 'item-1',
    targetTier: 'S',
    targetIndex: 0,
    startFrame: 0, // 0.0s
    durationInFrames: 20, // ~0.67s
  },
  {
    id: 'event-2',
    itemId: 'item-2',
    targetTier: 'S',
    targetIndex: 1,
    startFrame: 45, // 1.5s
    durationInFrames: 20,
  },
  {
    id: 'event-3',
    itemId: 'item-3',
    targetTier: 'A',
    targetIndex: 0,
    startFrame: 90, // 3.0s
    durationInFrames: 20,
  },
  {
    id: 'event-4',
    itemId: 'item-4',
    targetTier: 'B',
    targetIndex: 0,
    startFrame: 135, // 4.5s
    durationInFrames: 20,
  },
  {
    id: 'event-5',
    itemId: 'item-5',
    targetTier: 'C',
    targetIndex: 0,
    startFrame: 180, // 6.0s
    durationInFrames: 20,
  },
];

export const INITIAL_COMPOSITION_PROPS: TierListCompositionProps = {
  title: 'TIER LIST RANKING',
  tiers: DEFAULT_TIERS,
  items: SAMPLE_ITEMS,
  events: SAMPLE_EVENTS,
  itemDisplaySize: 84,
};
