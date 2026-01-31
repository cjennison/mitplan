import { useState, useEffect } from 'react';

/**
 * Custom hook to get the current player's job from ACT/OverlayPlugin
 *
 * Tries multiple methods to get player info:
 * 1. Cactbot's onPlayerChangedEvent (if Cactbot is loaded)
 * 2. OverlayPlugin's PartyChanged event (base OverlayPlugin)
 * 3. OverlayPlugin's ChangePrimaryPlayer event (base OverlayPlugin)
 *
 * @returns {Object} Player info including job and name
 */
const usePlayerJob = () => {
  const [playerJob, setPlayerJob] = useState(null);
  const [playerName, setPlayerName] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Handler for Cactbot's onPlayerChangedEvent
    const handlePlayerChanged = (e) => {
      const data = e.detail || e;

      if (data.job) {
        setPlayerJob(data.job.toUpperCase());
      }
      if (data.name) {
        setPlayerName(data.name);
      }
    };

    // Handler for base OverlayPlugin's PartyChanged event
    // This gives us the player's job from the party list
    const handlePartyChanged = (e) => {
      console.log('[usePlayerJob] PartyChanged received:', e);
      const party = e.party || [];

      // Find the player in the party (they should be first or marked as inParty)
      const player = party.find((p) => p.inParty) || party[0];
      if (player) {
        console.log('[usePlayerJob] Found player in party:', player);
        if (player.name) {
          setPlayerName(player.name);
        }
        // PartyChanged uses job ID numbers, need to convert
        if (player.job !== undefined) {
          const jobName = jobIdToName(player.job);
          if (jobName) {
            console.log('[usePlayerJob] Setting job from party:', jobName);
            setPlayerJob(jobName);
          }
        }
      }
    };

    // Handler for ChangePrimaryPlayer (gives us the player name)
    const handleChangePrimaryPlayer = (e) => {
      console.log('[usePlayerJob] ChangePrimaryPlayer received:', e);
      if (e.charName) {
        setPlayerName(e.charName);
      }
    };

    // Check if OverlayPlugin API is available
    if (typeof window.addOverlayListener === 'function') {
      console.log('[usePlayerJob] Registering overlay listeners...');

      // Register for Cactbot event (if Cactbot is loaded)
      window.addOverlayListener('onPlayerChangedEvent', handlePlayerChanged);

      // Register for base OverlayPlugin events
      window.addOverlayListener('PartyChanged', handlePartyChanged);
      window.addOverlayListener('ChangePrimaryPlayer', handleChangePrimaryPlayer);

      // Start receiving events - CRITICAL: must be called after registering listeners
      if (typeof window.startOverlayEvents === 'function') {
        console.log('[usePlayerJob] Calling startOverlayEvents...');
        window.startOverlayEvents();
      }

      // Try to request player update from Cactbot (if available)
      if (typeof window.callOverlayHandler === 'function') {
        console.log('[usePlayerJob] Requesting player update...');
        window.callOverlayHandler({ call: 'cactbotRequestPlayerUpdate' }).catch(() => {
          // Cactbot not available, that's OK - we'll use PartyChanged instead
          console.log('[usePlayerJob] Cactbot not available, using base OverlayPlugin events');
        });
      }

      setIsInitialized(true);
    } else {
      console.log('[usePlayerJob] OverlayPlugin API not available - not running in ACT?');
      // Fallback to document event listeners
      document.addEventListener('onPlayerChangedEvent', handlePlayerChanged);
      setIsInitialized(true);
    }

    return () => {
      console.log('[usePlayerJob] Cleaning up listeners...');
      if (typeof window.removeOverlayListener === 'function') {
        window.removeOverlayListener('onPlayerChangedEvent', handlePlayerChanged);
        window.removeOverlayListener('PartyChanged', handlePartyChanged);
        window.removeOverlayListener('ChangePrimaryPlayer', handleChangePrimaryPlayer);
      } else {
        document.removeEventListener('onPlayerChangedEvent', handlePlayerChanged);
      }
    };
  }, []);

  return {
    playerJob,
    playerName,
    isInitialized,
  };
};

/**
 * Convert job ID to job abbreviation
 * Based on FFXIV job IDs
 */
const jobIdToName = (jobId) => {
  const JOB_MAP = {
    0: null, // None
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
  return JOB_MAP[jobId] || null;
};

export default usePlayerJob;
