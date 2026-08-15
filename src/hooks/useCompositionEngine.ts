import { useEffect, useState, useRef } from 'react';
import {
  CompositionFeedback,
  DeviceAttitude,
  DirectionalBadgeType,
  SeverityTier,
  ShotArchetype,
} from '../types/camera';

interface CompositionEngineProps {
  attitude: DeviceAttitude;
  archetype: ShotArchetype;
  autoSnapEnabled: boolean;
  onAutoSnapTrigger?: () => void;
}

const AUTO_SNAP_LOCK_TIME_MS = 500;

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
    severity: 'moderate',
    primaryBadge: 'tilt-up',
    primaryBadgeText: '',
    detailedTips: [],
    autoSnapProgress: 0,
  });

  const lockStartTimeRef = useRef<number | null>(null);
  const hasTriggeredSnapRef = useRef(false);

  useEffect(() => {
    const { pitchErrorDeg, rollErrorDeg, isLevel } = attitude;

    // Pitch score calculation
    const maxPitchErr = archetype.pitchToleranceDeg * 2.5;
    const pitchRatio = Math.max(0, 1 - Math.abs(pitchErrorDeg) / maxPitchErr);

    // Roll score calculation
    const maxRollErr = archetype.rollToleranceDeg * 2.5;
    const rollRatio = Math.max(0, 1 - Math.abs(rollErrorDeg) / maxRollErr);

    const rawScore = pitchRatio * 0.5 + rollRatio * 0.5;
    const score = Math.round(rawScore * 100) / 100;

    const isLocked = isLevel;

    // Compute Severity Tier:
    // 'perfect': locked in the zone -> HUD disappears
    // 'minor': slightly off -> subtle quiet pill
    // 'moderate': standard guidance -> normal HUD
    // 'severe': big mistake (bad tilt, crooked horizon) -> loud high-contrast warning
    let severity: SeverityTier = 'moderate';
    if (isLocked) {
      severity = 'perfect';
    } else if (score >= 0.80) {
      severity = 'minor';
    } else if (Math.abs(rollErrorDeg) > 8 || Math.abs(pitchErrorDeg) > 12 || score < 0.45) {
      severity = 'severe';
    } else {
      severity = 'moderate';
    }

    let badgeType: DirectionalBadgeType = 'perfect-lock';
    let badgeText = '';
    const tips: string[] = [];

    if (severity === 'perfect') {
      badgeType = 'perfect-lock';
      badgeText = '✨ PERFECT • HOLD STILL';
      tips.push('Framing is flawless.');
    } else if (Math.abs(rollErrorDeg) > archetype.rollToleranceDeg) {
      badgeType = 'level-horizon';
      const dir = rollErrorDeg > 0 ? 'LEFT ↺' : 'RIGHT ↻';
      const prefix = severity === 'severe' ? '🚨 ROTATE PHONE ' : 'Rotate ';
      badgeText = `${prefix}${dir} (${Math.abs(Math.round(rollErrorDeg))}°)`;
      tips.push('Horizon is tilted.');
    } else if (pitchErrorDeg < -archetype.pitchToleranceDeg) {
      badgeType = 'tilt-up';
      const deg = Math.abs(Math.round(pitchErrorDeg));
      const prefix = severity === 'severe' ? '🚨 TILT TOP BACK ↑ ' : 'Tilt top back ↑ ';
      badgeText = `${prefix}(${deg}°)`;
      tips.push(archetype.heightHint);
    } else if (pitchErrorDeg > archetype.pitchToleranceDeg) {
      badgeType = 'tilt-down';
      const deg = Math.round(pitchErrorDeg);
      const prefix = severity === 'severe' ? '🚨 TILT FORWARD ↓ ' : 'Tilt forward ↓ ';
      badgeText = `${prefix}(${deg}°)`;
      tips.push(archetype.heightHint);
    }

    // Auto-snap lock countdown
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
      severity,
      primaryBadge: badgeType,
      primaryBadgeText: badgeText,
      detailedTips: tips,
      autoSnapProgress,
    });
  }, [attitude, archetype, autoSnapEnabled, onAutoSnapTrigger]);

  return feedback;
}
