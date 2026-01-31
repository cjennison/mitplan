/**
 * Sound utilities for playing notification sounds
 *
 * Uses the Web Audio API to generate simple alert sounds without
 * requiring external sound files.
 */

// Audio context singleton - created on first use
let audioContext = null;

/**
 * Get or create the AudioContext
 * Must be called after user interaction (browser requirement)
 */
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

/**
 * Play a simple beep/tone sound
 *
 * @param {Object} options - Sound options
 * @param {number} options.frequency - Frequency in Hz (default 880 = A5)
 * @param {number} options.duration - Duration in seconds (default 0.15)
 * @param {number} options.volume - Volume 0-1 (default 0.3)
 * @param {string} options.type - Oscillator type: 'sine', 'square', 'triangle', 'sawtooth' (default 'sine')
 */
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

/**
 * Play an "alert" sound - a quick double beep
 * Used when a mitigation needs to be used NOW
 */
export const playAlertSound = () => {
  // First beep
  playTone({ frequency: 880, duration: 0.1, volume: 0.25, type: 'sine' });
  // Second beep (slightly higher, slight delay)
  setTimeout(() => {
    playTone({ frequency: 1046, duration: 0.1, volume: 0.25, type: 'sine' });
  }, 120);
};

/**
 * Play a softer "info" sound - single lower tone
 * Could be used for approaching mitigations
 */
export const playInfoSound = () => {
  playTone({ frequency: 660, duration: 0.12, volume: 0.2, type: 'sine' });
};

/**
 * Play an "alarm" sound - urgent triple beep
 * Could be used for critical/missed mitigations
 */
export const playAlarmSound = () => {
  playTone({ frequency: 1046, duration: 0.08, volume: 0.3, type: 'square' });
  setTimeout(() => {
    playTone({ frequency: 1046, duration: 0.08, volume: 0.3, type: 'square' });
  }, 100);
  setTimeout(() => {
    playTone({ frequency: 1318, duration: 0.12, volume: 0.3, type: 'square' });
  }, 200);
};

/**
 * Pre-warm the audio context. Call on user interaction to ensure sounds work.
 */
export const initAudio = () => {
  try {
    getAudioContext();
  } catch (e) {
    // Audio context initialization failed - sounds will not work
  }
};
