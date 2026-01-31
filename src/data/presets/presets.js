/**
 * Preset mitigation plans bundled with Mitplan
 * These are community-standard Party Finder mitigation plans
 */
import m9s from './m9s.js';
import m10s from './m10s.js';
import m11s from './m11s.js';
import m12sP1 from './m12s-p1.js';
import m12sP2 from './m12s-p2.js';

export const PRESETS = [/* m9s, m10s, m11s, */ m12sP1 /*, m12sP2 */];

export const getPresetById = (id) => PRESETS.find((p) => p.id === id);

export default PRESETS;
