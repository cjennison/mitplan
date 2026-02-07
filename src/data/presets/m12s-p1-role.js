/**
 * M12S Phase 1 - AAC Heavyweight M4 (Savage)
 * Simplified role-based raid plan
 *
 * This version uses job types (Tank, Healer, Melee, etc.) instead of specific jobs
 * where abilities are shared across the job type. Class-specific abilities still
 * use the specific job code.
 */
export default {
  id: 'm12s-p1-role',
  name: "Ikuya Mitty's M12S - Part 1",
  fightName: 'M12S P1',
  version: '1.0',
  requiresRoles: true,
  timeline: [
    // ═══════════════════════════════════════════════════════════════
    // RAID PLAN IMAGES
    // Show strategy diagrams at specific fight phases
    // ═══════════════════════════════════════════════════════════════
    {
      type: 'raidplan',
      timestamp: 115, // 115 1:55 - Act 2 starts
      endTimestamp: 178, // 178 2:58 - Act 2 ends
      imageUrl: '/raidplans/m12s-p1-act2.png',
      note: 'Act 2 Positions',
    },
    {
      type: 'raidplan',
      timestamp: 180, //  3:03 - Act 3 starts
      endTimestamp: 230, //  3:50 - Act 3 ends
      imageUrl: '/raidplans/m12s-p1-act3.png',
      note: 'Act 3 Positions',
    },
    {
      type: 'raidplan',
      timestamp: 240, // 4:00 - Curtain Call Baits
      endTimestamp: 260, // 4:20 - Curtain Call Baits ends
      imageUrl: '/raidplans/m12s-p1-curtaincallbaits.png',
      note: 'Curtain Call Baits',
    },
    {
      type: 'raidplan',
      timestamp: 261, // 260 4:20 - Curtain Call Spreads
      endTimestamp: 280, // 280 4:40 - Curtain Call Spreads ends
      imageUrl: '/raidplans/m12s-p1-curtaincallspreads.png',
      note: 'Curtain Call Spreads',
    },

    // ═══════════════════════════════════════════════════════════════
    // ACTION TIMELINE
    // ═══════════════════════════════════════════════════════════════

    // The Fixer @ 0:13
    { timestamp: 13, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'The Fixer' },
    { timestamp: 13, job: 'Tank', role: 'OT', ability: 'Group Defensive', note: 'The Fixer' },
    // Healers are class-specific due to different abilities
    { timestamp: 13, job: 'WHM', ability: 'Plenary Indulgence', note: 'The Fixer' },
    { timestamp: 13, job: 'AST', ability: 'Collective Unconscious', note: 'The Fixer' },
    { timestamp: 13, job: 'SCH', ability: 'Sacred Soil + Spreadlo', note: 'The Fixer' },
    { timestamp: 13, job: 'SGE', ability: 'Zoe Shields + Kerachole', note: 'The Fixer' },
    { timestamp: 13, job: 'Melee', role: 'M1', ability: 'Feint', note: 'The Fixer' },
    { timestamp: 13, job: 'PhysRanged', ability: 'Group Defensive', note: 'The Fixer' },
    { timestamp: 13, job: 'MagicRanged', ability: 'Addle', note: 'The Fixer' },

    // Mortal Slayer @ 0:41
    { timestamp: 41, job: 'SCH', ability: 'Sacred Soil + Fey Illumination', note: 'Mortal Slayer' },
    { timestamp: 41, job: 'SGE', ability: 'Kerachole', note: 'Mortal Slayer' },

    // Ravenous Reach @ 1:25
    { timestamp: 85, job: 'Tank', role: 'MT', ability: 'Group Defensive', note: 'Ravenous Reach' },
    { timestamp: 85, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Ravenous Reach' },
    { timestamp: 85, job: 'WHM', ability: 'Temperance + Divine Caress', note: 'Ravenous Reach' },
    { timestamp: 85, job: 'AST', ability: 'Neutral Sect + Sun Sign', note: 'Ravenous Reach' },
    {
      timestamp: 85,
      job: 'SCH',
      ability: 'Expedient + Seraph + Seraphism',
      note: 'Ravenous Reach',
    },
    {
      timestamp: 85,
      job: 'SGE',
      ability: 'Holos + Panhaima + Philosophia',
      note: 'Ravenous Reach',
    },
    { timestamp: 85, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Ravenous Reach' },

    // Fourth-wall Fusion @ 1:34
    { timestamp: 94, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'Fourth-wall Fusion' },
    {
      timestamp: 94,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive (DRK/GNB)',
      note: 'Fourth-wall Fusion',
    },
    { timestamp: 94, job: 'WHM', ability: 'Liturgy of the Bell', note: 'Fourth-wall Fusion' },
    { timestamp: 94, job: 'AST', ability: 'Macrocosmos', note: 'Fourth-wall Fusion' },
    { timestamp: 94, job: 'SCH', ability: 'Sacred Soil + Spreadlo', note: 'Fourth-wall Fusion' },
    { timestamp: 94, job: 'SGE', ability: 'Zoe Shields + Kerachole', note: 'Fourth-wall Fusion' },
    { timestamp: 94, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Fourth-wall Fusion' },
    { timestamp: 94, job: 'PhysRanged', ability: 'Group Defensive', note: 'Fourth-wall Fusion' },
    { timestamp: 94, job: 'MagicRanged', ability: 'Addle', note: 'Fourth-wall Fusion' },

    // The Fixer @ 1:45
    {
      timestamp: 105,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive (WAR/PLD)',
      note: 'The Fixer',
    },
    { timestamp: 105, job: 'WHM', ability: 'Plenary Indulgence', note: 'The Fixer' },
    { timestamp: 105, job: 'AST', ability: 'Collective Unconscious', note: 'The Fixer' },
    { timestamp: 105, job: 'PhysRanged', ability: 'Group Defensive', note: 'The Fixer' },
    { timestamp: 105, job: 'MagicRanged', ability: 'Addle', note: 'The Fixer' },

    // Splattershed @ 3:05
    { timestamp: 185, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Splattershed' },
    { timestamp: 185, job: 'SCH', ability: 'Sacred Soil', note: 'Splattershed' },
    { timestamp: 185, job: 'SGE', ability: 'Kerachole', note: 'Splattershed' },
    { timestamp: 185, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Splattershed' },

    // Venomous Scourge @ 3:48
    { timestamp: 228, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'Venomous Scourge' },
    {
      timestamp: 228,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive',
      note: 'Venomous Scourge',
    },
    {
      timestamp: 228,
      job: 'SCH',
      ability: 'Sacred Soil + Fey Illumination + Spreadlo',
      note: 'Venomous Scourge',
    },
    {
      timestamp: 228,
      job: 'SGE',
      ability: 'Panhaima + Kerachole + Zoe Shields',
      note: 'Venomous Scourge',
    },
    { timestamp: 228, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Venomous Scourge' },
    { timestamp: 228, job: 'PhysRanged', ability: 'Group Defensive', note: 'Venomous Scourge' },
    { timestamp: 228, job: 'MagicRanged', ability: 'Addle', note: 'Venomous Scourge' },

    // The Fixer @ 3:58
    { timestamp: 238, job: 'Tank', role: 'OT', ability: 'Group Defensive', note: 'The Fixer' },
    { timestamp: 238, job: 'WHM', ability: 'Plenary Indulgence', note: 'The Fixer' },
    { timestamp: 238, job: 'AST', ability: 'Collective Unconscious', note: 'The Fixer' },

    // Ravenous Reach @ 4:25
    { timestamp: 265, job: 'Tank', role: 'MT', ability: 'Group Defensive', note: 'Ravenous Reach' },
    { timestamp: 265, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Ravenous Reach' },
    { timestamp: 265, job: 'WHM', ability: 'Temperance + Divine Caress', note: 'Ravenous Reach' },
    { timestamp: 265, job: 'AST', ability: 'Neutral Sect + Sun Sign', note: 'Ravenous Reach' },
    { timestamp: 265, job: 'SCH', ability: 'Expedient + Seraph', note: 'Ravenous Reach' },
    { timestamp: 265, job: 'SGE', ability: 'Holos', note: 'Ravenous Reach' },
    { timestamp: 265, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Ravenous Reach' },

    // Splattershed @ 4:47
    { timestamp: 287, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'Splattershed' },
    { timestamp: 287, job: 'SCH', ability: 'Sacred Soil', note: 'Splattershed' },
    { timestamp: 287, job: 'SGE', ability: 'Kerachole', note: 'Splattershed' },
    { timestamp: 287, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Splattershed' },

    // Mortal Slayer @ 5:12
    { timestamp: 312, job: 'SCH', ability: 'Succor', note: 'Mortal Slayer' },
    { timestamp: 312, job: 'SGE', ability: 'Eukrasian Prognosis', note: 'Mortal Slayer' },

    // Slaughtershed I @ 5:39
    { timestamp: 339, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Slaughtershed I' },
    { timestamp: 339, job: 'WHM', ability: 'Plenary Indulgence', note: 'Slaughtershed I' },
    { timestamp: 339, job: 'AST', ability: 'Collective Unconscious', note: 'Slaughtershed I' },
    {
      timestamp: 339,
      job: 'SCH',
      ability: 'Sacred Soil + Fey Illumination + Seraphism',
      note: 'Slaughtershed I',
    },
    { timestamp: 339, job: 'SGE', ability: 'Kerachole + Philosophia', note: 'Slaughtershed I' },
    { timestamp: 339, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Slaughtershed I' },
    { timestamp: 339, job: 'MagicRanged', ability: 'Addle', note: 'Slaughtershed I' },

    // Slaughtershed II @ 6:08
    { timestamp: 368, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'Slaughtershed II' },
    {
      timestamp: 368,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive',
      note: 'Slaughtershed II',
    },
    { timestamp: 368, job: 'WHM', ability: 'Liturgy of the Bell', note: 'Slaughtershed II' },
    { timestamp: 368, job: 'AST', ability: 'Macrocosmos', note: 'Slaughtershed II' },
    { timestamp: 368, job: 'SCH', ability: 'Sacred Soil + Spreadlo', note: 'Slaughtershed II' },
    {
      timestamp: 368,
      job: 'SGE',
      ability: 'Kerachole + Panhaima + Zoe Shields',
      note: 'Slaughtershed II',
    },
    { timestamp: 368, job: 'PhysRanged', ability: 'Group Defensive', note: 'Slaughtershed II' },

    // Slaughtershed III @ 6:37
    {
      timestamp: 397,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive',
      note: 'Slaughtershed III',
    },
    { timestamp: 397, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Slaughtershed III' },
    {
      timestamp: 397,
      job: 'WHM',
      ability: 'Plenary Indulgence + Temperance + Divine Caress',
      note: 'Slaughtershed III',
    },
    {
      timestamp: 397,
      job: 'AST',
      ability: 'Collective Unconscious + Neutral Sect + Sun Sign',
      note: 'Slaughtershed III',
    },
    {
      timestamp: 397,
      job: 'SCH',
      ability: 'Sacred Soil + Expedient + Seraph',
      note: 'Slaughtershed III',
    },
    { timestamp: 397, job: 'SGE', ability: 'Kerachole + Holos', note: 'Slaughtershed III' },
    { timestamp: 397, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Slaughtershed III' },
  ],
};
