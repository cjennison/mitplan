import styles from './TimelineView.module.css';
import { formatTime } from '../../utils/timeFormat';
import { getJobColor, getRoleFromJob } from '../../utils/ffxivData';

/**
 * TimelineView component - Displays mitigations from the plan
 *
 * Shows upcoming mitigations in a compact, readable format.
 * Always uses the "locked" style for consistency.
 *
 * @param {Object} props
 * @param {Object} props.plan - The decoded mitigation plan
 * @param {number} props.currentTime - Current fight time in seconds (0 if not started)
 * @param {number} props.windowSeconds - How many seconds ahead to show (default 30)
 * @param {number} props.maxItems - Maximum number of timeline groups to display (default 3)
 * @param {boolean} props.isLocked - Whether the overlay is in locked (minimal) mode
 */
const TimelineView = ({
  plan,
  currentTime = 0,
  windowSeconds = 30,
  maxItems = 3,
  isLocked = false,
}) => {
  if (!plan || !plan.timeline || plan.timeline.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No plan loaded</p>
      </div>
    );
  }

  // Sort timeline by timestamp
  const sortedTimeline = [...plan.timeline].sort((a, b) => a.timestamp - b.timestamp);

  // Filter to only upcoming entries within the window
  const upcomingEntries = sortedTimeline.filter((entry) => {
    const timeUntil = entry.timestamp - currentTime;
    return timeUntil > 0 && timeUntil <= windowSeconds;
  });

  // Group entries by timestamp for display
  const groupedEntries = [];
  let currentGroup = null;

  for (const entry of upcomingEntries) {
    if (!currentGroup || currentGroup.timestamp !== entry.timestamp) {
      currentGroup = {
        timestamp: entry.timestamp,
        entries: [],
      };
      groupedEntries.push(currentGroup);
    }
    currentGroup.entries.push(entry);
  }

  // Limit to maxItems groups
  const limitedGroups = groupedEntries.slice(0, maxItems);

  if (limitedGroups.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No upcoming mitigations</p>
      </div>
    );
  }

  return (
    <div className={styles.containerLocked}>
      {limitedGroups.map((group, groupIndex) => {
        const timeUntil = group.timestamp - currentTime;
        const isImminent = timeUntil > 0 && timeUntil <= 5;

        return (
          <div
            key={groupIndex}
            className={`${styles.timeGroupLocked} ${isImminent ? styles.imminentLocked : ''}`}
          >
            <div className={styles.timestampLocked}>
              <span className={styles.timeLocked}>{formatTime(group.timestamp)}</span>
            </div>

            <div className={styles.entriesLocked}>
              {group.entries.map((entry, entryIndex) => {
                const role = getRoleFromJob(entry.job);
                const jobColor = getJobColor(entry.job);

                return (
                  <div
                    key={entryIndex}
                    className={styles.entryLocked}
                    style={{ '--job-color': jobColor }}
                  >
                    <span className={`${styles.jobBadgeLocked} ${styles[`role-${role}`]}`}>
                      {entry.job}
                    </span>
                    <span className={styles.abilityLocked}>{entry.ability}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineView;
