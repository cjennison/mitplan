import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook to manage fight timer state with start/stop/reset controls.
 * Uses refs to avoid stale closure issues in interval callbacks.
 */
const useFightTimer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const lastTickRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    isRunningRef.current = false;
  }, []);

  const start = useCallback(() => {
    if (isRunningRef.current) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(true);
    isRunningRef.current = true;
    lastTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setCurrentTime((prev) => prev + delta);
    }, 100);
  }, []);

  const reset = useCallback(() => {
    stop();
    setCurrentTime(0);
  }, [stop]);

  const toggle = useCallback(() => {
    if (isRunningRef.current) {
      stop();
    } else {
      start();
    }
  }, [start, stop]);

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
