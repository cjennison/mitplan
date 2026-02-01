/**
 * P1S Test Plan - Asphodelos: The First Circle (Savage)
 * Simple test plan for validating auto-load functionality
 */
export default {
  id: 'p1s-test',
  name: 'P1S Auto-Load Test',
  fightName: 'P1S',
  author: 'Mitplan',
  description: 'Test plan for validating zone-based auto-loading',
  isDefault: true, // Mark as default for testing
  requiresRoles: false,
  timeline: [
    // Test entries using 'All' job type to show to everyone
    { timestamp: 10, job: 'All', ability: 'Test Raidwide 1', note: 'First test mitigation - 10s' },
    { timestamp: 30, job: 'All', ability: 'Test Raidwide 2', note: 'Second test mitigation - 30s' },
    { timestamp: 60, job: 'All', ability: 'Test Tankbuster', note: 'Third test mitigation - 60s' },
  ],
};
