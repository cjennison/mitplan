import { useState, useCallback, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './PlanInput.module.css';

/**
 * PlanInput component - Load mitigation plans from catalog or import via Base64
 */
const PlanInput = ({
  open,
  onOpenChange,
  onPlanLoad,
  onPlanSelect,
  error,
  isOverlayLocked = false,
  presets = [],
  importedPlans = [],
}) => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (open && activeTab === 'import' && textareaRef.current) {
      const timer = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open, activeTab]);

  useEffect(() => {
    if (!open) {
      setInputValue('');
      setActiveTab('catalog');
    }
  }, [open]);

  const handleLoadPlan = useCallback(() => {
    if (!inputValue.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      onPlanLoad(inputValue.trim());
      setIsLoading(false);
    }, 100);
  }, [inputValue, onPlanLoad]);

  const handleSelectPlan = useCallback(
    (plan) => {
      onPlanSelect(plan);
      onOpenChange(false);
    },
    [onPlanSelect, onOpenChange]
  );

  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      if (e.key === 'Enter' && e.ctrlKey) {
        handleLoadPlan();
      }
    },
    [handleLoadPlan]
  );

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
          {isOverlayLocked ? '🔒 Load Plan' : 'Load Plan'}
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

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'catalog' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              Catalog
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'import' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('import')}
            >
              Import
            </button>
          </div>

          {activeTab === 'catalog' && (
            <div className={styles.catalogPanel}>
              <div className={styles.catalogSection}>
                <h3 className={styles.sectionTitle}>Presets</h3>
                <div className={styles.planList}>
                  {presets.map((plan) => (
                    <button
                      key={plan.id}
                      className={styles.planItem}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <span className={styles.planName}>{plan.name}</span>
                      <span className={styles.planMeta}>
                        {plan.timeline?.length || 0} mitigations
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {importedPlans.length > 0 && (
                <div className={styles.catalogSection}>
                  <h3 className={styles.sectionTitle}>Imported</h3>
                  <div className={styles.planList}>
                    {importedPlans.map((plan) => (
                      <button
                        key={plan.id}
                        className={styles.planItem}
                        onClick={() => handleSelectPlan(plan)}
                      >
                        <span className={styles.planName}>{plan.name}</span>
                        <span className={styles.planMeta}>
                          {plan.timeline?.length || 0} mitigations
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {presets.length === 0 && importedPlans.length === 0 && (
                <p className={styles.emptyText}>No plans available. Import a plan to get started.</p>
              )}
            </div>
          )}

          {activeTab === 'import' && (
            <div className={styles.importPanel}>
              <Dialog.Description className={styles.description}>
                Paste the Base64 encoded mitigation plan from your raid leader.
              </Dialog.Description>

              <div className={styles.inputWrapper}>
                <textarea
                  ref={textareaRef}
                  className={styles.textarea}
                  placeholder="Paste Base64 encoded plan here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={stopKeyboardPropagation}
                  onKeyPress={stopKeyboardPropagation}
                  rows={4}
                />
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.actions}>
                <Dialog.Close asChild>
                  <button className={styles.buttonSecondary}>Cancel</button>
                </Dialog.Close>
                <button
                  className={styles.buttonPrimary}
                  onClick={handleLoadPlan}
                  disabled={!inputValue.trim() || isLoading}
                >
                  {isLoading ? 'Loading...' : 'Import Plan'}
                </button>
              </div>

              <p className={styles.hint}>Tip: Press Ctrl+Enter to import quickly</p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PlanInput;
