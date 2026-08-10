import { Row } from '../../../../../components/primitives/Row/Row';
import type { ExperiencePayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { InteractiveCard } from '../../Card/Card';
import { WipeButton } from '../../WipeButton/WipeButton';
import layoutStyles from '../CardLayout.module.css';
import { TagList } from '../TagList/TagList';
import styles from './ExperienceCard.module.css';

export function ExperienceCard({ payload }: { payload: ExperiencePayload }) {
  return (
    <Row>
      <InteractiveCard>
        <Badge kind="experience">{payload.badge}</Badge>
        {/* An empty src would make the iframe load the page into itself. */}
        {payload.video && (
          <div className={styles.video}>
            <iframe
              src={payload.video}
              className={styles.iframe}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={payload.name}
            />
          </div>
        )}
        <div className={styles.header}>
          <div className={styles.name}>{payload.name}</div>
          <span className={styles.meta}>{payload.meta}</span>
        </div>
        <p className={styles.blurb}>{payload.blurb}</p>
        {payload.tech && <TagList tags={payload.tech} marginTop={16} />}
        {payload.href && (
          <div className={layoutStyles.actionRow}>
            <WipeButton href={payload.href} label={payload.cta ?? ''} target="_blank" rel="noopener" />
          </div>
        )}
      </InteractiveCard>
    </Row>
  );
}
