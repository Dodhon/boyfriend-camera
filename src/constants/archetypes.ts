import { ShotArchetype, ShotArchetypeId } from '../types/camera';

export const SHOT_ARCHETYPES: Record<ShotArchetypeId, ShotArchetype> = {
  'ootd-full': {
    id: 'ootd-full',
    title: 'OOTD / Full Body',
    subtitle: 'Elongate legs & show the whole fit',
    badge: 'OOTD',
    iconName: 'User',
    targetPitchDeg: 5.5, // Tilted slightly up towards sky
    pitchToleranceDeg: 3.5,
    targetRollDeg: 0.0,
    rollToleranceDeg: 2.0,
    heightHint: 'Waist / Stomach Height',
    lensPreference: '1x',
    headroomPercentage: 0.12,
    feetMarginPercentage: 0.06,
    defaultScale: 0.80,
    // Aesthetic full-body fashion street style photo
    sampleImageUrl:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    proTip: 'Hold phone at belly-button level and tilt the top back slightly towards you.',
  },
  'portrait-half': {
    id: 'portrait-half',
    title: 'Half Body / Portrait',
    subtitle: 'Upper-third eye line & clean depth',
    badge: 'PORTRAIT',
    iconName: 'Smile',
    targetPitchDeg: 1.0,
    pitchToleranceDeg: 3.0,
    targetRollDeg: 0.0,
    rollToleranceDeg: 1.5,
    heightHint: 'Chest / Eye Height',
    lensPreference: '2x',
    headroomPercentage: 0.15,
    feetMarginPercentage: 0.35,
    defaultScale: 0.65,
    // Aesthetic half-body outdoor portrait
    sampleImageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    proTip: 'Align her eyes with the upper dashed line. Crop at mid-thigh, never knees.',
  },
  'aesthetic-wide': {
    id: 'aesthetic-wide',
    title: 'Scenery / Architecture',
    subtitle: 'Vibe shot with 50%+ negative space',
    badge: 'SCENERY',
    iconName: 'Camera',
    targetPitchDeg: 0.0,
    pitchToleranceDeg: 2.5,
    targetRollDeg: 0.0,
    rollToleranceDeg: 1.5,
    heightHint: 'Eye Level (Level Horizon)',
    lensPreference: '0.5x',
    headroomPercentage: 0.22,
    feetMarginPercentage: 0.12,
    defaultScale: 0.45,
    // Aesthetic travel/scenery photo
    sampleImageUrl:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop',
    proTip: 'Strictly level horizon is critical. Position her along the golden third vertical line.',
  },
};

export const ARCHETYPE_LIST: ShotArchetype[] = Object.values(SHOT_ARCHETYPES);
export const DEFAULT_ARCHETYPE: ShotArchetype = SHOT_ARCHETYPES['ootd-full'];
