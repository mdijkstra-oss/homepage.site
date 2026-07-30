import { Row } from '../../../../../components/primitives/Row/Row';
import type { NotePayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { InteractiveCard } from '../../Card/Card';
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
            <div className={styles.loopLabel}>{payload.loop.label}</div>
            <div className={styles.loop}>
              {payload.loop.steps.map((step) => (
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
