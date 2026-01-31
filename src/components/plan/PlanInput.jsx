import { useState, useCallback, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './PlanInput.module.css';

/**
 * PlanInput component - Handles Base64 plan input via keyboard paste (Ctrl+V)
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {function} props.onOpenChange - Callback when dialog open state changes
 * @param {function} props.onPlanLoad - Callback when a valid plan is loaded, receives decoded plan
 * @param {string} props.error - Error message to display
 * @param {boolean} props.isOverlayLocked - Whether ACT's overlay lock is enabled
 */
const PlanInput = ({ open, onOpenChange, onPlanLoad, error, isOverlayLocked = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  /**
   * Focus the textarea when dialog opens
   * This helps ensure keyboard input goes to our overlay, not the game
   */
  useEffect(() => {
    if (open && textareaRef.current) {
      // Small delay to ensure dialog is fully mounted
      const timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleLoadPlan = useCallback(() => {
    if (!inputValue.trim()) {
      return;
    }
    setIsLoading(true);
    // Small delay to show loading state
    setTimeout(() => {
      onPlanLoad(inputValue.trim());
      setIsLoading(false);
    }, 100);
  }, [inputValue, onPlanLoad]);

  /**
   * Handle keydown - stop propagation to prevent ACT from passing to game
   */
  const handleKeyDown = useCallback(
    (e) => {
      // CRITICAL: Stop propagation so ACT doesn't pass keyboard events to the game
      e.stopPropagation();

      if (e.key === 'Enter' && e.ctrlKey) {
        handleLoadPlan();
      }
    },
    [handleLoadPlan]
  );

  /**
   * Stop all keyboard events from bubbling up to ACT/game
   * This is applied to the entire dialog content
   */
  const stopKeyboardPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className={`${styles.triggerButton} ${isOverlayLocked ? styles.triggerDisabled : ''}`}
          disabled={isOverlayLocked}
          title={isOverlayLocked ? 'Unlock overlay in ACT to load mitigation plan' : ''}
        >
          {isOverlayLocked ? '🔒 Load Mitigation Plan' : 'Load Mitigation Plan'}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          onKeyDown={stopKeyboardPropagation}
          onKeyUp={stopKeyboardPropagation}
          onKeyPress={stopKeyboardPropagation}
        >
          <Dialog.Title className={styles.title}>Load Mitigation Plan</Dialog.Title>

          <Dialog.Description className={styles.description}>
            Paste the Base64 encoded mitigation plan from your raid leader using Ctrl+V.
          </Dialog.Description>

          <div className={styles.inputWrapper}>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              placeholder="Click here, then press Ctrl+V to paste..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={stopKeyboardPropagation}
              onKeyPress={stopKeyboardPropagation}
              rows={4}
            />
          </div>

          {error && <div className={styles.error}>⚠️ {error}</div>}

          <div className={styles.actions}>
            <Dialog.Close asChild>
              <button className={styles.buttonSecondary}>Cancel</button>
            </Dialog.Close>

            <button
              className={styles.buttonPrimary}
              onClick={handleLoadPlan}
              disabled={!inputValue.trim() || isLoading}
            >
              {isLoading ? 'Loading...' : 'Load Plan'}
            </button>
          </div>

          <p className={styles.hint}>Tip: Press Ctrl+Enter to load the plan quickly</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PlanInput;
