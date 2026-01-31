import styles from './DevConsole.module.css';

/**
 * DevConsole component - Development controls for testing the mitigation system
 *
 * Provides:
 * - Start Fight button (starts the timer)
 * - Stop Timer button (pauses without reset)
 * - Reset Timer button (stops and resets to 0:00)
 * - Current time display
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
 */
const DevConsole = ({ currentTime, isRunning, onStart, onStop, onReset, isHidden = false }) => {
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
    </div>
  );
};

export default DevConsole;
