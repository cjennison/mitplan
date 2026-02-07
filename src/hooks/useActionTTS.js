import { useEffect, useRef } from 'react';

const speak = (text) => {
  if (typeof callOverlayHandler === 'function') {
    callOverlayHandler({ call: 'say', text });
  }
};

const useActionTTS = (calloutData, enableVoiceCountdown = false, enableVoiceActions = false) => {
  const lastSpokenRef = useRef({
    abilityTime: null,
    countdownValue: null,
    announcedStart: false,
    announcedEnd: false,
  });

  useEffect(() => {
    if (!enableVoiceCountdown && !enableVoiceActions) return;
    if (!calloutData) return;

    const { countdown, abilityTime, action } = calloutData;
    if (!action) return;

    const rounded = Math.floor(countdown);
    const abilityName = action.abilities?.[0]?.name || 'Action';

    if (lastSpokenRef.current.abilityTime !== abilityTime) {
      lastSpokenRef.current = {
        abilityTime,
        countdownValue: null,
        announcedStart: false,
        announcedEnd: false,
      };
    }

    const startCountdown = enableVoiceActions && enableVoiceCountdown ? 6 : 5;

    if (rounded === startCountdown && !lastSpokenRef.current.announcedStart) {
      lastSpokenRef.current.announcedStart = true;
      lastSpokenRef.current.countdownValue = startCountdown;

      if (enableVoiceActions && enableVoiceCountdown) {
        speak(`${abilityName} in 5`);
      } else if (enableVoiceCountdown) {
        speak('5');
      }
    }

    if (rounded >= 1 && rounded <= 5) {
      if (rounded === 5 && lastSpokenRef.current.announcedStart) {
        return;
      }

      if (lastSpokenRef.current.countdownValue !== rounded) {
        lastSpokenRef.current.countdownValue = rounded;

        if (enableVoiceCountdown) {
          speak(rounded.toString());
        }
      }
    }

    if (rounded <= 0 && countdown > -0.5 && !lastSpokenRef.current.announcedEnd) {
      lastSpokenRef.current.announcedEnd = true;

      if (enableVoiceActions) {
        speak(abilityName);
      }
    }
  }, [calloutData, enableVoiceCountdown, enableVoiceActions]);

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
