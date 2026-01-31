import * as Dialog from '@radix-ui/react-dialog';
import { getRoleOptionsForJob, jobRequiresRoleSelection } from '../../hooks/useConfig';
import styles from './ConfigDialog.module.css';

/**
 * ConfigDialog - Configuration modal for overlay settings
 */
const ConfigDialog = ({ open, onOpenChange, config, onConfigChange, playerJob, playerName }) => {
  const handleShowOwnMitigationsChange = (e) => {
    onConfigChange('showOwnMitigationsOnly', e.target.checked);
  };

  const handleShowNotesChange = (e) => {
    onConfigChange('showNotes', e.target.checked);
  };

  const handleEnableSoundChange = (e) => {
    onConfigChange('enableSound', e.target.checked);
  };

  const roleOptions = getRoleOptionsForJob(playerJob);
  const showRoleSelector = jobRequiresRoleSelection(playerJob);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className={styles.triggerButton} title="Open Settings">
          ⚙️
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>Settings</Dialog.Title>

          <Dialog.Description className={styles.description}>
            Configure overlay behavior
          </Dialog.Description>

          {/* Player Info Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Player Info</h3>
            <div className={styles.playerInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Name:</span>
                <span className={styles.infoValue}>{playerName || 'Unknown'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Class:</span>
                <span className={styles.infoValue}>
                  {playerJob ? (
                    <span className={styles.jobBadge}>{playerJob}</span>
                  ) : (
                    'Not detected'
                  )}
                </span>
              </div>
              {showRoleSelector && (
                <div className={styles.roleRow}>
                  <span className={styles.infoLabel}>Role:</span>
                  <div className={styles.roleButtonGroup}>
                    {roleOptions.map((opt) => (
                      <button
                        key={opt.value}
                        className={`${styles.roleButton} ${config.playerRole === opt.value ? styles.roleButtonActive : ''}`}
                        onClick={() => onConfigChange('playerRole', opt.value)}
                      >
                        {opt.value}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {showRoleSelector && !config.playerRole && (
              <p className={styles.roleWarning}>
                Select your role to see role-specific mitigations in plans that require it.
              </p>
            )}
          </div>

          {/* Filtering Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Filtering</h3>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={config.showOwnMitigationsOnly}
                onChange={handleShowOwnMitigationsChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Show own mitigations only</span>
            </label>
            <p className={styles.checkboxDescription}>
              When enabled, only shows mitigations for your current class ({playerJob || 'N/A'}).
              Other players' mitigations will be hidden.
            </p>
          </div>

          {/* Display Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Display</h3>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={config.showNotes}
                onChange={handleShowNotesChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Show mitigation notes</span>
            </label>
            <p className={styles.checkboxDescription}>
              When enabled, displays any notes attached to mitigations below the ability name in the
              callout.
            </p>
          </div>

          {/* Audio Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Audio</h3>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={config.enableSound}
                onChange={handleEnableSoundChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Play sound on mitigation</span>
            </label>
            <p className={styles.checkboxDescription}>
              When enabled, plays a notification sound when it&apos;s time to use a mitigation.
            </p>
          </div>

          <div className={styles.actions}>
            <Dialog.Close asChild>
              <button className={styles.closeButton}>Close</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfigDialog;
