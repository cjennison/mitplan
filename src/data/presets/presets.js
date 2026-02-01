/**
 * Preset mitigation plans bundled with Mitplan
 * These are community-standard Party Finder mitigation plans
 *
 * isDefault: true marks this preset as the developer-recommended default
 * for its fight. Only one preset per fightName should have isDefault: true.
 */
import m9s from './m9s.js';
import m10s from './m10s.js';
import m11s from './m11s.js';
import m12sP1 from './m12s-p1.js';
import m12sP1Role from './m12s-p1-role.js';
import m12sP2 from './m12s-p2.js';
import p1sTest from './p1s-test.js';

// Mark the role-based simplified plan as default for M12S P1
m12sP1Role.isDefault = true;

export const PRESETS = [/* m9s, m10s, m11s, */ m12sP1Role /*, m12sP2 */];

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
