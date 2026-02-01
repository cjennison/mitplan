/**
 * Overlay Configuration
 *
 * These values control the behavior and appearance of the Mitplan overlay.
 * Some are hardcoded for now but designed to be configurable later.
 */

// Maximum number of upcoming mitigations to display in the timeline
export const MAX_TIMELINE_ITEMS = 3;

// How far ahead (in seconds) to look for upcoming mitigations
export const TIMELINE_WINDOW_SECONDS = 30;

// LocalStorage keys for persisting draggable container positions
export const STORAGE_KEYS = {
  TIMELINE_POSITION: 'mitplan-timeline-position',
  TIMELINE_SIZE: 'mitplan-timeline-size',
  CALLOUT_POSITION: 'mitplan-callout-position',
  CALLOUT_SIZE: 'mitplan-callout-size',
  RAIDPLAN_POSITION: 'mitplan-raidplan-position',
  RAIDPLAN_SIZE: 'mitplan-raidplan-size',
  LOADED_PLAN: 'mitplan-loaded-plan',
};

// Default positions and sizes for containers (percentages of parent)
export const DEFAULT_TIMELINE = {
  x: 10,
  y: 10,
  width: 280,
  height: 120,
};

export const DEFAULT_CALLOUT = {
  x: 10,
  y: 150,
  width: 200,
  height: 60,
};

export const DEFAULT_RAIDPLAN = {
  x: 300,
  y: 10,
  width: 300,
  height: 200,
};
