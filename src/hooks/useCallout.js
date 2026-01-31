import { useMemo } from 'react';

/**
 * Configuration for callout timing
 */
export const CALLOUT_CONFIG = {
  // Seconds before ability time to show callout
  SHOW_BEFORE: 5,
  // Seconds after ability time to keep showing callout
  SHOW_AFTER: 3,
};

/**
 * Custom hook to determine which ability should be shown as a callout
 *
 * An ability becomes a callout when it's within SHOW_BEFORE seconds of happening.
 * It remains as a callout until SHOW_AFTER seconds after it should have happened.
 *
 * Plan structure expected:
 * - plan.timeline: Array of { timestamp, job, ability }
 *
 * @param {Object} plan - The mitigation plan with timeline
 * @param {number} currentTime - Current fight time in seconds
 * @returns {Object|null} The current callout info or null if no callout should show
 */
const useCallout = (plan, currentTime) => {
  const callout = useMemo(() => {
    if (!plan || !plan.timeline || plan.timeline.length === 0) {
      return null;
    }

    // Sort timeline by timestamp to ensure we get the earliest callout
    const sortedTimeline = [...plan.timeline].sort((a, b) => a.timestamp - b.timestamp);

    // Find the first ability that should be shown as a callout
    // An ability is a callout if: (timestamp - SHOW_BEFORE) <= currentTime <= (timestamp + SHOW_AFTER)
    for (const entry of sortedTimeline) {
      const abilityTime = entry.timestamp;
      const showStart = abilityTime - CALLOUT_CONFIG.SHOW_BEFORE;
      const showEnd = abilityTime + CALLOUT_CONFIG.SHOW_AFTER;

      if (currentTime >= showStart && currentTime <= showEnd) {
        // Calculate countdown (positive before ability time, negative after)
        const countdown = abilityTime - currentTime;

        // Find all abilities at this timestamp (for grouped mitigations)
        const abilitiesAtTime = sortedTimeline
          .filter((e) => e.timestamp === abilityTime)
          .map((e) => ({ job: e.job, name: e.ability }));

        return {
          mitigation: {
            time: abilityTime,
            abilities: abilitiesAtTime,
          },
          countdown, // Positive = seconds until, Negative = seconds since
          abilityTime,
          isOverdue: countdown < 0,
        };
      }
    }

    return null;
  }, [plan, currentTime]);

  return callout;
};

/**
 * Custom hook to filter timeline items
 *
 * Returns abilities that:
 * - Are in the future (relative to currentTime)
 * - Are NOT within the callout window (more than SHOW_BEFORE seconds away)
 * - Are within the timeline window
 *
 * @param {Object} plan - The mitigation plan with timeline
 * @param {number} currentTime - Current fight time in seconds
 * @param {number} windowSeconds - How far ahead to show in timeline
 * @param {number} maxItems - Maximum number of items to show
 * @returns {Array} Filtered and limited array of timeline entries
 */
const useTimelineItems = (plan, currentTime, windowSeconds = 30, maxItems = 3) => {
  const items = useMemo(() => {
    if (!plan || !plan.timeline || plan.timeline.length === 0) {
      return [];
    }

    // Filter entries:
    // 1. Must be more than SHOW_BEFORE seconds in the future (not in callout range)
    // 2. Must be within the timeline window
    const filtered = plan.timeline.filter((entry) => {
      const timeUntil = entry.timestamp - currentTime;

      // Must be more than SHOW_BEFORE seconds away (not a callout yet)
      if (timeUntil <= CALLOUT_CONFIG.SHOW_BEFORE) {
        return false;
      }

      // Must be within the window
      if (timeUntil > windowSeconds) {
        return false;
      }

      return true;
    });

    // Sort by timestamp (earliest first) and limit to maxItems
    return filtered.sort((a, b) => a.timestamp - b.timestamp).slice(0, maxItems);
  }, [plan, currentTime, windowSeconds, maxItems]);

  return items;
};

export { useCallout, useTimelineItems };
