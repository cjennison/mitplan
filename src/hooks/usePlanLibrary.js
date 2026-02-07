import { useState, useCallback, useEffect, useMemo } from 'react';
import { PRESETS, getDefaultPresetForFight } from '../data/presets/presets.js';
import { getFightNameForZone } from '../data/zoneMapping.js';

const STORAGE_KEY = 'xrt-imported-plans';
const DEFAULTS_STORAGE_KEY = 'xrt-default-plans';

const usePlanLibrary = () => {
  const [importedPlans, setImportedPlans] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Storage unavailable or corrupted
    }
    return [];
  });

  const [userDefaults, setUserDefaults] = useState(() => {
    try {
      const stored = localStorage.getItem(DEFAULTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // Storage unavailable or corrupted
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(importedPlans));
    } catch {
      // Storage unavailable
    }
  }, [importedPlans]);

  useEffect(() => {
    try {
      localStorage.setItem(DEFAULTS_STORAGE_KEY, JSON.stringify(userDefaults));
    } catch {
      // Storage unavailable
    }
  }, [userDefaults]);

  const addImportedPlan = useCallback((plan) => {
    if (!plan.name) {
      plan.name = plan.fightName || 'Unnamed Plan';
    }
    if (!plan.id) {
      plan.id = `imported-${Date.now()}`;
    }

    setImportedPlans((prev) => {
      const existingIndex = prev.findIndex((p) => p.name === plan.name);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = plan;
        return updated;
      }
      return [...prev, plan];
    });
  }, []);

  const removeImportedPlan = useCallback((planId) => {
    setImportedPlans((prev) => prev.filter((p) => p.id !== planId));
    // Also remove from defaults if this plan was a default
    setUserDefaults((prev) => {
      const updated = { ...prev };
      for (const fight of Object.keys(updated)) {
        if (updated[fight] === planId) {
          delete updated[fight];
        }
      }
      return updated;
    });
  }, []);

  const getImportedPlanById = useCallback(
    (id) => importedPlans.find((p) => p.id === id),
    [importedPlans]
  );

  const setDefaultPlan = useCallback((fightName, planId) => {
    setUserDefaults((prev) => {
      if (planId === null) {
        const updated = { ...prev };
        delete updated[fightName];
        return updated;
      }
      return { ...prev, [fightName]: planId };
    });
  }, []);

  const getDefaultPlanId = useCallback(
    (fightName) => {
      if (userDefaults[fightName]) {
        return userDefaults[fightName];
      }
      const presetDefault = getDefaultPresetForFight(fightName);
      return presetDefault?.id || null;
    },
    [userDefaults]
  );

  const getDefaultPlan = useCallback(
    (fightName) => {
      const planId = getDefaultPlanId(fightName);
      if (!planId) return null;

      const preset = PRESETS.find((p) => p.id === planId);
      if (preset) return preset;

      return importedPlans.find((p) => p.id === planId) || null;
    },
    [getDefaultPlanId, importedPlans]
  );

  const getDefaultPlanForZone = useCallback(
    (zoneName) => {
      const fightName = getFightNameForZone(zoneName);
      if (!fightName) return null;
      return getDefaultPlan(fightName);
    },
    [getDefaultPlan]
  );

  const isPlanDefault = useCallback(
    (planId, fightName) => {
      return getDefaultPlanId(fightName) === planId;
    },
    [getDefaultPlanId]
  );

  const allPlans = useMemo(() => {
    return [
      ...PRESETS.map((p) => ({ ...p, type: 'preset' })),
      ...importedPlans.map((p) => ({ ...p, type: 'imported' })),
    ];
  }, [importedPlans]);

  return {
    presets: PRESETS,
    importedPlans,
    allPlans,
    addImportedPlan,
    removeImportedPlan,
    getImportedPlanById,
    setDefaultPlan,
    getDefaultPlanId,
    getDefaultPlan,
    getDefaultPlanForZone,
    isPlanDefault,
    userDefaults,
  };
};

export default usePlanLibrary;
