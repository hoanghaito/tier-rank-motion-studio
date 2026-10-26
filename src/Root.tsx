import React from 'react';
import { Composition } from 'remotion';
import { TierListComposition } from './remotion/TierListComposition';
import { INITIAL_COMPOSITION_PROPS } from './data/sample-data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TierRankVideo"
        component={TierListComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={INITIAL_COMPOSITION_PROPS}
      />
    </>
  );
};
