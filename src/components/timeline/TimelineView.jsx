import styles from './TimelineView.module.css';
import { formatTime } from '../../utils/timeFormat';
import { getJobColor, getRoleFromJob } from '../../utils/ffxivData';

/**
 * TimelineView component - Displays all mitigations from the plan
 * Shows the full timeline with all jobs and their abilities
 *
 * @param {Object} props
 * @param {Object} props.plan - The decoded mitigation plan
 * @param {number} props.currentTime - Current fight time in seconds (0 if not started)
 * @param {number} props.windowSeconds - How many seconds ahead to highlight (default 30)
 */
const TimelineView = ({ plan, currentTime = 0, windowSeconds = 30 }) => {
  if (!plan || !plan.timeline || plan.timeline.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No mitigation plan loaded</p>
      </div>
    );
  }

  // Sort timeline by timestamp
  const sortedTimeline = [...plan.timeline].sort((a, b) => a.timestamp - b.timestamp);

  // Group entries by timestamp for display
  const groupedEntries = [];
  let currentGroup = null;

  for (const entry of sortedTimeline) {
    if (!currentGroup || currentGroup.timestamp !== entry.timestamp) {
      currentGroup = {
        timestamp: entry.timestamp,
        entries: [],
      };
      groupedEntries.push(currentGroup);
    }
    currentGroup.entries.push(entry);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.fightName}>{plan.fightName || 'Mitigation Plan'}</h2>
        <span className={styles.entryCount}>{plan.timeline.length} mitigations</span>
      </div>

      <div className={styles.timeline}>
        {groupedEntries.map((group, groupIndex) => {
          const timeUntil = group.timestamp - currentTime;
          const isUpcoming = timeUntil > 0 && timeUntil <= windowSeconds;
          const isPassed = timeUntil <= 0;
          const isImminent = timeUntil > 0 && timeUntil <= 5;

          return (
            <div
              key={groupIndex}
              className={`
                ${styles.timeGroup}
                ${isUpcoming ? styles.upcoming : ''}
                ${isPassed ? styles.passed : ''}
                ${isImminent ? styles.imminent : ''}
              `}
            >
              <div className={styles.timestamp}>
                <span className={styles.time}>{formatTime(group.timestamp)}</span>
                {currentTime > 0 && timeUntil > 0 && (
                  <span className={styles.countdown}>
                    {timeUntil <= 60 ? `${Math.floor(timeUntil)}s` : ''}
                  </span>
                )}
              </div>

              <div className={styles.entries}>
                {group.entries.map((entry, entryIndex) => {
                  const role = getRoleFromJob(entry.job);
                  const jobColor = getJobColor(entry.job);

                  return (
                    <div
                      key={entryIndex}
                      className={styles.entry}
                      style={{ '--job-color': jobColor }}
                    >
                      <span className={`${styles.jobBadge} ${styles[`role-${role}`]}`}>
                        {entry.job}
                      </span>
                      <span className={styles.ability}>{entry.ability}</span>
                      {entry.note && <span className={styles.note}>{entry.note}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineView;
