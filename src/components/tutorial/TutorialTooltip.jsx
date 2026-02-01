import * as Tooltip from '@radix-ui/react-tooltip';
import { TUTORIAL_CONTENT } from '../../hooks/useTutorial';
import styles from './TutorialTooltip.module.css';

/**
 * TutorialTooltip - Tutorial tooltip that shows during first-run experience
 *
 * All tooltips are shown simultaneously when showTutorial is true.
 * They all disappear when the user completes the tutorial by locking the UI.
 */
const TutorialTooltip = ({
  children,
  contentKey,
  show,
  side = 'bottom',
  align = 'center',
  sideOffset = 8,
}) => {
  const content = TUTORIAL_CONTENT[contentKey];

  if (!content) {
    return children;
  }

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root open={show}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className={styles.content}
            side={side}
            align={align}
            sideOffset={sideOffset}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <h3 className={styles.title}>{content.title}</h3>
            <p className={styles.description}>{content.description}</p>
            <Tooltip.Arrow className={styles.arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TutorialTooltip;
