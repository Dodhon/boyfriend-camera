import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { X, Download, Trash2, CheckCircle2, Award } from 'lucide-react-native';
import { CapturedPhoto } from '../types/camera';
import { SHOT_ARCHETYPES } from '../constants/archetypes';

interface PhotoReviewModalProps {
  visible: boolean;
  photos: CapturedPhoto[];
  onClose: () => void;
  onDeletePhoto: (id: string) => void;
}

export const PhotoReviewModal: React.FC<PhotoReviewModalProps> = ({
  visible,
  photos,
  onClose,
  onDeletePhoto,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!photos.length) {
    return null;
  }

  const activePhoto = photos[Math.min(currentIndex, photos.length - 1)];
  const archetype = SHOT_ARCHETYPES[activePhoto.archetypeId];
  const scorePct = Math.round(activePhoto.alignmentScore * 100);

  const handleSaveToCameraRoll = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow photo library access to save your photos.');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(activePhoto.uri);
      setIsSaved(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      Alert.alert('Save Failed', 'Could not save photo to camera roll.');
    }
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onDeletePhoto(activePhoto.id);
    if (photos.length <= 1) {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onClose();
            }}
          >
            <X size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{archetype.title}</Text>
            <Text style={styles.headerSubtitle}>
              Shot {currentIndex + 1} of {photos.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleDelete}
          >
            <Trash2 size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Main Photo View */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: activePhoto.uri }} style={styles.photo} resizeMode="contain" />

          {/* AI Composition Score Badge */}
          <View style={styles.scorePill}>
            <Award size={16} color="#22C55E" />
            <Text style={styles.scorePillText}>COMPOSITION SCORE: {scorePct}%</Text>
          </View>
        </View>

        {/* Bottom Actions Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.saveBtn, isSaved ? styles.saveBtnSuccess : null]}
            onPress={handleSaveToCameraRoll}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={20} color="#FFF" />
                <Text style={styles.saveBtnText}>SAVED TO CAMERA ROLL</Text>
              </>
            ) : (
              <>
                <Download size={20} color="#000" />
                <Text style={[styles.saveBtnText, { color: '#000' }]}>SAVE TO CAMERA ROLL</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  scorePill: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  scorePillText: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 12,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 30,
  },
  saveBtnSuccess: {
    backgroundColor: '#22C55E',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
