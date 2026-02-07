import { useMemo } from 'react';
import { getJobType } from '../utils/ffxivData';

const matchesRoleFilter = (playerJob, roleFilters) => {
  if (!roleFilters || !Array.isArray(roleFilters) || roleFilters.length === 0) {
    return true;
  }
  const playerJobType = getJobType(playerJob);
  return roleFilters.some((filter) => filter.toLowerCase() === playerJobType.toLowerCase());
};

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
        if (!matchesRoleFilter(playerJob, entry.roleFilters)) {
          continue;
        }

        return {
          imageUrl: entry.imageUrl,
          note: entry.note || '',
          startTime,
          endTime,
          timeRemaining: endTime - currentTime,
        };
      }
    }

    return null;
  }, [plan, currentTime, playerJob]);

  return activeRaidPlan;
};

export default useRaidPlan;
