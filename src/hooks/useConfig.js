import { useState, useEffect, useCallback } from 'react';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  showOwnMitigationsOnly: false,
  showNotes: true,
};

/**
 * LocalStorage key for config
 */
const CONFIG_STORAGE_KEY = 'mitplan-config';

/**
 * Custom hook to manage overlay configuration
 *
 * Persists config to localStorage and restores on load.
 *
 * @returns {Object} Config state and methods
 */
const useConfig = () => {
  // Load initial config from localStorage
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Restored config from localStorage:', parsed);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to restore config from localStorage:', e);
    }
    return DEFAULT_CONFIG;
  });

  /**
   * Update a single config value
   */
  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };

      // Save to localStorage
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      } catch (e) {
        console.warn('Failed to save config to localStorage:', e);
      }

      return newConfig;
    });
  }, []);

  /**
   * Reset config to defaults
   */
  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove config from localStorage:', e);
    }
  }, []);

  return {
    config,
    updateConfig,
    resetConfig,
  };
};

export default useConfig;
