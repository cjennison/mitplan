import { useState, useEffect } from 'react';

const JOB_MAP = {
  0: null,
  1: 'GLA',
  2: 'PGL',
  3: 'MRD',
  4: 'LNC',
  5: 'ARC',
  6: 'CNJ',
  7: 'THM',
  8: 'CRP',
  9: 'BSM',
  10: 'ARM',
  11: 'GSM',
  12: 'LTW',
  13: 'WVR',
  14: 'ALC',
  15: 'CUL',
  16: 'MIN',
  17: 'BTN',
  18: 'FSH',
  19: 'PLD',
  20: 'MNK',
  21: 'WAR',
  22: 'DRG',
  23: 'BRD',
  24: 'WHM',
  25: 'BLM',
  26: 'ACN',
  27: 'SMN',
  28: 'SCH',
  29: 'ROG',
  30: 'NIN',
  31: 'MCH',
  32: 'DRK',
  33: 'AST',
  34: 'SAM',
  35: 'RDM',
  36: 'BLU',
  37: 'GNB',
  38: 'DNC',
  39: 'RPR',
  40: 'SGE',
  41: 'VPR',
  42: 'PCT',
};

const jobIdToName = (jobId) => JOB_MAP[jobId] || null;

/**
 * Hook to get the current player's job from ACT/OverlayPlugin.
 * Listens to onPlayerChangedEvent, PartyChanged, and ChangePrimaryPlayer events.
 */
const usePlayerJob = () => {
  const [playerJob, setPlayerJob] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const handlePlayerChanged = (e) => {
      const data = e.detail || e;
      if (data.job) setPlayerJob(data.job.toUpperCase());
      if (data.name) setPlayerName(data.name);
    };

    const handlePartyChanged = (e) => {
      const party = e.party || [];
      const player = party.find((p) => p.inParty) || party[0];
      if (player) {
        if (player.name) setPlayerName(player.name);
        if (player.job !== undefined) {
          const jobName = jobIdToName(player.job);
          if (jobName) setPlayerJob(jobName);
        }
      }
    };

    const handleChangePrimaryPlayer = (e) => {
      if (e.charName) setPlayerName(e.charName);
    };

    if (typeof window.addOverlayListener === 'function') {
      window.addOverlayListener('onPlayerChangedEvent', handlePlayerChanged);
      window.addOverlayListener('PartyChanged', handlePartyChanged);
      window.addOverlayListener('ChangePrimaryPlayer', handleChangePrimaryPlayer);

      if (typeof window.startOverlayEvents === 'function') {
        window.startOverlayEvents();
      }

      if (typeof window.callOverlayHandler === 'function') {
        window.callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' }).catch(() => {});
      }

      setIsInitialized(true);
    } else {
      document.addEventListener('onPlayerChangedEvent', handlePlayerChanged);
      setIsInitialized(true);
    }

    return () => {
      if (typeof window.removeOverlayListener === 'function') {
        window.removeOverlayListener('onPlayerChangedEvent', handlePlayerChanged);
        window.removeOverlayListener('PartyChanged', handlePartyChanged);
        window.removeOverlayListener('ChangePrimaryPlayer', handleChangePrimaryPlayer);
      } else {
        document.removeEventListener('onPlayerChangedEvent', handlePlayerChanged);
      }
    };
  }, []);

  return { playerJob, playerName, isInitialized };
};

export default usePlayerJob;
