/**
 * Plan Validator - Validates mitigation plan schema and data
 */

/**
 * Required fields for a valid mitigation plan
 */
const REQUIRED_FIELDS = ['version', 'timeline'];

/**
 * Required fields for each timeline entry (mitigation type)
 */
const REQUIRED_ENTRY_FIELDS = ['timestamp', 'job', 'ability'];

/**
 * Required fields for raid plan entries
 */
const REQUIRED_RAIDPLAN_FIELDS = ['timestamp', 'endTimestamp', 'imageUrl'];

/**
 * Valid job codes (specific jobs)
 */
const VALID_JOBS = [
  // Tanks
  'PLD',
  'WAR',
  'DRK',
  'GNB',
  // Healers
  'WHM',
  'SCH',
  'AST',
  'SGE',
  // Melee DPS
  'MNK',
  'DRG',
  'NIN',
  'SAM',
  'RPR',
  'VPR',
  // Ranged Physical DPS
  'BRD',
  'MCH',
  'DNC',
  // Ranged Magical DPS
  'BLM',
  'SMN',
  'RDM',
  'PCT',
];

/**
 * Valid job type codes (role-based categories)
 * Used in role-based presets where abilities apply to entire job types
 */
const VALID_JOB_TYPES = ['All', 'Tank', 'Healer', 'Melee', 'PhysRanged', 'MagicRanged'];

/**
 * Validates a mitigation plan object
 *
 * @param {object} plan - The plan object to validate
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export const validatePlan = (plan) => {
  const errors = [];
  const warnings = [];

  // Check if plan is an object
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    errors.push('Plan must be a valid object');
    return { valid: false, errors, warnings };
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in plan)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check version
  if (plan.version && typeof plan.version !== 'string') {
    errors.push('Version must be a string');
  }

  // Check timeline
  if (!Array.isArray(plan.timeline)) {
    errors.push('Timeline must be an array');
    return { valid: errors.length === 0, errors, warnings };
  }

  if (plan.timeline.length === 0) {
    warnings.push('Timeline is empty - no mitigations will be displayed');
  }

  // Validate each timeline entry
  plan.timeline.forEach((entry, index) => {
    const entryPrefix = `Timeline entry ${index + 1}`;

    // Check if this is a raid plan entry
    if (entry.type === 'raidplan') {
      // Validate raid plan entry
      for (const field of REQUIRED_RAIDPLAN_FIELDS) {
        if (!(field in entry)) {
          errors.push(`${entryPrefix} (raidplan): Missing required field "${field}"`);
        }
      }

      // Validate timestamps
      if (entry.timestamp !== undefined) {
        if (typeof entry.timestamp !== 'number' || entry.timestamp < 0) {
          errors.push(`${entryPrefix} (raidplan): Timestamp must be a non-negative number`);
        }
      }
      if (entry.endTimestamp !== undefined) {
        if (typeof entry.endTimestamp !== 'number' || entry.endTimestamp < 0) {
          errors.push(`${entryPrefix} (raidplan): End timestamp must be a non-negative number`);
        }
        if (entry.timestamp !== undefined && entry.endTimestamp <= entry.timestamp) {
          errors.push(`${entryPrefix} (raidplan): End timestamp must be after start timestamp`);
        }
      }

      // Validate imageUrl
      if (entry.imageUrl !== undefined && typeof entry.imageUrl !== 'string') {
        errors.push(`${entryPrefix} (raidplan): Image URL must be a string`);
      }

      return; // Skip mitigation validation for raid plan entries
    }

    // Standard mitigation entry validation
    // Check required entry fields
    for (const field of REQUIRED_ENTRY_FIELDS) {
      if (!(field in entry)) {
        errors.push(`${entryPrefix}: Missing required field "${field}"`);
      }
    }

    // Validate timestamp
    if (entry.timestamp !== undefined) {
      if (typeof entry.timestamp !== 'number' || entry.timestamp < 0) {
        errors.push(`${entryPrefix}: Timestamp must be a non-negative number`);
      }
    }

    // Validate job code
    if (entry.job !== undefined) {
      if (typeof entry.job !== 'string') {
        errors.push(`${entryPrefix}: Job must be a string`);
      } else {
        const jobUpper = entry.job.toUpperCase();
        const isValidJob = VALID_JOBS.includes(jobUpper);
        const isValidJobType = VALID_JOB_TYPES.some((type) => type.toUpperCase() === jobUpper);
        if (!isValidJob && !isValidJobType) {
          warnings.push(`${entryPrefix}: Unknown job code "${entry.job}"`);
        }
      }
    }

    // Validate ability name
    if (entry.ability !== undefined && typeof entry.ability !== 'string') {
      errors.push(`${entryPrefix}: Ability must be a string`);
    }
  });

  // Check for optional but recommended fields
  if (!plan.fightName) {
    warnings.push('Missing optional field: fightName - fight name will not be displayed');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Gets a summary of a mitigation plan
 *
 * @param {object} plan - The validated plan object
 * @returns {{ fightName: string, entryCount: number, jobCounts: object, duration: number }}
 */
export const getPlanSummary = (plan) => {
  const jobCounts = {};
  let maxTimestamp = 0;

  for (const entry of plan.timeline || []) {
    const job = entry.job?.toUpperCase() || 'UNKNOWN';
    jobCounts[job] = (jobCounts[job] || 0) + 1;

    if (entry.timestamp > maxTimestamp) {
      maxTimestamp = entry.timestamp;
    }
  }

  return {
    fightName: plan.fightName || 'Unknown Fight',
    entryCount: plan.timeline?.length || 0,
    jobCounts,
    duration: maxTimestamp,
  };
};

export { VALID_JOBS };
