import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { CompositionFeedback, DeviceAttitude, ShotArchetype } from '../types/camera';
import { LevelIndicator } from './LevelIndicator';
import { PoseSilhouette } from './PoseSilhouette';

interface HUDOverlayProps {
  archetype: ShotArchetype;
  attitude: DeviceAttitude;
  feedback: CompositionFeedback;
  showGrid: boolean;
  autoSnapEnabled: boolean;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  archetype,
  attitude,
  feedback,
  showGrid,
  autoSnapEnabled,
}) => {
  const { score, isLocked, primaryBadgeText, autoSnapProgress } = feedback;
  const scorePct = Math.round(score * 100);

  const isGreen = isLocked;
  const isYellow = score > 0.75;
  const statusColor = isGreen ? '#22C55E' : isYellow ? '#FBBF24' : '#EF4444';
  const badgeBg = isGreen ? 'rgba(34, 197, 94, 0.85)' : 'rgba(0, 0, 0, 0.75)';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Top Status Header */}
      <View style={styles.topHeader}>
        {/* Left: Mode Chip */}
        <View style={styles.modeChip}>
          <Text style={styles.modeText}>{archetype.badge}</Text>
        </View>

        {/* Center: Height Guidance Pill */}
        <View style={styles.heightPill}>
          <Text style={styles.heightText}>📍 {archetype.heightHint}</Text>
        </View>

        {/* Right: Alignment Meter */}
        <View style={[styles.scoreChip, { borderColor: statusColor }]}>
          <View style={[styles.scoreDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.scoreText, { color: statusColor }]}>{scorePct}%</Text>
        </View>
      </View>

      {/* Silhouette Guides */}
      <PoseSilhouette archetype={archetype} isLocked={isLocked} score={score} />

      {/* Cockpit Level Horizon Bar */}
      <LevelIndicator attitude={attitude} isLocked={isLocked} score={score} />

      {/* Floating Center-Bottom Directional Guidance Badge */}
      <View style={styles.badgeContainer}>
        <View style={[styles.directionalBadge, { backgroundColor: badgeBg, borderColor: statusColor }]}>
          <Text style={styles.directionalText}>{primaryBadgeText}</Text>
        </View>

        {/* Auto-Snap Progress Bar (when locked) */}
        {autoSnapEnabled && autoSnapProgress > 0 && (
          <View style={styles.autoSnapBarContainer}>
            <View
              style={[
                styles.autoSnapBarFill,
                { width: `${Math.round(autoSnapProgress * 100)}%` },
              ]}
            />
          </View>
        )}
      </View>
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
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    zIndex: 10,
  },
  modeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heightPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heightText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1.5,
    gap: 6,
  },
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: '18%',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  directionalBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  directionalText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  autoSnapBarContainer: {
    width: 160,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  autoSnapBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 2,
  },
});
