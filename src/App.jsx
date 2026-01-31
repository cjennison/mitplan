import { useState, useCallback, useEffect } from 'react';
import PlanInput from './components/plan/PlanInput';
import TimelineView from './components/timeline/TimelineView';
import DraggableContainer from './components/common/DraggableContainer';
import MitigationCallout from './components/callout/MitigationCallout';
import { decodePlan } from './utils/planCodec';
import { validatePlan, getPlanSummary } from './utils/planValidator';
import {
  MAX_TIMELINE_ITEMS,
  TIMELINE_WINDOW_SECONDS,
  STORAGE_KEYS,
  DEFAULT_TIMELINE,
  DEFAULT_CALLOUT,
} from './config/overlayConfig';
import styles from './App.module.css';

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
  const [plan, setPlan] = useState(null);
  const [planError, setPlanError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // ACT's lock overlay state
  const [isLocked, setIsLocked] = useState(false);

  // Our internal UI lock state (only matters when isLocked is true)
  const [isUILocked, setIsUILocked] = useState(false);

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

    setPlan(decodeResult.data);
    setDialogOpen(false);
    setPlanError('');
  }, []);

  /**
   * Clear the loaded plan
   */
  const handleClearPlan = useCallback(() => {
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
              currentTime={0}
              windowSeconds={TIMELINE_WINDOW_SECONDS}
              maxItems={MAX_TIMELINE_ITEMS}
              isLocked={!isLocked || isUILocked}
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
            abilityName="Shake It Off"
            job="WAR"
            isLocked={!isLocked || isUILocked}
          />
        </DraggableContainer>
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
