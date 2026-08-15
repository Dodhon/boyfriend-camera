import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DeviceAttitude, SeverityTier } from '../types/camera';

interface LevelIndicatorProps {
  attitude: DeviceAttitude;
  isLocked: boolean;
  score: number;
  severity: SeverityTier;
}

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({
  attitude,
  isLocked,
  score,
  severity,
}) => {
  const { rollDeg, pitchDeg, pitchErrorDeg } = attitude;

  // When alignment is perfect, completely hide the horizon bar to declutter the viewfinder
  if (severity === 'perfect') {
    return null;
  }

  const clampedRoll = Math.max(-45, Math.min(45, rollDeg));
  const verticalOffset = Math.max(-30, Math.min(30, -pitchErrorDeg * 4));

  const isSevere = severity === 'severe';
  const isMinor = severity === 'minor';

  const accentColor = isSevere ? '#EF4444' : isMinor ? '#22C55E' : '#FBBF24';
  const wingThickness = isSevere ? 4 : isMinor ? 1.5 : 2.5;
  const opacity = isSevere ? 1.0 : isMinor ? 0.45 : 0.75;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Horizon Pitch/Roll Bar */}
      <View
        style={[
          styles.levelBarContainer,
          {
            opacity,
            transform: [
              { translateY: verticalOffset },
              { rotate: `${clampedRoll}deg` },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.wingLine,
            { backgroundColor: accentColor, height: wingThickness },
            isSevere ? styles.glowRed : null,
          ]}
        />

        <View
          style={[
            styles.centerReticle,
            { borderColor: accentColor, borderWidth: isSevere ? 3 : 2 },
          ]}
        >
          <View style={[styles.centerDot, { backgroundColor: accentColor }]} />
        </View>

        <View
          style={[
            styles.wingLine,
            { backgroundColor: accentColor, height: wingThickness },
            isSevere ? styles.glowRed : null,
          ]}
        />
      </View>

      {/* Show Numerical Degree Badges ONLY when error is severe or moderate */}
      {!isMinor && (
        <View style={styles.metricsRow}>
          <View
            style={[
              styles.metricChip,
              { borderColor: isSevere ? '#EF4444' : 'rgba(255, 255, 255, 0.2)' },
            ]}
          >
            <Text style={[styles.metricLabel, { color: accentColor }]}>
              TILT: {pitchDeg > 0 ? `+${pitchDeg}°` : `${pitchDeg}°`}
            </Text>
          </View>
          <View
            style={[
              styles.metricChip,
              { borderColor: isSevere ? '#EF4444' : 'rgba(255, 255, 255, 0.2)' },
            ]}
          >
            <Text style={[styles.metricLabel, { color: accentColor }]}>
              ROLL: {rollDeg > 0 ? `+${rollDeg}°` : `${rollDeg}°`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 240,
    height: 40,
  },
  wingLine: {
    flex: 1,
    borderRadius: 2,
  },
  centerReticle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  glowRed: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
});
