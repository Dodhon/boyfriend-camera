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
  const { score, isLocked, severity, primaryBadgeText, detailedTips, autoSnapProgress } = feedback;
  const scorePct = Math.round(score * 100);

  const isPerfect = severity === 'perfect';
  const isSevere = severity === 'severe';
  const isMinor = severity === 'minor';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Subtle Glowing Framing Border on Target Lock */}
      {isPerfect && <View style={styles.perfectBorder} />}

      {/* Top Header - Hidden when perfect */}
      {!isPerfect && (
        <View style={styles.topHeader}>
          <View style={styles.modeChip}>
            <Text style={styles.modeText}>{archetype.badge}</Text>
          </View>

          <View style={styles.heightPill}>
            <Text style={styles.heightText}>📍 {archetype.heightHint}</Text>
          </View>

          <View
            style={[
              styles.scoreChip,
              { borderColor: isSevere ? '#EF4444' : isMinor ? '#10B981' : '#FBBF24' },
            ]}
          >
            <View
              style={[
                styles.scoreDot,
                { backgroundColor: isSevere ? '#EF4444' : isMinor ? '#10B981' : '#FBBF24' },
              ]}
            />
            <Text
              style={[
                styles.scoreText,
                { color: isSevere ? '#EF4444' : isMinor ? '#10B981' : '#FBBF24' },
              ]}
            >
              {scorePct}%
            </Text>
          </View>
        </View>
      )}

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

      {/* Center Guidance Area */}
      <View style={styles.badgeContainer}>
        {/* SEVERE: Show Enumerated 'Why This Is Bad' Card */}
        {isSevere && detailedTips.length > 0 && (
          <View style={styles.severeCard}>
            <Text style={styles.severeCardHeading}>WHY THIS PICTURE IS BAD:</Text>
            {detailedTips.map((tip, idx) => (
              <Text key={idx} style={styles.severeCardBullet}>
                ❌ {idx + 1}. {tip}
              </Text>
            ))}
          </View>
        )}

        {/* Action Badge */}
        <View
          style={[
            styles.directionalBadge,
            isPerfect
              ? styles.badgePerfect
              : isSevere
              ? styles.badgeSevere
              : styles.badgeModerate,
          ]}
        >
          <Text
            style={[
              styles.directionalText,
              isPerfect ? styles.textPerfect : isSevere ? styles.textSevere : null,
            ]}
          >
            {primaryBadgeText}
          </Text>
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
  perfectBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3.5,
    borderColor: '#22C55E',
    opacity: 0.85,
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
  severeCard: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EF4444',
    padding: 14,
    marginBottom: 12,
  },
  severeCardHeading: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  severeCardBullet: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 3,
  },
  directionalBadge: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 26,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  badgeModerate: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#FBBF24',
  },
  badgeSevere: {
    backgroundColor: '#EF4444',
    borderColor: '#FFF',
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  badgePerfect: {
    backgroundColor: '#22C55E',
    borderColor: '#FFF',
    borderWidth: 2,
    paddingHorizontal: 28,
    paddingVertical: 14,
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
  textPerfect: {
    color: '#000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
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
