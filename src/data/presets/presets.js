/**
 * Preset raid plans bundled with XRT
 * These are community-standard Party Finder raid plans
 *
 * isDefault: true marks this preset as the developer-recommended default
 * for its fight. Only one preset per fightName should have isDefault: true.
 */
import m9sRole from './m9s-role.js';
import m10sRole from './m10s-role.js';
import m11sRole from './m11s-role.js';
import m12sP1Role from './m12s-p1-role.js';

// Mark role-based plans as defaults for their respective fights
m9sRole.isDefault = true;
m10sRole.isDefault = true;
m11sRole.isDefault = true;
m12sP1Role.isDefault = true;

export const PRESETS = [m9sRole, m10sRole, m11sRole, m12sP1Role];

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
