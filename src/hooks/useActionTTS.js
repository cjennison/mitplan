import { useEffect, useRef } from 'react';

/**
 * Speak text using OverlayPlugin's TTS
 * @param {string} text - Text to speak
 */
const speak = (text) => {
  if (typeof callOverlayHandler === 'function') {
    callOverlayHandler({ call: 'say', text });
  }
};

/**
 * Hook to provide TTS (text-to-speech) countdown and action announcements.
 *
 * Behavior matrix:
 * - Both ON: "{Action} in 5" (at 6s), "4", "3", "2", "1", "{Action}"
 * - Actions ON, Countdown OFF: "{Action}" at 0
 * - Actions OFF, Countdown ON: "5", "4", "3", "2", "1" (nothing at 0)
 * - Both OFF: Nothing
 *
 * When both voice actions and countdown are enabled, we announce at 6 seconds
 * to give TTS time to say "{Action} in 5" before the countdown continues.
 *
 * @param {Object} calloutData - Callout data from useCallout hook
 * @param {boolean} enableVoiceCountdown - Whether to speak countdown numbers
 * @param {boolean} enableVoiceActions - Whether to speak ability names
 */
const useActionTTS = (calloutData, enableVoiceCountdown = false, enableVoiceActions = false) => {
  // Track what we've already spoken to avoid repeats
  const lastSpokenRef = useRef({
    abilityTime: null,
    countdownValue: null,
    announcedStart: false,
    announcedEnd: false,
  });

  useEffect(() => {
    // If neither TTS option is enabled, do nothing
    if (!enableVoiceCountdown && !enableVoiceActions) return;
    if (!calloutData) return;

    const { countdown, abilityTime, action } = calloutData;
    if (!action) return;

    const rounded = Math.floor(countdown);
    const abilityName = action.abilities?.[0]?.name || 'Action';

    // Reset tracking when we switch to a new ability
    if (lastSpokenRef.current.abilityTime !== abilityTime) {
      lastSpokenRef.current = {
        abilityTime,
        countdownValue: null,
        announcedStart: false,
        announcedEnd: false,
      };
    }

    // When both are enabled, start at 6 seconds to give TTS time for "{Action} in 5"
    // Otherwise start at 5 seconds
    const startCountdown = enableVoiceActions && enableVoiceCountdown ? 6 : 5;

    // Handle the initial announcement (at 6s when both enabled, 5s otherwise)
    if (rounded === startCountdown && !lastSpokenRef.current.announcedStart) {
      lastSpokenRef.current.announcedStart = true;
      lastSpokenRef.current.countdownValue = startCountdown;

      if (enableVoiceActions && enableVoiceCountdown) {
        // "{Action} in 5" - said at 6 seconds to finish before "4"
        speak(`${abilityName} in 5`);
      } else if (enableVoiceCountdown) {
        // Just "5"
        speak('5');
      }
      // If only actions enabled, don't say anything until 0
    }

    // Countdown from 4 to 1 (or 5 to 1 if only countdown enabled)
    if (rounded >= 1 && rounded <= 5) {
      // Skip 5 if we already announced the start (both enabled case)
      if (rounded === 5 && lastSpokenRef.current.announcedStart) {
        return;
      }

      // Only speak if we haven't spoken this number yet
      if (lastSpokenRef.current.countdownValue !== rounded) {
        lastSpokenRef.current.countdownValue = rounded;

        if (enableVoiceCountdown) {
          speak(rounded.toString());
        }
      }
    }

    // At 0 (NOW!)
    if (rounded <= 0 && countdown > -0.5 && !lastSpokenRef.current.announcedEnd) {
      lastSpokenRef.current.announcedEnd = true;

      if (enableVoiceActions) {
        // Say the ability name
        speak(abilityName);
      }
      // If only countdown is enabled, don't say anything at 0
    }
  }, [calloutData, enableVoiceCountdown, enableVoiceActions]);

  // Reset when callout data clears
  useEffect(() => {
    if (!calloutData) {
      lastSpokenRef.current = {
        abilityTime: null,
        countdownValue: null,
        announcedStart: false,
        announcedEnd: false,
      };
    }
  }, [calloutData]);
};

export default useActionTTS;
