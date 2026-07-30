import { Row } from '../../../../../components/primitives/Row/Row';
import type { ExperiencePayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { InteractiveCard } from '../../Card/Card';
import { TagList } from '../TagList/TagList';
import styles from './ExperienceCard.module.css';

export function ExperienceCard({ payload }: { payload: ExperiencePayload }) {
  return (
    <Row>
      <InteractiveCard>
        <Badge kind="experience">{payload.badge}</Badge>
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
