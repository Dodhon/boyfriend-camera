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

    const maxPitchErr = archetype.pitchToleranceDeg * 2.5;
    const pitchRatio = Math.max(0, 1 - Math.abs(pitchErrorDeg) / maxPitchErr);

    const maxRollErr = archetype.rollToleranceDeg * 2.5;
    const rollRatio = Math.max(0, 1 - Math.abs(rollErrorDeg) / maxRollErr);

    const rawScore = pitchRatio * 0.5 + rollRatio * 0.5;
    const score = Math.round(rawScore * 100) / 100;

    const isLocked = isLevel;

    // Determine Severity Tier
    let severity: SeverityTier = 'moderate';
    if (isLocked) {
      severity = 'perfect';
    } else if (score >= 0.80) {
      severity = 'minor';
    } else if (Math.abs(rollErrorDeg) > 7 || Math.abs(pitchErrorDeg) > 10 || score < 0.50) {
      severity = 'severe';
    } else {
      severity = 'moderate';
    }

    // Enumerated Issue Tracking (Why this shot is bad)
    const enumeratedIssues: string[] = [];

    if (Math.abs(rollErrorDeg) > archetype.rollToleranceDeg) {
      const dir = rollErrorDeg > 0 ? 'left ↺' : 'right ↻';
      enumeratedIssues.push(`Crooked horizon tilted ${Math.abs(Math.round(rollErrorDeg))}° (${dir})`);
    }

    if (pitchErrorDeg < -archetype.pitchToleranceDeg) {
      const deg = Math.abs(Math.round(pitchErrorDeg));
      enumeratedIssues.push(`Held too high / tilted downward ${deg}° (shortens legs)`);
    } else if (pitchErrorDeg > archetype.pitchToleranceDeg) {
      const deg = Math.round(pitchErrorDeg);
      enumeratedIssues.push(`Tilted too far upward by ${deg}°`);
    }

    let badgeType: DirectionalBadgeType = 'perfect-lock';
    let badgeText = '';

    if (severity === 'perfect') {
      badgeType = 'perfect-lock';
      badgeText = '📸 TAKE PHOTO NOW';
    } else if (severity === 'severe') {
      badgeType = 'tilt-up';
      badgeText = `🚨 ${enumeratedIssues.length} ISSUES FOUND • FIX ANGLE`;
    } else {
      // Minor / Moderate: single clear instruction
      if (Math.abs(rollErrorDeg) > archetype.rollToleranceDeg) {
        badgeType = 'level-horizon';
        badgeText = `Rotate phone ${rollErrorDeg > 0 ? 'left ↺' : 'right ↻'} (${Math.abs(Math.round(rollErrorDeg))}°)`;
      } else if (pitchErrorDeg < -archetype.pitchToleranceDeg) {
        badgeType = 'tilt-up';
        badgeText = `Tilt top of phone back ↑ (${Math.abs(Math.round(pitchErrorDeg))}°)`;
      } else if (pitchErrorDeg > archetype.pitchToleranceDeg) {
        badgeType = 'tilt-down';
        badgeText = `Tilt top of phone forward ↓ (${Math.round(pitchErrorDeg)}°)`;
      }
    }

    // Auto-snap countdown
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
      detailedTips: enumeratedIssues,
      autoSnapProgress,
    });
  }, [attitude, archetype, autoSnapEnabled, onAutoSnapTrigger]);

  return feedback;
}
