import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import Svg, { Circle, Line, Rect, Path, G, Text as SvgText } from 'react-native-svg';
import { ShotArchetype } from '../types/camera';

interface PoseSilhouetteProps {
  archetype: ShotArchetype;
  isLocked: boolean;
  score: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const PoseSilhouette: React.FC<PoseSilhouetteProps> = ({
  archetype,
  isLocked,
  score,
}) => {
  const strokeColor = isLocked
    ? '#22C55E'
    : score > 0.75
    ? '#FBBF24'
    : 'rgba(255, 255, 255, 0.28)';

  const strokeWidth = isLocked ? 2.5 : 1.5;
  const opacity = isLocked ? 0.9 : 0.6;

  const w = SCREEN_WIDTH;
  const h = SCREEN_HEIGHT * 0.75;
  const cx = w / 2;

  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={w} height={h} style={styles.svg}>
        {/* Full Body OOTD Guides */}
        {archetype.id === 'ootd-full' && (
          <G opacity={opacity}>
            {/* Upper Headroom Guideline */}
            <Line
              x1={w * 0.15}
              y1={h * archetype.headroomPercentage}
              x2={w * 0.85}
              y2={h * archetype.headroomPercentage}
              stroke={strokeColor}
              strokeWidth={1}
              strokeDasharray="4, 4"
            />
            <SvgText
              x={w * 0.15}
              y={h * archetype.headroomPercentage - 6}
              fill={strokeColor}
              fontSize="10"
              fontWeight="bold"
            >
              HEADROOM
            </SvgText>

            {/* Head Silhouette Circle */}
            <Circle
              cx={cx}
              cy={h * (archetype.headroomPercentage + 0.08)}
              r={w * 0.08}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Shoulders & Torso Outline */}
            <Path
              d={`
                M ${cx - w * 0.18} ${h * 0.28}
                Q ${cx} ${h * 0.25} ${cx + w * 0.18} ${h * 0.28}
                L ${cx + w * 0.14} ${h * 0.50}
                L ${cx - w * 0.14} ${h * 0.50}
                Z
              `}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Leg & Stance Guidelines */}
            <Line
              x1={cx - w * 0.08}
              y1={h * 0.50}
              x2={cx - w * 0.10}
              y2={h * (1 - archetype.feetMarginPercentage)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            <Line
              x1={cx + w * 0.08}
              y1={h * 0.50}
              x2={cx + w * 0.10}
              y2={h * (1 - archetype.feetMarginPercentage)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />

            {/* Feet Baseline Anchor */}
            <Line
              x1={w * 0.2}
              y1={h * (1 - archetype.feetMarginPercentage)}
              x2={w * 0.8}
              y2={h * (1 - archetype.feetMarginPercentage)}
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeDasharray="5, 3"
            />
            <SvgText
              x={w * 0.2}
              y={h * (1 - archetype.feetMarginPercentage) + 14}
              fill={strokeColor}
              fontSize="10"
              fontWeight="bold"
            >
              FEET ANCHOR (BOTTOM 8%)
            </SvgText>
          </G>
        )}

        {/* Half Body Portrait Guides */}
        {archetype.id === 'portrait-half' && (
          <G opacity={opacity}>
            {/* Eye-line Horizontal Rule (Upper Third) */}
            <Line
              x1={w * 0.1}
              y1={h * 0.33}
              x2={w * 0.9}
              y2={h * 0.33}
              stroke={strokeColor}
              strokeWidth={1.5}
              strokeDasharray="6, 4"
            />
            <SvgText
              x={w * 0.1}
              y={h * 0.33 - 6}
              fill={strokeColor}
              fontSize="10"
              fontWeight="bold"
            >
              EYE LEVEL LINE
            </SvgText>

            {/* Face Oval */}
            <Circle
              cx={cx}
              cy={h * 0.33}
              r={w * 0.16}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Shoulder Outline */}
            <Path
              d={`
                M ${cx - w * 0.32} ${h * 0.65}
                Q ${cx - w * 0.18} ${h * 0.45} ${cx - w * 0.10} ${h * 0.44}
                L ${cx + w * 0.10} ${h * 0.44}
                Q ${cx + w * 0.18} ${h * 0.45} ${cx + w * 0.32} ${h * 0.65}
              `}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
          </G>
        )}

        {/* Cafe / Sitting Guides */}
        {archetype.id === 'cafe-sitting' && (
          <G opacity={opacity}>
            {/* Seated Head */}
            <Circle
              cx={cx}
              cy={h * 0.28}
              r={w * 0.13}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Seated Torso */}
            <Path
              d={`
                M ${cx - w * 0.22} ${h * 0.55}
                L ${cx + w * 0.22} ${h * 0.55}
              `}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />

            {/* Table Surface Horizon Baseline */}
            <Line
              x1={w * 0.05}
              y1={h * 0.58}
              x2={w * 0.95}
              y2={h * 0.58}
              stroke={strokeColor}
              strokeWidth={2}
            />
            <SvgText
              x={w * 0.08}
              y={h * 0.58 + 16}
              fill={strokeColor}
              fontSize="10"
              fontWeight="bold"
            >
              TABLE SURFACE HORIZON
            </SvgText>
          </G>
        )}

        {/* Scenery / Golden Ratio Guides */}
        {archetype.id === 'aesthetic-wide' && (
          <G opacity={opacity}>
            <Line x1={w * 0.33} y1={0} x2={w * 0.33} y2={h} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            <Line x1={w * 0.66} y1={0} x2={w * 0.66} y2={h} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            <Line x1={0} y1={h * 0.33} x2={w} y2={h * 0.33} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            <Line x1={0} y1={h * 0.66} x2={w} y2={h * 0.66} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

            <Rect
              x={cx - w * 0.16}
              y={h * 0.25}
              width={w * 0.32}
              height={h * 0.5}
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
