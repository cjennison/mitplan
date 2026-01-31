import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Combat state types
 * @typedef {'idle' | 'countdown' | 'combat' | 'ended'} CombatState
 */

/**
 * Localized patterns for detecting fight events from log lines
 * These match the patterns used by Cactbot for consistency
 */
const ENGAGE_PATTERNS = {
  en: /Engage!/,
  de: /Start!/,
  fr: /À l'attaque\s*!/,
  ja: /戦闘開始！/,
  cn: /战斗开始！/,
  ko: /전투 시작!/,
};

/**
 * Patterns for countdown start messages
 * Line type 268 (0x10C) - Countdown
 * Format: 268|timestamp|playerHexId|worldId|countdownTime|result|playerName|hash
 */
const COUNTDOWN_LINE_TYPE = '268';

/**
 * Patterns for countdown cancel messages
 * Line type 269 (0x10D) - CountdownCancel
 */
const COUNTDOWN_CANCEL_LINE_TYPE = '269';

/**
 * Log line type 00 (GameLog) codes for chat/system messages
 */
const GAMELOG_TYPE = '00';
const GAMELOG_ENGAGE_CODE = '0039'; // System messages including "Engage!"

/**
 * ActorControl line type 33 (0x21) - used for wipe detection
 * Network6D line type 33 with command 40000010 = fade to black (wipe starting)
 * Network6D line type 33 with command 80000004 = content reset (wipe complete)
 */
const ACTORCONTROL_LINE_TYPE = '33';
const WIPE_COMMANDS = ['40000010', '80000004', '40000001'];

/**
 * Patterns for detecting wipe via echo commands (Cactbot compatible)
 */
const WIPE_ECHO_PATTERNS = [/cactbot wipe/i, /wipe/i];

/**
 * Check if the OverlayPlugin API is available
 */
const isOverlayPluginAvailable = () => {
  return (
    typeof window !== 'undefined' &&
    (typeof window.addOverlayListener === 'function' ||
      typeof window.OverlayPluginApi !== 'undefined')
  );
};

/**
 * Custom hook to track combat state from ACT/OverlayPlugin events
 *
 * This hook listens to game events and provides:
 * - Current combat state (idle, countdown, combat, ended)
 * - Zone information
 * - Callbacks for combat state transitions
 *
 * Events tracked:
 * - onInCombatChangedEvent: Direct combat state from ACT
 * - ChangeZone: Zone changes (resets combat state)
 * - LogLine: Countdown and engage messages
 *
 * @param {Object} options - Hook options
 * @param {Function} options.onCombatStart - Called when combat starts (engage)
 * @param {Function} options.onCombatEnd - Called when combat ends
 * @param {Function} options.onCountdownStart - Called when countdown begins (with seconds)
 * @param {Function} options.onZoneChange - Called when zone changes
 * @param {Function} options.onWipe - Called on party wipe
 * @returns {Object} Combat state and zone info
 */
const useCombatEvents = ({
  onCombatStart,
  onCombatEnd,
  onCountdownStart,
  onZoneChange,
  onWipe,
} = {}) => {
  // Current combat state
  const [combatState, setCombatState] = useState('idle');

  // In-game combat flag from ACT
  const [inGameCombat, setInGameCombat] = useState(false);

  // ACT combat flag (parsing)
  const [inACTCombat, setInACTCombat] = useState(false);

  // Current zone info
  const [zoneId, setZoneId] = useState(null);
  const [zoneName, setZoneName] = useState('');

  // Countdown state
  const [countdownSeconds, setCountdownSeconds] = useState(null);
  const [countdownPlayer, setCountdownPlayer] = useState(null);

  // Refs for callbacks to avoid stale closures
  const onCombatStartRef = useRef(onCombatStart);
  const onCombatEndRef = useRef(onCombatEnd);
  const onCountdownStartRef = useRef(onCountdownStart);
  const onZoneChangeRef = useRef(onZoneChange);
  const onWipeRef = useRef(onWipe);

  // Refs for state to avoid stale closures in event handlers
  const inGameCombatRef = useRef(false);
  const combatStateRef = useRef('idle');

  // Keep callback refs updated
  useEffect(() => {
    onCombatStartRef.current = onCombatStart;
    onCombatEndRef.current = onCombatEnd;
    onCountdownStartRef.current = onCountdownStart;
    onZoneChangeRef.current = onZoneChange;
    onWipeRef.current = onWipe;
  }, [onCombatStart, onCombatEnd, onCountdownStart, onZoneChange, onWipe]);

  // Keep state refs in sync
  useEffect(() => {
    inGameCombatRef.current = inGameCombat;
  }, [inGameCombat]);

  useEffect(() => {
    combatStateRef.current = combatState;
  }, [combatState]);

  /**
   * Parse a countdown line (type 268)
   * Format: 268|timestamp|playerHexId|worldId|countdownTime|result|playerName|hash
   */
  const parseCountdownLine = useCallback((line) => {
    const parts = line.split('|');
    if (parts.length < 7) return null;

    const countdownTime = parseInt(parts[4], 10);
    const result = parts[5];
    const playerName = parts[6];

    // result '00' means success, anything else is failure
    if (result !== '00') return null;

    return {
      seconds: countdownTime,
      player: playerName,
    };
  }, []);

  /**
   * Check if a GameLog line is an "Engage!" message
   */
  const isEngageMessage = useCallback((line) => {
    const parts = line.split('|');
    if (parts.length < 5) return false;

    // Check if it's a GameLog (type 00) with engage code
    if (parts[0] !== GAMELOG_TYPE) return false;

    const code = parts[2];
    const message = parts[4] || '';

    // Check for engage code or match engage patterns
    if (code === GAMELOG_ENGAGE_CODE) {
      // Check against all language patterns
      return Object.values(ENGAGE_PATTERNS).some((pattern) => pattern.test(message));
    }

    return false;
  }, []);

  /**
   * Check if a line indicates a wipe
   * Detects ActorControl wipe commands and echo-based wipe triggers
   */
  const isWipeMessage = useCallback((line) => {
    const parts = line.split('|');
    if (parts.length < 3) return false;

    const lineType = parts[0];

    // Check for ActorControl wipe commands (line type 33 / 0x21)
    if (lineType === ACTORCONTROL_LINE_TYPE) {
      // Format: 33|timestamp|instanceId|command|data0|data1|data2|data3
      const command = parts[3]?.toUpperCase();
      if (command && WIPE_COMMANDS.includes(command)) {
        return true;
      }
    }

    // Check for echo-based wipe triggers (GameLog type 00, echo code 0038)
    if (lineType === GAMELOG_TYPE) {
      const code = parts[2];
      const message = parts[4] || '';
      // Echo code is 0038
      if (code === '0038') {
        return WIPE_ECHO_PATTERNS.some((pattern) => pattern.test(message));
      }
    }

    return false;
  }, []);

  /**
   * Handle log line events
   */
  const handleLogLine = useCallback(
    (e) => {
      const line = e.rawLine || (Array.isArray(e.line) ? e.line.join('|') : '');
      if (!line) return;

      const lineType = line.split('|')[0];

      // Check for countdown start (type 268)
      if (lineType === COUNTDOWN_LINE_TYPE) {
        const countdown = parseCountdownLine(line);
        if (countdown) {
          setCountdownSeconds(countdown.seconds);
          setCountdownPlayer(countdown.player);
          setCombatState('countdown');
          combatStateRef.current = 'countdown';
          onCountdownStartRef.current?.(countdown.seconds, countdown.player);
        }
        return;
      }

      // Check for countdown cancel (type 269)
      if (lineType === COUNTDOWN_CANCEL_LINE_TYPE) {
        setCountdownSeconds(null);
        setCountdownPlayer(null);
        if (combatStateRef.current === 'countdown') {
          setCombatState('idle');
          combatStateRef.current = 'idle';
        }
        return;
      }

      // Check for "Engage!" message
      if (isEngageMessage(line)) {
        setCombatState('combat');
        combatStateRef.current = 'combat';
        setCountdownSeconds(null);
        setCountdownPlayer(null);
        onCombatStartRef.current?.();
        return;
      }

      // Check for wipe
      if (isWipeMessage(line)) {
        console.log('[Combat] Wipe detected via log line');
        setCombatState('idle');
        combatStateRef.current = 'idle';
        setCountdownSeconds(null);
        setCountdownPlayer(null);
        setInGameCombat(false);
        inGameCombatRef.current = false;
        setInACTCombat(false);
        onWipeRef.current?.();
        return;
      }
    },
    [parseCountdownLine, isEngageMessage, isWipeMessage]
  );

  /**
   * Handle combat state changes from ACT
   */
  const handleInCombatChanged = useCallback((e) => {
    const detail = e.detail || e;
    const newInGameCombat = detail.inGameCombat ?? false;
    const newInACTCombat = detail.inACTCombat ?? false;

    console.log('[Combat] onInCombatChangedEvent:', {
      newInGameCombat,
      newInACTCombat,
      wasInGameCombat: inGameCombatRef.current,
    });

    const wasInGameCombat = inGameCombatRef.current;

    // Update state
    setInGameCombat(newInGameCombat);
    setInACTCombat(newInACTCombat);
    inGameCombatRef.current = newInGameCombat;

    // Combat started (in-game flag is most reliable for actual combat)
    if (newInGameCombat && !wasInGameCombat) {
      console.log('[Combat] Combat STARTED - triggering onCombatStart');
      // Only trigger if we weren't already in combat state
      if (combatStateRef.current !== 'combat') {
        setCombatState('combat');
        combatStateRef.current = 'combat';
        onCombatStartRef.current?.();
      }
    }

    // Combat ended
    if (!newInGameCombat && wasInGameCombat) {
      console.log('[Combat] Combat ENDED - triggering onCombatEnd');
      setCombatState('ended');
      combatStateRef.current = 'ended';
      setCountdownSeconds(null);
      setCountdownPlayer(null);
      onCombatEndRef.current?.();

      // Reset to idle after a short delay (allows for quick re-pulls)
      setTimeout(() => {
        setCombatState((prev) => {
          if (prev === 'ended') {
            combatStateRef.current = 'idle';
            return 'idle';
          }
          return prev;
        });
      }, 3000);
    }
  }, []); // No dependencies - uses refs for everything

  /**
   * Handle zone changes
   */
  const handleZoneChange = useCallback((e) => {
    const newZoneId = e.zoneID;
    const newZoneName = e.zoneName || '';

    setZoneId(newZoneId);
    setZoneName(newZoneName);

    // Reset combat state on zone change
    setCombatState('idle');
    setCountdownSeconds(null);
    setCountdownPlayer(null);
    setInGameCombat(false);
    setInACTCombat(false);

    onZoneChangeRef.current?.(newZoneId, newZoneName);
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!isOverlayPluginAvailable()) {
      console.log('[useCombatEvents] OverlayPlugin not available, running in browser mode');
      return;
    }

    const addListener = window.addOverlayListener;
    const removeListener = window.removeOverlayListener;

    // Subscribe to events
    addListener('LogLine', handleLogLine);
    addListener('onInCombatChangedEvent', handleInCombatChanged);
    addListener('ChangeZone', handleZoneChange);

    // Start event flow if needed
    if (typeof window.startOverlayEvents === 'function') {
      window.startOverlayEvents();
    }

    // Cleanup
    return () => {
      if (removeListener) {
        removeListener('LogLine', handleLogLine);
        removeListener('onInCombatChangedEvent', handleInCombatChanged);
        removeListener('ChangeZone', handleZoneChange);
      }
    };
  }, [handleLogLine, handleInCombatChanged, handleZoneChange]);

  /**
   * Manually trigger a wipe (useful for testing or manual reset)
   */
  const triggerWipe = useCallback(() => {
    setCombatState('idle');
    setCountdownSeconds(null);
    setCountdownPlayer(null);
    setInGameCombat(false);
    onWipeRef.current?.();
  }, []);

  /**
   * Manually start combat (for dev/testing)
   */
  const manualStartCombat = useCallback(() => {
    setCombatState('combat');
    setInGameCombat(true);
    onCombatStartRef.current?.();
  }, []);

  /**
   * Manually end combat (for dev/testing)
   */
  const manualEndCombat = useCallback(() => {
    setCombatState('ended');
    setInGameCombat(false);
    onCombatEndRef.current?.();
    setTimeout(() => {
      setCombatState((prev) => (prev === 'ended' ? 'idle' : prev));
    }, 1000);
  }, []);

  return {
    // Combat state
    combatState,
    inGameCombat,
    inACTCombat,

    // Zone info
    zoneId,
    zoneName,

    // Countdown info
    countdownSeconds,
    countdownPlayer,

    // Computed helpers
    isInCombat: combatState === 'combat',
    isIdle: combatState === 'idle',
    isCountingDown: combatState === 'countdown',

    // Manual controls (for testing)
    triggerWipe,
    manualStartCombat,
    manualEndCombat,
  };
};

export default useCombatEvents;
