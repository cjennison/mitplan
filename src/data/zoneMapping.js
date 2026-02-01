/**
 * FFXIV Zone to Fight Name Mapping
 *
 * Maps actual FFXIV zone names (as reported by ACT/OverlayPlugin) to our
 * internal fight name identifiers used in raid plans.
 *
 * Zone names come from the ChangeZone event's zoneName property.
 * Fight names must match the fightName property in our preset/imported plans.
 *
 * ⚠️ IMPORTANT: These zone names are UNVERIFIED placeholders!
 * The exact zone names must be collected in-game. See docs/ZONE_NAME_COLLECTION.md
 *
 * Zone IDs from Cactbot (for reference):
 * - AacLightHeavyweightM1Savage: 1226 (M1S/R1S)
 * - AacLightHeavyweightM2Savage: 1228 (M2S/R2S)
 * - AacLightHeavyweightM3Savage: 1230 (M3S/R3S)
 * - AacLightHeavyweightM4Savage: 1232 (M4S/R4S)
 * - AacCruiserweightM1Savage: 1257 (M5S/R5S)
 * - AacCruiserweightM2Savage: 1259 (M6S/R6S)
 * - AacCruiserweightM3Savage: 1261 (M7S/R7S)
 * - AacCruiserweightM4Savage: 1263 (M8S/R8S)
 * - AacHeavyweightM1Savage: 1321 (M9S/R9S)
 * - AacHeavyweightM2Savage: 1323 (M10S/R10S)
 * - AacHeavyweightM3Savage: 1325 (M11S/R11S)
 * - AacHeavyweightM4Savage: 1327 (M12S/R12S)
 */

// AAC Light-heavyweight (Patch 7.0 Savage Raids - M1S-M4S)
// AAC Cruiserweight (Patch 7.1 Savage Raids - M5S-M8S)
// AAC Heavyweight (Patch 7.2 Savage Raids - M9S-M12S)

export const ZONE_TO_FIGHT_MAP = {
  // ═══════════════════════════════════════════════════════════════
  // TEST ZONE - Endwalker Savage (P1S)
  // ═══════════════════════════════════════════════════════════════

  // P1S - Asphodelos: The First Circle (Savage) - Zone ID: 1003
  // Used for testing auto-load functionality
  'Asphodelos: The First Circle (Savage)': 'P1S',

  // ═══════════════════════════════════════════════════════════════
  // AAC Light-heavyweight (M1S-M4S) - UNVERIFIED ZONE NAMES
  // ═══════════════════════════════════════════════════════════════

  // M1S - Black Cat (Savage) - Zone ID: 1226
  'AAC Light-heavyweight M1 (Savage)': 'M1S',

  // M2S - Honey B. Lovely (Savage) - Zone ID: 1228
  'AAC Light-heavyweight M2 (Savage)': 'M2S',

  // M3S - Brute Bomber (Savage) - Zone ID: 1230
  'AAC Light-heavyweight M3 (Savage)': 'M3S',

  // M4S - Wicked Thunder (Savage) - Zone ID: 1232
  'AAC Light-heavyweight M4 (Savage)': 'M4S',

  // ═══════════════════════════════════════════════════════════════
  // AAC Cruiserweight (M5S-M8S) - UNVERIFIED ZONE NAMES
  // ═══════════════════════════════════════════════════════════════

  // M5S - Dancing Green (Savage) - Zone ID: 1257
  'AAC Cruiserweight M1 (Savage)': 'M5S',

  // M6S - Sugar Riot (Savage) - Zone ID: 1259
  'AAC Cruiserweight M2 (Savage)': 'M6S',

  // M7S - Brute Abombinator (Savage) - Zone ID: 1261
  'AAC Cruiserweight M3 (Savage)': 'M7S',

  // M8S - Howling Blade (Savage) - Zone ID: 1263
  'AAC Cruiserweight M4 (Savage)': 'M8S',

  // ═══════════════════════════════════════════════════════════════
  // AAC Heavyweight (M9S-M12S) - UNVERIFIED ZONE NAMES
  // ═══════════════════════════════════════════════════════════════

  // M9S - Vamp Fatale (Savage) - Zone ID: 1321
  'AAC Heavyweight M1 (Savage)': 'M9S',

  // M10S - Red Hot & Deep Blue (Savage) - Zone ID: 1323
  'AAC Heavyweight M2 (Savage)': 'M10S',

  // M11S - The Tyrant (Savage) - Zone ID: 1325
  'AAC Heavyweight M3 (Savage)': 'M11S',

  // M12S - Lindwurm (Savage) - Zone ID: 1327
  // Note: Same zone for P1 and P2 - defaults to P1
  'AAC Heavyweight M4 (Savage)': 'M12S P1',
};

// Reverse map: fight name -> list of zone names
export const FIGHT_TO_ZONES_MAP = Object.entries(ZONE_TO_FIGHT_MAP).reduce((acc, [zone, fight]) => {
  if (!acc[fight]) {
    acc[fight] = [];
  }
  acc[fight].push(zone);
  return acc;
}, {});

/**
 * Get the fight name for a given zone name
 * @param {string} zoneName - The zone name from ChangeZone event
 * @returns {string|null} - The fight name or null if not a supported raid zone
 */
export const getFightNameForZone = (zoneName) => {
  if (!zoneName) return null;
  return ZONE_TO_FIGHT_MAP[zoneName] || null;
};

/**
 * Get all zone names for a given fight name
 * @param {string} fightName - The fight name (e.g., "M12S P1")
 * @returns {string[]} - Array of zone names that map to this fight
 */
export const getZonesForFight = (fightName) => {
  if (!fightName) return [];
  return FIGHT_TO_ZONES_MAP[fightName] || [];
};

/**
 * Check if a zone is a supported raid zone
 * @param {string} zoneName - The zone name from ChangeZone event
 * @returns {boolean}
 */
export const isRaidZone = (zoneName) => {
  return zoneName in ZONE_TO_FIGHT_MAP;
};

/**
 * Get all supported fight names
 * @returns {string[]}
 */
export const getSupportedFightNames = () => {
  return [...new Set(Object.values(ZONE_TO_FIGHT_MAP))];
};

export default ZONE_TO_FIGHT_MAP;
