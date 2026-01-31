import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./PlanInput.module.css";

/**
 * PlanInput component - Handles Base64 plan input via paste or clipboard button
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {function} props.onOpenChange - Callback when dialog open state changes
 * @param {function} props.onPlanLoad - Callback when a valid plan is loaded, receives decoded plan
 * @param {string} props.error - Error message to display
 */
const PlanInput = ({ open, onOpenChange, onPlanLoad, error }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
      // Clipboard API might not be available in ACT overlay
      // User can still manually paste
    }
  }, []);

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

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleLoadPlan();
      }
    },
    [handleLoadPlan],
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className={styles.triggerButton}>Load Mitigation Plan</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>
            Load Mitigation Plan
          </Dialog.Title>

          <Dialog.Description className={styles.description}>
            Paste the Base64 encoded mitigation plan from your raid leader.
          </Dialog.Description>

          <div className={styles.inputWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="Paste Base64 encoded plan here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={4}
            />

            <button
              className={styles.clipboardButton}
              onClick={handlePasteFromClipboard}
              type="button"
              title="Paste from clipboard"
            >
              📋 Paste from Clipboard
            </button>
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
              {isLoading ? "Loading..." : "Load Plan"}
            </button>
          </div>

          <p className={styles.hint}>
            Tip: Press Ctrl+Enter to load the plan quickly
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PlanInput;
