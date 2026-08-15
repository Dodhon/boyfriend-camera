import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Camera, RefreshCw, Zap, ZapOff, Grid, Sparkles } from 'lucide-react-native';
import { CapturedPhoto } from '../types/camera';

interface ControlsBarProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  onToggleFlash: () => void;
  onToggleGrid: () => void;
  onToggleAutoSnap: () => void;
  onOpenGallery: () => void;
  flashMode: 'off' | 'on';
  showGrid: boolean;
  autoSnapEnabled: boolean;
  isLocked: boolean;
  lastPhoto: CapturedPhoto | null;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  onCapture,
  onFlipCamera,
  onToggleFlash,
  onToggleGrid,
  onToggleAutoSnap,
  onOpenGallery,
  flashMode,
  showGrid,
  autoSnapEnabled,
  isLocked,
  lastPhoto,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Quick Settings Sub-Row */}
      <View style={styles.quickSettingsRow}>
        {/* Flash Toggle */}
        <TouchableOpacity
          style={[styles.smallBtn, flashMode === 'on' ? styles.btnActive : null]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onToggleFlash();
          }}
        >
          {flashMode === 'on' ? (
            <Zap size={18} color="#FBBF24" />
          ) : (
            <ZapOff size={18} color="#FFF" />
          )}
        </TouchableOpacity>

        {/* Grid Toggle */}
        <TouchableOpacity
          style={[styles.smallBtn, showGrid ? styles.btnActive : null]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onToggleGrid();
          }}
        >
          <Grid size={18} color={showGrid ? '#22C55E' : '#FFF'} />
        </TouchableOpacity>

        {/* Auto-Snap Toggle */}
        <TouchableOpacity
          style={[styles.autoSnapBadge, autoSnapEnabled ? styles.autoSnapActive : null]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            onToggleAutoSnap();
          }}
        >
          <Sparkles size={14} color={autoSnapEnabled ? '#000' : '#FFF'} />
          <Text style={[styles.autoSnapText, autoSnapEnabled ? styles.autoSnapTextActive : null]}>
            AUTO-SNAP {autoSnapEnabled ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Shutter & Primary Action Row */}
      <View style={styles.mainActionRow}>
        {/* Gallery / Last Photo Thumbnail */}
        <TouchableOpacity
          style={styles.thumbnailBtn}
          onPress={() => {
            if (lastPhoto) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              onOpenGallery();
            }
          }}
          disabled={!lastPhoto}
        >
          {lastPhoto ? (
            <Image source={{ uri: lastPhoto.uri }} style={styles.thumbnailImg} />
          ) : (
            <View style={styles.thumbnailPlaceholder} />
          )}
        </TouchableOpacity>

        {/* Big Shutter Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.shutterOuterRing,
            isLocked ? styles.shutterRingLocked : null,
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
            onCapture();
          }}
        >
          <View
            style={[
              styles.shutterInnerCircle,
              isLocked ? styles.shutterInnerLocked : null,
            ]}
          />
        </TouchableOpacity>

        {/* Flip Camera Button */}
        <TouchableOpacity
          style={styles.flipBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onFlipCamera();
          }}
        >
          <RefreshCw size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    paddingTop: 12,
    backgroundColor: '#000',
  },
  quickSettingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  smallBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  autoSnapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  autoSnapActive: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  autoSnapText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  autoSnapTextActive: {
    color: '#000',
  },
  mainActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thumbnailBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  shutterOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  shutterRingLocked: {
    borderColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  shutterInnerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
  },
  shutterInnerLocked: {
    backgroundColor: '#22C55E',
  },
  flipBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
