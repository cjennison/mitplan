import { useMemo } from 'react';

/**
 * Hook to determine which raid plan image to display based on current fight time.
 *
 * Raid plan entries in the timeline have:
 * - type: 'raidplan'
 * - timestamp: when to start showing the image
 * - endTimestamp: when to stop showing the image
 * - imageUrl: URL/path to the image
 * - note: optional label for the image
 *
 * @param {Object} plan - The loaded raid plan
 * @param {number} currentTime - Current fight time in seconds
 * @returns {Object|null} - The active raid plan entry or null
 */
const useRaidPlan = (plan, currentTime) => {
  const activeRaidPlan = useMemo(() => {
    if (!plan?.timeline?.length) return null;

    // Filter to only raidplan type entries
    const raidPlanEntries = plan.timeline.filter((entry) => entry.type === 'raidplan');

    if (raidPlanEntries.length === 0) return null;

    // Find the first raidplan that is currently active
    // (currentTime is between timestamp and endTimestamp)
    for (const entry of raidPlanEntries) {
      const startTime = entry.timestamp;
      const endTime = entry.endTimestamp;

      if (currentTime >= startTime && currentTime < endTime) {
        return {
          imageUrl: entry.imageUrl,
          note: entry.note || '',
          startTime,
          endTime,
          // Time remaining until this image goes away
          timeRemaining: endTime - currentTime,
        };
      }
    }

    return null;
  }, [plan, currentTime]);

  return activeRaidPlan;
};

export default useRaidPlan;
