import { useState, useEffect, useCallback, useRef } from 'react';

const ENGAGE_PATTERNS = {
  en: /Engage!/,
  de: /Start!/,
  fr: /À l'attaque\s*!/,
  ja: /戦闘開始！/,
  cn: /战斗开始！/,
  ko: /전투 시작!/,
};

const COUNTDOWN_LINE_TYPE = '268';
const COUNTDOWN_CANCEL_LINE_TYPE = '269';
const GAMELOG_TYPE = '00';
const GAMELOG_ENGAGE_CODE = '0039';
const ACTORCONTROL_LINE_TYPE = '33';
const WIPE_COMMANDS = ['4000000F', '40000010', '40000005'];
const WIPE_ECHO_PATTERNS = [/cactbot wipe/i, /wipe/i];

const isOverlayPluginAvailable = () =>
  typeof window !== 'undefined' &&
  (typeof window.addOverlayListener === 'function' ||
    typeof window.OverlayPluginApi !== 'undefined');

const useCombatEvents = ({
  onCombatStart,
  onCombatEnd,
  onCountdownStart,
  onZoneChange,
  onWipe,
} = {}) => {
  const [combatState, setCombatState] = useState('idle');
  const [inGameCombat, setInGameCombat] = useState(false);
  const [inACTCombat, setInACTCombat] = useState(false);
  const [zoneId, setZoneId] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState(null);
  const [countdownPlayer, setCountdownPlayer] = useState(null);

  const onCombatStartRef = useRef(onCombatStart);
  const onCombatEndRef = useRef(onCombatEnd);
  const onCountdownStartRef = useRef(onCountdownStart);
  const onZoneChangeRef = useRef(onZoneChange);
  const onWipeRef = useRef(onWipe);
  const inGameCombatRef = useRef(false);
  const combatStateRef = useRef('idle');
  const combatEndTimeoutRef = useRef(null);

  useEffect(() => {
    onCombatStartRef.current = onCombatStart;
    onCombatEndRef.current = onCombatEnd;
    onCountdownStartRef.current = onCountdownStart;
    onZoneChangeRef.current = onZoneChange;
    onWipeRef.current = onWipe;
  }, [onCombatStart, onCombatEnd, onCountdownStart, onZoneChange, onWipe]);

  useEffect(() => {
    inGameCombatRef.current = inGameCombat;
  }, [inGameCombat]);
  useEffect(() => {
    combatStateRef.current = combatState;
  }, [combatState]);

  const parseCountdownLine = useCallback((line) => {
    const parts = line.split('|');
    if (parts.length < 7) return null;
    const countdownTime = parseInt(parts[4], 10);
    const result = parts[5];
    const playerName = parts[6];
    if (result !== '00') return null;
    return { seconds: countdownTime, player: playerName };
  }, []);

  const isEngageMessage = useCallback((line) => {
    const parts = line.split('|');
    if (parts.length < 5 || parts[0] !== GAMELOG_TYPE) return false;
    const code = parts[2];
    const message = parts[4] || '';
    if (code === GAMELOG_ENGAGE_CODE) {
      return Object.values(ENGAGE_PATTERNS).some((pattern) => pattern.test(message));
    }
    return false;
  }, []);

  const isWipeMessage = useCallback((line) => {
    const parts = line.split('|');
    if (parts.length < 3) return false;
    const lineType = parts[0];

    // ActorControl wipe commands (party wipe, instance reset)
    if (lineType === ACTORCONTROL_LINE_TYPE) {
      const command = parts[3]?.toUpperCase();
      if (command && WIPE_COMMANDS.includes(command)) {
        console.log('[XRT] Wipe command detected:', command, 'from line:', line);
        return true;
      }
    }

    // Echo message wipes (e.g., "/e wipe" or cactbot wipe)
    if (lineType === GAMELOG_TYPE) {
      const code = parts[2];
      const message = parts[4] || '';
      if (code === '0038') {
        if (WIPE_ECHO_PATTERNS.some((pattern) => pattern.test(message))) {
          console.log('[XRT] Wipe echo detected:', message);
          return true;
        }
      }
    }

    if (lineType === '33') {
      console.log('[XRT] ActorControl line:', parts.slice(0, 5).join('|'));
    }

    return false;
  }, []);

  const handleLogLine = useCallback(
    (e) => {
      const line = e.rawLine || (Array.isArray(e.line) ? e.line.join('|') : '');
      if (!line) return;
      const lineType = line.split('|')[0];

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

      if (lineType === COUNTDOWN_CANCEL_LINE_TYPE) {
        setCountdownSeconds(null);
        setCountdownPlayer(null);
        if (combatStateRef.current === 'countdown') {
          setCombatState('idle');
          combatStateRef.current = 'idle';
        }
        return;
      }

      if (isEngageMessage(line)) {
        setCombatState('combat');
        combatStateRef.current = 'combat';
        setCountdownSeconds(null);
        setCountdownPlayer(null);
        onCombatStartRef.current?.();
        return;
      }

      if (isWipeMessage(line)) {
        if (combatEndTimeoutRef.current) {
          clearTimeout(combatEndTimeoutRef.current);
          combatEndTimeoutRef.current = null;
        }
        setCombatState('idle');
        combatStateRef.current = 'idle';
        setCountdownSeconds(null);
        setCountdownPlayer(null);
        setInGameCombat(false);
        inGameCombatRef.current = false;
        setInACTCombat(false);
        onWipeRef.current?.();
      }
    },
    [parseCountdownLine, isEngageMessage, isWipeMessage]
  );

  const handleInCombatChanged = useCallback((e) => {
    const detail = e.detail || e;
    const newInGameCombat = detail.inGameCombat ?? false;
    const newInACTCombat = detail.inACTCombat ?? false;
    const wasInGameCombat = inGameCombatRef.current;

    console.log('[XRT] InCombatChanged:', {
      newInGameCombat,
      newInACTCombat,
      wasInGameCombat,
      combatState: combatStateRef.current,
    });

    setInGameCombat(newInGameCombat);
    setInACTCombat(newInACTCombat);
    inGameCombatRef.current = newInGameCombat;

    if (newInGameCombat && !wasInGameCombat) {
      console.log('[XRT] Combat state: entering combat');
      if (combatEndTimeoutRef.current) {
        console.log('[XRT] Cancelled pending combat end timeout');
        clearTimeout(combatEndTimeoutRef.current);
        combatEndTimeoutRef.current = null;
      }

      if (combatStateRef.current !== 'combat') {
        setCombatState('combat');
        combatStateRef.current = 'combat';
        onCombatStartRef.current?.();
      }
    }

    if (!newInGameCombat && wasInGameCombat) {
      combatEndTimeoutRef.current = setTimeout(() => {
        if (!inGameCombatRef.current && combatStateRef.current === 'combat') {
          setCombatState('ended');
          combatStateRef.current = 'ended';
          setCountdownSeconds(null);
          setCountdownPlayer(null);
          onCombatEndRef.current?.();

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
        combatEndTimeoutRef.current = null;
      }, 3000);
    }
  }, []);

  const handleZoneChange = useCallback((e) => {
    const newZoneId = e.zoneID;
    const newZoneName = e.zoneName || '';

    // Log zone info for debugging zone name mappings
    if (import.meta.env.DEV || import.meta.env.VITE_DEV_CONSOLE_ENABLED === 'true') {
      console.log('[XRT] Zone Change:', {
        zoneId: newZoneId,
        zoneName: newZoneName,
        raw: e,
      });
    }

    setZoneId(newZoneId);
    setZoneName(newZoneName);
    setCombatState('idle');
    combatStateRef.current = 'idle';
    setCountdownSeconds(null);
    setCountdownPlayer(null);
    setInGameCombat(false);
    inGameCombatRef.current = false;
    setInACTCombat(false);
    if (combatEndTimeoutRef.current) {
      clearTimeout(combatEndTimeoutRef.current);
      combatEndTimeoutRef.current = null;
    }
    onZoneChangeRef.current?.(newZoneId, newZoneName);
  }, []);

  useEffect(() => {
    return () => {
      if (combatEndTimeoutRef.current) {
        clearTimeout(combatEndTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOverlayPluginAvailable()) return;

    const addListener = window.addOverlayListener;
    const removeListener = window.removeOverlayListener;

    addListener('LogLine', handleLogLine);
    addListener('onInCombatChangedEvent', handleInCombatChanged);
    addListener('ChangeZone', handleZoneChange);

    if (typeof window.startOverlayEvents === 'function') {
      window.startOverlayEvents();
    }

    return () => {
      if (removeListener) {
        removeListener('LogLine', handleLogLine);
        removeListener('onInCombatChangedEvent', handleInCombatChanged);
        removeListener('ChangeZone', handleZoneChange);
      }
    };
  }, [handleLogLine, handleInCombatChanged, handleZoneChange]);

  const triggerWipe = useCallback(() => {
    setCombatState('idle');
    setCountdownSeconds(null);
    setCountdownPlayer(null);
    setInGameCombat(false);
    onWipeRef.current?.();
  }, []);

  const manualStartCombat = useCallback(() => {
    setCombatState('combat');
    setInGameCombat(true);
    onCombatStartRef.current?.();
  }, []);

  const manualEndCombat = useCallback(() => {
    setCombatState('ended');
    setInGameCombat(false);
    onCombatEndRef.current?.();
    setTimeout(() => {
      setCombatState((prev) => (prev === 'ended' ? 'idle' : prev));
    }, 1000);
  }, []);

  return {
    combatState,
    inGameCombat,
    inACTCombat,
    zoneId,
    zoneName,
    countdownSeconds,
    countdownPlayer,
    isInCombat: combatState === 'combat',
    isIdle: combatState === 'idle',
    isCountingDown: combatState === 'countdown',
    triggerWipe,
    manualStartCombat,
    manualEndCombat,
  };
};

export default useCombatEvents;
