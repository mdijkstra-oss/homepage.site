import type { EducationPayload } from '../../../data/blocks';
import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { CardHeading } from './CardHeading';
import styles from './EducationCard.module.css';
import { SpotlightRow } from './SpotlightRow';

export function EducationCard({ payload }: { payload: EducationPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="education">EDUCATION</Badge>
        <CardHeading title={payload.title} subtitle={payload.subtitle} />
        <div className={styles.list}>
          {payload.items.map((item) => (
            <SpotlightRow key={item.degree} className={styles.row}>
              {item.img ? (
                <a href={item.url} target="_blank" rel="noopener" className={styles.link}>
                  <img src={item.img} alt={item.degree} className={styles.image} />
                </a>
              ) : (
                <div className={styles.initials}>{item.initials}</div>
              )}
              <div className={styles.text}>
                <div className={styles.degree}>{item.degree}</div>
                <div className={styles.school}>{item.school}</div>
              </div>
              <span className={styles.year}>{item.year}</span>
            </SpotlightRow>
          ))}
        </div>
      </Card>
    </Row>
  );
}
