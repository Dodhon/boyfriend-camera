import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Rect, Path, G, Text as SvgText } from 'react-native-svg';
import { SeverityTier, ShotArchetype } from '../types/camera';

interface PoseSilhouetteProps {
  archetype: ShotArchetype;
  isLocked: boolean;
  score: number;
  severity: SeverityTier;
  scaleMultiplier: number; // 0.45 to 1.0
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PoseSilhouette: React.FC<PoseSilhouetteProps> = ({
  archetype,
  isLocked,
  score,
  severity,
  scaleMultiplier = 1.0,
}) => {
  // When perfect, silhouette fades to transparent/ghost level so he can see her expression
  const opacity =
    severity === 'perfect'
      ? 0.15
      : severity === 'minor'
      ? 0.4
      : severity === 'severe'
      ? 0.85
      : 0.6;

  const strokeColor =
    severity === 'perfect'
      ? '#22C55E'
      : severity === 'minor'
      ? '#FBBF24'
      : severity === 'severe'
      ? '#EF4444'
      : 'rgba(255, 255, 255, 0.35)';

  const strokeWidth = severity === 'severe' ? 3 : isLocked ? 2 : 1.5;

  const w = SCREEN_WIDTH;
  const h = SCREEN_HEIGHT * 0.75;
  const cx = w / 2;

  // Scale factor anchored to bottom center
  const s = Math.max(0.4, Math.min(1.2, scaleMultiplier));

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={w} height={h} style={styles.svg}>
        {/* Full Body OOTD Guides */}
        {archetype.id === 'ootd-full' && (
          <G opacity={opacity}>
            {/* Upper Headroom Guideline */}
            <Line
              x1={w * 0.15}
              y1={h * (1 - s * 0.90)}
              x2={w * 0.85}
              y2={h * (1 - s * 0.90)}
              stroke={strokeColor}
              strokeWidth={1}
              strokeDasharray="4, 4"
            />

            {/* Head Silhouette Circle */}
            <Circle
              cx={cx}
              cy={h * (1 - s * 0.82)}
              r={w * 0.08 * s}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Torso & Shoulders */}
            <Path
              d={`
                M ${cx - w * 0.18 * s} ${h * (1 - s * 0.70)}
                Q ${cx} ${h * (1 - s * 0.73)} ${cx + w * 0.18 * s} ${h * (1 - s * 0.70)}
                L ${cx + w * 0.14 * s} ${h * (1 - s * 0.45)}
                L ${cx - w * 0.14 * s} ${h * (1 - s * 0.45)}
                Z
              `}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Legs Stance */}
            <Line
              x1={cx - w * 0.08 * s}
              y1={h * (1 - s * 0.45)}
              x2={cx - w * 0.10 * s}
              y2={h * (1 - archetype.feetMarginPercentage)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1={cx + w * 0.08 * s}
              y1={h * (1 - s * 0.45)}
              x2={cx + w * 0.10 * s}
              y2={h * (1 - archetype.feetMarginPercentage)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />

            {/* Feet Anchor Line */}
            <Line
              x1={w * 0.25}
              y1={h * (1 - archetype.feetMarginPercentage)}
              x2={w * 0.75}
              y2={h * (1 - archetype.feetMarginPercentage)}
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeDasharray="5, 3"
            />
          </G>
        )}

        {/* Half Body Portrait Guides */}
        {archetype.id === 'portrait-half' && (
          <G opacity={opacity}>
            <Line
              x1={w * 0.1}
              y1={h * 0.33}
              x2={w * 0.9}
              y2={h * 0.33}
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeDasharray="6, 4"
            />

            <Circle
              cx={cx}
              cy={h * 0.33}
              r={w * 0.16 * s}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            <Path
              d={`
                M ${cx - w * 0.32 * s} ${h * 0.65}
                Q ${cx - w * 0.18 * s} ${h * 0.45} ${cx - w * 0.10 * s} ${h * 0.44}
                L ${cx + w * 0.10 * s} ${h * 0.44}
                Q ${cx + w * 0.18 * s} ${h * 0.45} ${cx + w * 0.32 * s} ${h * 0.65}
              `}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          </G>
        )}

        {/* Cafe / Table Sitting Guides */}
        {archetype.id === 'cafe-sitting' && (
          <G opacity={opacity}>
            <Circle
              cx={cx}
              cy={h * 0.28}
              r={w * 0.13 * s}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Path
              d={`
                M ${cx - w * 0.22 * s} ${h * 0.55}
                L ${cx + w * 0.22 * s} ${h * 0.55}
              `}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1={w * 0.05}
              y1={h * 0.58}
              x2={w * 0.95}
              y2={h * 0.58}
              stroke={strokeColor}
              strokeWidth={2}
            />
          </G>
        )}

        {/* 0.5x High-Angle Y2K Guide */}
        {archetype.id === 'y2k-high' && (
          <G opacity={opacity}>
            {/* Top-down circular perspective */}
            <Circle
              cx={cx}
              cy={h * 0.35}
              r={w * 0.22 * s}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              cx={cx}
              cy={h * 0.65}
              r={w * 0.12 * s}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray="4, 4"
              fill="transparent"
            />
          </G>
        )}

        {/* Scenery / Golden Ratio Guides */}
        {archetype.id === 'aesthetic-wide' && (
          <G opacity={opacity}>
            <Line x1={w * 0.33} y1={0} x2={w * 0.33} y2={h} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
            <Line x1={w * 0.66} y1={0} x2={w * 0.66} y2={h} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
            <Line x1={0} y1={h * 0.33} x2={w} y2={h * 0.33} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
            <Line x1={0} y1={h * 0.66} x2={w} y2={h * 0.66} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

            <Rect
              x={cx - w * 0.16 * s}
              y={h * 0.25}
              width={w * 0.32 * s}
              height={h * 0.5 * s}
              rx={12}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray="6, 4"
              fill="transparent"
            />
          </G>
        )}
      </Svg>
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
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
