import { useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { jobRequiresRoleSelection } from '../../hooks/useConfig';
import styles from './PlanInput.module.css';

/**
 * PlanInput component - Load mitigation plans from catalog
 */
const PlanInput = ({
  open,
  onOpenChange,
  onPlanSelect,
  presets = [],
  importedPlans = [],
  playerJob = null,
  playerRole = null,
}) => {
  const needsRoleWarning = jobRequiresRoleSelection(playerJob) && !playerRole;

  const handleSelectPlan = useCallback(
    (plan) => {
      onPlanSelect(plan);
      onOpenChange(false);
    },
    [onPlanSelect, onOpenChange]
  );

  const stopKeyboardPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className={styles.triggerButton}>Load Plan</button>
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

          <div className={styles.catalogPanel}>
            {needsRoleWarning && (
              <div className={styles.roleWarning}>
                Some plans require a role to be set. Go to Settings and select your role (MT/OT for
                tanks, M1/M2 for melee).
              </div>
            )}

            <div className={styles.catalogSection}>
              <h3 className={styles.sectionTitle}>Presets</h3>
              <div className={styles.planList}>
                {presets.map((plan) => (
                  <button
                    key={plan.id}
                    className={`${styles.planItem} ${plan.requiresRoles && needsRoleWarning ? styles.planItemWarning : ''}`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    <div className={styles.planInfo}>
                      <span className={styles.planName}>{plan.name}</span>
                      {plan.requiresRoles && <span className={styles.rolesBadge}>Roles</span>}
                    </div>
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
                      className={`${styles.planItem} ${plan.requiresRoles && needsRoleWarning ? styles.planItemWarning : ''}`}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <div className={styles.planInfo}>
                        <span className={styles.planName}>{plan.name}</span>
                        {plan.requiresRoles && <span className={styles.rolesBadge}>Roles</span>}
                      </div>
                      <span className={styles.planMeta}>
                        {plan.timeline?.length || 0} mitigations
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {presets.length === 0 && importedPlans.length === 0 && (
              <p className={styles.emptyText}>
                No plans available. Use the import field in the bottom bar to add a plan.
              </p>
            )}
          </div>

          <div className={styles.actions}>
            <Dialog.Close asChild>
              <button className={styles.buttonSecondary}>Close</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PlanInput;
