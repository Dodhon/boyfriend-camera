export type ShotArchetypeId =
  | 'ootd-full'
  | 'portrait-half'
  | 'cafe-sitting'
  | 'aesthetic-wide'
  | 'golden-hour'
  | 'y2k-high';

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
  heightHint: 'Waist / Stomach Height' | 'Chest / Eye Height' | 'Table / Seated Level' | 'High / Above Head';
  lensPreference: '1x' | '2x' | '0.5x';
  headroomPercentage: number;
  feetMarginPercentage: number;
  defaultScale: number; // e.g. 0.75
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
  score: number; // 0.0 to 1.0
  isLocked: boolean;
  isLevel: boolean;
  severity: SeverityTier;
  primaryBadge: DirectionalBadgeType;
  primaryBadgeText: string;
  detailedTips: string[];
  autoSnapProgress: number; // 0.0 to 1.0
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
