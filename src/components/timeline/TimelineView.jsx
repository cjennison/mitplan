import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './TimelineView.module.css';
import {
  getJobColor,
  getRoleFromJob,
  jobMatchesEntry,
  getJobDisplayInfo,
} from '../../utils/ffxivData';
import JobBadge from '../common/JobBadge';
import { CALLOUT_CONFIG } from '../../hooks/useCallout';

/**
 * Format countdown time for display
 * Shows seconds until ability (e.g., "0:15" for 15 seconds)
 */
const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Approximate height of a single timeline group in pixels
const ITEM_HEIGHT_ESTIMATE = 36;

/**
 * TimelineView component - Displays mitigations from the plan
 *
 * Shows upcoming mitigations in a compact, readable format.
 * Displays countdown time (time until ability) rather than absolute timestamps.
 * Filters out abilities that are within the callout window (5 seconds).
 * Supports both specific jobs (WAR, SCH) and job types (Tank, Healer, Melee).
 * Dynamically shows as many items as can fit in the container.
 *
 * @param {Object} props
 * @param {Object} props.plan - The decoded mitigation plan
 * @param {number} props.currentTime - Current fight time in seconds (0 if not started)
 * @param {number} props.windowSeconds - How many seconds ahead to show (default 30)
 * @param {boolean} props.isLocked - Whether the overlay is in locked (minimal) mode
 * @param {boolean} props.showOwnOnly - If true, only show abilities for playerJob
 * @param {string} props.playerJob - The player's current job (e.g., "WAR", "SCH")
 */
const TimelineView = ({
  plan,
  currentTime = 0,
  windowSeconds = 30,
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
    const containerPadding = 16; // 0.5rem top + 0.5rem bottom padding
    const itemGap = 6; // 0.375rem gap between items

    // Use measured item height if available, otherwise use estimate
    let itemHeight = ITEM_HEIGHT_ESTIMATE;
    if (itemRef.current) {
      itemHeight = itemRef.current.offsetHeight;
    }

    const availableHeight = containerHeight - containerPadding;
    const itemWithGap = itemHeight + itemGap;

    // Calculate how many full items can fit
    const fittingItems = Math.floor((availableHeight + itemGap) / itemWithGap);

    // Minimum of 1, and cap at a reasonable maximum
    const newMaxItems = Math.max(1, Math.min(fittingItems, 20));

    if (newMaxItems !== maxItems) {
      setMaxItems(newMaxItems);
    }
  }, [maxItems]);

  // Recalculate on mount and when container resizes
  useEffect(() => {
    // Wait for next animation frame to ensure container is properly sized after mount
    // This fixes the issue where the container reports incorrect size on initial load/reload
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

  // Check if entry matches player's job and role (supports job types)
  const entryMatchesPlayer = (entry) => {
    if (!jobMatchesEntry(entry.job, playerJob)) return false;
    if (entry.role && playerRole) {
      return entry.role.toUpperCase() === playerRole.toUpperCase();
    }
    return true;
  };

  // Sort timeline by timestamp
  const sortedTimeline = [...plan.timeline].sort((a, b) => a.timestamp - b.timestamp);

  // Filter to only upcoming entries (not yet in callout window)
  const upcomingEntries = sortedTimeline.filter((entry) => {
    // Filter by job and role if showOwnOnly is enabled
    if (showOwnOnly && playerJob) {
      if (!entryMatchesPlayer(entry)) return false;
    }

    const timeUntil = entry.timestamp - currentTime;
    // Hide entries that are already in the callout window
    if (Math.floor(timeUntil) <= CALLOUT_CONFIG.SHOW_BEFORE) return false;
    // No time limit - we'll show the next N groups regardless of time
    return true;
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
    <div ref={containerRef} className={styles.containerLocked}>
      {limitedGroups.map((group, groupIndex) => {
        const timeUntil = group.timestamp - currentTime;
        const isImminent = timeUntil > 0 && timeUntil <= 10;

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
