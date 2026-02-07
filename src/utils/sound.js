let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browsers require user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

export const playTone = ({
  frequency = 880,
  duration = 0.15,
  volume = 0.3,
  type = 'sine',
} = {}) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Quick fade in/out to avoid clicks
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Failed to play sound:', e);
  }
};

export const playAlertSound = () => {
  // First beep
  playTone({ frequency: 880, duration: 0.1, volume: 0.25, type: 'sine' });
  // Second beep (slightly higher, slight delay)
  setTimeout(() => {
    playTone({ frequency: 1046, duration: 0.1, volume: 0.25, type: 'sine' });
  }, 120);
};

export const playInfoSound = () => {
  playTone({ frequency: 660, duration: 0.12, volume: 0.2, type: 'sine' });
};

export const playAlarmSound = () => {
  playTone({ frequency: 1046, duration: 0.08, volume: 0.3, type: 'square' });
  setTimeout(() => {
    playTone({ frequency: 1046, duration: 0.08, volume: 0.3, type: 'square' });
  }, 100);
  setTimeout(() => {
    playTone({ frequency: 1318, duration: 0.12, volume: 0.3, type: 'square' });
  }, 200);
};

export const playChimeSound = () => {
  playTone({ frequency: 523, duration: 0.1, volume: 0.2, type: 'sine' }); // C5
  setTimeout(() => {
    playTone({ frequency: 659, duration: 0.1, volume: 0.2, type: 'sine' }); // E5
  }, 80);
  setTimeout(() => {
    playTone({ frequency: 784, duration: 0.15, volume: 0.25, type: 'sine' }); // G5
  }, 160);
};

export const playPingSound = () => {
  playTone({ frequency: 1200, duration: 0.08, volume: 0.2, type: 'sine' });
};

export const SOUND_TYPES = {
  info: { id: 'info', label: 'Soft Tone', play: playInfoSound },
  alert: { id: 'alert', label: 'Double Beep', play: playAlertSound },
  alarm: { id: 'alarm', label: 'Urgent Alarm', play: playAlarmSound },
  chime: { id: 'chime', label: 'Chime', play: playChimeSound },
  ping: { id: 'ping', label: 'Ping', play: playPingSound },
};

export const playSoundByType = (soundType) => {
  const sound = SOUND_TYPES[soundType];
  if (sound) {
    sound.play();
  } else {
    // Fallback to info sound
    playInfoSound();
  }
};

export const initAudio = () => {
  try {
    getAudioContext();
  } catch (e) {
    // Audio context initialization failed - sounds will not work
  }
};
