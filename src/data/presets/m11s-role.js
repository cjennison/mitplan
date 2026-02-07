/**
 * M11S - AAC Cruiserweight M3 (Savage) - The Tyrant
 * Role-based raid plan - Tank mitigation
 */
export default {
  id: 'm11s-role',
  name: 'M11S - The Tyrant',
  fightName: 'M11S',
  version: '1.0',
  requiresRoles: true,
  timeline: [
    // ───────────────────────────────────────────────────────────────
    // Crown of Arcadia (optional) @ 0:02
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 10,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive',
      note: 'Crown of Arcadia (optional)',
    },

    // ───────────────────────────────────────────────────────────────
    // Crown of Arcadia @ 1:54
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 114,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Crown of Arcadia',
    },

    // ───────────────────────────────────────────────────────────────
    // Dance of Domination Trophy @ 2:18
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 138,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive + Reprisal',
      note: 'Dance of Domination Trophy',
    },

    // ───────────────────────────────────────────────────────────────
    // One and Only @ 3:49
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 233,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive',
      note: 'One and Only',
    },

    // ───────────────────────────────────────────────────────────────
    // Meteorain @ 4:45
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 298,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Meteorain Wild Charge',
    },

    // ───────────────────────────────────────────────────────────────
    // Massive Meteor @ 7:18
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 438,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Massive Meteor',
    },

    // ───────────────────────────────────────────────────────────────
    // Crown of Arcadia @ 7:53
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 473,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Crown of Arcadia',
    },
    {
      timestamp: 473,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive',
      note: 'Crown of Arcadia',
    },

    // ───────────────────────────────────────────────────────────────
    // Crown of Arcadia @ 8:36
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 516,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive',
      note: 'Crown of Arcadia',
    },

    // ───────────────────────────────────────────────────────────────
    // Crown of Arcadia @ 9:34
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 574,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Crown of Arcadia',
    },

    // ───────────────────────────────────────────────────────────────
    // Heartbreak Kick (Party) @ 10:27
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 627,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal + Group Defensive',
      note: 'Heartbreak Kick (Party)',
    },
    {
      timestamp: 627,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive',
      note: 'Heartbreak Kick (Party)',
    },
  ],
};
