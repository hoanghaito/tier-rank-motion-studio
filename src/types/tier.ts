export type TierId = 'S' | 'A' | 'B' | 'C' | 'D';

export interface TierDefinition {
  id: TierId;
  label: string;
  color: string;
}

export interface TierItem {
  id: string;
  name: string;
  imageUrl: string;
  aspectRatio?: number;
}

export interface RankingEvent {
  id: string;
  itemId: string;
  targetTier: TierId;
  targetIndex: number;
  startFrame: number;
  durationInFrames: number;
}

export interface TierListCompositionProps extends Record<string, unknown> {
  title: string;
  tiers: TierDefinition[];
  items: TierItem[];
  events: RankingEvent[];
  itemDisplaySize?: number;
}
