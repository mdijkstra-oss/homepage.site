import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { CardHeading } from './CardHeading';
import { SpotlightRow } from './SpotlightRow';
import styles from './AlsoCard.module.css';
import type { AlsoPayload } from '../../../data/blocks';

export function AlsoCard({ payload }: { payload: AlsoPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="also">ALSO BUILT</Badge>
        <CardHeading title={payload.title} subtitle={payload.subtitle} />
        <div className={styles.list}>
          {payload.items.map((item) => (
            <SpotlightRow key={item.idx} className={styles.row}>
              <span className={styles.index}>{item.idx}</span>
              <div className={styles.text}><div className={styles.name}>{item.name} <span className={styles.description}>· {item.desc}</span></div></div>
              <span className={styles.tech}>{item.tech}</span>
            </SpotlightRow>
          ))}
        </div>
      </Card>
    </Row>
  );
}
