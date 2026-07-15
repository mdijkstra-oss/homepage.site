import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { SpotlightRow } from './SpotlightRow';
import styles from './ApproachCard.module.css';
import type { ApproachPayload } from '../../../data/blocks';

export function ApproachCard({ payload }: { payload: ApproachPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="approach">APPROACH</Badge>
        <div className={styles.title}>{payload.title}</div>
        <p className={styles.intro}>{payload.intro}</p>
        <div className={styles.list}>
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
