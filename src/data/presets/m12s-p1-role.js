/**
 * M12S Phase 1 - AAC Heavyweight M4 (Savage)
 * Simplified role-based mitigation plan
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
      timestamp: 115, // 1:55 - Act 2 starts
      endTimestamp: 178, // 2:58 - Act 2 ends
      imageUrl: '/raidplans/m12s-p1-act2.png',
      note: 'Act 2 Positions',
    },
    {
      type: 'raidplan',
      timestamp: 300, // 300 3:00 - Act 3 starts
      endTimestamp: 330, // 330 3:50 - Act 3 ends
      imageUrl: '/raidplans/m12s-p1-act3.png',
      note: 'Act 3 Positions',
    },
    {
      type: 'raidplan',
      timestamp: 360, // 360 4:00 - Curtain Call Baits
      endTimestamp: 380, // 380 4:20 - Curtain Call Baits ends
      imageUrl: '/raidplans/m12s-p1-curtaincallbaits.png',
      note: 'Curtain Call Baits',
    },
    {
      type: 'raidplan',
      timestamp: 380, // 380 4:20 - Curtain Call Spreads
      endTimestamp: 400, // 400 4:40 - Curtain Call Spreads ends
      imageUrl: '/raidplans/m12s-p1-curtaincallspreads.png',
      note: 'Curtain Call Spreads',
    },
    {
      type: 'raidplan',
      timestamp: 410, // 410 6:50 - Chain Breaks
      endTimestamp: 435, // 435 7:15 - Chain Breaks ends
      imageUrl: '/raidplans/m12s-p1-chains.webp',
      note: 'Chain Breaks',
    },

    // ═══════════════════════════════════════════════════════════════
    // MITIGATION TIMELINE
    // ═══════════════════════════════════════════════════════════════

    // The Fixer @ 0:16
    { timestamp: 16, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'The Fixer' },
    { timestamp: 16, job: 'Tank', role: 'OT', ability: 'Party Mit', note: 'The Fixer' },
    // Healers are class-specific due to different abilities
    { timestamp: 16, job: 'WHM', ability: 'Plenary Indulgence', note: 'The Fixer' },
    { timestamp: 16, job: 'AST', ability: 'Collective Unconscious', note: 'The Fixer' },
    { timestamp: 16, job: 'SCH', ability: 'Sacred Soil + Spreadlo', note: 'The Fixer' },
    { timestamp: 16, job: 'SGE', ability: 'Zoe Shields + Kerachole', note: 'The Fixer' },
    { timestamp: 16, job: 'Melee', role: 'M1', ability: 'Feint', note: 'The Fixer' },
    { timestamp: 16, job: 'PhysRanged', ability: 'Party Mit', note: 'The Fixer' },
    { timestamp: 16, job: 'MagicRanged', ability: 'Addle', note: 'The Fixer' },

    // Mortal Slayer @ 0:44
    { timestamp: 44, job: 'SCH', ability: 'Sacred Soil + Fey Illumination', note: 'Mortal Slayer' },
    { timestamp: 44, job: 'SGE', ability: 'Kerachole', note: 'Mortal Slayer' },

    // Ravenous Reach @ 1:28
    { timestamp: 88, job: 'Tank', role: 'MT', ability: 'Party Mit', note: 'Ravenous Reach' },
    { timestamp: 88, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Ravenous Reach' },
    { timestamp: 88, job: 'WHM', ability: 'Temperance + Divine Caress', note: 'Ravenous Reach' },
    { timestamp: 88, job: 'AST', ability: 'Neutral Sect + Sun Sign', note: 'Ravenous Reach' },
    {
      timestamp: 88,
      job: 'SCH',
      ability: 'Expedient + Seraph + Seraphism',
      note: 'Ravenous Reach',
    },
    {
      timestamp: 88,
      job: 'SGE',
      ability: 'Holos + Panhaima + Philosophia',
      note: 'Ravenous Reach',
    },
    { timestamp: 88, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Ravenous Reach' },

    // Fourth-wall Fusion @ 1:37
    { timestamp: 97, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'Tank', role: 'OT', ability: 'Party Mit', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'WHM', ability: 'Liturgy of the Bell', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'AST', ability: 'Macrocosmos', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'SCH', ability: 'Sacred Soil + Spreadlo', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'SGE', ability: 'Zoe Shields + Kerachole', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'PhysRanged', ability: 'Party Mit', note: 'Fourth-wall Fusion' },
    { timestamp: 97, job: 'MagicRanged', ability: 'Addle', note: 'Fourth-wall Fusion' },

    // The Fixer @ 1:48
    { timestamp: 108, job: 'Tank', role: 'OT', ability: 'Party Mit', note: 'The Fixer' },
    { timestamp: 108, job: 'WHM', ability: 'Plenary Indulgence', note: 'The Fixer' },
    { timestamp: 108, job: 'AST', ability: 'Collective Unconscious', note: 'The Fixer' },
    { timestamp: 108, job: 'PhysRanged', ability: 'Party Mit', note: 'The Fixer' },
    { timestamp: 108, job: 'MagicRanged', ability: 'Addle', note: 'The Fixer' },

    // Splattershed @ 3:08
    { timestamp: 188, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Splattershed' },
    { timestamp: 188, job: 'SCH', ability: 'Sacred Soil', note: 'Splattershed' },
    { timestamp: 188, job: 'SGE', ability: 'Kerachole', note: 'Splattershed' },
    { timestamp: 188, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Splattershed' },

    // Venomous Scourge @ 3:51
    { timestamp: 231, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'Venomous Scourge' },
    { timestamp: 231, job: 'Tank', role: 'OT', ability: 'Party Mit', note: 'Venomous Scourge' },
    {
      timestamp: 231,
      job: 'SCH',
      ability: 'Sacred Soil + Fey Illumination + Spreadlo',
      note: 'Venomous Scourge',
    },
    {
      timestamp: 231,
      job: 'SGE',
      ability: 'Panhaima + Kerachole + Zoe Shields',
      note: 'Venomous Scourge',
    },
    { timestamp: 231, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Venomous Scourge' },
    { timestamp: 231, job: 'PhysRanged', ability: 'Party Mit', note: 'Venomous Scourge' },
    { timestamp: 231, job: 'MagicRanged', ability: 'Addle', note: 'Venomous Scourge' },

    // The Fixer @ 4:01
    { timestamp: 241, job: 'Tank', role: 'OT', ability: 'Party Mit', note: 'The Fixer' },
    { timestamp: 241, job: 'WHM', ability: 'Plenary Indulgence', note: 'The Fixer' },
    { timestamp: 241, job: 'AST', ability: 'Collective Unconscious', note: 'The Fixer' },

    // Ravenous Reach @ 4:28
    { timestamp: 268, job: 'Tank', role: 'MT', ability: 'Party Mit', note: 'Ravenous Reach' },
    { timestamp: 268, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Ravenous Reach' },
    { timestamp: 268, job: 'WHM', ability: 'Temperance + Divine Caress', note: 'Ravenous Reach' },
    { timestamp: 268, job: 'AST', ability: 'Neutral Sect + Sun Sign', note: 'Ravenous Reach' },
    { timestamp: 268, job: 'SCH', ability: 'Expedient + Seraph', note: 'Ravenous Reach' },
    { timestamp: 268, job: 'SGE', ability: 'Holos', note: 'Ravenous Reach' },
    { timestamp: 268, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Ravenous Reach' },

    // Splattershed @ 4:50
    { timestamp: 290, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'Splattershed' },
    { timestamp: 290, job: 'SCH', ability: 'Sacred Soil', note: 'Splattershed' },
    { timestamp: 290, job: 'SGE', ability: 'Kerachole', note: 'Splattershed' },
    { timestamp: 290, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Splattershed' },

    // Mortal Slayer @ 5:15
    { timestamp: 315, job: 'SCH', ability: 'Succor', note: 'Mortal Slayer' },
    { timestamp: 315, job: 'SGE', ability: 'Eukrasian Prognosis', note: 'Mortal Slayer' },

    // Slaughtershed I @ 5:42
    { timestamp: 342, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Slaughtershed I' },
    { timestamp: 342, job: 'WHM', ability: 'Plenary Indulgence', note: 'Slaughtershed I' },
    { timestamp: 342, job: 'AST', ability: 'Collective Unconscious', note: 'Slaughtershed I' },
    {
      timestamp: 342,
      job: 'SCH',
      ability: 'Sacred Soil + Fey Illumination + Seraphism',
      note: 'Slaughtershed I',
    },
    { timestamp: 342, job: 'SGE', ability: 'Kerachole + Philosophia', note: 'Slaughtershed I' },
    { timestamp: 342, job: 'Melee', role: 'M1', ability: 'Feint', note: 'Slaughtershed I' },
    { timestamp: 342, job: 'MagicRanged', ability: 'Addle', note: 'Slaughtershed I' },

    // Slaughtershed II @ 6:11
    { timestamp: 371, job: 'Tank', role: 'MT', ability: 'Reprisal', note: 'Slaughtershed II' },
    { timestamp: 371, job: 'Tank', role: 'OT', ability: 'Party Mit', note: 'Slaughtershed II' },
    { timestamp: 371, job: 'WHM', ability: 'Liturgy of the Bell', note: 'Slaughtershed II' },
    { timestamp: 371, job: 'AST', ability: 'Macrocosmos', note: 'Slaughtershed II' },
    { timestamp: 371, job: 'SCH', ability: 'Sacred Soil + Spreadlo', note: 'Slaughtershed II' },
    {
      timestamp: 371,
      job: 'SGE',
      ability: 'Kerachole + Panhaima + Zoe Shields',
      note: 'Slaughtershed II',
    },
    { timestamp: 371, job: 'PhysRanged', ability: 'Party Mit', note: 'Slaughtershed II' },

    // Slaughtershed III @ 6:40
    { timestamp: 400, job: 'Tank', role: 'MT', ability: 'Party Mit', note: 'Slaughtershed III' },
    { timestamp: 400, job: 'Tank', role: 'OT', ability: 'Reprisal', note: 'Slaughtershed III' },
    {
      timestamp: 400,
      job: 'WHM',
      ability: 'Plenary Indulgence + Temperance + Divine Caress',
      note: 'Slaughtershed III',
    },
    {
      timestamp: 400,
      job: 'AST',
      ability: 'Collective Unconscious + Neutral Sect + Sun Sign',
      note: 'Slaughtershed III',
    },
    {
      timestamp: 400,
      job: 'SCH',
      ability: 'Sacred Soil + Expedient + Seraph',
      note: 'Slaughtershed III',
    },
    { timestamp: 400, job: 'SGE', ability: 'Kerachole + Holos', note: 'Slaughtershed III' },
    { timestamp: 400, job: 'Melee', role: 'M2', ability: 'Feint', note: 'Slaughtershed III' },

    // Welcome message for all players
    { timestamp: 410, job: 'All', ability: 'Thank you for using Mitplan!', note: 'Welcome' },
  ],
};
