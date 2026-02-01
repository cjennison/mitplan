/**
 * Preset raid plans bundled with XRT
 * These are community-standard Party Finder raid plans
 *
 * isDefault: true marks this preset as the developer-recommended default
 * for its fight. Only one preset per fightName should have isDefault: true.
 */
import m12sP1Role from './m12s-p1-role.js';

// Mark the role-based simplified plan as default for M12S P1
m12sP1Role.isDefault = true;

export const PRESETS = [m12sP1Role];

export const getPresetById = (id) => PRESETS.find((p) => p.id === id);

/**
 * Get the default preset for a given fight name
 * @param {string} fightName - The fight name (e.g., "M12S P1")
 * @returns {Object|null} - The default preset or null
 */
export const getDefaultPresetForFight = (fightName) => {
  return PRESETS.find((p) => p.fightName === fightName && p.isDefault) || null;
};

export default PRESETS;
