import Logo from './Logo';
import NavLinks from './NavLinks';

export default function Header() {
  return (
    <div data-chrome="" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40, height: 58,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px',
      borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(12,14,19,0.42)',
      backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
    }}>
      <Logo />
      <NavLinks />
    </div>
  );
}
