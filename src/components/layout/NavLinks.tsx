import { MONO } from '../primitives/theme';

export default function NavLinks() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 13 }}>
      <a className="navlink" href="https://www.linkedin.com/in/matthijn-dijkstra-65527199/" target="_blank" rel="noopener">LinkedIn</a>
      <span className="navlink">Resume</span>
      <a className="navlink" href="mailto:hire@mdijkstra.dev?subject=Let's%20build%20something">Contact</a>
    </div>
  );
}
