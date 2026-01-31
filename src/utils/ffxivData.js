/**
 * FFXIV Job data and utilities
 */

/**
 * Job Type definitions - broader categories than roles
 * These can be used in presets instead of specific jobs
 */
export const JOB_TYPES = {
  Tank: { name: 'Tank', role: 'tank', color: '#3d5a80', jobs: ['PLD', 'WAR', 'DRK', 'GNB'] },
  Healer: { name: 'Healer', role: 'healer', color: '#4a7c59', jobs: ['WHM', 'SCH', 'AST', 'SGE'] },
  Melee: {
    name: 'Melee',
    role: 'dps',
    color: '#8b3a3a',
    jobs: ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'],
  },
  PhysRanged: { name: 'Phys Ranged', role: 'dps', color: '#8b3a3a', jobs: ['BRD', 'MCH', 'DNC'] },
  MagicRanged: {
    name: 'Magic Ranged',
    role: 'dps',
    color: '#8b3a3a',
    jobs: ['BLM', 'SMN', 'RDM', 'PCT'],
  },
};

/**
 * Job definitions with role and jobType information
 */
export const JOBS = {
  // Tanks
  PLD: { name: 'Paladin', role: 'tank', jobType: 'Tank', color: '#3d5a80' },
  WAR: { name: 'Warrior', role: 'tank', jobType: 'Tank', color: '#3d5a80' },
  DRK: { name: 'Dark Knight', role: 'tank', jobType: 'Tank', color: '#3d5a80' },
  GNB: { name: 'Gunbreaker', role: 'tank', jobType: 'Tank', color: '#3d5a80' },

  // Healers
  WHM: { name: 'White Mage', role: 'healer', jobType: 'Healer', color: '#4a7c59' },
  SCH: { name: 'Scholar', role: 'healer', jobType: 'Healer', color: '#4a7c59' },
  AST: { name: 'Astrologian', role: 'healer', jobType: 'Healer', color: '#4a7c59' },
  SGE: { name: 'Sage', role: 'healer', jobType: 'Healer', color: '#4a7c59' },

  // Melee DPS
  MNK: { name: 'Monk', role: 'dps', jobType: 'Melee', color: '#8b3a3a' },
  DRG: { name: 'Dragoon', role: 'dps', jobType: 'Melee', color: '#8b3a3a' },
  NIN: { name: 'Ninja', role: 'dps', jobType: 'Melee', color: '#8b3a3a' },
  SAM: { name: 'Samurai', role: 'dps', jobType: 'Melee', color: '#8b3a3a' },
  RPR: { name: 'Reaper', role: 'dps', jobType: 'Melee', color: '#8b3a3a' },
  VPR: { name: 'Viper', role: 'dps', jobType: 'Melee', color: '#8b3a3a' },

  // Ranged Physical DPS
  BRD: { name: 'Bard', role: 'dps', jobType: 'PhysRanged', color: '#8b3a3a' },
  MCH: { name: 'Machinist', role: 'dps', jobType: 'PhysRanged', color: '#8b3a3a' },
  DNC: { name: 'Dancer', role: 'dps', jobType: 'PhysRanged', color: '#8b3a3a' },

  // Ranged Magical DPS
  BLM: { name: 'Black Mage', role: 'dps', jobType: 'MagicRanged', color: '#8b3a3a' },
  SMN: { name: 'Summoner', role: 'dps', jobType: 'MagicRanged', color: '#8b3a3a' },
  RDM: { name: 'Red Mage', role: 'dps', jobType: 'MagicRanged', color: '#8b3a3a' },
  PCT: { name: 'Pictomancer', role: 'dps', jobType: 'MagicRanged', color: '#8b3a3a' },
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

/**
 * Get job type from job code (Tank, Healer, Melee, PhysRanged, MagicRanged)
 *
 * @param {string} job - Job abbreviation
 * @returns {string} Job type or 'unknown'
 */
export const getJobType = (job) => {
  const jobData = JOBS[job?.toUpperCase()];
  return jobData?.jobType || 'unknown';
};

/**
 * Check if a job code is actually a job type (Tank, Healer, Melee, etc.)
 *
 * @param {string} jobOrType - Job abbreviation or job type
 * @returns {boolean} True if it's a job type
 */
export const isJobType = (jobOrType) => {
  return JOB_TYPES[jobOrType] !== undefined;
};

/**
 * Check if a player's job matches a timeline entry's job field.
 * The entry's job can be either a specific job (WAR, SCH) or a job type (Tank, Healer, Melee).
 *
 * @param {string} entryJob - The job field from the timeline entry
 * @param {string} playerJob - The player's current job (e.g., 'WAR')
 * @returns {boolean} True if the player matches
 */
export const jobMatchesEntry = (entryJob, playerJob) => {
  if (!entryJob || !playerJob) return false;

  const entryUpper = entryJob.toUpperCase();
  const playerUpper = playerJob.toUpperCase();

  // Direct match (e.g., WAR === WAR)
  if (entryUpper === playerUpper) return true;

  // Check if entry is a job type (Tank, Healer, etc.)
  // Need to handle case-insensitive lookup
  const jobTypeKey = Object.keys(JOB_TYPES).find((k) => k.toUpperCase() === entryUpper);
  if (jobTypeKey) {
    const jobType = JOB_TYPES[jobTypeKey];
    return jobType.jobs.includes(playerUpper);
  }

  return false;
};

/**
 * Get display info for a job or job type (for badges)
 *
 * @param {string} jobOrType - Job abbreviation or job type
 * @returns {Object} { displayName, role, color }
 */
export const getJobDisplayInfo = (jobOrType) => {
  if (!jobOrType) return { displayName: '???', role: 'unknown', color: '#666666' };

  const upper = jobOrType.toUpperCase();

  // Check if it's a specific job
  const jobData = JOBS[upper];
  if (jobData) {
    return { displayName: upper, role: jobData.role, color: jobData.color };
  }

  // Check if it's a job type
  const jobTypeKey = Object.keys(JOB_TYPES).find((k) => k.toUpperCase() === upper);
  if (jobTypeKey) {
    const jobType = JOB_TYPES[jobTypeKey];
    return { displayName: jobTypeKey, role: jobType.role, color: jobType.color };
  }

  return { displayName: jobOrType, role: 'unknown', color: '#666666' };
};
