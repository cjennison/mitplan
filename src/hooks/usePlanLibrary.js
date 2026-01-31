import { useState, useCallback, useEffect } from 'react';
import { PRESETS } from '../data/presets/presets.js';

const STORAGE_KEY = 'mitplan-imported-plans';

/**
 * Hook for managing the plan library (presets + imported plans)
 */
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(importedPlans));
    } catch {
      // Storage unavailable
    }
  }, [importedPlans]);

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
  }, []);

  const getImportedPlanById = useCallback(
    (id) => importedPlans.find((p) => p.id === id),
    [importedPlans]
  );

  return {
    presets: PRESETS,
    importedPlans,
    addImportedPlan,
    removeImportedPlan,
    getImportedPlanById,
  };
};

export default usePlanLibrary;
