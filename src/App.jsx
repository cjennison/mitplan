import { useState, useCallback, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import PlanInput from './components/plan/PlanInput';
import TimelineView from './components/timeline/TimelineView';
import DraggableContainer from './components/common/DraggableContainer';
import Logo from './components/common/Logo';
import MitigationCallout from './components/callout/MitigationCallout';
import DevConsole from './components/dev/DevConsole';
import ConfigDialog from './components/config/ConfigDialog';
import HelpDialog from './components/help/HelpDialog';
import { decodePlan } from './utils/planCodec';
import { validatePlan } from './utils/planValidator';
import useFightTimer from './hooks/useFightTimer';
import { useCallout } from './hooks/useCallout';
import useConfig, { isRoleValidForJob } from './hooks/useConfig';
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
 * Only enabled when VITE_DEV_CONSOLE_ENABLED is explicitly set to 'true'.
 */
const isDevConsoleEnabled = () => import.meta.env.VITE_DEV_CONSOLE_ENABLED === 'true';

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
  const [importValue, setImportValue] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isUILocked, setIsUILocked] = useState(false);
  const [isDevConsoleVisible, setIsDevConsoleVisible] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Hooks that provide data (must come before callbacks that use them)
  const { config, updateConfig } = useConfig();
  const { playerJob, playerName } = usePlayerJob();
  const {
    presets,
    importedPlans,
    addImportedPlan,
    removeImportedPlan,
    setDefaultPlan,
    isPlanDefault,
    getDefaultPlanForZone,
  } = usePlanLibrary();

  const { currentTime, isRunning, start, stop, reset } = useFightTimer();

  // Auto-load default plan for zone (memoized to avoid recreating on each render)
  const handleZoneAutoLoad = useCallback(
    (zoneName) => {
      const defaultPlan = getDefaultPlanForZone(zoneName);
      if (defaultPlan) {
        // Load the default plan for this zone
        try {
          localStorage.setItem(STORAGE_KEYS.LOADED_PLAN, JSON.stringify(defaultPlan));
        } catch {
          // Ignore localStorage errors
        }
        setPlan(defaultPlan);
        setPlanError('');
      } else {
        // No default plan for this zone - clear the current plan
        try {
          localStorage.removeItem(STORAGE_KEYS.LOADED_PLAN);
        } catch {
          // Ignore localStorage errors
        }
        setPlan(null);
        setPlanError('');
      }
    },
    [getDefaultPlanForZone]
  );

  const combatEvents = useCombatEvents({
    onCombatStart: useCallback(() => {
      reset();
      setTimeout(() => start(), 50);
    }, [reset, start]),
    onCombatEnd: useCallback(() => {
      reset();
    }, [reset]),
    onCountdownStart: useCallback(() => {
      reset();
    }, [reset]),
    onZoneChange: useCallback(
      (zoneId, zoneName) => {
        reset();
        handleZoneAutoLoad(zoneName);
      },
      [reset, handleZoneAutoLoad]
    ),
    onWipe: useCallback(() => {
      reset();
    }, [reset]),
  });

  const calloutData = useCallout(plan, currentTime, {
    showOwnOnly: config.showOwnMitigationsOnly,
    playerJob,
    playerRole: config.playerRole,
  });

  useMitigationSound(calloutData, config.enableSound, config.soundType);

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

  const handlePlanLoad = useCallback(
    (base64String) => {
      setPlanError('');
      const decodeResult = decodePlan(base64String);
      if (!decodeResult.success) {
        setPlanError(decodeResult.error);
        return false;
      }
      const validation = validatePlan(decodeResult.data);
      if (!validation.valid) {
        setPlanError(validation.errors.join('. '));
        return false;
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
      return true;
    },
    [addImportedPlan]
  );

  const handleImport = useCallback(() => {
    if (!importValue.trim()) return;
    const success = handlePlanLoad(importValue.trim());
    if (success) {
      setImportValue('');
    }
  }, [importValue, handlePlanLoad]);

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
              playerRole={config.playerRole}
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
            <Logo size={21} className={styles.logo} />
            <span className={styles.title}>Mitplan</span>
            {plan && <span className={styles.planStatus}>| {plan.fightName || 'Plan loaded'}</span>}
            {plan?.requiresRoles && !isRoleValidForJob(config.playerRole, playerJob) && (
              <span className={styles.roleWarning}>⚠️ Select role in Settings</span>
            )}
          </div>

          <div className={styles.controlActions}>
            <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
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
            <div className={styles.importGroup}>
              <input
                type="text"
                className={styles.importInput}
                placeholder="Paste plan..."
                value={importValue}
                onChange={(e) => setImportValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleImport();
                  }
                }}
              />
              <button
                className={styles.importButton}
                onClick={handleImport}
                disabled={!importValue.trim()}
              >
                Import
              </button>
            </div>
            <PlanInput
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onPlanSelect={handlePlanSelect}
              onDeletePlan={removeImportedPlan}
              onSetDefault={setDefaultPlan}
              isPlanDefault={isPlanDefault}
              error={planError}
              presets={presets}
              importedPlans={importedPlans}
              playerJob={playerJob}
              playerRole={config.playerRole}
            />
          </div>
        </div>
      )}
      <SpeedInsights />
    </div>
  );
};

export default App;
