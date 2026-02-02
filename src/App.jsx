import { useState, useCallback, useEffect, useRef } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import PlanInput from './components/plan/PlanInput';
import TimelineView from './components/timeline/TimelineView';
import DraggableContainer from './components/common/DraggableContainer';
import Logo from './components/common/Logo';
import ActionCallout from './components/callout/ActionCallout';
import RaidPlanDisplay from './components/raidplan/RaidPlanDisplay';
import DevConsole from './components/dev/DevConsole';
import ConfigDialog from './components/config/ConfigDialog';
import HelpDialog from './components/help/HelpDialog';
import TutorialTooltip from './components/tutorial/TutorialTooltip';
import TutorialOverlay from './components/tutorial/TutorialOverlay';
import { decodePlan } from './utils/planCodec';
import { validatePlan } from './utils/planValidator';
import useFightTimer from './hooks/useFightTimer';
import { useCallout } from './hooks/useCallout';
import useRaidPlan from './hooks/useRaidPlan';
import useConfig, { isRoleValidForJob } from './hooks/useConfig';
import usePlayerJob from './hooks/usePlayerJob';
import useActionSound from './hooks/useActionSound';
import useActionTTS from './hooks/useActionTTS';
import useCombatEvents from './hooks/useCombatEvents';
import usePlanLibrary from './hooks/usePlanLibrary';
import useTutorial from './hooks/useTutorial';
import {
  MAX_TIMELINE_ITEMS,
  TIMELINE_WINDOW_SECONDS,
  STORAGE_KEYS,
  DEFAULT_TIMELINE,
  DEFAULT_CALLOUT,
  DEFAULT_RAIDPLAN,
} from './config/overlayConfig';
import styles from './App.module.css';

/**
 * Check if dev console should be available.
 * Only enabled when VITE_DEV_CONSOLE_ENABLED is explicitly set to 'true'.
 */
const isDevConsoleEnabled = () => import.meta.env.VITE_DEV_CONSOLE_ENABLED === 'true';

const DEV_CONSOLE_AVAILABLE = isDevConsoleEnabled();

/**
 * Main XRT Application Component
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

  // Tutorial system for first-run experience
  const { showTutorial, completeTutorial, resetTutorial } = useTutorial();

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

  // Track combat state for callbacks that need it
  const isInCombatRef = useRef(false);

  const combatEvents = useCombatEvents({
    onCombatStart: useCallback(() => {
      console.log(
        '[XRT] Combat started - resetting and starting timer. Was in combat:',
        isInCombatRef.current
      );
      isInCombatRef.current = true;
      reset();
      setTimeout(() => start(), 50);
    }, [reset, start]),
    onCombatEnd: useCallback(() => {
      console.log('[XRT] Combat ended - NOT resetting (phase transition protection)');
      isInCombatRef.current = false;
      // Don't reset on combat end - boss may just be untargetable (phase transition)
      // Timer will reset on wipe, zone change, or next combat start
    }, []),
    onCountdownStart: useCallback(
      (seconds, player) => {
        // Only reset on countdown if not currently in combat
        // Prevents accidental resets if someone starts a countdown mid-fight
        if (!isInCombatRef.current) {
          console.log(`[XRT] Countdown started (${seconds}s by ${player}) - resetting timer`);
          reset();
        } else {
          console.log(`[XRT] Countdown started but IN COMBAT - ignoring reset`);
        }
      },
      [reset]
    ),
    onZoneChange: useCallback(
      (zoneId, zoneName) => {
        console.log(`[XRT] Zone changed to "${zoneName}" (${zoneId}) - resetting timer`);
        isInCombatRef.current = false;
        reset();
        handleZoneAutoLoad(zoneName);
      },
      [reset, handleZoneAutoLoad]
    ),
    onWipe: useCallback(() => {
      console.log('[XRT] Wipe detected - resetting timer');
      isInCombatRef.current = false;
      reset();
    }, [reset]),
  });

  const calloutData = useCallout(plan, currentTime, {
    showOwnOnly: config.showOwnActionsOnly,
    playerJob,
    playerRole: config.playerRole,
  });

  // Raid plan image display hook
  const raidPlanData = useRaidPlan(plan, currentTime);

  useActionSound(calloutData, config.enableSound, config.soundType);
  useActionTTS(calloutData, config.enableVoiceCountdown, config.enableVoiceActions);

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

  const handleToggleUILock = useCallback(() => {
    setIsUILocked((prev) => {
      // If locking the UI and tutorial is showing, complete the tutorial
      if (!prev && showTutorial) {
        completeTutorial();
      }
      return !prev;
    });
  }, [showTutorial, completeTutorial]);

  const handleToggleDevConsole = useCallback(() => setIsDevConsoleVisible((prev) => !prev), []);

  const handlePlanLoad = useCallback(
    (base64String) => {
      console.log('[XRT] Attempting to load plan...');
      setPlanError('');
      const decodeResult = decodePlan(base64String);
      if (!decodeResult.success) {
        console.error('[XRT] Decode failed:', decodeResult.error);
        setPlanError(decodeResult.error);
        return false;
      }
      console.log('[XRT] Decoded plan:', decodeResult.data);
      const validation = validatePlan(decodeResult.data);
      if (!validation.valid) {
        console.error('[XRT] Validation failed:', validation.errors);
        setPlanError(validation.errors.join('. '));
        return false;
      }
      if (validation.warnings.length > 0) {
        console.warn('[XRT] Validation warnings:', validation.warnings);
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
      console.log('[XRT] Plan loaded successfully:', loadedPlan.fightName || loadedPlan.name);
      return true;
    },
    [addImportedPlan]
  );

  const handleImport = useCallback(() => {
    if (!importValue.trim()) {
      console.warn('[XRT] Import attempted with empty value');
      return;
    }
    console.log('[XRT] Importing from text input, length:', importValue.trim().length);
    const success = handlePlanLoad(importValue.trim());
    if (success) {
      setImportValue('');
    } else {
      console.error('[XRT] Import failed - check planError state');
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

  // Gameplay mode: UI is locked, hide all controls for clean gameplay view
  const isGameplayMode = isUILocked;

  // Show unlock indicator when ACT overlay is not locked
  const showUnlockIndicator = !isLocked;

  return (
    <div
      className={`${styles.app} ${isGameplayMode ? styles.gameplayMode : ''} ${showUnlockIndicator ? styles.overlayUnlocked : ''}`}
    >
      {/* Overlay unlock indicator - shows bounds and resize handle when ACT overlay is unlocked */}
      {showUnlockIndicator && (
        <>
          <div className={styles.unlockBadge}>
            <span>🔓</span>
            <span>Overlay Unlocked</span>
          </div>
          <div className={styles.resizeHandle}>
            <div className={styles.resizeGrip}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </>
      )}

      {/* Tutorial backdrop overlay */}
      <TutorialOverlay
        isActive={showTutorial}
        isOverlayLocked={isLocked}
        onDismiss={completeTutorial}
      />

      <div className={styles.canvas}>
        {isLocked && (
          <TutorialTooltip contentKey="lock" show={showTutorial} side="bottom" align="end">
            <button
              className={`${styles.uiLockToggle} ${showTutorial ? styles.tutorialHighlight : ''}`}
              onClick={handleToggleUILock}
              title={isUILocked ? 'Unlock UI to reposition elements' : 'Lock UI for gameplay'}
            >
              {isUILocked ? '🔒' : '🔓'}
            </button>
          </TutorialTooltip>
        )}

        <TutorialTooltip contentKey="timeline" show={showTutorial} side="right" align="start">
          <DraggableContainer
            storageKeyPosition={STORAGE_KEYS.TIMELINE_POSITION}
            storageKeySize={STORAGE_KEYS.TIMELINE_SIZE}
            defaultPosition={{ x: DEFAULT_TIMELINE.x, y: DEFAULT_TIMELINE.y }}
            defaultSize={{ width: DEFAULT_TIMELINE.width, height: DEFAULT_TIMELINE.height }}
            label="Timeline"
            isLocked={isUILocked}
            tutorialHighlight={showTutorial}
          >
            {plan ? (
              <TimelineView
                plan={plan}
                currentTime={currentTime}
                windowSeconds={TIMELINE_WINDOW_SECONDS}
                maxItems={MAX_TIMELINE_ITEMS}
                isLocked={isUILocked}
                showOwnOnly={config.showOwnActionsOnly}
                playerJob={playerJob}
                playerRole={config.playerRole}
              />
            ) : (
              <div className={styles.emptyContainer}>
                <p>No plan loaded</p>
              </div>
            )}
          </DraggableContainer>
        </TutorialTooltip>

        <TutorialTooltip contentKey="callout" show={showTutorial} side="right" align="start">
          <DraggableContainer
            storageKeyPosition={STORAGE_KEYS.CALLOUT_POSITION}
            storageKeySize={STORAGE_KEYS.CALLOUT_SIZE}
            defaultPosition={{ x: DEFAULT_CALLOUT.x, y: DEFAULT_CALLOUT.y }}
            defaultSize={{ width: DEFAULT_CALLOUT.width, height: DEFAULT_CALLOUT.height }}
            label="Callout"
            isLocked={isUILocked}
            tutorialHighlight={showTutorial}
          >
            <ActionCallout
              calloutData={calloutData}
              isLocked={isUILocked}
              isEmpty={!calloutData}
              showPlaceholder={!isUILocked}
              showNotes={config.showNotes}
            />
          </DraggableContainer>
        </TutorialTooltip>

        {/* Raid Plan Image Display - shows strategy images at defined times */}
        {config.enableRaidPlan && (raidPlanData || !isUILocked) && (
          <DraggableContainer
            storageKeyPosition={STORAGE_KEYS.RAIDPLAN_POSITION}
            storageKeySize={STORAGE_KEYS.RAIDPLAN_SIZE}
            defaultPosition={{ x: DEFAULT_RAIDPLAN.x, y: DEFAULT_RAIDPLAN.y }}
            defaultSize={{ width: DEFAULT_RAIDPLAN.width, height: DEFAULT_RAIDPLAN.height }}
            label="Raid Plan"
            isLocked={isUILocked}
          >
            <RaidPlanDisplay
              raidPlan={raidPlanData}
              isLocked={isUILocked}
              showPlaceholder={!isUILocked}
            />
          </DraggableContainer>
        )}

        {DEV_CONSOLE_AVAILABLE && isDevConsoleVisible && (
          <div className={styles.devConsoleWrapper}>
            <DevConsole
              currentTime={currentTime}
              isRunning={isRunning}
              onStart={start}
              onStop={stop}
              onReset={reset}
              isHidden={isUILocked}
              combatState={combatEvents}
            />
          </div>
        )}
      </div>

      {!isUILocked && (
        <div className={styles.controlBar}>
          <div className={styles.controlInfo}>
            <Logo size={21} className={styles.logo} />
            <span className={styles.title}>XRT</span>
            {plan && <span className={styles.planStatus}>| {plan.fightName || 'Plan loaded'}</span>}
            {plan?.requiresRoles && !isRoleValidForJob(config.playerRole, playerJob) && (
              <span className={styles.roleWarning}>⚠️ Select role in Settings</span>
            )}
          </div>

          <div className={styles.controlActions}>
            <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
            <TutorialTooltip contentKey="settings" show={showTutorial} side="top" align="center">
              <div>
                <ConfigDialog
                  open={isConfigOpen}
                  onOpenChange={setIsConfigOpen}
                  config={config}
                  onConfigChange={updateConfig}
                  playerJob={playerJob}
                  playerName={playerName}
                  onShowTutorial={resetTutorial}
                />
              </div>
            </TutorialTooltip>
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
            <TutorialTooltip contentKey="loadPlan" show={showTutorial} side="top" align="end">
              <div>
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
            </TutorialTooltip>
          </div>
        </div>
      )}
      <SpeedInsights />
    </div>
  );
};

export default App;
