import type { NotePayload } from '../../../data/blocks';
import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { InteractiveCard } from '../Card';
import styles from './NoteCard.module.css';

export function NoteCard({ payload }: { payload: NotePayload }) {
  return (
    <Row>
      <InteractiveCard className={styles.card}>
        {payload.badge && <Badge kind="note">{payload.badge}</Badge>}
        <div className={styles.eyebrow}>{payload.eyebrow}</div>
        <div className={styles.title}>{payload.title}</div>
        <div className={styles.paragraphs}>
          {payload.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        {payload.loop && (
          <>
            <div className={styles.loopLabel}>↻ THE LOOP</div>
            <div className={styles.loop}>
              {payload.loop.map((step) => (
                <span key={step} className={styles.loopStep}>
                  {step}
                </span>
              ))}
            </div>
          </>
        )}
      </InteractiveCard>
    </Row>
  );
}
