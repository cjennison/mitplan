import { useEffect, useRef } from 'react';
import { playSoundByType, initAudio } from '../utils/sound';

/**
 * Hook to play alert sounds when mitigations reach their activation time.
 * Sound plays when countdown crosses from positive to zero/negative.
 */
const useMitigationSound = (calloutData, enableSound = true, soundType = 'info') => {
  const lastSoundTimeRef = useRef(null);
  const audioInitRef = useRef(false);

  useEffect(() => {
    const initOnInteraction = () => {
      if (!audioInitRef.current) {
        initAudio();
        audioInitRef.current = true;
        document.removeEventListener('click', initOnInteraction);
        document.removeEventListener('keydown', initOnInteraction);
      }
    };

    document.addEventListener('click', initOnInteraction);
    document.addEventListener('keydown', initOnInteraction);

    return () => {
      document.removeEventListener('click', initOnInteraction);
      document.removeEventListener('keydown', initOnInteraction);
    };
  }, []);

  useEffect(() => {
    if (!enableSound || !calloutData) return;

    const { countdown, abilityTime } = calloutData;

    // Play sound when floored countdown hits 0 (matches when "NOW!" appears green)
    // Use floored value to sync with visual display
    const rounded = Math.floor(countdown);
    if (rounded <= 0 && countdown > -0.5 && lastSoundTimeRef.current !== abilityTime) {
      playSoundByType(soundType);
      lastSoundTimeRef.current = abilityTime;
    }
  }, [calloutData, enableSound, soundType]);

  useEffect(() => {
    if (!calloutData) {
      lastSoundTimeRef.current = null;
    }
  }, [calloutData]);
};

export default useMitigationSound;
