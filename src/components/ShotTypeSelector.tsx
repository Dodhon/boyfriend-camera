import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ShotArchetype, ShotArchetypeId } from '../types/camera';
import { ARCHETYPE_LIST } from '../constants/archetypes';

interface ShotTypeSelectorProps {
  selectedArchetype: ShotArchetype;
  onSelectArchetype: (archetype: ShotArchetype) => void;
}

export const ShotTypeSelector: React.FC<ShotTypeSelectorProps> = ({
  selectedArchetype,
  onSelectArchetype,
}) => {
  return (
    <View style={styles.container}>
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
    height: 48,
    justifyContent: 'center',
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
