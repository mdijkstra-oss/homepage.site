import type { ApproachPayload } from '../../../data/blocks';
import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { Card } from '../Card';
import styles from './ApproachCard.module.css';
import { CardHeading } from './CardHeading';
import layoutStyles from './CardLayout.module.css';
import { SpotlightRow } from './SpotlightRow';

export function ApproachCard({ payload }: { payload: ApproachPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="approach">APPROACH</Badge>
        <CardHeading title={payload.title} />
        <p className={styles.intro}>{payload.intro}</p>
        <div className={layoutStyles.list}>
          {payload.items.map((item) => (
            <SpotlightRow key={item.idx} className={styles.row}>
              <div className={styles.rowContent}>
                <span className={styles.index}>{item.idx}</span>
                <div className={styles.text}>
                  <div className={styles.lead}>{item.lead}</div>
                  <p className={styles.body}>{item.body}</p>
                </div>
              </div>
            </SpotlightRow>
          ))}
        </div>
      </Card>
    </Row>
  );
}
