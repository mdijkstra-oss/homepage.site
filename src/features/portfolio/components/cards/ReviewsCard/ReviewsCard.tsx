import { Row } from '../../../../../components/primitives/Row/Row';
import type { ReviewsPayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { Card } from '../../Card/Card';
import { CardHeading } from '../CardHeading/CardHeading';
import layoutStyles from '../CardLayout.module.css';
import { SpotlightRow } from '../SpotlightRow/SpotlightRow';
import styles from './ReviewsCard.module.css';

export function ReviewsCard({ payload }: { payload: ReviewsPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="reviews">RECOMMENDATIONS</Badge>
        <CardHeading title={payload.title} subtitle={payload.subtitle} />
        <div className={layoutStyles.list}>
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
