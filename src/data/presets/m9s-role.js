/**
 * M9S - AAC Cruiserweight M1 (Savage) - Vamp Fatale
 * Role-based raid plan - Tank mitigation
 */
export default {
  id: 'm9s-role',
  name: 'M9S - Vamp Fatale',
  fightName: 'M9S',
  version: '1.0',
  requiresRoles: true,
  timeline: [
    // ───────────────────────────────────────────────────────────────
    // Sadistic Screech @ 0:52
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 52,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Sadistic Screech',
    },

    // ───────────────────────────────────────────────────────────────
    // Sadistic Screech @ 2:10
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 130,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Sadistic Screech',
    },

    // ───────────────────────────────────────────────────────────────
    // Crowd Kill @ 2:24
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 144,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive',
      note: 'Crowd Kill',
    },
    {
      timestamp: 144,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Crowd Kill',
    },

    // ───────────────────────────────────────────────────────────────
    // Finale Fatale @ 2:43
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 163,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive',
      note: 'Finale Fatale',
    },

    // ───────────────────────────────────────────────────────────────
    // Insatiable Thirst @ 4:22
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 262,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive',
      note: 'Insatiable Thirst',
    },
    {
      timestamp: 262,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Insatiable Thirst',
    },

    // ───────────────────────────────────────────────────────────────
    // Sadistic Screech @ 4:35
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 275,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Sadistic Screech',
    },

    // ───────────────────────────────────────────────────────────────
    // Crowd Kill @ 5:48
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 348,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Crowd Kill',
    },

    // ───────────────────────────────────────────────────────────────
    // Crowd Kill @ 6:02
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 362,
      job: 'Tank',
      role: 'MT',
      ability: 'Group Defensive',
      note: 'Crowd Kill',
    },

    // ───────────────────────────────────────────────────────────────
    // Finale Fatale @ 6:21
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 381,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Finale Fatale',
    },
    {
      timestamp: 381,
      job: 'Tank',
      role: 'OT',
      ability: 'Group Defensive',
      note: 'Finale Fatale',
    },

    // ───────────────────────────────────────────────────────────────
    // Insatiable Thirst @ 9:22
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 562,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Insatiable Thirst',
    },
    {
      timestamp: 562,
      job: 'Tank',
      role: 'OT',
      ability: 'Reprisal',
      note: 'Insatiable Thirst',
    },

    // ───────────────────────────────────────────────────────────────
    // Crowd Kill @ 9:36
    // ───────────────────────────────────────────────────────────────
    {
      timestamp: 576,
      job: 'Tank',
      role: 'MT',
      ability: 'Reprisal',
      note: 'Crowd Kill',
    },
  ],
};
