import styles from './DevConsole.module.css';

/**
 * DevConsole component - Development controls for testing the mitigation system
 *
 * Provides:
 * - Start Fight button (starts the timer)
 * - Stop Timer button (pauses without reset)
 * - Reset Timer button (stops and resets to 0:00)
 * - Current time display
 * - Combat state display (from ACT events)
 *
 * This component is hidden when the UI is locked (gameplay mode).
 *
 * @param {Object} props
 * @param {number} props.currentTime - Current fight time in seconds
 * @param {boolean} props.isRunning - Whether the timer is currently running
 * @param {function} props.onStart - Callback to start the timer
 * @param {function} props.onStop - Callback to stop/pause the timer
 * @param {function} props.onReset - Callback to reset the timer
 * @param {boolean} props.isHidden - Whether to hide the console (when UI locked)
 * @param {Object} props.combatState - Combat state info from useCombatEvents
 */
const DevConsole = ({
  currentTime,
  isRunning,
  onStart,
  onStop,
  onReset,
  isHidden = false,
  combatState = null,
}) => {
  /**
   * Format time as M:SS.s (minutes:seconds.tenths)
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  if (isHidden) {
    return null;
  }

  return (
    <div className={styles.console}>
      <div className={styles.header}>
        <span className={styles.icon}>🛠️</span>
        <span className={styles.title}>Dev Console</span>
      </div>

      <div className={styles.timerDisplay}>
        <span className={styles.timerLabel}>Fight Time</span>
        <span className={`${styles.timerValue} ${isRunning ? styles.running : ''}`}>
          {formatTime(currentTime)}
        </span>
      </div>

      {/* Combat State Display */}
      {combatState && (
        <div className={styles.combatInfo}>
          <div className={styles.combatRow}>
            <span className={styles.combatLabel}>State:</span>
            <span className={`${styles.combatValue} ${styles[`state-${combatState.combatState}`]}`}>
              {combatState.combatState}
            </span>
          </div>
          {combatState.zoneName && (
            <div className={styles.combatRow}>
              <span className={styles.combatLabel}>Zone:</span>
              <span className={styles.combatValue} title={`ID: ${combatState.zoneId}`}>
                {combatState.zoneName.length > 20
                  ? `${combatState.zoneName.slice(0, 20)}...`
                  : combatState.zoneName}
              </span>
            </div>
          )}
          {combatState.countdownSeconds && (
            <div className={styles.combatRow}>
              <span className={styles.combatLabel}>Countdown:</span>
              <span className={styles.combatValue}>{combatState.countdownSeconds}s</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.controls}>
        {!isRunning ? (
          <button className={`${styles.button} ${styles.startButton}`} onClick={onStart}>
            ▶ Start Fight
          </button>
        ) : (
          <button className={`${styles.button} ${styles.stopButton}`} onClick={onStop}>
            ⏸ Stop
          </button>
        )}

        <button
          className={`${styles.button} ${styles.resetButton}`}
          onClick={onReset}
          disabled={currentTime === 0 && !isRunning}
        >
          ↺ Reset
        </button>
      </div>

      {/* Manual Combat Simulation (for testing without ACT) */}
      {combatState && (
        <div className={styles.combatControls}>
          <span className={styles.combatControlsLabel}>Simulate:</span>
          <button
            className={`${styles.button} ${styles.simButton}`}
            onClick={combatState.manualStartCombat}
            disabled={combatState.isInCombat}
          >
            ⚔️ Combat
          </button>
          <button
            className={`${styles.button} ${styles.simButton}`}
            onClick={combatState.manualEndCombat}
            disabled={!combatState.isInCombat}
          >
            🏁 End
          </button>
          <button
            className={`${styles.button} ${styles.simButton}`}
            onClick={combatState.triggerWipe}
          >
            💀 Wipe
          </button>
        </div>
      )}
    </div>
  );
};

export default DevConsole;
