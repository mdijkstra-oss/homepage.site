import { Row } from '../../../../../components/primitives/Row/Row';
import type { AlsoPayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { Card } from '../../Card/Card';
import { CardHeading } from '../CardHeading/CardHeading';
import layoutStyles from '../CardLayout.module.css';
import { SpotlightRow } from '../SpotlightRow/SpotlightRow';
import styles from './AlsoCard.module.css';

export function AlsoCard({ payload }: { payload: AlsoPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="also">{payload.badge}</Badge>
        <CardHeading title={payload.title} subtitle={payload.subtitle} />
        <div className={layoutStyles.list}>
          {payload.items.map((item) => (
            <SpotlightRow key={item.idx} className={styles.row}>
              <span className={styles.index}>{item.idx}</span>
              <div className={styles.text}>
                <div className={styles.name}>
                  {item.name} <span className={styles.description}>· {item.desc}</span>
                </div>
              </div>
              <span className={styles.tech}>{item.tech}</span>
            </SpotlightRow>
          ))}
        </div>
      </Card>
    </Row>
  );
}
