import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DeviceAttitude } from '../types/camera';

interface LevelIndicatorProps {
  attitude: DeviceAttitude;
  isLocked: boolean;
  score: number;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  attitude,
  isLocked,
  score,
}) => {
  const { rollDeg, pitchDeg, pitchErrorDeg } = attitude;

  // Clamp roll rotation to ±45° for visual stability
  const clampedRoll = Math.max(-45, Math.min(45, rollDeg));
  // Vertical offset based on pitch error (-40px to +40px)
  const verticalOffset = Math.max(-30, Math.min(30, -pitchErrorDeg * 4));

  const isNear = score > 0.75;
  const accentColor = isLocked ? '#22C55E' : isNear ? '#FBBF24' : 'rgba(255, 255, 255, 0.4)';
  const glowShadow = isLocked ? styles.glowGreen : isNear ? styles.glowYellow : null;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Horizon Pitch/Roll Bar */}
      <View
        style={[
          styles.levelBarContainer,
          {
            transform: [
              { translateY: verticalOffset },
              { rotate: `${clampedRoll}deg` },
            ],
          },
        ]}
      >
        {/* Left Wing Line */}
        <View style={[styles.wingLine, { backgroundColor: accentColor }, glowShadow]} />

        {/* Center Reticle Notch */}
        <View style={[styles.centerReticle, { borderColor: accentColor }, glowShadow]}>
          <View
            style={[
              styles.centerDot,
              { backgroundColor: accentColor },
              isLocked ? styles.centerDotLocked : null,
            ]}
          />
        </View>

        {/* Right Wing Line */}
        <View style={[styles.wingLine, { backgroundColor: accentColor }, glowShadow]} />
      </View>

      {/* Numerical Pitch & Roll Readout Badges */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricChip, { borderColor: isLocked ? '#22C55E' : 'rgba(255, 255, 255, 0.2)' }]}>
          <Text style={[styles.metricLabel, { color: accentColor }]}>
            PITCH: {pitchDeg > 0 ? `+${pitchDeg}°` : `${pitchDeg}°`}
          </Text>
        </View>
        <View style={[styles.metricChip, { borderColor: isLocked ? '#22C55E' : 'rgba(255, 255, 255, 0.2)' }]}>
          <Text style={[styles.metricLabel, { color: accentColor }]}>
            ROLL: {rollDeg > 0 ? `+${rollDeg}°` : `${rollDeg}°`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 40,
  },
  wingLine: {
    flex: 1,
    height: 2.5,
    borderRadius: 2,
  },
  centerReticle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  centerDotLocked: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  glowGreen: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  glowYellow: {
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
    elevation: 4,
  },
  metricsRow: {
    position: 'absolute',
    bottom: '26%',
    flexDirection: 'row',
    gap: 8,
  },
  metricChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
});
