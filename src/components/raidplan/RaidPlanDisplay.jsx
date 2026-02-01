import styles from './RaidPlanDisplay.module.css';

/**
 * Sanitizes a URL to ensure it's safe for use as an image source.
 * Blocks dangerous protocols like javascript:, data:, vbscript:, etc.
 *
 * @param {string} url - The URL to sanitize
 * @returns {string|null} - The safe URL or null if unsafe
 */
const sanitizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  // Block dangerous protocols explicitly
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  for (const protocol of dangerousProtocols) {
    if (lower.startsWith(protocol)) {
      console.warn('[Mitplan] Blocked unsafe image URL protocol:', protocol);
      return null;
    }
  }

  // Allow relative paths and http(s)
  const isRelativePath = /^[a-z0-9\/.]/i.test(trimmed) && !trimmed.includes(':');
  const isHttpUrl = lower.startsWith('http://') || lower.startsWith('https://');
  const isBlobUrl = lower.startsWith('blob:');

  if (isRelativePath || isHttpUrl || isBlobUrl) {
    return trimmed;
  }

  console.warn('[Mitplan] Blocked unrecognized URL format:', trimmed);
  return null;
};

/**
 * RaidPlanDisplay - Displays a raid plan image during the specified time window
 *
 * @param {Object} props
 * @param {Object} props.raidPlan - The active raid plan data from useRaidPlan
 * @param {boolean} props.isLocked - Whether the UI is locked (gameplay mode)
 * @param {boolean} props.showPlaceholder - Whether to show placeholder when no image
 */
const RaidPlanDisplay = ({ raidPlan, isLocked, showPlaceholder = false }) => {
  // Sanitize the URL at render time (defense-in-depth)
  const safeImageUrl = raidPlan ? sanitizeImageUrl(raidPlan.imageUrl) : null;

  // If no raid plan is active or URL is unsafe
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
