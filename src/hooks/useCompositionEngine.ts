import { useEffect, useState, useRef } from 'react';
import {
  CompositionFeedback,
  DeviceAttitude,
  DirectionalBadgeType,
  ShotArchetype,
} from '../types/camera';

interface CompositionEngineProps {
  attitude: DeviceAttitude;
  archetype: ShotArchetype;
  autoSnapEnabled: boolean;
  onAutoSnapTrigger?: () => void;
}

const AUTO_SNAP_LOCK_TIME_MS = 500; // 0.5s of continuous lock required

export function useCompositionEngine({
  attitude,
  archetype,
  autoSnapEnabled,
  onAutoSnapTrigger,
}: CompositionEngineProps): CompositionFeedback {
  const [feedback, setFeedback] = useState<CompositionFeedback>({
    score: 0,
    isLocked: false,
    isLevel: false,
    primaryBadge: 'tilt-up',
    primaryBadgeText: 'Adjust Angle',
    detailedTips: [],
    autoSnapProgress: 0,
  });

  const lockStartTimeRef = useRef<number | null>(null);
  const hasTriggeredSnapRef = useRef(false);

  useEffect(() => {
    const { pitchErrorDeg, rollErrorDeg, isLevel } = attitude;

    // Calculate normalized pitch score (1.0 = perfect target angle)
    const maxPitchErr = archetype.pitchToleranceDeg * 2.5;
    const pitchRatio = Math.max(0, 1 - Math.abs(pitchErrorDeg) / maxPitchErr);

    // Calculate normalized roll score (1.0 = perfect horizon level)
    const maxRollErr = archetype.rollToleranceDeg * 2.5;
    const rollRatio = Math.max(0, 1 - Math.abs(rollErrorDeg) / maxRollErr);

    // Composite alignment score (weighted 50% pitch, 50% roll)
    const rawScore = pitchRatio * 0.5 + rollRatio * 0.5;
    const score = Math.round(rawScore * 100) / 100;

    const isLocked = isLevel;

    // Determine primary directional guidance badge
    let badgeType: DirectionalBadgeType = 'perfect-lock';
    let badgeText = '✨ TARGET LOCKED • HOLD STEADY';
    const tips: string[] = [];

    if (isLocked) {
      badgeType = 'perfect-lock';
      badgeText = '✨ TARGET LOCKED • READY TO SNAP';
      tips.push('Angle is perfect! Keep framing steady.');
    } else if (Math.abs(rollErrorDeg) > archetype.rollToleranceDeg) {
      badgeType = 'level-horizon';
      const dir = rollErrorDeg > 0 ? 'LEFT ↺' : 'RIGHT ↻';
      badgeText = `ROTATE PHONE ${dir} (${Math.abs(rollErrorDeg)}°)`;
      tips.push('Level the horizon line to eliminate tilted shots.');
    } else if (pitchErrorDeg < -archetype.pitchToleranceDeg) {
      badgeType = 'tilt-up';
      const deg = Math.abs(Math.round(pitchErrorDeg));
      badgeText = `TILT TOP BACK ↑ (${deg}°)`;
      tips.push(archetype.heightHint);
      tips.push(archetype.proTip);
    } else if (pitchErrorDeg > archetype.pitchToleranceDeg) {
      badgeType = 'tilt-down';
      const deg = Math.round(pitchErrorDeg);
      badgeText = `TILT TOP FORWARD ↓ (${deg}°)`;
      tips.push(archetype.heightHint);
      tips.push(archetype.proTip);
    }

    // Auto-snap progress calculation
    let autoSnapProgress = 0;
    const now = Date.now();

    if (isLocked && autoSnapEnabled) {
      if (lockStartTimeRef.current === null) {
        lockStartTimeRef.current = now;
      }
      const elapsed = now - lockStartTimeRef.current;
      autoSnapProgress = Math.min(1.0, elapsed / AUTO_SNAP_LOCK_TIME_MS);

      if (autoSnapProgress >= 1.0 && !hasTriggeredSnapRef.current) {
        hasTriggeredSnapRef.current = true;
        if (onAutoSnapTrigger) {
          onAutoSnapTrigger();
        }
      }
    } else {
      lockStartTimeRef.current = null;
      hasTriggeredSnapRef.current = false;
      autoSnapProgress = 0;
    }

    setFeedback({
      score,
      isLocked,
      isLevel,
      primaryBadge: badgeType,
      primaryBadgeText: badgeText,
      detailedTips: tips,
      autoSnapProgress,
    });
  }, [attitude, archetype, autoSnapEnabled, onAutoSnapTrigger]);

  return feedback;
}
