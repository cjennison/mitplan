import m9sRole from './m9s-role.js';
import m10sRole from './m10s-role.js';
import m11sRole from './m11s-role.js';
import m12sP1Role from './m12s-p1-role.js';
import m12sP2Role from './m12s-p2-role.js';

m9sRole.isDefault = true;
m10sRole.isDefault = true;
m11sRole.isDefault = true;
m12sP1Role.isDefault = true;
m12sP2Role.isDefault = true;

export const PRESETS = [m9sRole, m10sRole, m11sRole, m12sP1Role, m12sP2Role];

export const getPresetById = (id) => PRESETS.find((p) => p.id === id);

export const getDefaultPresetForFight = (fightName) => {
  return PRESETS.find((p) => p.fightName === fightName && p.isDefault) || null;
};

export default PRESETS;
