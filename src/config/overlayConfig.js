/**
 * Overlay Configuration
 *
 * These values control the behavior and appearance of the XRT overlay.
 * Some are hardcoded for now but designed to be configurable later.
 */

// Maximum number of upcoming actions to display in the timeline
export const MAX_TIMELINE_ITEMS = 3;

// How far ahead (in seconds) to look for upcoming actions
export const TIMELINE_WINDOW_SECONDS = 30;

// LocalStorage keys for persisting draggable container positions
export const STORAGE_KEYS = {
  TIMELINE_POSITION: 'xrt-timeline-position',
  TIMELINE_SIZE: 'xrt-timeline-size',
  CALLOUT_POSITION: 'xrt-callout-position',
  CALLOUT_SIZE: 'xrt-callout-size',
  RAIDPLAN_POSITION: 'xrt-raidplan-position',
  RAIDPLAN_SIZE: 'xrt-raidplan-size',
  LOADED_PLAN: 'xrt-loaded-plan',
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
