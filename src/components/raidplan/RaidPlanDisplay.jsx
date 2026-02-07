import styles from './RaidPlanDisplay.module.css';

const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (lower.startsWith('https://')) return trimmed;
  if (lower.startsWith('http://')) return trimmed;
  if (lower.startsWith('blob:')) return trimmed;
  if (/^[a-z0-9\/.]/i.test(trimmed) && !trimmed.includes(':')) return trimmed;

  console.warn('[XRT] Blocked URL:', trimmed);
  return null;
};

const RaidPlanDisplay = ({ raidPlan, isLocked, showPlaceholder = false }) => {
  const safeImageUrl = raidPlan ? sanitizeImageUrl(raidPlan.imageUrl) : null;

  if (!raidPlan || !safeImageUrl) {
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
          src={safeImageUrl}
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
