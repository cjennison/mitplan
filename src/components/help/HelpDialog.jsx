import * as Dialog from '@radix-ui/react-dialog';
import styles from './HelpDialog.module.css';

const FAQ_ITEMS = [
  {
    question: "Can't copy/paste into the input?",
    answer:
      "This is a limitation of OverlayPlugin. Toggle the Lock Overlay off and on in ACT's OverlayPlugin settings to make the input box interactable.",
  },
  {
    question: 'Where do I get plan codes?',
    answer:
      'Plan codes are Base64-encoded strings that contain mitigation assignments. You can create them using the Plan Builder on the Mitplan website, or get them from your raid leader.',
  },
  {
    question: "Why don't I see any callouts?",
    answer:
      'Make sure you have imported a valid plan and are in combat. The overlay uses ACT combat events to track fight progress.',
  },
  {
    question: 'How do I reposition the overlay elements?',
    answer:
      'Unlock the ACT overlay first, then click and drag the Timeline or Callout headers. Click the lock icon in the top-right to toggle UI lock mode.',
  },
  {
    question: 'Why is my role showing as wrong?',
    answer:
      'Some jobs can fill multiple roles (e.g., PLD can be MT or OT). Go to Settings to manually select your role assignment.',
  },
];

const HelpDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className={styles.triggerButton} title="Help & FAQ">
          ?
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <Dialog.Title className={styles.title}>Help & FAQ</Dialog.Title>

          <Dialog.Description className={styles.description}>
            Common questions and troubleshooting tips
          </Dialog.Description>

          <div className={styles.faqList}>
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className={styles.faqItem}>
                <h4 className={styles.question}>{item.question}</h4>
                <p className={styles.answer}>{item.answer}</p>
              </div>
            ))}
          </div>

          <Dialog.Close asChild>
            <button className={styles.closeButton}>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default HelpDialog;
