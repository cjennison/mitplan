import styles from './RaidPlanDisplay.module.css';

/**
 * RaidPlanDisplay - Displays a raid plan image during the specified time window
 *
 * @param {Object} props
 * @param {Object} props.raidPlan - The active raid plan data from useRaidPlan
 * @param {boolean} props.isLocked - Whether the UI is locked (gameplay mode)
 * @param {boolean} props.showPlaceholder - Whether to show placeholder when no image
 */
const RaidPlanDisplay = ({ raidPlan, isLocked, showPlaceholder = false }) => {
  // If no raid plan is active
  if (!raidPlan) {
    if (showPlaceholder && !isLocked) {
      return (
        <div className={styles.placeholder}>
          <span className={styles.placeholderText}>Raid Plan</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className={styles.container}>
      {raidPlan.note && <div className={styles.label}>{raidPlan.note}</div>}
      <div className={styles.imageWrapper}>
        <img
          src={raidPlan.imageUrl}
          alt={raidPlan.note || 'Raid Plan'}
          className={styles.image}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className={styles.errorState}>
          <span>⚠️ Image not found</span>
        </div>
      </div>
    </div>
  );
};

export default RaidPlanDisplay;
