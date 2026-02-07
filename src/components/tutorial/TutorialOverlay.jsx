import styles from './TutorialOverlay.module.css';

const TutorialOverlay = ({ isActive, isOverlayLocked, onDismiss }) => {
  if (!isActive) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dismissContainer}>
        {!isOverlayLocked ? (
          <>
            <p className={styles.instructions}>
              <strong>Lock Overlay is currently OFF in OverlayPlugin.</strong>
              <br />
              First, resize this browser window to your preferred size.
              <br />
              Then enable <em>&quot;Lock Overlay&quot;</em> in OverlayPlugin to position the
              elements.
            </p>
            <button className={styles.dismissButton} onClick={onDismiss}>
              ✓ Skip Tutorial
            </button>
          </>
        ) : (
          <>
            <p className={styles.instructions}>
              Drag and resize the Callout and Timeline to your preferred positions.
              <br />
              When finished, click the 🔓 lock button in the top-right corner.
            </p>
            <button className={styles.dismissButton} onClick={onDismiss}>
              ✓ Skip Tutorial
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TutorialOverlay;
