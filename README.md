# Boyfriend Camera 📸✨

> **The real-time camera copilot that makes it dumb-proof for boyfriends to take aesthetic, flattering photos.**

Built with **React Native**, **Expo**, **CoreMotion Sensors**, and **Haptic Feedback**.

---

## The Problem & The Solution

- **The Problem**: When a girlfriend hands her phone to her boyfriend, she has an exact mental composition in mind (angle, leg elongation, headroom, level horizon). The guy holds the phone at eye level, tilts randomly, and snaps 40 unusable photos from the same bad angle.
- **The Solution**: Turn the screen into a **gamified target-lock HUD**. The app evaluates pitch, roll, and composition boundaries in real-time, displays large directional cues (*"TILT TOP BACK 6°"*, *"LOWER PHONE TO WAIST"*), snaps glowing green with a crisp haptic pulse on lock, and **auto-captures** the perfect shot.

---

## ✨ Features

### 1. 🎯 Real-Time Cockpit Horizon & Tilt Leveler
- Aircraft-style leveling HUD that tilts and shifts with the device's real-time attitude.
- Glowing **Neon Green** lock when level; amber/yellow when approaching alignment.

### 2. 👗 5 Photography-Informed Shot Archetypes
- **OOTD / Full Body**: Enforces waist-level elevation, upward $+6^\circ$ pitch to elongate legs, and an $8\%$ bottom feet margin.
- **Half Body / Portrait**: Upper-third eye-line alignment rule with face oval framing.
- **Cafe / Table Sitting**: Seated $-3.5^\circ$ downward perspective with table horizon baseline.
- **Scenery / Architecture**: Golden-ratio 3x3 grid with strict level horizon enforcement.
- **Golden Hour Glow**: Rim light and backlighting flare guide.

### 3. 💬 Dynamic Directional Badges
- Floating badges that direct the photographer in plain English:
  - `✨ TARGET LOCKED • READY TO SNAP`
  - `TILT TOP BACK ↑ (6°)`
  - `ROTATE PHONE LEFT ↺ (3°)`
  - `📍 Waist / Stomach Height`

### 4. ⚡ "Auto-Snap on Lock"
- When the composition is locked continuously for 0.5s, the camera automatically triggers capture without shutter-button shake.

### 5. 📳 Haptic Alignment Loop
- Progressive soft ticks on approach $\rightarrow$ crisp success notification haptic upon target lock.

### 6. 🖼️ Instant Photo Review & Camera Roll Save
- Fullscreen review modal displaying the AI composition score ($0\text{--}100\%$) and direct export to the iOS Photo Library.

---

## 🛠️ Technical Architecture

- **Framework**: Expo (SDK 57) + React Native + TypeScript
- **Camera Engine**: `expo-camera` (`CameraView`)
- **Motion Sensors**: `expo-sensors` (`DeviceMotion` / `Accelerometer` at 30Hz with Exponential Moving Average smoothing)
- **Haptics**: `expo-haptics`
- **Overlays**: `react-native-svg` for vector reticles, horizon bars, and wireframe silhouettes
- **Media**: `expo-media-library`

---

## 🚀 Running on Your iPhone

```bash
# Install dependencies
bun install

# Start Expo dev server
bun run ios
# or for interactive QR code / Expo Go:
npx expo start
```

---

## 📄 License

MIT
