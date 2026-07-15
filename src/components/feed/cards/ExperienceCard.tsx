import type { ExperiencePayload } from '../../../data/blocks';
import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { InteractiveCard } from '../Card';
import styles from './ExperienceCard.module.css';
import { TagList } from './TagList';

export function ExperienceCard({ payload }: { payload: ExperiencePayload }) {
  return (
    <Row>
      <InteractiveCard>
        <Badge kind="experience">FREELANCE · PROJECT</Badge>
        <div className={styles.video}>
          <iframe
            src={payload.video}
            className={styles.iframe}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={payload.name}
          />
        </div>
        <div className={styles.header}>
          <div className={styles.name}>{payload.name}</div>
          <span className={styles.meta}>{payload.meta}</span>
        </div>
        <p className={styles.blurb}>{payload.blurb}</p>
        {payload.tech && <TagList tags={payload.tech} marginTop={16} />}
      </InteractiveCard>
    </Row>
  );
}
