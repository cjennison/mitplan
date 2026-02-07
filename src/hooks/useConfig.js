import { useState, useCallback } from 'react';

const DEFAULT_CONFIG = {
  showOwnActionsOnly: false,
  showNotes: true,
  enableSound: true,
  soundType: 'info', // info, alert, alarm, chime, ping
  enableVoiceCountdown: false, // TTS countdown 5, 4, 3, 2, 1
  enableVoiceActions: false, // TTS ability name announcements
  enableRaidPlan: false, // Show raid plan images (off by default to save bandwidth)
  playerRole: null, // MT, OT, M1, M2, D3, D4, H1, H2
};

const CONFIG_STORAGE_KEY = 'xrt-config';

export const ROLE_OPTIONS = {
  tank: [
    { value: 'MT', label: 'Main Tank (MT)' },
    { value: 'OT', label: 'Off Tank (OT)' },
  ],
  melee: [
    { value: 'M1', label: 'Melee 1 (M1)' },
    { value: 'M2', label: 'Melee 2 (M2)' },
  ],
  ranged: [{ value: 'D3', label: 'Ranged DPS (D3)' }],
  caster: [{ value: 'D4', label: 'Caster DPS (D4)' }],
  healer: [
    { value: 'H1', label: 'Healer 1 (H1)' },
    { value: 'H2', label: 'Healer 2 (H2)' },
  ],
};

export const getRoleOptionsForJob = (job) => {
  if (!job) return [];
  const jobUpper = job.toUpperCase();

  const tanks = ['PLD', 'WAR', 'DRK', 'GNB'];
  const melees = ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'];
  const ranged = ['BRD', 'MCH', 'DNC'];
  const casters = ['BLM', 'SMN', 'RDM', 'PCT'];
  const healers = ['WHM', 'SCH', 'AST', 'SGE'];

  if (tanks.includes(jobUpper)) return ROLE_OPTIONS.tank;
  if (melees.includes(jobUpper)) return ROLE_OPTIONS.melee;
  if (ranged.includes(jobUpper)) return ROLE_OPTIONS.ranged;
  if (casters.includes(jobUpper)) return ROLE_OPTIONS.caster;
  if (healers.includes(jobUpper)) return ROLE_OPTIONS.healer;
  return [];
};

export const jobRequiresRoleSelection = (job) => {
  const options = getRoleOptionsForJob(job);
  return options.length > 1;
};

export const isRoleValidForJob = (role, job) => {
  if (!job) return true; // No job info, can't validate
  const options = getRoleOptionsForJob(job);
  if (options.length === 0) return true; // Job doesn't need role selection
  if (options.length === 1) return true; // Only one option, auto-valid
  if (!role) return false; // Needs role but none selected
  return options.some((opt) => opt.value === role);
};

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
