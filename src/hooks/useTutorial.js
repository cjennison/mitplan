import { useState, useCallback } from 'react';

const TUTORIAL_STORAGE_KEY = 'xrt-tutorial-completed';

export const TUTORIAL_CONTENT = {
  callout: {
    title: 'Action Callout',
    description: 'Drag this to where you want action alerts to appear during combat.',
  },
  timeline: {
    title: 'Timeline View',
    description: 'Drag to reposition and resize to show more or fewer upcoming actions.',
  },
  raidPlan: {
    title: 'Raid Plan',
    description: 'Shows strategy images at defined times. Drag to reposition for your layout.',
  },
  settings: {
    title: 'Settings',
    description: 'Configure sound alerts, job filtering, and display options.',
  },
  loadPlan: {
    title: 'Load Plan',
    description: 'Load raid plans from presets or import custom plans.',
  },
  lock: {
    title: 'Lock Interface',
    description:
      "Click to lock the overlay when you're done positioning. This hides all controls for gameplay.",
  },
};

const useTutorial = () => {
  const [showTutorial, setShowTutorial] = useState(() => {
    try {
      const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      return completed !== 'true';
    } catch {
      // If localStorage fails, don't show tutorial
      return false;
    }
  });

  const completeTutorial = useCallback(() => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch {
      // Ignore localStorage errors
    }
    setShowTutorial(false);
  }, []);

  const resetTutorial = useCallback(() => {
    try {
      localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    } catch {
      // Ignore localStorage errors
    }
    setShowTutorial(true);
  }, []);

  return {
    showTutorial,
    completeTutorial,
    resetTutorial,
  };
};

export default useTutorial;
