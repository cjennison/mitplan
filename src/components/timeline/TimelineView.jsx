import styles from './TimelineView.module.css';
import { formatTime } from '../../utils/timeFormat';
import { getJobColor, getRoleFromJob } from '../../utils/ffxivData';

/**
 * TimelineView component - Displays mitigations from the plan
 *
 * When unlocked: Shows the full timeline with all jobs and their abilities
 * When locked: Shows only upcoming mitigations (within windowSeconds) with minimal styling
 *
 * @param {Object} props
 * @param {Object} props.plan - The decoded mitigation plan
 * @param {number} props.currentTime - Current fight time in seconds (0 if not started)
 * @param {number} props.windowSeconds - How many seconds ahead to show (default 30)
 * @param {boolean} props.isLocked - Whether the overlay is in locked (minimal) mode
 */
const TimelineView = ({ plan, currentTime = 0, windowSeconds = 30, isLocked = false }) => {
  if (!plan || !plan.timeline || plan.timeline.length === 0) {
    return isLocked ? null : (
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
    // In locked mode, only include entries within the window
    if (isLocked) {
      const timeUntil = entry.timestamp - currentTime;
      if (timeUntil <= 0 || timeUntil > windowSeconds) {
        continue;
      }
    }

    if (!currentGroup || currentGroup.timestamp !== entry.timestamp) {
      currentGroup = {
        timestamp: entry.timestamp,
        entries: [],
      };
      groupedEntries.push(currentGroup);
    }
    currentGroup.entries.push(entry);
  }

  // In locked mode with no upcoming entries, show nothing
  if (isLocked && groupedEntries.length === 0) {
    return null;
  }

  // Locked mode: minimal, transparent display
  if (isLocked) {
    return (
      <div className={styles.containerLocked}>
        {groupedEntries.map((group, groupIndex) => {
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
  }

  // Unlocked mode: full display with header
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
