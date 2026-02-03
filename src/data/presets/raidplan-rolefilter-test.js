/**
 * Raid Plan Role Filter Test Preset
 *
 * This preset is used to test the roleFilters feature on raidplan entries.
 * Each raidplan entry demonstrates different filter configurations.
 */
export default {
  id: 'raidplan-rolefilter-test',
  name: 'Role Filter Test Plan',
  fightName: 'Test Fight',
  version: '1.0',
  requiresRoles: false,
  timeline: [
    // All players see this (no roleFilters)
    {
      type: 'raidplan',
      timestamp: 0,
      endTimestamp: 10,
      imageUrl: '/raidplans/m12s-p1-act2.png',
      note: 'ALL: Everyone sees this',
    },

    // Only Tanks see this
    {
      type: 'raidplan',
      timestamp: 10,
      endTimestamp: 20,
      imageUrl: '/raidplans/m12s-p1-act3.png',
      note: 'TANK ONLY: Only tanks see this',
      roleFilters: ['Tank'],
    },

    // Only Healers see this
    {
      type: 'raidplan',
      timestamp: 20,
      endTimestamp: 30,
      imageUrl: '/raidplans/m12s-p1-act3.png',
      note: 'HEALER ONLY: Only healers see this',
      roleFilters: ['Healer'],
    },

    // Only Melee DPS see this
    {
      type: 'raidplan',
      timestamp: 30,
      endTimestamp: 40,
      imageUrl: '/raidplans/m12s-p1-curtaincallbaits.png',
      note: 'MELEE ONLY: Only melee DPS see this',
      roleFilters: ['Melee'],
    },

    // Only Ranged DPS (physical and magical) see this
    {
      type: 'raidplan',
      timestamp: 40,
      endTimestamp: 50,
      imageUrl: '/raidplans/m12s-p1-curtaincallspreads.png',
      note: 'RANGED ONLY: Only ranged DPS see this',
      roleFilters: ['PhysRanged', 'MagicRanged'],
    },

    // Sample action entries to make this a valid plan
    { timestamp: 5, job: 'Tank', ability: 'Reprisal', note: 'Test action' },
    { timestamp: 15, job: 'Healer', ability: 'Party Heal', note: 'Test action' },
    { timestamp: 25, job: 'Melee', ability: 'Feint', note: 'Test action' },
    { timestamp: 35, job: 'PhysRanged', ability: 'Party Mit', note: 'Test action' },
    { timestamp: 45, job: 'MagicRanged', ability: 'Addle', note: 'Test action' },
  ],
};
