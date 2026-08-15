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
  scaleMultiplier: number;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  archetype,
  attitude,
  feedback,
  showGrid,
  autoSnapEnabled,
  scaleMultiplier,
}) => {
  const { score, isLocked, severity, primaryBadgeText, autoSnapProgress } = feedback;
  const scorePct = Math.round(score * 100);

  const isPerfect = severity === 'perfect';
  const isSevere = severity === 'severe';
  const isMinor = severity === 'minor';

  const statusColor = isPerfect
    ? '#22C55E'
    : isMinor
    ? '#10B981'
    : isSevere
    ? '#EF4444'
    : '#FBBF24';

  const badgeBg = isPerfect
    ? 'rgba(34, 197, 94, 0.9)'
    : isSevere
    ? 'rgba(239, 68, 68, 0.95)'
    : 'rgba(0, 0, 0, 0.75)';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Subtle Glowing Framing Border on Target Lock */}
      {isPerfect && <View style={styles.perfectBorder} />}

      {/* Top Status Header - Only visible when adjusting, minimal when perfect */}
      <View style={[styles.topHeader, isPerfect ? styles.topHeaderMinimal : null]}>
        {!isPerfect ? (
          <>
            <View style={styles.modeChip}>
              <Text style={styles.modeText}>{archetype.badge}</Text>
            </View>

            <View style={styles.heightPill}>
              <Text style={styles.heightText}>📍 {archetype.heightHint}</Text>
            </View>

            <View style={[styles.scoreChip, { borderColor: statusColor }]}>
              <View style={[styles.scoreDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.scoreText, { color: statusColor }]}>{scorePct}%</Text>
            </View>
          </>
        ) : (
          <View style={styles.lockedPill}>
            <View style={styles.lockedDot} />
            <Text style={styles.lockedText}>LOCKED</Text>
          </View>
        )}
      </View>

      {/* Dynamic Pose Silhouette */}
      <PoseSilhouette
        archetype={archetype}
        isLocked={isLocked}
        score={score}
        severity={severity}
        scaleMultiplier={scaleMultiplier}
      />

      {/* Cockpit Level Horizon Bar (Fades out when perfect) */}
      <LevelIndicator
        attitude={attitude}
        isLocked={isLocked}
        score={score}
        severity={severity}
      />

      {/* Directional Guidance Badge */}
      <View style={styles.badgeContainer}>
        {(!isPerfect || autoSnapProgress > 0) && (
          <View
            style={[
              styles.directionalBadge,
              { backgroundColor: badgeBg, borderColor: statusColor },
              isSevere ? styles.badgeSevere : null,
            ]}
          >
            <Text
              style={[
                styles.directionalText,
                isSevere ? styles.textSevere : null,
              ]}
            >
              {primaryBadgeText}
            </Text>
          </View>
        )}

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
  perfectBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3,
    borderColor: '#22C55E',
    opacity: 0.8,
    borderRadius: 8,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    zIndex: 10,
  },
  topHeaderMinimal: {
    justifyContent: 'center',
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
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 197, 94, 0.85)',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  lockedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
  },
  lockedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
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
  badgeSevere: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  directionalText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  textSevere: {
    fontSize: 15,
    fontWeight: '900',
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
