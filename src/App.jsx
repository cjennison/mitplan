import { useState, useCallback, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import PlanInput from './components/plan/PlanInput';
import TimelineView from './components/timeline/TimelineView';
import DraggableContainer from './components/common/DraggableContainer';
import MitigationCallout from './components/callout/MitigationCallout';
import DevConsole from './components/dev/DevConsole';
import ConfigDialog from './components/config/ConfigDialog';
import { decodePlan } from './utils/planCodec';
import { validatePlan } from './utils/planValidator';
import useFightTimer from './hooks/useFightTimer';
import { useCallout } from './hooks/useCallout';
import useConfig from './hooks/useConfig';
import usePlayerJob from './hooks/usePlayerJob';
import useMitigationSound from './hooks/useMitigationSound';
import useCombatEvents from './hooks/useCombatEvents';
import usePlanLibrary from './hooks/usePlanLibrary';
import {
  MAX_TIMELINE_ITEMS,
  TIMELINE_WINDOW_SECONDS,
  STORAGE_KEYS,
  DEFAULT_TIMELINE,
  DEFAULT_CALLOUT,
} from './config/overlayConfig';
import styles from './App.module.css';

/**
 * Check if dev console should be available.
 * Enabled when VITE_DEV_CONSOLE_ENABLED is 'true' or in development mode.
 */
const isDevConsoleEnabled = () =>
  import.meta.env.VITE_DEV_CONSOLE_ENABLED === 'true' || import.meta.env.DEV;

const DEV_CONSOLE_AVAILABLE = isDevConsoleEnabled();

/**
 * Main Mitplan Application Component
 */
const App = () => {
  const [plan, setPlan] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOADED_PLAN);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localStorage errors
    }
    return null;
  });
  const [planError, setPlanError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isUILocked, setIsUILocked] = useState(false);
  const [isDevConsoleVisible, setIsDevConsoleVisible] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const { currentTime, isRunning, start, stop, reset } = useFightTimer();

  const combatEvents = useCombatEvents({
    onCombatStart: useCallback(() => { reset(); setTimeout(() => start(), 50); }, [reset, start]),
    onCombatEnd: useCallback(() => { reset(); }, [reset]),
    onCountdownStart: useCallback(() => { reset(); }, [reset]),
    onZoneChange: useCallback(() => { reset(); }, [reset]),
    onWipe: useCallback(() => { reset(); }, [reset]),
  });

  const { config, updateConfig } = useConfig();
  const { playerJob, playerName } = usePlayerJob();
  const { presets, importedPlans, addImportedPlan } = usePlanLibrary();
  const calloutData = useCallout(plan, currentTime, {
    showOwnOnly: config.showOwnMitigationsOnly,
    playerJob,
  });

  useMitigationSound(calloutData, config.enableSound);

  useEffect(() => {
    const handleOverlayStateUpdate = (e) => {
      if (e.detail && typeof e.detail.isLocked === 'boolean') {
        setIsLocked(e.detail.isLocked);
        if (!e.detail.isLocked) setIsUILocked(false);
      }
    };
    document.addEventListener('onOverlayStateUpdate', handleOverlayStateUpdate);
    return () => document.removeEventListener('onOverlayStateUpdate', handleOverlayStateUpdate);
  }, []);

  const handleToggleUILock = useCallback(() => setIsUILocked((prev) => !prev), []);
  const handleToggleDevConsole = useCallback(() => setIsDevConsoleVisible((prev) => !prev), []);

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
    const loadedPlan = decodeResult.data;
    addImportedPlan(loadedPlan);
    try {
      localStorage.setItem(STORAGE_KEYS.LOADED_PLAN, JSON.stringify(loadedPlan));
    } catch {
      // Ignore localStorage errors
    }
    setPlan(loadedPlan);
    setDialogOpen(false);
    setPlanError('');
  }, [addImportedPlan]);

  const handlePlanSelect = useCallback((selectedPlan) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOADED_PLAN, JSON.stringify(selectedPlan));
    } catch {
      // Ignore localStorage errors
    }
    setPlan(selectedPlan);
    setPlanError('');
  }, []);

  const handleClearPlan = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEYS.LOADED_PLAN);
    } catch {
      // Ignore localStorage errors
    }
    setPlan(null);
    setPlanError('');
  }, []);

  const isGameplayMode = isLocked && isUILocked;

  return (
    <div className={`${styles.app} ${isGameplayMode ? styles.gameplayMode : ''}`}>
      <div className={styles.canvas}>
        {isLocked && (
          <button
            className={styles.uiLockToggle}
            onClick={handleToggleUILock}
            title={isUILocked ? 'Unlock UI to reposition elements' : 'Lock UI for gameplay'}
          >
            {isUILocked ? '🔒' : '🔓'}
          </button>
        )}

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

        {DEV_CONSOLE_AVAILABLE && isDevConsoleVisible && (
          <div className={styles.devConsoleWrapper}>
            <DevConsole
              currentTime={currentTime}
              isRunning={isRunning}
              onStart={start}
              onStop={stop}
              onReset={reset}
              isHidden={isLocked && isUILocked}
              combatState={combatEvents}
            />
          </div>
        )}
      </div>

      {!(isLocked && isUILocked) && (
        <div className={styles.controlBar}>
          <div className={styles.controlInfo}>
            <span className={styles.title}>Mitplan</span>
            {plan && <span className={styles.planStatus}>| {plan.fightName || 'Plan loaded'}</span>}
          </div>

          <div className={styles.controlActions}>
            <ConfigDialog
              open={isConfigOpen}
              onOpenChange={setIsConfigOpen}
              config={config}
              onConfigChange={updateConfig}
              playerJob={playerJob}
              playerName={playerName}
            />
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
              onPlanSelect={handlePlanSelect}
              error={planError}
              isOverlayLocked={isLocked}
              presets={presets}
              importedPlans={importedPlans}
            />
          </div>
        </div>
      )}
      <SpeedInsights />
    </div>
  );
};

export default App;
