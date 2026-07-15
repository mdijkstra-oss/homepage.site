import { Row } from '../primitives/Row';
import { FG, MONO } from '../primitives/theme';
import { shineOnLeave, shineOnMove } from '../effects/shine';
import { assertNever } from '../../lib/assertNever';
import { Badge } from './Badge';
import { Card } from './Card';
import { TechTag } from './TechTag';
import { WipeButton } from './WipeButton';
import type {
  CardBlock,
  ProfilePayload,
  RolePayload,
  ReviewsPayload,
  ApproachPayload,
  NotePayload,
  EducationPayload,
  ExperiencePayload,
  AlsoPayload,
} from '../../types/blocks';

/* ---------- profile ---------- */
export function ProfileCard({ p }: { p: ProfilePayload }) {
  const mailto = `mailto:${p.email}?subject=${encodeURIComponent(p.emailSubject)}`;
  const noteFlip = 'transform .38s cubic-bezier(.4,0,.2,1), opacity .3s ease';
  return (
    <Row>
      <Card shine>
        <Badge kind="profile">{p.badge}</Badge>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{
            width: 88, height: 88, flex: '0 0 auto', borderRadius: 16,
            background: 'linear-gradient(155deg,#f5a04f,#e8743b)', border: '1px solid rgba(255,200,150,0.4)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#3a1c06', fontWeight: 700, fontSize: 26, letterSpacing: '.04em',
          }}>{p.initials}</div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd', lineHeight: 1.04 }}>{p.name}</div>
            <div style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '.18em', color: '#8fa0b8', marginTop: 7 }}>{p.label}</div>
            <p style={{ margin: '16px 0 0', fontSize: 14.5, lineHeight: 1.62, color: '#c4cee0' }}>{p.bio}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, marginTop: 16, fontFamily: MONO, fontSize: 11.5, color: '#8fa0b8' }}>
              <span style={{ width: 6, height: 6, flex: '0 0 auto', borderRadius: '50%', background: '#7bf5b0', opacity: .85 }} />
              Available for Staff/founding roles · Remote (EU/US overlap)
            </div>
          </div>
        </div>
        <div className="hire-wrap" style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 20, flexWrap: 'wrap' }}>
          <WipeButton href={mailto} label={p.cta} background="#fff" color="#0a0c14" fillBg="#567cff" fillColor="#fff" />
          <span style={{ position: 'relative', display: 'inline-block', height: 14, lineHeight: '14px', overflow: 'hidden', fontFamily: MONO, fontSize: 11 }}>
            <span className="note-a" style={{ display: 'block', color: '#6f7f95', transition: noteFlip }}>{p.note}</span>
            <span className="note-b" style={{ display: 'block', position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap', color: '#8fb0ff', transform: 'translateY(100%)', opacity: 0, transition: noteFlip }}>1 of 1 available</span>
          </span>
        </div>
      </Card>
    </Row>
  );
}

/* ---------- role ---------- */
export function RoleCard({ p }: { p: RolePayload }) {
  return (
    <Row>
      <Card shine style={{ padding: 28 }}>
        <Badge kind="role">{p.badge}</Badge>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          {p.logo
            ? <img src={p.logo} alt={p.name} style={{ width: 64, height: 64, flex: '0 0 auto', borderRadius: 15, objectFit: 'cover' }} />
            : <div style={{ width: 64, height: 64, flex: '0 0 auto', borderRadius: 15, background: 'linear-gradient(155deg,#1e8f7e,#136052)', border: '1px solid rgba(120,255,220,0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eafff8', fontWeight: 700, fontSize: 20, letterSpacing: '.02em' }}>{p.initials}</div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd' }}>{p.name}</div>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.1em', color: '#8fa0b8', marginTop: 5 }}>{p.meta}</div>
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
          {p.paras.map((para, i) => (
            <p key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.68, color: '#c4cee0', textWrap: 'pretty' }}>
              {'url' in para
                ? <>{para.pre}<a className="inlink-text" href={para.url} target="_blank" rel="noopener">{para.linkText}</a>{para.post}</>
                : para.text}
            </p>
          ))}
        </div>
        {p.stats && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
            {p.stats.map((st, i) => (
              <a key={i} className="statcard" href={st.href} target="_blank" rel="noopener"
                style={{ flex: 1, minWidth: 128, padding: '13px 15px', borderRadius: 13, background: 'linear-gradient(180deg, rgba(110,230,200,0.13), rgba(110,230,200,0.04))', border: '1px solid rgba(120,235,205,0.22)', textDecoration: 'none' }}>
                <div style={{ fontSize: 23, fontWeight: 700, color: '#e8fff8', letterSpacing: '-.01em' }}>{st.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 10, letterSpacing: '.06em', color: '#98b8ae', marginTop: 4 }}>
                  <span>{st.label}</span><span style={{ fontSize: 10.5, color: '#bfeadd' }}>{st.note}</span><span style={{ fontSize: 12.5, lineHeight: 1 }}>↗</span>
                </div>
              </a>
            ))}
          </div>
        )}
        {p.tech && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
            {p.tech.map((t) => <TechTag key={t}>{t}</TechTag>)}
          </div>
        )}
        {p.href && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginTop: 20, flexWrap: 'wrap' }}>
            <WipeButton href={p.href} label={p.cta ?? ''} target="_blank" rel="noopener" />
            {p.ctaNote && <span style={{ fontFamily: MONO, fontSize: 11, color: '#6f7f95' }}>{p.ctaNote}</span>}
          </div>
        )}
        {p.footnotes && (
          <div style={{ marginTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {p.footnotes.map((fn) => (
              <a key={fn.n} className="footnote" href={fn.url} target="_blank" rel="noopener"
                style={{ fontFamily: MONO, fontSize: 10.5, lineHeight: 1.5, color: '#93b8cf', textDecoration: 'none' }}>
                <span style={{ color: '#b7c4d8' }}>{fn.n}.</span> {fn.text} ↗
              </a>
            ))}
          </div>
        )}
      </Card>
    </Row>
  );
}

/* ---------- reviews ---------- */
export function ReviewsCard({ p }: { p: ReviewsPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="reviews">RECOMMENDATIONS</Badge>
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd' }}>{p.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: '#8fa0b8', marginTop: 6 }}>{p.subtitle}</div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
          {p.items.map((rv, i) => (
            <div key={i} onPointerMove={(e) => shineOnMove(e.currentTarget, e)} onPointerLeave={(e) => shineOnLeave(e.currentTarget)} style={{ position: 'relative', padding: '16px 12px', margin: '0 -12px', borderRadius: 10, borderTop: '1px solid rgba(255,255,255,0.08)', transition: 'background-color .2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={rv.photo} alt={rv.name} style={{ width: 68, height: 68, flex: '0 0 auto', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#eef2f8' }}>{rv.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 13, color: '#9aa9bd', marginTop: 3 }}>{rv.role}</div>
                </div>
                <a href={rv.url} target="_blank" rel="noopener" data-inlink=""
                  style={{ width: 32, height: 32, flex: '0 0 auto', borderRadius: 7, background: '#0a66c2', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, textDecoration: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(10,102,194,0.5)', position: 'relative', overflow: 'hidden' }}>
                  <span data-in-a="" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>in</span>
                  <span data-in-b="" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ position: 'relative', width: 10, height: 10, display: 'block' }}>
                      <span style={{ position: 'absolute', top: 0, right: 0, width: 7, height: 7, borderTop: '2px solid #fff', borderRight: '2px solid #fff' }} />
                      <span style={{ position: 'absolute', top: 4, left: -1, width: 12, height: 2, background: '#fff', borderRadius: 2, transform: 'rotate(-45deg)' }} />
                    </span>
                  </span>
                </a>
              </div>
              <p style={{ margin: '12px 0 0', fontSize: 14, lineHeight: 1.62, color: '#d2dae6', fontStyle: 'italic' }}>“{rv.quote}”</p>
            </div>
          ))}
        </div>
      </Card>
    </Row>
  );
}

/* ---------- approach ---------- */
export function ApproachCard({ p }: { p: ApproachPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="approach">APPROACH</Badge>
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd' }}>{p.title}</div>
        <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.66, color: '#c7d1df' }}>{p.intro}</p>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
          {p.items.map((ap) => (
            <div key={ap.idx} onPointerMove={(e) => shineOnMove(e.currentTarget, e)} onPointerLeave={(e) => shineOnLeave(e.currentTarget)} style={{ position: 'relative', padding: '16px 12px', margin: '0 -12px', borderRadius: 10, borderTop: '1px solid rgba(255,255,255,0.08)', transition: 'background-color .2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: '#ff9ecb', flex: '0 0 auto' }}>{ap.idx}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: '#eef2f8' }}>{ap.lead}</div>
                  <p style={{ margin: '7px 0 0', fontSize: 14, lineHeight: 1.62, color: '#c7d1df' }}>{ap.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Row>
  );
}

/* ---------- note ---------- */
export function NoteCard({ p }: { p: NotePayload }) {
  return (
    <Row>
      <Card shine style={{ padding: '28px 30px', background: 'linear-gradient(140deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03)), linear-gradient(rgba(12,14,19,0.5), rgba(12,14,19,0.5))', border: '1px solid rgba(255,255,255,0.16)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 18px 50px rgba(0,0,0,0.4)' }}>
        {p.badge && <Badge kind="noteBlue">{p.badge}</Badge>}
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.18em', color: '#8fa0b8' }}>{p.eyebrow}</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd', marginTop: 8 }}>{p.title}</div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {p.paras.map((para, i) => (
            <p key={i} style={{ margin: 0, fontSize: 14.5, lineHeight: 1.72, color: '#c4cee0', textWrap: 'pretty' }}>{para}</p>
          ))}
        </div>
        {p.loop && (
          <>
            <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 10.5, letterSpacing: '.18em', color: '#7f8da0' }}>↻ THE LOOP</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 11, alignItems: 'center' }}>
              {p.loop.map((step) => (
                <span key={step} style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 13px', borderRadius: 999, background: 'linear-gradient(180deg, rgba(120,150,255,0.14), rgba(120,150,255,0.05))', border: '1px solid rgba(150,180,255,0.28)', color: '#cdd8f2', fontFamily: FG, fontWeight: 600, fontSize: 12.5 }}>{step}</span>
              ))}
            </div>
          </>
        )}
      </Card>
    </Row>
  );
}

/* ---------- education ---------- */
export function EducationCard({ p }: { p: EducationPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="education">EDUCATION</Badge>
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd' }}>{p.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: '#8fa0b8', marginTop: 6 }}>{p.subtitle}</div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column' }}>
          {p.items.map((row, i) => (
            <div key={i} onPointerMove={(e) => shineOnMove(e.currentTarget, e)} onPointerLeave={(e) => shineOnLeave(e.currentTarget)} style={{ position: 'relative', display: 'flex', gap: 15, alignItems: 'center', padding: '14px 12px', margin: '0 -12px', borderRadius: 10, borderTop: '1px solid rgba(255,255,255,0.08)', transition: 'background-color .2s ease' }}>
              {row.img
                ? <a href={row.url} target="_blank" rel="noopener" style={{ flex: '0 0 auto', display: 'inline-flex', borderRadius: 11 }}>
                    <img src={row.img} alt={row.degree} style={{ width: 46, height: 46, flex: '0 0 auto', borderRadius: 11, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.14)' }} />
                  </a>
                : <div style={{ width: 46, height: 46, flex: '0 0 auto', borderRadius: 11, background: 'linear-gradient(155deg,#2b313e,#1b2029)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9db4d6', fontWeight: 700, fontSize: 13 }}>{row.initials}</div>}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 600, color: '#eef2f8' }}>{row.degree}</div>
                <div style={{ fontSize: 13, color: '#a9b6c8', marginTop: 2 }}>{row.school}</div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#8fa0b8', whiteSpace: 'nowrap' }}>{row.year}</span>
            </div>
          ))}
        </div>
      </Card>
    </Row>
  );
}

/* ---------- experience (video) ---------- */
export function ExperienceCard({ p }: { p: ExperiencePayload }) {
  return (
    <Row>
      <Card shine>
        <Badge kind="experience">FREELANCE · PROJECT</Badge>
        <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', marginBottom: 18, borderRadius: 14, overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
          <iframe src={p.video} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen title={p.name} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd' }}>{p.name}</div>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.12em', color: '#8fa0b8' }}>{p.meta}</span>
        </div>
        <p style={{ margin: '11px 0 0', fontSize: 14, lineHeight: 1.62, color: '#c4cee0' }}>{p.blurb}</p>
        {p.tech && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {p.tech.map((t) => <TechTag key={t}>{t}</TechTag>)}
          </div>
        )}
      </Card>
    </Row>
  );
}

/* ---------- also built ---------- */
export function AlsoCard({ p }: { p: AlsoPayload }) {
  return (
    <Row>
      <Card>
        <Badge kind="also">ALSO BUILT</Badge>
        <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-.01em', color: '#f4f7fd' }}>{p.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '.16em', color: '#8fa0b8', marginTop: 6 }}>{p.subtitle}</div>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
          {p.items.map((it, i) => (
            <div key={i} onPointerMove={(e) => shineOnMove(e.currentTarget, e)} onPointerLeave={(e) => shineOnLeave(e.currentTarget)} style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 14, padding: '13px 12px', margin: '0 -12px', borderRadius: 10, borderTop: '1px solid rgba(255,255,255,0.08)', transition: 'background-color .2s ease' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: '#6f7f95', flex: '0 0 auto', width: 22 }}>{it.idx}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#eef2f8' }}>{it.name} <span style={{ fontWeight: 400, color: '#9aa9bd' }}>· {it.desc}</span></div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: '#7e8ea2', whiteSpace: 'nowrap' }}>{it.tech}</span>
            </div>
          ))}
        </div>
      </Card>
    </Row>
  );
}

/* ---------- dispatcher ---------- */
export function Block({ block }: { block: CardBlock }) {
  switch (block.type) {
    case 'profile':    return <ProfileCard p={block.payload} />;
    case 'role':       return <RoleCard p={block.payload} />;
    case 'reviews':    return <ReviewsCard p={block.payload} />;
    case 'approach':   return <ApproachCard p={block.payload} />;
    case 'note':       return <NoteCard p={block.payload} />;
    case 'education':  return <EducationCard p={block.payload} />;
    case 'experience': return <ExperienceCard p={block.payload} />;
    case 'also':       return <AlsoCard p={block.payload} />;
    default:           return assertNever(block);
  }
}
