import { useState, useCallback } from 'react';

/**
 * Storage key for tracking if user has completed the tutorial
 */
const TUTORIAL_STORAGE_KEY = 'xrt-tutorial-completed';

/**
 * Tutorial tooltip content for each element
 */
export const TUTORIAL_CONTENT = {
  callout: {
    title: 'Action Callout',
    description: 'Drag this to where you want action alerts to appear during combat.',
  },
  timeline: {
    title: 'Timeline View',
    description: 'Drag to reposition and resize to show more or fewer upcoming actions.',
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

/**
 * Hook to manage first-run tutorial experience
 *
 * All tooltips show simultaneously until user clicks the lock button.
 *
 * @returns {Object} Tutorial state and controls
 */
const useTutorial = () => {
  // Check if this is the first run (tutorial not completed)
  const [showTutorial, setShowTutorial] = useState(() => {
    try {
      const completed = localStorage.getItem(TUTORIAL_STORAGE_KEY);
      // Show tutorial if never completed
      return completed !== 'true';
    } catch {
      // If localStorage fails, don't show tutorial
      return false;
    }
  });

  /**
   * Mark tutorial as completed and hide all tooltips
   */
  const completeTutorial = useCallback(() => {
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    } catch {
      // Ignore localStorage errors
    }
    setShowTutorial(false);
  }, []);

  /**
   * Reset tutorial to show again (for "Show Tutorial" button in settings)
   */
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
