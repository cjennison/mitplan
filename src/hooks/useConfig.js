import { useState, useCallback } from 'react';

const DEFAULT_CONFIG = {
  showOwnMitigationsOnly: false,
  showNotes: true,
  enableSound: true,
};

const CONFIG_STORAGE_KEY = 'mitplan-config';

/**
 * Hook to manage overlay configuration with localStorage persistence.
 */
const useConfig = () => {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      // Ignore storage errors
    }
    return DEFAULT_CONFIG;
  });

  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      } catch (e) {
        // Ignore storage errors
      }
      return newConfig;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  return { config, updateConfig, resetConfig };
};

export default useConfig;
