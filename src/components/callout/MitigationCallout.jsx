import styles from './MitigationCallout.module.css';

/**
 * MitigationCallout - Shows the current/upcoming mitigation as a large callout
 *
 * This is what the player sees front-and-center during combat.
 * Shows countdown before the ability should be used, then shows
 * negative time after it should have been used.
 *
 * When unlocked and no active callout, shows a placeholder so users
 * can see what the callout will look like during the fight.
 *
 * @param {Object} props
 * @param {Object} props.calloutData - Callout info from useCallout hook
 * @param {Object} props.calloutData.mitigation - The mitigation object
 * @param {number} props.calloutData.countdown - Seconds until/since ability (positive=before, negative=after)
 * @param {boolean} props.calloutData.isOverdue - Whether the ability time has passed
 * @param {boolean} props.isLocked - Whether overlay is locked (gameplay mode)
 * @param {boolean} props.isEmpty - Whether to show empty state
 * @param {boolean} props.showPlaceholder - Whether to show placeholder when empty (for unlocked mode)
 * @param {boolean} props.showNotes - Whether to show notes underneath abilities
 */
const MitigationCallout = ({
  calloutData,
  isLocked = false,
  isEmpty = false,
  showPlaceholder = false,
  showNotes = true,
}) => {
  /**
   * Format countdown for display
   * Uses floor to match timeline display - ensures each number appears only once
   * Positive: "5", "4", "3", "2", "1"
   * Zero/Negative: "NOW!" (no negative numbers)
   */
  const formatCountdown = (countdown) => {
    const rounded = Math.floor(countdown);
    if (rounded > 0) {
      return rounded.toString();
    }
    return 'NOW!';
  };

  /**
   * Get countdown urgency class
   * Yellow for 3+ seconds, Red for 1-2 seconds, Green for NOW
   */
  const getUrgencyClass = (countdown) => {
    if (countdown <= 0) return styles.countdownNow; // Green - NOW!
    if (countdown <= 2) return styles.countdownUrgent; // Red - urgent
    return styles.countdownNormal; // Yellow - normal
  };

  // Show placeholder when unlocked and no active callout
  // This helps users see what the callout will look like
  if ((isEmpty || !calloutData) && showPlaceholder && !isLocked) {
    return (
      <div className={`${styles.callout} ${styles.placeholder}`}>
        <div className={styles.mainContent}>
          <div className={styles.abilityInfo}>
            <span className={styles.jobBadge}>WAR</span>
            <span className={styles.abilityName}>Reprisal</span>
          </div>
        </div>
        <div className={`${styles.countdown} ${styles.countdownNormal}`}>5</div>
      </div>
    );
  }

  // Empty state when no callout data - show nothing
  if (isEmpty || !calloutData) {
    return null;
  }

  const { mitigation, countdown } = calloutData;

  // Get job and ability info - handle multiple abilities
  const abilities = mitigation.abilities || [];
  const firstAbility = abilities[0] || {};
  const job = firstAbility.job || 'UNK';
  const abilityName = firstAbility.name || 'Unknown';
  const note = firstAbility.note || null;

  // If there are multiple abilities, show them all
  const hasMultiple = abilities.length > 1;

  return (
    <div className={`${styles.callout} ${isLocked ? styles.locked : ''}`}>
      <div className={styles.mainContent}>
        <div className={styles.abilityInfo}>
          <span className={styles.jobBadge}>{job}</span>
          <span className={styles.abilityName}>{abilityName}</span>
        </div>

        {/* Show note for first ability if showNotes is enabled */}
        {showNotes && note && <div className={styles.abilityNote}>{note}</div>}

        {hasMultiple && (
          <div className={styles.additionalAbilities}>
            {abilities.slice(1).map((ability, index) => (
              <div key={index} className={styles.additionalAbilityRow}>
                <span className={styles.additionalAbility}>
                  <span className={styles.additionalJob}>{ability.job}</span>
                  <span className={styles.additionalName}>{ability.name}</span>
                </span>
                {/* Show note for additional abilities if showNotes is enabled */}
                {showNotes && ability.note && (
                  <div className={styles.additionalNote}>{ability.note}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${styles.countdown} ${getUrgencyClass(countdown)}`}>
        {formatCountdown(countdown)}
      </div>
    </div>
  );
};

export default MitigationCallout;
