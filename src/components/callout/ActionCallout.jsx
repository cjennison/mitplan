import styles from './ActionCallout.module.css';
import JobBadge from '../common/JobBadge';

const ActionCallout = ({
  calloutData,
  isLocked = false,
  isEmpty = false,
  showPlaceholder = false,
  showNotes = true,
}) => {
  const formatCountdown = (countdown) => {
    const rounded = Math.floor(countdown);
    if (rounded > 0) {
      return rounded.toString();
    }
    return 'NOW!';
  };

  const getUrgencyClass = (countdown) => {
    const rounded = Math.floor(countdown);
    if (rounded <= 0) return styles.countdownNow; // Green - NOW!
    if (rounded <= 2) return styles.countdownUrgent; // Red - urgent
    return styles.countdownNormal; // Yellow - normal
  };

  if ((isEmpty || !calloutData) && showPlaceholder && !isLocked) {
    return (
      <div className={`${styles.callout} ${styles.placeholder}`}>
        <div className={styles.mainContent}>
          <div className={styles.abilityInfo}>
            <JobBadge job="WAR" />
            <span className={styles.abilityName}>Reprisal</span>
          </div>
        </div>
        <div className={`${styles.countdown} ${styles.countdownNormal}`}>5</div>
      </div>
    );
  }

  if (isEmpty || !calloutData) {
    return null;
  }

  const { action, countdown } = calloutData;

  if (!action) {
    return null;
  }

  const abilities = action.abilities || [];
  const firstAbility = abilities[0] || {};
  const job = firstAbility.job || 'UNK';
  const abilityName = firstAbility.name || 'Unknown';
  const note = firstAbility.note || null;
  const hasMultiple = abilities.length > 1;

  return (
    <div className={`${styles.callout} ${isLocked ? styles.locked : ''}`}>
      <div className={styles.mainContent}>
        <div className={styles.abilityInfo}>
          <JobBadge job={job} className={isLocked ? styles.calloutBadge : ''} />
          <span className={styles.abilityName}>{abilityName}</span>
        </div>

        {showNotes && note && <div className={styles.abilityNote}>{note}</div>}

        {hasMultiple && (
          <div className={styles.additionalAbilities}>
            {abilities.slice(1).map((ability, index) => (
              <div key={index} className={styles.additionalAbilityRow}>
                <span className={styles.additionalAbility}>
                  <span className={styles.additionalJob}>{ability.job}</span>
                  <span className={styles.additionalName}>{ability.name}</span>
                </span>
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

export default ActionCallout;
