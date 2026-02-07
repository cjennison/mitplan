export const ZONE_TO_FIGHT_MAP = {
  // M1S-M4S
  'AAC Light-heavyweight M1 (Savage)': 'M1S',
  'AAC Light-heavyweight M2 (Savage)': 'M2S',
  'AAC Light-heavyweight M3 (Savage)': 'M3S',
  'AAC Light-heavyweight M4 (Savage)': 'M4S',

  // M5S-M8S
  'AAC Cruiserweight M1 (Savage)': 'M5S',
  'AAC Cruiserweight M2 (Savage)': 'M6S',
  'AAC Cruiserweight M3 (Savage)': 'M7S',
  'AAC Cruiserweight M4 (Savage)': 'M8S',

  // M9S-M12S
  'AAC Heavyweight M1 (Savage)': 'M9S',
  'AAC Heavyweight M2 (Savage)': 'M10S',
  'AAC Heavyweight M3 (Savage)': 'M11S',
  'AAC Heavyweight M4 (Savage)': 'M12S P1',
};

export const FIGHT_TO_ZONES_MAP = Object.entries(ZONE_TO_FIGHT_MAP).reduce((acc, [zone, fight]) => {
  if (!acc[fight]) {
    acc[fight] = [];
  }
  acc[fight].push(zone);
  return acc;
}, {});

export const getFightNameForZone = (zoneName) => {
  if (!zoneName) return null;
  return ZONE_TO_FIGHT_MAP[zoneName] || null;
};

export const getZonesForFight = (fightName) => {
  if (!fightName) return [];
  return FIGHT_TO_ZONES_MAP[fightName] || [];
};

export const isRaidZone = (zoneName) => {
  return zoneName in ZONE_TO_FIGHT_MAP;
};

export const getSupportedFightNames = () => {
  return [...new Set(Object.values(ZONE_TO_FIGHT_MAP))];
};

export default ZONE_TO_FIGHT_MAP;
