import { CallbackListener, PlayerRef } from '@remotion/player';
import { useCallback, useSyncExternalStore } from 'react';

export const useCurrentPlayerFrame = (
  ref: React.RefObject<PlayerRef | null>
): number => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const player = ref.current;
      if (!player) {
        return () => undefined;
      }
      const updater: CallbackListener<'frameupdate'> = () => {
        onStoreChange();
      };
      player.addEventListener('frameupdate', updater);
      return () => {
        player.removeEventListener('frameupdate', updater);
      };
    },
    [ref]
  );

  const frame = useSyncExternalStore<number>(
    subscribe,
    () => ref.current?.getCurrentFrame() ?? 0,
    () => 0
  );

  return frame;
};
