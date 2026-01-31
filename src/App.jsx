import { useState, useCallback, useEffect } from 'react';
import PlanInput from './components/plan/PlanInput';
import TimelineView from './components/timeline/TimelineView';
import { decodePlan } from './utils/planCodec';
import { validatePlan, getPlanSummary } from './utils/planValidator';
import styles from './App.module.css';

/**
 * Main Mitplan Application Component
 *
 * Layout Design:
 * - Timeline is always displayed using the clean "locked" style
 * - When UNLOCKED: drag header at top, timeline in middle, controls at bottom
 * - When LOCKED: only timeline remains (no header, no controls)
 *
 * This ensures the timeline stays where users position it when they lock the overlay.
 */
const App = () => {
  const [plan, setPlan] = useState(null);
  const [planError, setPlanError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  /**
   * Listen for OverlayPlugin lock state changes
   * The OverlayPlugin dispatches 'onOverlayStateUpdate' CustomEvent to document
   * when the user toggles "Lock overlay" in ACT settings
   */
  useEffect(() => {
    const handleOverlayStateUpdate = (e) => {
      if (e.detail && typeof e.detail.isLocked === 'boolean') {
        setIsLocked(e.detail.isLocked);
      }
    };

    document.addEventListener('onOverlayStateUpdate', handleOverlayStateUpdate);

    return () => {
      document.removeEventListener('onOverlayStateUpdate', handleOverlayStateUpdate);
    };
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

  // LOCKED MODE: Timeline stays in exact same position
  // Invisible spacers replace the header and control bar to maintain layout
  if (isLocked) {
    return (
      <div className={styles.appLocked}>
        {/* Invisible spacer - same height as drag header */}
        <div className={styles.lockedHeaderSpacer} />

        {/* Timeline in same position as unlocked */}
        {plan ? (
          <TimelineView plan={plan} currentTime={0} windowSeconds={30} isLocked={true} />
        ) : (
          <div className={styles.lockedEmpty}>No plan loaded</div>
        )}

        {/* Invisible spacer - same height as control bar */}
        <div className={styles.lockedControlSpacer} />
      </div>
    );
  }

  // UNLOCKED MODE: Drag header at top, timeline in middle, controls at bottom
  return (
    <div className={styles.app}>
      {/* Drag Handle Header - helps users position the overlay */}
      <div className={styles.dragHeader}>
        <span className={styles.dragIcon}>⋮⋮</span>
        <span className={styles.dragText}>Drag to position</span>
      </div>

      {/* Timeline Area - uses the clean locked style */}
      <div className={styles.timelineArea}>
        {plan ? (
          <TimelineView plan={plan} currentTime={0} windowSeconds={30} isLocked={true} />
        ) : (
          <div className={styles.emptyTimeline}>
            <p>No mitigations to display</p>
            <p className={styles.emptyHint}>Load a plan below to get started</p>
          </div>
        )}
      </div>

      {/* Control Bar - at the bottom */}
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
          />
        </div>
      </div>
    </div>
  );
};

export default App;
