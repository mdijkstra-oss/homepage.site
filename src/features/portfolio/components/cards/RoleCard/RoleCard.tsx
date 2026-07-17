import { Row } from '../../../../../components/primitives/Row/Row';
import type { RolePayload } from '../../../model/types';
import { Badge } from '../../Badge/Badge';
import { InteractiveCard } from '../../Card/Card';
import { WipeButton } from '../../WipeButton/WipeButton';
import layoutStyles from '../CardLayout.module.css';
import { TagList } from '../TagList/TagList';
import styles from './RoleCard.module.css';

export function RoleCard({ payload }: { payload: RolePayload }) {
  return (
    <Row>
      <InteractiveCard className={styles.card}>
        <Badge kind="role">{payload.badge}</Badge>
        <div className={styles.header}>
          {payload.logo ? (
            <img src={payload.logo} alt={payload.name} className={styles.logo} />
          ) : (
            <div className={styles.initials}>{payload.initials}</div>
          )}
          <div className={styles.titleWrap}>
            <div className={styles.name}>{payload.name}</div>
            <div className={styles.meta}>{payload.meta}</div>
          </div>
        </div>
        <div className={styles.paragraphs}>
          {payload.paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.paragraph}>
              {'url' in paragraph ? (
                <>
                  {paragraph.pre}
                  <a className={styles.inlink} href={paragraph.url} target="_blank" rel="noopener">
                    {paragraph.linkText}
                  </a>
                  {paragraph.post}
                </>
              ) : (
                paragraph.text
              )}
            </p>
          ))}
        </div>
        {payload.stats && (
          <div className={styles.stats}>
            {payload.stats.map((stat) => (
              <a key={stat.href} className={styles.stat} href={stat.href} target="_blank" rel="noopener">
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>
                  <span>{stat.label}</span>
                  <span className={styles.statNote}>{stat.note}</span>
                  <span className={styles.statArrow}>↗</span>
                </div>
              </a>
            ))}
          </div>
        )}
        {payload.tech && <TagList tags={payload.tech} marginTop={18} />}
        {payload.href && (
          <div className={layoutStyles.actionRow}>
            <WipeButton href={payload.href} label={payload.cta ?? ''} target="_blank" rel="noopener" />
            {payload.ctaNote && <span className={styles.ctaNote}>{payload.ctaNote}</span>}
          </div>
        )}
        {payload.footnotes && (
          <div className={styles.footnotes}>
            {payload.footnotes.map((footnote) => (
              <a key={footnote.n} className={styles.footnote} href={footnote.url} target="_blank" rel="noopener">
                <span className={styles.footnoteIndex}>{footnote.n}.</span> {footnote.text} ↗
              </a>
            ))}
          </div>
        )}
      </InteractiveCard>
    </Row>
  );
}
