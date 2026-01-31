import { useState, useCallback, useEffect } from 'react';
import PlanInput from './components/plan/PlanInput';
import TimelineView from './components/timeline/TimelineView';
import DraggableContainer from './components/common/DraggableContainer';
import MitigationCallout from './components/callout/MitigationCallout';
import DevConsole from './components/dev/DevConsole';
import ConfigDialog from './components/config/ConfigDialog';
import { decodePlan } from './utils/planCodec';
import { validatePlan, getPlanSummary } from './utils/planValidator';
import useFightTimer from './hooks/useFightTimer';
import { useCallout } from './hooks/useCallout';
import useConfig from './hooks/useConfig';
import usePlayerJob from './hooks/usePlayerJob';
import {
  MAX_TIMELINE_ITEMS,
  TIMELINE_WINDOW_SECONDS,
  STORAGE_KEYS,
  DEFAULT_TIMELINE,
  DEFAULT_CALLOUT,
} from './config/overlayConfig';
import styles from './App.module.css';

/**
 * Check if dev console should be available
 * Only enabled when VITE_DEV_CONSOLE_ENABLED is 'true' or in development mode
 */
const isDevConsoleEnabled = () => {
  // Check explicit environment variable
  if (import.meta.env.VITE_DEV_CONSOLE_ENABLED === 'true') {
    return true;
  }
  // Also enable in development mode (localhost)
  if (import.meta.env.DEV) {
    return true;
  }
  return false;
};

const DEV_CONSOLE_AVAILABLE = isDevConsoleEnabled();

/**
 * Main Mitplan Application Component
 *
 * State Machine:
 * 1. Lock overlay OFF (ACT): Full UI, user drags entire window
 * 2. Lock overlay ON (ACT): Window locked, two sub-states:
 *    a. UI Unlocked (our toggle): Can drag Timeline/Callout elements
 *    b. UI Locked (our toggle): Elements stay in place, gameplay mode
 */
const App = () => {
  // Load saved plan from localStorage on initial render
  const [plan, setPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOADED_PLAN);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Restored plan from localStorage:', parsed.fightName || 'Unnamed plan');
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to restore plan from localStorage:', e);
    }
    return null;
  });
  const [planError, setPlanError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // ACT's lock overlay state
  const [isLocked, setIsLocked] = useState(false);

  // Our internal UI lock state (only matters when isLocked is true)
  const [isUILocked, setIsUILocked] = useState(false);

  // Dev console visibility toggle
  const [isDevConsoleVisible, setIsDevConsoleVisible] = useState(false);

  // Config dialog visibility toggle
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Fight timer for controlling timeline and callouts
  const { currentTime, isRunning, start, stop, reset } = useFightTimer();

  // Config hook for settings persistence
  const { config, updateConfig } = useConfig();

  // Player job detection from ACT/OverlayPlugin
  const { playerJob, playerName } = usePlayerJob();

  // Get current callout based on timer (with filtering options)
  const calloutData = useCallout(plan, currentTime, {
    showOwnOnly: config.showOwnMitigationsOnly,
    playerJob,
  });

  /**
   * Listen for OverlayPlugin lock state changes
   */
  useEffect(() => {
    const handleOverlayStateUpdate = (e) => {
      if (e.detail && typeof e.detail.isLocked === 'boolean') {
        setIsLocked(e.detail.isLocked);
        // When ACT unlocks, reset our UI lock state
        if (!e.detail.isLocked) {
          setIsUILocked(false);
        }
      }
    };

    document.addEventListener('onOverlayStateUpdate', handleOverlayStateUpdate);
    return () => {
      document.removeEventListener('onOverlayStateUpdate', handleOverlayStateUpdate);
    };
  }, []);

  /**
   * Toggle our internal UI lock state
   */
  const handleToggleUILock = useCallback(() => {
    setIsUILocked((prev) => !prev);
  }, []);

  /**
   * Toggle dev console visibility
   */
  const handleToggleDevConsole = useCallback(() => {
    setIsDevConsoleVisible((prev) => !prev);
  }, []);

  /**
   * Handle plan loading from Base64 input
   */
  const handlePlanLoad = useCallback((base64String) => {
    setPlanError('');

    const decodeResult = decodePlan(base64String);
    if (!decodeResult.success) {
      setPlanError(decodeResult.error);
      return;
    }

    const validation = validatePlan(decodeResult.data);
    if (!validation.valid) {
      setPlanError(validation.errors.join('. '));
      return;
    }

    if (validation.warnings.length > 0) {
      console.warn('Plan warnings:', validation.warnings);
    }

    const summary = getPlanSummary(decodeResult.data);
    console.log('Plan loaded:', summary);

    // Save to localStorage for persistence across sessions
    try {
      localStorage.setItem(STORAGE_KEYS.LOADED_PLAN, JSON.stringify(decodeResult.data));
    } catch (e) {
      console.warn('Failed to save plan to localStorage:', e);
    }

    setPlan(decodeResult.data);
    setDialogOpen(false);
    setPlanError('');
  }, []);

  /**
   * Clear the loaded plan
   */
  const handleClearPlan = useCallback(() => {
    // Remove from localStorage
    try {
      localStorage.removeItem(STORAGE_KEYS.LOADED_PLAN);
    } catch (e) {
      console.warn('Failed to remove plan from localStorage:', e);
    }

    setPlan(null);
    setPlanError('');
  }, []);

  // Determine if we should show fully transparent background (gameplay mode)
  const isGameplayMode = isLocked && isUILocked;

  return (
    <div className={`${styles.app} ${isGameplayMode ? styles.gameplayMode : ''}`}>
      {/* Main Canvas - contains draggable elements */}
      <div className={styles.canvas}>
        {/* UI Lock Toggle - shows in top-right when ACT overlay is locked */}
        {isLocked && (
          <button
            className={styles.uiLockToggle}
            onClick={handleToggleUILock}
            title={isUILocked ? 'Unlock UI to reposition elements' : 'Lock UI for gameplay'}
          >
            {isUILocked ? '🔒' : '🔓'}
          </button>
        )}

        {/* Timeline Container - draggable and resizable */}
        <DraggableContainer
          storageKeyPosition={STORAGE_KEYS.TIMELINE_POSITION}
          storageKeySize={STORAGE_KEYS.TIMELINE_SIZE}
          defaultPosition={{ x: DEFAULT_TIMELINE.x, y: DEFAULT_TIMELINE.y }}
          defaultSize={{ width: DEFAULT_TIMELINE.width, height: DEFAULT_TIMELINE.height }}
          label="Timeline"
          isLocked={!isLocked || isUILocked}
        >
          {plan ? (
            <TimelineView
              plan={plan}
              currentTime={currentTime}
              windowSeconds={TIMELINE_WINDOW_SECONDS}
              maxItems={MAX_TIMELINE_ITEMS}
              isLocked={!isLocked || isUILocked}
              showOwnOnly={config.showOwnMitigationsOnly}
              playerJob={playerJob}
            />
          ) : (
            <div className={styles.emptyContainer}>
              <p>No plan loaded</p>
            </div>
          )}
        </DraggableContainer>

        {/* Callout Container - draggable and resizable */}
        <DraggableContainer
          storageKeyPosition={STORAGE_KEYS.CALLOUT_POSITION}
          storageKeySize={STORAGE_KEYS.CALLOUT_SIZE}
          defaultPosition={{ x: DEFAULT_CALLOUT.x, y: DEFAULT_CALLOUT.y }}
          defaultSize={{ width: DEFAULT_CALLOUT.width, height: DEFAULT_CALLOUT.height }}
          label="Callout"
          isLocked={!isLocked || isUILocked}
        >
          <MitigationCallout
            calloutData={calloutData}
            isLocked={!isLocked || isUILocked}
            isEmpty={!calloutData}
            showPlaceholder={!isLocked || !isUILocked}
            showNotes={config.showNotes}
          />
        </DraggableContainer>

        {/* Dev Console - for testing timer and mitigations (only when enabled and visible) */}
        {DEV_CONSOLE_AVAILABLE && isDevConsoleVisible && (
          <div className={styles.devConsoleWrapper}>
            <DevConsole
              currentTime={currentTime}
              isRunning={isRunning}
              onStart={start}
              onStop={stop}
              onReset={reset}
              isHidden={isLocked && isUILocked}
            />
          </div>
        )}
      </div>

      {/* Control Bar - fixed at bottom, hidden only when UI is locked */}
      {!(isLocked && isUILocked) && (
        <div className={styles.controlBar}>
          <div className={styles.controlInfo}>
            <span className={styles.logo}>🛡️</span>
            <span className={styles.title}>Mitplan</span>
            {plan && <span className={styles.planStatus}>• {plan.fightName || 'Plan loaded'}</span>}
          </div>

          <div className={styles.controlActions}>
            {/* Config Dialog Toggle */}
            <ConfigDialog
              open={isConfigOpen}
              onOpenChange={setIsConfigOpen}
              config={config}
              onConfigChange={updateConfig}
              playerJob={playerJob}
              playerName={playerName}
            />
            {/* Dev Console Toggle - only shown when feature is enabled */}
            {DEV_CONSOLE_AVAILABLE && (
              <button
                className={`${styles.devToggleButton} ${isDevConsoleVisible ? styles.devToggleActive : ''}`}
                onClick={handleToggleDevConsole}
                title={isDevConsoleVisible ? 'Hide Dev Console' : 'Show Dev Console'}
              >
                🛠️
              </button>
            )}
            {plan && (
              <button className={styles.clearButton} onClick={handleClearPlan}>
                Clear
              </button>
            )}
            <PlanInput
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onPlanLoad={handlePlanLoad}
              error={planError}
              isOverlayLocked={isLocked}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
