import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook to manage fight timer state
 *
 * The timer tracks elapsed time in seconds and provides controls to:
 * - Start the timer
 * - Stop/pause the timer
 * - Reset the timer to 0
 *
 * @returns {Object} Timer state and controls
 */
const useFightTimer = () => {
  // Current elapsed time in seconds (can be decimal for smooth updates)
  const [currentTime, setCurrentTime] = useState(0);

  // Whether the timer is currently running
  const [isRunning, setIsRunning] = useState(false);

  // Ref to store the interval ID
  const intervalRef = useRef(null);

  // Ref to store the last timestamp for accurate timing
  const lastTickRef = useRef(null);

  /**
   * Start the fight timer
   */
  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    lastTickRef.current = Date.now();

    // Update every 100ms for smooth countdown display
    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000; // Convert to seconds
      lastTickRef.current = now;

      setCurrentTime((prev) => prev + delta);
    }, 100);
  }, [isRunning]);

  /**
   * Stop/pause the fight timer
   */
  const stop = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning]);

  /**
   * Reset the timer to 0:00
   */
  const reset = useCallback(() => {
    stop();
    setCurrentTime(0);
  }, [stop]);

  /**
   * Toggle between running and stopped
   */
  const toggle = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    currentTime,
    isRunning,
    start,
    stop,
    reset,
    toggle,
  };
};

export default useFightTimer;
