import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './TimelineView.module.css';
import { getJobColor, getRoleFromJob, jobMatchesEntry } from '../../utils/ffxivData';
import JobBadge from '../common/JobBadge';
import { CALLOUT_CONFIG } from '../../hooks/useCallout';

const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const ITEM_HEIGHT_ESTIMATE = 36;

const TimelineView = ({
  plan,
  currentTime = 0,
  showOwnOnly = false,
  playerJob = null,
  playerRole = null,
}) => {
  const containerRef = useRef(null);
  const itemRef = useRef(null);
  const [maxItems, setMaxItems] = useState(3);

  // Calculate how many items can fit in the container
  const calculateMaxItems = useCallback(() => {
    if (!containerRef.current) return;

    const containerHeight = containerRef.current.clientHeight;
    const containerPadding = 16;
    const itemGap = 6;

    let itemHeight = ITEM_HEIGHT_ESTIMATE;
    if (itemRef.current) {
      itemHeight = itemRef.current.offsetHeight;
    }

    const availableHeight = containerHeight - containerPadding;
    const itemWithGap = itemHeight + itemGap;
    const fittingItems = Math.floor((availableHeight + itemGap) / itemWithGap);
    const newMaxItems = Math.max(1, Math.min(fittingItems, 20));

    if (newMaxItems !== maxItems) {
      setMaxItems(newMaxItems);
    }
  }, [maxItems]);

  useEffect(() => {
    let frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        calculateMaxItems();
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      calculateMaxItems();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [calculateMaxItems]);

  if (!plan || !plan.timeline || plan.timeline.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No plan loaded</p>
      </div>
    );
  }

  const entryMatchesPlayer = (entry) => {
    if (!jobMatchesEntry(entry.job, playerJob)) return false;
    if (entry.role && playerRole) {
      return entry.role.toUpperCase() === playerRole.toUpperCase();
    }
    return true;
  };

  const sortedTimeline = [...plan.timeline]
    .filter((entry) => entry.type !== 'raidplan')
    .sort((a, b) => a.timestamp - b.timestamp);

  const upcomingEntries = sortedTimeline.filter((entry) => {
    if (showOwnOnly && playerJob) {
      if (!entryMatchesPlayer(entry)) return false;
    }

    const timeUntil = entry.timestamp - currentTime;
    if (Math.floor(timeUntil) <= CALLOUT_CONFIG.SHOW_BEFORE) return false;
    return true;
  });

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

  const limitedGroups = groupedEntries.slice(0, maxItems);

  if (limitedGroups.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No upcoming mitigations</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.containerLocked}>
      {limitedGroups.map((group, groupIndex) => {
        const timeUntil = group.timestamp - currentTime;
        const isImminent = timeUntil > 0 && timeUntil <= 20;

        return (
          <div
            key={groupIndex}
            ref={groupIndex === 0 ? itemRef : null}
            className={`${styles.timeGroupLocked} ${isImminent ? styles.imminentLocked : ''}`}
          >
            <div className={styles.timestampLocked}>
              <span className={styles.timeLocked}>{formatCountdown(timeUntil)}</span>
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
                    <JobBadge job={entry.job} />
                    <span className={styles.abilityLocked}>{entry.ability}</span>
                    {entry.note && <span className={styles.noteLocked}>{entry.note}</span>}
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
