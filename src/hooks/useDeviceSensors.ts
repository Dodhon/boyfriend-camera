import { useEffect, useState, useRef } from 'react';
import { DeviceMotion, Accelerometer } from 'expo-sensors';
import { DeviceAttitude, ShotArchetype } from '../types/camera';

const RAD_TO_DEG = 180 / Math.PI;
const SMOOTHING_FACTOR = 0.25; // Exponential moving average weight

type SensorSubscription = {
  remove: () => void;
} | null;

export function useDeviceSensors(activeArchetype: ShotArchetype): DeviceAttitude {
  const [attitude, setAttitude] = useState<DeviceAttitude>({
    pitchDeg: 0,
    rollDeg: 0,
    isLevel: false,
    pitchErrorDeg: 0,
    rollErrorDeg: 0,
  });

  const smoothedPitchRef = useRef(0);
  const smoothedRollRef = useRef(0);

  useEffect(() => {
    let subscription: SensorSubscription = null;

    async function startListening() {
      // Set 30Hz update interval (33ms) for responsive 30fps HUD without battery drain
      DeviceMotion.setUpdateInterval(33);

      const isAvailable = await DeviceMotion.isAvailableAsync();

      if (isAvailable) {
        subscription = DeviceMotion.addListener((data) => {
          if (!data || !data.rotation) {
            if (data && data.accelerationIncludingGravity) {
              const { x, y, z } = data.accelerationIncludingGravity;
              const pitch = Math.atan2(-y, Math.sqrt(x * x + z * z)) * RAD_TO_DEG;
              const roll = Math.atan2(x, -y) * RAD_TO_DEG;
              updateAttitude(pitch, roll);
            }
            return;
          }

          const beta = data.rotation.beta * RAD_TO_DEG;
          const gamma = data.rotation.gamma * RAD_TO_DEG;

          const photographicPitch = 90 - beta;
          const photographicRoll = gamma;

          updateAttitude(photographicPitch, photographicRoll);
        });
      } else {
        Accelerometer.setUpdateInterval(33);
        subscription = Accelerometer.addListener((accelData) => {
          const { x, y, z } = accelData;
          const pitch = Math.atan2(z, Math.sqrt(x * x + y * y)) * RAD_TO_DEG;
          const roll = Math.atan2(x, -y) * RAD_TO_DEG;
          updateAttitude(pitch, roll);
        });
      }
    }

    function updateAttitude(rawPitch: number, rawRoll: number) {
      smoothedPitchRef.current =
        smoothedPitchRef.current * (1 - SMOOTHING_FACTOR) + rawPitch * SMOOTHING_FACTOR;
      smoothedRollRef.current =
        smoothedRollRef.current * (1 - SMOOTHING_FACTOR) + rawRoll * SMOOTHING_FACTOR;

      const currentPitch = smoothedPitchRef.current;
      const currentRoll = smoothedRollRef.current;

      const pitchError = currentPitch - activeArchetype.targetPitchDeg;
      const rollError = currentRoll - activeArchetype.targetRollDeg;

      const isPitchWithinTolerance = Math.abs(pitchError) <= activeArchetype.pitchToleranceDeg;
      const isRollWithinTolerance = Math.abs(rollError) <= activeArchetype.rollToleranceDeg;

      const isLevel = isPitchWithinTolerance && isRollWithinTolerance;

      setAttitude({
        pitchDeg: Math.round(currentPitch * 10) / 10,
        rollDeg: Math.round(currentRoll * 10) / 10,
        isLevel,
        pitchErrorDeg: Math.round(pitchError * 10) / 10,
        rollErrorDeg: Math.round(rollError * 10) / 10,
      });
    }

    startListening();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [activeArchetype]);

  return attitude;
}
