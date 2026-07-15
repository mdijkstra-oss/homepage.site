import type { ProfilePayload } from '../../../data/blocks';
import { Row } from '../../primitives/Row';
import { Badge } from '../Badge';
import { InteractiveCard } from '../Card';
import { WipeButton } from '../WipeButton';
import styles from './ProfileCard.module.css';

export function ProfileCard({ payload }: { payload: ProfilePayload }) {
  const mailto = `mailto:${payload.email}?subject=${encodeURIComponent(payload.emailSubject)}`;
  return (
    <Row>
      <InteractiveCard>
        <Badge kind="profile">{payload.badge}</Badge>
        <div className={styles.header}>
          <div className={styles.avatar}>{payload.initials}</div>
          <div className={styles.content}>
            <div className={styles.name}>{payload.name}</div>
            <div className={styles.label}>{payload.label}</div>
            <p className={styles.bio}>{payload.bio}</p>
            <div className={styles.availability}>
              <span className={styles.availabilityDot} />
              Available for Staff/founding roles · Remote (EU/US overlap)
            </div>
          </div>
        </div>
        <div className={styles.hire}>
          <WipeButton
            href={mailto}
            label={payload.cta}
            background="#fff"
            color="#0a0c14"
            fillBg="#567cff"
            fillColor="#fff"
          />
          <span className={styles.note}>
            <span className={styles.noteA}>{payload.note}</span>
            <span className={styles.noteB}>1 of 1 available</span>
          </span>
        </div>
      </InteractiveCard>
    </Row>
  );
}
