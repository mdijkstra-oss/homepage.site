import { Row } from '../../../../../components/primitives/Row/Row';
import type { ApproachPayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { Card } from '../../Card/Card';
import { CardHeading } from '../CardHeading/CardHeading';
import layoutStyles from '../CardLayout.module.css';
import { SpotlightRow } from '../SpotlightRow/SpotlightRow';
import styles from './ApproachCard.module.css';

export function ApproachCard({ payload }: { payload: ApproachPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="approach">{payload.badge}</Badge>
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
