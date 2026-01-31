import { useMemo } from 'react';

export const CALLOUT_CONFIG = {
  SHOW_BEFORE: 5,
  SHOW_AFTER: 3,
};

/**
 * Determines which ability should be shown as a callout based on current fight time.
 * Shows abilities within SHOW_BEFORE seconds of happening until SHOW_AFTER seconds after.
 */
const useCallout = (plan, currentTime, options = {}) => {
  const { showOwnOnly = false, playerJob = null } = options;

  const callout = useMemo(() => {
    if (!plan?.timeline?.length) return null;

    let timeline = plan.timeline;
    if (showOwnOnly && playerJob) {
      timeline = timeline.filter((entry) => entry.job.toUpperCase() === playerJob.toUpperCase());
    }

    if (timeline.length === 0) return null;

    const sortedTimeline = [...timeline].sort((a, b) => a.timestamp - b.timestamp);

    for (const entry of sortedTimeline) {
      const abilityTime = entry.timestamp;
      const timeUntil = abilityTime - currentTime;
      const showEnd = abilityTime + CALLOUT_CONFIG.SHOW_AFTER;

      if (Math.floor(timeUntil) <= CALLOUT_CONFIG.SHOW_BEFORE && currentTime <= showEnd) {
        const countdown = timeUntil;
        const abilitiesAtTime = sortedTimeline
          .filter((e) => e.timestamp === abilityTime)
          .map((e) => ({ job: e.job, name: e.ability, note: e.note }));

        return {
          mitigation: { time: abilityTime, abilities: abilitiesAtTime },
          countdown,
          abilityTime,
          isOverdue: countdown < 0,
        };
      }
    }

    return null;
  }, [plan, currentTime, showOwnOnly, playerJob]);

  return callout;
};

/**
 * Returns timeline items that are upcoming but not yet in callout range.
 * Uses Math.floor to match displayed countdown - hides when displayed value <= SHOW_BEFORE
 */
const useTimelineItems = (plan, currentTime, windowSeconds = 30, maxItems = 3) => {
  const items = useMemo(() => {
    if (!plan?.timeline?.length) return [];

    const filtered = plan.timeline.filter((entry) => {
      const timeUntil = entry.timestamp - currentTime;
      return Math.floor(timeUntil) > CALLOUT_CONFIG.SHOW_BEFORE && timeUntil <= windowSeconds;
    });

    return filtered.sort((a, b) => a.timestamp - b.timestamp).slice(0, maxItems);
  }, [plan, currentTime, windowSeconds, maxItems]);

  return items;
};

export { useCallout, useTimelineItems };
