import { useEffect, useRef } from 'react';
import { playAlertSound, initAudio } from '../utils/sound';

/**
 * Hook to play alert sounds when mitigations reach their activation time.
 * Sound plays when countdown crosses from positive to zero/negative.
 */
const useMitigationSound = (calloutData, enableSound = true) => {
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

    if (countdown <= 0 && countdown > -0.5 && lastSoundTimeRef.current !== abilityTime) {
      playAlertSound();
      lastSoundTimeRef.current = abilityTime;
    }
  }, [calloutData, enableSound]);

  useEffect(() => {
    if (!calloutData) {
      lastSoundTimeRef.current = null;
    }
  }, [calloutData]);
};

export default useMitigationSound;
