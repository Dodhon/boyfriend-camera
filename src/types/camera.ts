export type ShotArchetypeId =
  | 'ootd-full'
  | 'portrait-half'
  | 'cafe-sitting'
  | 'aesthetic-wide'
  | 'golden-hour';

export interface ShotArchetype {
  id: ShotArchetypeId;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  // Ideal phone orientation:
  // pitch > 0 means tilted upwards (looking slightly up at subject)
  // pitch < 0 means tilted downwards
  targetPitchDeg: number;
  pitchToleranceDeg: number;
  targetRollDeg: number;
  rollToleranceDeg: number;
  // Shooting height hint for the photographer
  heightHint: 'Waist / Stomach Height' | 'Chest / Eye Height' | 'Table / Seated Level' | 'Low / Knee Angle';
  lensPreference: '1x' | '2x' | '0.5x';
  headroomPercentage: number; // e.g. 0.12 = 12% from top
  feetMarginPercentage: number; // e.g. 0.08 = 8% from bottom
  proTip: string;
}

export interface DeviceAttitude {
  pitchDeg: number; // Tilted back/forward (-90 to +90)
  rollDeg: number;  // Tilted left/right (-180 to +180)
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
  | 'step-back'
  | 'hold-steady';

export interface CompositionFeedback {
  score: number; // 0.0 to 1.0 (1.0 = perfect alignment)
  isLocked: boolean;
  isLevel: boolean;
  primaryBadge: DirectionalBadgeType;
  primaryBadgeText: string;
  detailedTips: string[];
  autoSnapProgress: number; // 0.0 to 1.0 (fills over 0.5s of continuous lock)
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
