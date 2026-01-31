import { useState, useCallback, useEffect } from 'react';
import PlanInput from './components/plan/PlanInput';
import TimelineView from './components/timeline/TimelineView';
import { decodePlan } from './utils/planCodec';
import { validatePlan, getPlanSummary } from './utils/planValidator';
import styles from './App.module.css';

/**
 * Main Mitplan Application Component
 *
 * Handles:
 * - Plan loading via Base64 input
 * - Plan validation and error display
 * - Timeline view rendering
 * - Locked/unlocked overlay mode (controlled by ACT OverlayPlugin)
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
    // Reset previous errors
    setPlanError('');

    // Decode the Base64 string
    const decodeResult = decodePlan(base64String);

    if (!decodeResult.success) {
      setPlanError(decodeResult.error);
      return;
    }

    // Validate the plan schema
    const validation = validatePlan(decodeResult.data);

    if (!validation.valid) {
      setPlanError(validation.errors.join('. '));
      return;
    }

    // Log warnings if any
    if (validation.warnings.length > 0) {
      console.warn('Plan warnings:', validation.warnings);
    }

    // Log plan summary
    const summary = getPlanSummary(decodeResult.data);
    console.log('Plan loaded:', summary);

    // Set the plan and close dialog
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

  // When locked, show minimal overlay with just the timeline
  if (isLocked) {
    return (
      <div className={styles.appLocked}>
        {/* Minimal Timeline View - only upcoming mitigations */}
        {plan && (
          <TimelineView
            plan={plan}
            currentTime={0}
            windowSeconds={30}
            isLocked={true}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.title}>
          <span className={styles.logo}>🛡️</span>
          <span>Mitplan</span>
        </div>

        <PlanInput
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onPlanLoad={handlePlanLoad}
          error={planError}
        />
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {!plan ? (
          // Empty State
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <p className={styles.emptyText}>
              No mitigation plan loaded. Click "Load Mitigation Plan" to get started.
            </p>
          </div>
        ) : (
          // Plan Loaded State
          <div className={styles.planLoaded}>
            {/* Status Bar */}
            <div className={styles.statusBar}>
              <span className={styles.statusText}>
                ✓ Plan loaded: {plan.fightName || 'Unknown Fight'}
              </span>
              <button className={styles.clearButton} onClick={handleClearPlan}>
                Clear
              </button>
            </div>

            {/* Timeline View */}
            <div className={styles.timelineContainer}>
              <TimelineView plan={plan} currentTime={0} windowSeconds={30} isLocked={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
