import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { CardHeading } from './CardHeading';
import { SpotlightRow } from './SpotlightRow';
import styles from './ReviewsCard.module.css';
import type { ReviewsPayload } from '../../../data/blocks';

export function ReviewsCard({ payload }: { payload: ReviewsPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="reviews">RECOMMENDATIONS</Badge>
        <CardHeading title={payload.title} subtitle={payload.subtitle} />
        <div className={styles.list}>
          {payload.items.map((review) => (
            <SpotlightRow key={review.name} className={styles.row}>
              <div className={styles.header}>
                <img src={review.photo} alt={review.name} className={styles.photo} />
                <div className={styles.text}>
                  <div className={styles.name}>{review.name}</div>
                  <div className={styles.role}>{review.role}</div>
                </div>
                <a href={review.url} target="_blank" rel="noopener" className={styles.link}>
                  <span className={styles.linkFace}>in</span>
                  <span className={`${styles.linkFace} ${styles.linkFaceHidden}`}>
                    <span className={styles.arrow}>
                      <span className={styles.arrowHead} />
                      <span className={styles.arrowStem} />
                    </span>
                  </span>
                </a>
              </div>
              <p className={styles.quote}>“{review.quote}”</p>
            </SpotlightRow>
          ))}
        </div>
      </Card>
    </Row>
  );
}
