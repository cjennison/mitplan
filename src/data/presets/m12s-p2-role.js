/**
 * M12S Phase 2 - AAC Heavyweight M4 (Savage)
 * Simplified role-based raid plan
 *
 * This version uses job types (Tank, Healer, Melee, etc.) instead of specific jobs
 * where abilities are shared across the job type. Class-specific abilities still
 * use the specific job code.
 */
export default {
  id: 'm12s-p2-role',
  name: "Ikuya Mitty's M12S - Part 2 DN | Clone Zero",
  fightName: 'M12S P2',
  version: '1.0',
  requiresRoles: true,
  timeline: [
    // ═══════════════════════════════════════════════════════════════
    // ACTION TIMELINE
    // ═══════════════════════════════════════════════════════════════
    {
      type: 'raidplan',
      timestamp: 1,
      endTimestamp: 10,
      imageUrl: 'https://wtfdig.info/74/m12s/dn-rep1-1.webp',
      note: 'Rep 1 Setup',
    },
    {
      type: 'raidplan',
      timestamp: 40,
      endTimestamp: 77,
      imageUrl: '/raidplans/m12s-p2-rep1-melee.png',
      note: 'Rep 1 Melee',
      roleFilters: ['Melee', 'Tank'],
    },
    {
      type: 'raidplan',
      timestamp: 40,
      endTimestamp: 77,
      imageUrl: '/raidplans/m12s-p2-rep1-ranged.png',
      note: 'Rep 1 Ranged',
      roleFilters: ['PhysRanged', 'MagicRanged', 'Healer'],
    },
    {
      type: 'raidplan',
      timestamp: 80,
      endTimestamp: 140,
      imageUrl: '/raidplans/m12s-p2-rep2-setup.webp',
      note: 'Replication 2 Tethers',
    },

    // ───────────────────────────────────────────────────────────────
    // Arcadia Aflame @ 0:17 (cast at 0:14)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 14,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'Tank',
      role: 'OT',
      ability: 'Party Mit',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'WHM',
      ability: 'Plenary Indulgence',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'AST',
      ability: 'Collective Unconscious',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'SCH',
      ability: 'Sacred Soil',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'SGE',
      ability: 'Holos + Kerachole',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'Melee',
      role: 'M1',
      ability: 'Feint',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'PhysRanged',
      ability: 'Party Mit',
      note: 'Arcadia Aflame',
    },
    {
      timestamp: 14,
      job: 'MagicRanged',
      ability: 'Addle',
      note: 'Arcadia Aflame',
    },

    // ───────────────────────────────────────────────────────────────
    // Mighty Magic / Top-tier Slam I @ 0:40 (cast at 0:37)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 37,
      job: 'WHM',
      ability: 'Temperance',
      note: 'Mighty Magic / Top-tier Slam I',
    },
    {
      timestamp: 37,
      job: 'AST',
      ability: 'Neutral Sect',
      note: 'Mighty Magic / Top-tier Slam I',
    },
    {
      timestamp: 37,
      job: 'SCH',
      ability: 'Spreadlo + Seraph + Expedient',
      note: 'Mighty Magic / Top-tier Slam I',
    },
    {
      timestamp: 37,
      job: 'SGE',
      ability: 'Panhaima + Zoe Shields',
      note: 'Mighty Magic / Top-tier Slam I',
    },

    // ───────────────────────────────────────────────────────────────
    // Mighty Magic / Top-tier Slam II @ 1:01 (cast at 0:58)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 58,
      job: 'Tank',
      role: 'MT',
      ability: 'Party Mit',
      note: 'Mighty Magic / Top-tier Slam II',
    },
    {
      timestamp: 58,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Mighty Magic / Top-tier Slam II',
    },
    {
      timestamp: 58,
      job: 'WHM',
      ability: 'Divine Caress',
      note: 'Mighty Magic / Top-tier Slam II',
    },
    {
      timestamp: 58,
      job: 'AST',
      ability: 'Sun Sign',
      note: 'Mighty Magic / Top-tier Slam II',
    },
    {
      timestamp: 58,
      job: 'SCH',
      ability: 'Fey Illumination + Seraph + Sacred Soil',
      note: 'Mighty Magic / Top-tier Slam II',
    },
    {
      timestamp: 58,
      job: 'SGE',
      ability: 'Kerachole',
      note: 'Mighty Magic / Top-tier Slam II',
    },
    {
      timestamp: 58,
      job: 'Melee',
      role: 'M2',
      ability: 'Feint',
      note: 'Mighty Magic / Top-tier Slam II',
    },

    // ───────────────────────────────────────────────────────────────
    // Firefall Splash @ 2:08 (cast at 2:05)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 125,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'Tank',
      role: 'OT',
      ability: 'Party Mit',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'WHM',
      ability: 'Liturgy of the Bell',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'AST',
      ability: 'Macrocosmos',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'SCH',
      ability: 'Seraphism + Sacred Soil + Spreadlo',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'SGE',
      ability: 'Philosophia + Holos + Kerachole',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'Melee',
      role: 'M1',
      ability: 'Feint',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'PhysRanged',
      ability: 'Party Mit',
      note: 'Firefall Splash',
    },
    {
      timestamp: 125,
      job: 'MagicRanged',
      ability: 'Addle',
      note: 'Firefall Splash',
    },

    // ───────────────────────────────────────────────────────────────
    // Reenactment @ 2:41 (cast at 2:38)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 158,
      job: 'Tank',
      role: 'MT',
      ability: 'Party Mit',
      note: 'Reenactment',
    },
    {
      timestamp: 158,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Reenactment',
    },
    {
      timestamp: 158,
      job: 'WHM',
      ability: 'Plenary Indulgence + Temperance + Divine Caress',
      note: 'Reenactment',
    },
    {
      timestamp: 158,
      job: 'AST',
      ability: 'Collective Unconscious + Neutral Sect + Sun Sign',
      note: 'Reenactment',
    },
    {
      timestamp: 158,
      job: 'SCH',
      ability: 'Expedient + Seraph + Sacred Soil',
      note: 'Reenactment',
    },
    {
      timestamp: 158,
      job: 'SGE',
      ability: 'Zoe Shields + Panhaima + Kerachole',
      note: 'Reenactment',
    },
    {
      timestamp: 158,
      job: 'Melee',
      role: 'M2',
      ability: 'Feint',
      note: 'Reenactment',
    },

    // ───────────────────────────────────────────────────────────────
    // Blood Mana @ 3:22 (cast at 3:19)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 199,
      job: 'SCH',
      ability: 'Sacred Soil',
      note: 'Blood Mana',
    },
    {
      timestamp: 199,
      job: 'SGE',
      ability: 'Kerachole',
      note: 'Blood Mana',
    },

    // ───────────────────────────────────────────────────────────────
    // Netherworld Near/Far @ 3:50 (cast at 3:47)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 227,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'Tank',
      role: 'OT',
      ability: 'Party Mit (DRK/GNB)',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'WHM',
      ability: 'Plenary Indulgence',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'AST',
      ability: 'Collective Unconscious',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'SCH',
      ability: 'Sacred Soil',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'SGE',
      ability: 'Kerachole',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'Melee',
      role: 'M1',
      ability: 'Feint',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'PhysRanged',
      ability: 'Party Mit',
      note: 'Netherworld Near/Far',
    },
    {
      timestamp: 227,
      job: 'MagicRanged',
      ability: 'Addle',
      note: 'Netherworld Near/Far',
    },

    // ───────────────────────────────────────────────────────────────
    // Arcadia Aflame @ 3:58 (cast at 3:55)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 235,
      job: 'Tank',
      role: 'OT',
      ability: 'Party Mit (WAR/PLD)',
      note: 'Arcadia Aflame',
    },

    // ───────────────────────────────────────────────────────────────
    // Idyllic Dream @ 4:30 (cast at 4:27)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 267,
      job: 'Tank',
      role: 'MT',
      ability: 'Party Mit',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 267,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 267,
      job: 'SCH',
      ability: 'Fey Illumination (Use Early) + Spreadlo + Sacred Soil',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 267,
      job: 'SGE',
      ability: 'Holos (Use Early) + Zoe Shields + Kerachole',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 267,
      job: 'Melee',
      role: 'M2',
      ability: 'Feint',
      note: 'Idyllic Dream',
    },

    // ───────────────────────────────────────────────────────────────
    // Lindwurm's Meteor @ 5:45 (cast at 5:42)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 342,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'Tank',
      role: 'OT',
      ability: 'Party Mit',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'WHM',
      ability: 'Plenary Indulgence',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'AST',
      ability: 'Collective Unconscious',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'SCH',
      ability: 'Sacred Soil',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'SGE',
      ability: 'Kerachole',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'Melee',
      role: 'M1',
      ability: 'Feint',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'PhysRanged',
      ability: 'Party Mit',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'MagicRanged',
      ability: 'Addle',
      note: "Lindwurm's Meteor",
    },
    {
      timestamp: 342,
      job: 'MCH',
      ability: 'Tactician',
      note: "Lindwurm's Meteor - Extra",
    },

    // ───────────────────────────────────────────────────────────────
    // Twisted Vision @ 6:12 (cast at 6:09)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 369,
      job: 'Tank',
      role: 'MT',
      ability: 'Party Mit',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'WHM',
      ability: 'Everything',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'AST',
      ability: 'Everything',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'SCH',
      ability: 'Everything',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'SGE',
      ability: 'Everything',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'Melee',
      role: 'M1',
      ability: 'Use Personals!',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'Melee',
      role: 'M2',
      ability: 'Use Personals!',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'PhysRanged',
      ability: 'Use Personals!',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'MagicRanged',
      ability: 'Use Personals!',
      note: 'Twisted Vision',
    },
    {
      timestamp: 369,
      job: 'RDM',
      ability: 'Magick Barrier',
      note: 'Twisted Vision - Extra',
    },

    // ───────────────────────────────────────────────────────────────
    // Reenactment + Twisted Vision @ 7:20 (cast at 7:17)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 437,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Reenactment + Twisted Vision',
    },
    {
      timestamp: 437,
      job: 'Tank',
      role: 'OT',
      ability: 'Party Mit',
      note: 'Reenactment + Twisted Vision',
    },
    {
      timestamp: 437,
      job: 'SCH',
      ability: 'Sacred Soil',
      note: 'Reenactment + Twisted Vision',
    },
    {
      timestamp: 437,
      job: 'SGE',
      ability: 'Kerachole',
      note: 'Reenactment + Twisted Vision',
    },
    {
      timestamp: 437,
      job: 'Melee',
      role: 'M2',
      ability: 'Feint',
      note: 'Reenactment + Twisted Vision',
    },
    {
      timestamp: 437,
      job: 'PhysRanged',
      ability: 'Party Mit',
      note: 'Reenactment + Twisted Vision',
    },

    // ───────────────────────────────────────────────────────────────
    // Idyllic Dream @ 7:53 (cast at 7:50)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 470,
      job: 'Tank',
      role: 'MT',
      ability: 'Party Mit',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'WHM',
      ability: 'Plenary Indulgence',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'AST',
      ability: 'Collective Unconscious',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'SCH',
      ability: 'Sacred Soil',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'SGE',
      ability: 'Kerachole',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'Melee',
      role: 'M1',
      ability: 'Feint',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'MagicRanged',
      ability: 'Addle',
      note: 'Idyllic Dream',
    },
    {
      timestamp: 470,
      job: 'MCH',
      ability: 'Tactician',
      note: 'Idyllic Dream - Extra',
    },

    // ───────────────────────────────────────────────────────────────
    // Arcadian Hell I @ 8:36 (cast at 8:33)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 513,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Arcadian Hell I',
    },
    {
      timestamp: 513,
      job: 'WHM',
      ability: 'Temperance',
      note: 'Arcadian Hell I',
    },
    {
      timestamp: 513,
      job: 'AST',
      ability: 'Neutral Sect',
      note: 'Arcadian Hell I',
    },
    {
      timestamp: 513,
      job: 'SCH',
      ability: 'Expedient + Seraph + Fey Illumination + Sacred Soil',
      note: 'Arcadian Hell I',
    },
    {
      timestamp: 513,
      job: 'SGE',
      ability: 'Holos',
      note: 'Arcadian Hell I',
    },
    {
      timestamp: 513,
      job: 'RDM',
      ability: 'Magick Barrier',
      note: 'Arcadian Hell I - Extra',
    },

    // ───────────────────────────────────────────────────────────────
    // Arcadian Hell II @ 8:52 (cast at 8:49)
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 529,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal + Party Mit',
      note: 'Arcadian Hell II',
    },
    {
      timestamp: 529,
      job: 'WHM',
      ability: 'Plenary Indulgence + Divine Caress',
      note: 'Arcadian Hell II',
    },
    {
      timestamp: 529,
      job: 'AST',
      ability: 'Collective Unconscious + Sun Sign',
      note: 'Arcadian Hell II',
    },
    {
      timestamp: 529,
      job: 'SCH',
      ability: 'Spreadlo + Seraph + Sacred Soil',
      note: 'Arcadian Hell II',
    },
    {
      timestamp: 529,
      job: 'SGE',
      ability: 'Zoe Shields + Panhaima + Kerachole',
      note: 'Arcadian Hell II',
    },
    {
      timestamp: 529,
      job: 'Melee',
      role: 'M2',
      ability: 'Feint',
      note: 'Arcadian Hell II',
    },
    {
      timestamp: 529,
      job: 'PhysRanged',
      ability: 'Party Mit',
      note: 'Arcadian Hell II',
    },
  ],
};
