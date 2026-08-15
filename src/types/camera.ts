export type ShotArchetypeId =
  | 'ootd-full'
  | 'portrait-half'
  | 'aesthetic-wide';

export type ScalePreset = 'full-80' | 'standard-65' | 'scenery-45';

export interface ShotArchetype {
  id: ShotArchetypeId;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  targetPitchDeg: number;
  pitchToleranceDeg: number;
  targetRollDeg: number;
  rollToleranceDeg: number;
  heightHint: 'Waist / Stomach Height' | 'Chest / Eye Height' | 'Table / Seated Level' | 'Eye Level (Level Horizon)';
  lensPreference: '1x' | '2x' | '0.5x';
  headroomPercentage: number;
  feetMarginPercentage: number;
  defaultScale: number;
  sampleImageUrl: string;
  proTip: string;
}

export interface DeviceAttitude {
  pitchDeg: number;
  rollDeg: number;
  isLevel: boolean;
  pitchErrorDeg: number;
  rollErrorDeg: number;
}

export type DirectionalBadgeType =
  | 'perfect-lock'
  | 'tilt-up'
  | 'tilt-down'
  | 'level-horizon'
  | 'lower-phone'
  | 'raise-phone'
  | 'step-closer'
  | 'step-back'
  | 'hold-steady';

export type SeverityTier = 'perfect' | 'minor' | 'moderate' | 'severe';

export interface CompositionFeedback {
  score: number;
  isLocked: boolean;
  isLevel: boolean;
  severity: SeverityTier;
  primaryBadge: DirectionalBadgeType;
  primaryBadgeText: string;
  detailedTips: string[];
  autoSnapProgress: number;
}

export interface CapturedPhoto {
  id: string;
  uri: string;
  width: number;
  height: number;
  timestamp: number;
  archetypeId: ShotArchetypeId;
  alignmentScore: number;
  isFavorited?: boolean;
}

export interface SimulationState {
  enabled: boolean;
  simulatedPitchDeg: number;
  simulatedRollDeg: number;
  simulatedScale: number;
  activeSampleIndex: number;
}
