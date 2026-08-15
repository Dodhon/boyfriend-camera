import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScalePreset, ShotArchetype } from '../types/camera';
import { ARCHETYPE_LIST } from '../constants/archetypes';

interface ShotTypeSelectorProps {
  selectedArchetype: ShotArchetype;
  onSelectArchetype: (archetype: ShotArchetype) => void;
  scaleMultiplier: number;
  onSelectScale: (scale: number) => void;
}

const SCALE_PRESETS: { label: string; scale: number }[] = [
  { label: '80% FIT', scale: 0.80 },
  { label: '65% STD', scale: 0.65 },
  { label: '45% VIBE', scale: 0.45 },
];

export const ShotTypeSelector: React.FC<ShotTypeSelectorProps> = ({
  selectedArchetype,
  onSelectArchetype,
  scaleMultiplier,
  onSelectScale,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Scale Presets Sub-Row */}
      <View style={styles.scaleRow}>
        <Text style={styles.scaleHeading}>SUBJECT SCALE:</Text>
        {SCALE_PRESETS.map((preset) => {
          const isSelected = Math.abs(scaleMultiplier - preset.scale) < 0.05;
          return (
            <TouchableOpacity
              key={preset.label}
              style={[styles.scaleChip, isSelected ? styles.scaleChipActive : null]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onSelectScale(preset.scale);
              }}
            >
              <Text
                style={[
                  styles.scaleChipText,
                  isSelected ? styles.scaleChipTextActive : null,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Main Archetype Selector Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {ARCHETYPE_LIST.map((item) => {
          const isSelected = item.id === selectedArchetype.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              style={[
                styles.pill,
                isSelected ? styles.pillSelected : styles.pillUnselected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                onSelectArchetype(item);
                onSelectScale(item.defaultScale);
              }}
            >
              <Text
                style={[
                  styles.pillText,
                  isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
                ]}
              >
                {item.title.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
  },
  scaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scaleHeading: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scaleChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  scaleChipActive: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  scaleChipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '800',
  },
  scaleChipTextActive: {
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  pillSelected: {
    backgroundColor: '#FFF',
  },
  pillUnselected: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  pillTextSelected: {
    color: '#000',
  },
  pillTextUnselected: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
});
