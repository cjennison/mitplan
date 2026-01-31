import { useEffect, useRef } from 'react';
import { playAlertSound, initAudio } from '../utils/sound';

/**
 * Hook to play sounds when mitigations need to be used
 *
 * Plays a sound when a callout transitions from "countdown" to "NOW!"
 * (when countdown crosses from positive to zero/negative)
 *
 * @param {Object} calloutData - The current callout data from useCallout
 * @param {boolean} enableSound - Whether sound is enabled
 */
const useMitigationSound = (calloutData, enableSound = true) => {
  // Track the last callout time we played a sound for
  const lastSoundTimeRef = useRef(null);
  // Track if audio has been initialized
  const audioInitRef = useRef(false);

  // Initialize audio on first interaction
  useEffect(() => {
    const initOnInteraction = () => {
      if (!audioInitRef.current) {
        initAudio();
        audioInitRef.current = true;
        // Remove listeners after first interaction
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
    if (!enableSound || !calloutData) {
      return;
    }

    const { countdown, abilityTime } = calloutData;

    // Play sound when:
    // 1. Countdown is at or just past zero (NOW!)
    // 2. We haven't already played a sound for this ability time
    if (countdown <= 0 && countdown > -0.5 && lastSoundTimeRef.current !== abilityTime) {
      playAlertSound();
      lastSoundTimeRef.current = abilityTime;
    }

    // Reset the ref when the ability time changes (new callout)
    if (abilityTime !== lastSoundTimeRef.current && countdown > 0) {
      // Don't reset yet - wait for the countdown to finish
    }
  }, [calloutData, enableSound]);

  // Reset when callout clears
  useEffect(() => {
    if (!calloutData) {
      lastSoundTimeRef.current = null;
    }
  }, [calloutData]);
};

export default useMitigationSound;
