/**
 * FFXIV Job data and utilities
 */

/**
 * Job definitions with role information
 */
export const JOBS = {
  // Tanks
  PLD: { name: 'Paladin', role: 'tank', color: '#3d5a80' },
  WAR: { name: 'Warrior', role: 'tank', color: '#3d5a80' },
  DRK: { name: 'Dark Knight', role: 'tank', color: '#3d5a80' },
  GNB: { name: 'Gunbreaker', role: 'tank', color: '#3d5a80' },

  // Healers
  WHM: { name: 'White Mage', role: 'healer', color: '#4a7c59' },
  SCH: { name: 'Scholar', role: 'healer', color: '#4a7c59' },
  AST: { name: 'Astrologian', role: 'healer', color: '#4a7c59' },
  SGE: { name: 'Sage', role: 'healer', color: '#4a7c59' },

  // Melee DPS
  MNK: { name: 'Monk', role: 'dps', color: '#8b3a3a' },
  DRG: { name: 'Dragoon', role: 'dps', color: '#8b3a3a' },
  NIN: { name: 'Ninja', role: 'dps', color: '#8b3a3a' },
  SAM: { name: 'Samurai', role: 'dps', color: '#8b3a3a' },
  RPR: { name: 'Reaper', role: 'dps', color: '#8b3a3a' },
  VPR: { name: 'Viper', role: 'dps', color: '#8b3a3a' },

  // Ranged Physical DPS
  BRD: { name: 'Bard', role: 'dps', color: '#8b3a3a' },
  MCH: { name: 'Machinist', role: 'dps', color: '#8b3a3a' },
  DNC: { name: 'Dancer', role: 'dps', color: '#8b3a3a' },

  // Ranged Magical DPS
  BLM: { name: 'Black Mage', role: 'dps', color: '#8b3a3a' },
  SMN: { name: 'Summoner', role: 'dps', color: '#8b3a3a' },
  RDM: { name: 'Red Mage', role: 'dps', color: '#8b3a3a' },
  PCT: { name: 'Pictomancer', role: 'dps', color: '#8b3a3a' },
};

/**
 * Role colors for styling
 */
export const ROLE_COLORS = {
  tank: '#3d5a80',
  healer: '#4a7c59',
  dps: '#8b3a3a',
};

/**
 * Get role from job code
 *
 * @param {string} job - Job abbreviation (e.g., 'WAR')
 * @returns {string} Role name ('tank', 'healer', 'dps', or 'unknown')
 */
export const getRoleFromJob = (job) => {
  const jobData = JOBS[job?.toUpperCase()];
  return jobData?.role || 'unknown';
};

/**
 * Get job color from job code
 *
 * @param {string} job - Job abbreviation
 * @returns {string} Hex color code
 */
export const getJobColor = (job) => {
  const jobData = JOBS[job?.toUpperCase()];
  return jobData?.color || '#666666';
};

/**
 * Get full job name from abbreviation
 *
 * @param {string} job - Job abbreviation
 * @returns {string} Full job name or the original abbreviation if unknown
 */
export const getJobName = (job) => {
  const jobData = JOBS[job?.toUpperCase()];
  return jobData?.name || job;
};
