import { useMemo } from 'react';
import { getJobType } from '../utils/ffxivData';

/**
 * Check if a player's job type matches any of the role filters.
 *
 * @param {string} playerJob - The player's job (e.g., 'WAR')
 * @param {string[]} roleFilters - Array of role/job types to filter by (e.g., ['Tank', 'Healer'])
 * @returns {boolean} True if player's job type is in the roleFilters, or if no filters exist
 */
const matchesRoleFilter = (playerJob, roleFilters) => {
  // If no role filters, show to everyone
  if (!roleFilters || !Array.isArray(roleFilters) || roleFilters.length === 0) {
    return true;
  }

  // Get the player's job type (Tank, Healer, Melee, PhysRanged, MagicRanged)
  const playerJobType = getJobType(playerJob);

  // Check if player's job type is in the filter list (case-insensitive)
  return roleFilters.some((filter) => filter.toLowerCase() === playerJobType.toLowerCase());
};

/**
 * Hook to determine which raid plan image to display based on current fight time.
 *
 * Raid plan entries in the timeline have:
 * - type: 'raidplan'
 * - timestamp: when to start showing the image
 * - endTimestamp: when to stop showing the image
 * - imageUrl: URL/path to the image
 * - note: optional label for the image
 * - roleFilters: (optional) array of job types that should see this image
 *
 * @param {Object} plan - The loaded raid plan
 * @param {number} currentTime - Current fight time in seconds
 * @param {string} playerJob - The player's current job (e.g., 'WAR')
 * @returns {Object|null} - The active raid plan entry or null
 */
const useRaidPlan = (plan, currentTime, playerJob) => {
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
        // Check role filter - if player doesn't match, skip this entry
        if (!matchesRoleFilter(playerJob, entry.roleFilters)) {
          continue;
        }

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
  }, [plan, currentTime, playerJob]);

  return activeRaidPlan;
};

export default useRaidPlan;
