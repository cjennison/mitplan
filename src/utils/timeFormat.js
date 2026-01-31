/**
 * Time formatting utilities
 */

/**
 * Formats seconds into MM:SS format
 *
 * @param {number} totalSeconds - Total seconds
 * @returns {string} Formatted time string (e.g., "1:30" or "0:05")
 */
export const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formats seconds with decimal precision for countdown
 *
 * @param {number} seconds - Seconds (can be decimal)
 * @returns {string} Formatted time string (e.g., "5.2s")
 */
export const formatCountdown = (seconds) => {
  if (seconds <= 0) return '0s';
  if (seconds < 10) {
    return `${seconds.toFixed(1)}s`;
  }
  return `${Math.floor(seconds)}s`;
};

/**
 * Gets a human-readable relative time
 *
 * @param {number} seconds - Seconds from now
 * @returns {string} Human readable string (e.g., "in 30s", "now!")
 */
export const getRelativeTime = (seconds) => {
  if (seconds <= 0) return 'now!';
  if (seconds < 60) return `in ${Math.floor(seconds)}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (remainingSeconds === 0) {
    return `in ${minutes}m`;
  }
  return `in ${minutes}m ${remainingSeconds}s`;
};
