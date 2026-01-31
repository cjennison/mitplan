import styles from './MitigationCallout.module.css';

/**
 * MitigationCallout - Shows the current/upcoming mitigation as a large callout
 *
 * This is what the player sees front-and-center during combat.
 * Currently shows an example; will be dynamic based on fight timeline.
 *
 * @param {Object} props
 * @param {string} props.abilityName - Name of the ability to use
 * @param {string} props.job - Job abbreviation (WAR, SCH, etc.)
 * @param {boolean} props.isLocked - Whether overlay is locked
 */
const MitigationCallout = ({ abilityName = 'Shake It Off', job = 'WAR', isLocked = false }) => {
  return (
    <div className={`${styles.callout} ${isLocked ? styles.locked : ''}`}>
      <span className={styles.jobBadge}>{job}</span>
      <span className={styles.abilityName}>{abilityName}</span>
    </div>
  );
};

export default MitigationCallout;
