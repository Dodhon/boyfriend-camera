import { useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

export function useHapticFeedback(isLocked: boolean, alignmentScore: number) {
  const prevLockedRef = useRef(false);
  const lastTickTimeRef = useRef(0);

  useEffect(() => {
    // When transitioning into locked state: crisp success haptic
    if (isLocked && !prevLockedRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }

    // When transitioning out of locked state: very light warning tick
    if (!isLocked && prevLockedRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }

    prevLockedRef.current = isLocked;
  }, [isLocked]);

  useEffect(() => {
    // Near alignment (score > 0.85): trigger subtle progress ticks throttled to max once per 600ms
    const now = Date.now();
    if (!isLocked && alignmentScore > 0.85 && now - lastTickTimeRef.current > 600) {
      lastTickTimeRef.current = now;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft).catch(() => {});
    }
  }, [alignmentScore, isLocked]);
}
