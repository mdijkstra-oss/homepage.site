import { Row } from '../../../../../components/primitives/Row/Row';
import type { ProfilePayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { InteractiveCard } from '../../Card/Card';
import { WipeButton } from '../../WipeButton/WipeButton';
import layoutStyles from '../CardLayout.module.css';
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
        <div className={`${layoutStyles.actionRow} ${styles.hire}`}>
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
