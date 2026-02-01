import { useState, useCallback, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import { jobRequiresRoleSelection } from '../../hooks/useConfig';
import styles from './PlanInput.module.css';

/**
 * PlanInput component - Load mitigation plans from catalog
 */
const PlanInput = ({
  open,
  onOpenChange,
  onPlanSelect,
  onDeletePlan,
  presets = [],
  importedPlans = [],
  playerJob = null,
  playerRole = null,
}) => {
  const [planToDelete, setPlanToDelete] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
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

  const handleDeleteClick = useCallback((e, plan) => {
    e.stopPropagation();
    setPlanToDelete(plan);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (planToDelete && onDeletePlan) {
      onDeletePlan(planToDelete.id);
    }
    setPlanToDelete(null);
  }, [planToDelete, onDeletePlan]);

  const handleCancelDelete = useCallback(() => {
    setPlanToDelete(null);
  }, []);

  const toggleGroup = useCallback((fightName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [fightName]: !prev[fightName],
    }));
  }, []);

  // Combine and process plans - group by fightName
  const groupedPlans = useMemo(() => {
    const allPlans = [
      ...presets.map((p) => ({ ...p, type: 'preset' })),
      ...importedPlans.map((p) => ({ ...p, type: 'imported' })),
    ];

    // Group by fightName
    const groups = {};
    allPlans.forEach((plan) => {
      const fight = plan.fightName || 'Other Plans';
      if (!groups[fight]) {
        groups[fight] = [];
      }
      groups[fight].push(plan);
    });

    // Sort fights alphabetically, but put "Other Plans" last
    const sortedFights = Object.keys(groups).sort((a, b) => {
      if (a === 'Other Plans') return 1;
      if (b === 'Other Plans') return -1;
      return a.localeCompare(b);
    });

    return sortedFights.map((fight) => ({
      fightName: fight,
      plans: groups[fight],
    }));
  }, [presets, importedPlans]);

  // Determine if we should collapse by default (4+ sections or 10+ total plans)
  const shouldCollapseByDefault = useMemo(() => {
    const totalPlans = presets.length + importedPlans.length;
    const totalSections = groupedPlans.length;
    return totalSections >= 4 || totalPlans >= 10;
  }, [presets.length, importedPlans.length, groupedPlans.length]);

  // Check if a group is expanded
  const isGroupExpanded = useCallback(
    (fightName) => {
      // If user has explicitly toggled, use that value
      if (expandedGroups[fightName] !== undefined) {
        return expandedGroups[fightName];
      }
      // Otherwise, use default based on content size
      return !shouldCollapseByDefault;
    },
    [expandedGroups, shouldCollapseByDefault]
  );

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

          <div className={styles.planListScroll}>
            {needsRoleWarning && (
              <div className={styles.roleWarning}>
                Some plans require a role to be set. Go to Settings and select your role (MT/OT for
                tanks, M1/M2 for melee).
              </div>
            )}

            {groupedPlans.length > 0 ? (
              groupedPlans.map((group) => (
                <Collapsible.Root
                  key={group.fightName}
                  open={isGroupExpanded(group.fightName)}
                  onOpenChange={() => toggleGroup(group.fightName)}
                  className={styles.fightGroup}
                >
                  <Collapsible.Trigger className={styles.groupHeader}>
                    <span className={styles.groupChevron}>
                      {isGroupExpanded(group.fightName) ? '▼' : '▶'}
                    </span>
                    <span className={styles.groupName}>{group.fightName}</span>
                    <span className={styles.groupCount}>{group.plans.length}</span>
                  </Collapsible.Trigger>
                  <Collapsible.Content className={styles.groupContent}>
                    <div className={styles.planList}>
                      {group.plans.map((plan) => (
                        <div key={plan.id} className={styles.importedPlanRow}>
                          <button
                            className={`${styles.planItem} ${plan.type === 'imported' ? styles.planItemImported : ''} ${plan.requiresRoles && needsRoleWarning ? styles.planItemWarning : ''}`}
                            onClick={() => handleSelectPlan(plan)}
                          >
                            <div className={styles.planInfo}>
                              <span className={styles.planName}>{plan.name}</span>
                              {plan.type === 'preset' && (
                                <span className={`${styles.typeBadge} ${styles.badgePreset}`}>
                                  PRESET
                                </span>
                              )}
                              {plan.type === 'imported' && (
                                <span className={`${styles.typeBadge} ${styles.badgeImported}`}>
                                  IMPORTED
                                </span>
                              )}
                              {plan.requiresRoles && (
                                <span className={styles.rolesBadge}>Roles</span>
                              )}
                            </div>
                            <span className={styles.planMeta}>
                              {plan.timeline?.length || 0} mitigations
                            </span>
                          </button>
                          {plan.type === 'imported' && (
                            <button
                              className={styles.deleteButton}
                              onClick={(e) => handleDeleteClick(e, plan)}
                              title="Delete imported plan"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>
              ))
            ) : (
              <p className={styles.emptyText}>
                No plans available. Use the import field in the bottom bar to add a plan.
              </p>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog.Root
            open={!!planToDelete}
            onOpenChange={(open) => !open && setPlanToDelete(null)}
          >
            <AlertDialog.Portal>
              <AlertDialog.Overlay className={styles.alertOverlay} />
              <AlertDialog.Content className={styles.alertContent}>
                <AlertDialog.Title className={styles.alertTitle}>
                  Delete Imported Plan?
                </AlertDialog.Title>
                <AlertDialog.Description className={styles.alertDescription}>
                  Are you sure you want to delete "{planToDelete?.name}"? This action cannot be
                  undone.
                </AlertDialog.Description>
                <div className={styles.alertActions}>
                  <AlertDialog.Cancel asChild>
                    <button className={styles.alertCancel} onClick={handleCancelDelete}>
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button className={styles.alertDelete} onClick={handleConfirmDelete}>
                      Delete
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>

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
