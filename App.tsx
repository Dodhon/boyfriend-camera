import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Camera as CameraIcon, ShieldAlert } from 'lucide-react-native';

import { ShotArchetype, CapturedPhoto } from './src/types/camera';
import { DEFAULT_ARCHETYPE } from './src/constants/archetypes';
import { useDeviceSensors } from './src/hooks/useDeviceSensors';
import { useCompositionEngine } from './src/hooks/useCompositionEngine';
import { useHapticFeedback } from './src/hooks/useHapticFeedback';

import { HUDOverlay } from './src/components/HUDOverlay';
import { ShotTypeSelector } from './src/components/ShotTypeSelector';
import { ControlsBar } from './src/components/ControlsBar';
import { PhotoReviewModal } from './src/components/PhotoReviewModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [showGrid, setShowGrid] = useState(true);
  const [autoSnapEnabled, setAutoSnapEnabled] = useState(true);
  const [archetype, setArchetype] = useState<ShotArchetype>(DEFAULT_ARCHETYPE);

  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  // 1. Device Sensors & Attitude calculation
  const attitude = useDeviceSensors(archetype);

  // 2. Photo Capture handler
  const handleCapture = useCallback(async () => {
    if (!cameraRef.current) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.95,
        skipProcessing: false,
      });

      if (photo && photo.uri) {
        const newPhoto: CapturedPhoto = {
          id: Date.now().toString(),
          uri: photo.uri,
          width: photo.width || SCREEN_WIDTH,
          height: photo.height || SCREEN_WIDTH * 1.33,
          timestamp: Date.now(),
          archetypeId: archetype.id,
          alignmentScore: attitude.isLevel ? 1.0 : 0.85,
        };

        setCapturedPhotos((prev) => [newPhoto, ...prev]);
      }
    } catch (err) {
      console.warn('Capture failed:', err);
    }
  }, [archetype.id, attitude.isLevel]);

  // 3. Composition Rules Engine
  const feedback = useCompositionEngine({
    attitude,
    archetype,
    autoSnapEnabled,
    onAutoSnapTrigger: handleCapture,
  });

  // 4. Haptic Feedback Loop
  useHapticFeedback(feedback.isLocked, feedback.score);

  if (!permission) {
    return <View style={styles.darkBackground} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.permissionCard}>
          <ShieldAlert size={48} color="#22C55E" />
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionDesc}>
            Boyfriend Camera needs access to your camera and motion sensors to guide framing and take flattering photos in real-time.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>ALLOW CAMERA</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const lastPhoto = capturedPhotos.length > 0 ? capturedPhotos[0] : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden />

      {/* Main Camera Viewfinder */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
        mode="picture"
      >
        {/* HUD & Composition Overlays */}
        <HUDOverlay
          archetype={archetype}
          attitude={attitude}
          feedback={feedback}
          showGrid={showGrid}
          autoSnapEnabled={autoSnapEnabled}
        />
      </CameraView>

      {/* Bottom Interface Controls */}
      <View style={styles.bottomInterface}>
        {/* Shot Archetype Selector Carousel */}
        <ShotTypeSelector
          selectedArchetype={archetype}
          onSelectArchetype={setArchetype}
        />

        {/* Primary Controls & Shutter Bar */}
        <ControlsBar
          onCapture={handleCapture}
          onFlipCamera={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
          onToggleFlash={() => setFlash((prev) => (prev === 'off' ? 'on' : 'off'))}
          onToggleGrid={() => setShowGrid((prev) => !prev)}
          onToggleAutoSnap={() => setAutoSnapEnabled((prev) => !prev)}
          onOpenGallery={() => setIsReviewOpen(true)}
          flashMode={flash === 'on' ? 'on' : 'off'}
          showGrid={showGrid}
          autoSnapEnabled={autoSnapEnabled}
          isLocked={feedback.isLocked}
          lastPhoto={lastPhoto}
        />
      </View>

      {/* Fullscreen Photo Review Modal */}
      <PhotoReviewModal
        visible={isReviewOpen}
        photos={capturedPhotos}
        onClose={() => setIsReviewOpen(false)}
        onDeletePhoto={(id) => {
          setCapturedPhotos((prev) => prev.filter((p) => p.id !== id));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  darkBackground: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  bottomInterface: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionCard: {
    alignItems: 'center',
    backgroundColor: '#171717',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  permissionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionDesc: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
  },
  permissionBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});
