import { BLOCKS } from './data/prompts.js';
import { PILLS } from './data/theme.js';

export class SiteEngine {
  constructor(cfg) {
    this.props = cfg || {};
    this._pills = PILLS;
  }

  // ====== CONTENT — single ordered block list ======
  // Each block: { type, ...payload }. The list defines order.
  // Types: user | assistant | profile | experience | also | education | reviews
  // placeholder — later these will push a new message onto the stack.
  // for now, scroll to the relevant card.
  jumpToType(type) {
    const order = BLOCKS;
    let n = 0;
    for (let i = 0; i < order.length; i++) {
      if (order[i].type === type) { n = i; break; }
    }
    // land on the user message that precedes the block, so the question
    // that "asked for" the card is visible above it
    if (n > 0 && order[n - 1].type === 'user') n--;
    const bubbles = this.root && this.root.querySelectorAll('[data-bubble]');
    const target = bubbles && bubbles[n];
    if (target) {
      const r = target.getBoundingClientRect();
      window.scrollBy({ top: r.top - 120, behavior: 'smooth' });
    }
  }

  readCfg() {
    const p = this.props || {};
    const num = (v, d) => (v === undefined || v === null || v === '') ? d : Number(v);
    return {
      golOpacity:   num(p.golOpacity, 0.42),
      golFade:      num(p.golFade, 560),
      golWait:      num(p.golWait, 280),
      animStart:    num(p.animStart, 0.74),
      animDur:      num(p.animDur, 700),
      animRise:     num(p.animRise, 34),
      animDrift:    num(p.animDrift, 22),
      animTilt:     num(p.animTilt, 14),
      animScale:    num(p.animScale, 0.94),
      animBlur:     num(p.animBlur, 3),
      flyDur:       num(p.flyDur, 1050),
      snakeBase:    num(p.snakeBase, 150),
      snakeMin:     num(p.snakeMin, 60),
      snakeRamp:    num(p.snakeRamp, 3),
      eatParticles: num(p.eatParticles, 40),
      eatPower:     num(p.eatPower, 0.7),
      snakeGap:     num(p.snakeGap, 4),
    };
  }

  applyGolCfg() {
    this._fadeMs = Math.max(40, this.cfg.golFade);
    this._waitMs = Math.max(0, this.cfg.golWait);
    if (this.golCanvas) this.golCanvas.style.opacity = String(this.cfg.golOpacity);
  }

  mount(rootEl) {
    this.root = rootEl;
    this.cfg = this.readCfg();
    const root = this.root;
    if (!root) return;
    this.flyDur = Math.max(300, this.cfg.flyDur);
    this.setupForeground(root);
    this.initHireButton(root);
    this.initPillHover(root);
    this.initLife(root.querySelector('[data-gol]'));
    this.definePin();
    this.positionHotspot();
    this.initRowShine(root);
    window.addEventListener('resize', this.onResize);
    this.ready = true;
  }

  // whole row / whole special-card gets a subtle shine on hover, brighter where the mouse is
  initRowShine(root) {
    const paint = (target, fillEl, e) => {
      const r = target.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      fillEl.style.backgroundImage = 'radial-gradient(260px circle at ' + x.toFixed(1) + '% ' + y.toFixed(1) + '%, rgba(255,255,255,0.13), transparent 72%), linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05))';
    };
    this._onRowMove = (e) => {
      const t = e.target;
      const card = t.closest && t.closest('[data-shinecard]');
      if (card && root.contains(card)) {
        const fill = card.querySelector(':scope > [data-shinefill]');
        if (fill) paint(card, fill, e);
      }
      const row = t.closest && t.closest('[data-shinerow]');
      if (row && root.contains(row)) paint(row, row, e);
    };
    this._onRowOut = (e) => {
      const t = e.target;
      const card = t.closest && t.closest('[data-shinecard]');
      if (card && !card.contains(e.relatedTarget)) { const f = card.querySelector(':scope > [data-shinefill]'); if (f) f.style.backgroundImage = 'none'; }
      const row = t.closest && t.closest('[data-shinerow]');
      if (row && !row.contains(e.relatedTarget)) row.style.backgroundImage = 'none';
    };
    root.addEventListener('pointermove', this._onRowMove, { passive: true });
    root.addEventListener('pointerout', this._onRowOut, { passive: true });
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    if (this._golTimer) clearInterval(this._golTimer);
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._io) this._io.disconnect();
    if (this._onKey) window.removeEventListener('keydown', this._onKey);
    if (this._onMove) window.removeEventListener('pointermove', this._onMove);
    if (this._onHotClick && this.hotEl) this.hotEl.removeEventListener('click', this._onHotClick);
    if (this._onGameKey) window.removeEventListener('keydown', this._onGameKey);
    clearTimeout(this._snakeTimer); clearTimeout(this._respawnTimer); clearTimeout(this._countTimer);
  }

  // ---- "Hire me" button: hover-only diagonal ink wipe. A blue fill slides in
  //      left→right with a slanted (/) leading edge; the duplicated white label
  //      inside the fill flips the text color exactly along that edge. ----
  initHireButton(root) {
    // generic ink-wipe: any [data-wipe-btn] with a [data-wipe-fill] child gets
    // the same hover treatment as the hire button (e.g. "View project")
    const restG = 'polygon(-40% 0%, -20% 0%, -40% 100%, -60% 100%)';
    const fullG = 'polygon(-40% 0%, 140% 0%, 120% 100%, -60% 100%)';
    root.querySelectorAll('[data-wipe-btn]').forEach((b) => {
      const f = b.querySelector('[data-wipe-fill]');
      if (!f) return;
      b.addEventListener('mouseenter', () => { f.style.clipPath = fullG; f.style.webkitClipPath = fullG; });
      b.addEventListener('mouseleave', () => { f.style.clipPath = restG; f.style.webkitClipPath = restG; });
    });

    const btn = root.querySelector('[data-hire-btn]');
    const fill = root.querySelector('[data-hire-fill]');
    if (!btn || !fill) return;
    const noteA = root.querySelector('[data-note-a]');
    const noteB = root.querySelector('[data-note-b]');
    const rest = 'polygon(-40% 0%, -20% 0%, -40% 100%, -60% 100%)';
    const full = 'polygon(-40% 0%, 140% 0%, 120% 100%, -60% 100%)';
    this._hireEnter = () => {
      fill.style.clipPath = full; fill.style.webkitClipPath = full;
      if (noteA) { noteA.style.transform = 'translateY(-100%)'; noteA.style.opacity = '0'; }
      if (noteB) { noteB.style.transform = 'translateY(0)'; noteB.style.opacity = '1'; }
    };
    this._hireLeave = () => {
      fill.style.clipPath = rest; fill.style.webkitClipPath = rest;
      if (noteA) { noteA.style.transform = 'translateY(0)'; noteA.style.opacity = '1'; }
      if (noteB) { noteB.style.transform = 'translateY(100%)'; noteB.style.opacity = '0'; }
    };
    btn.addEventListener('mouseenter', this._hireEnter);
    btn.addEventListener('mouseleave', this._hireLeave);
  }

  // ---- chat pills: badge-colored ink wipe on hover (same move as "Hire me").
  //      Each pill's fill wipes in with the colors of the badge it scrolls to;
  //      the resting pill stays dark with only the icon tinted. ----
  initPillHover(root) {
    const rest = 'polygon(-40% 0%, -20% 0%, -40% 100%, -60% 100%)';
    const full = 'polygon(-40% 0%, 140% 0%, 120% 100%, -60% 100%)';
    root.querySelectorAll('[data-prompt-pill]').forEach((b, i) => {
      const p = (this._pills || [])[i];
      if (!p || b.querySelector('[data-pill-fill]')) return;
      const ic = b.querySelector('[data-pill-icon]');
      if (ic) ic.style.color = p.iconColor;
      const f = document.createElement('span');
      f.setAttribute('data-pill-fill', '');
      f.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:7px;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;white-space:nowrap;transition:clip-path .38s cubic-bezier(.4,0,.2,1);";
      f.style.background = p.hoverBg;
      f.style.color = p.hoverColor;
      f.style.clipPath = rest; f.style.webkitClipPath = rest;
      f.innerHTML = '<span style="opacity:.9;font-size:11.5px;">' + p.icon + '</span>' + p.label;
      b.appendChild(f);
      b.addEventListener('mouseenter', () => { f.style.clipPath = full; f.style.webkitClipPath = full; b.style.borderColor = p.hoverBorder; });
      b.addEventListener('mouseleave', () => { f.style.clipPath = rest; f.style.webkitClipPath = rest; b.style.borderColor = 'rgba(255,255,255,0.16)'; });
    });
  }

  now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  // ============================================================
  //  FOREGROUND MOTION ENGINE  (animation-agnostic)
  //  Every block has TWO independent progress channels:
  //    entryP — one-shot 0→1, driven by SCROLL (IntersectionObserver).
  //             Plays once when the block scrolls into view, then settles
  //             forever. ("once settled, settled")
  //    flyP   — 0→1, driven by a TWEEN fired by the konami code. Flies the
  //             foreground blocks off-screen; background canvas is untouched.
  //  Same applyState() consumes whichever channel(s) are active, so the
  //  motion is identical whether the driver is the scrollbar or the tween.
  // ============================================================
  setupForeground(root) {
    this.fg = [
      ...[...root.querySelectorAll('[data-bubble]')].map((el) => this._mkItem(el, false)),
      ...[...root.querySelectorAll('[data-chrome]')].map((el) => this._mkItem(el, true)),
    ];


    // ---- interactive easter-egg (hotspot glow + particle burst) ----
    this.initInteractive(root);

    // ---- single rAF loop drives all foreground motion + fx ----
    const loop = () => {
      const t = this.now();
      const ld = this._loopLast ? Math.min(80, t - this._loopLast) : 16; this._loopLast = t;
      this.tickFg(t);
      this.tickSnake(ld);
      this.tickBurst(t);
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);

    this.installKonami();
  }

  // Build a foreground item for one element. Bubbles start hidden and reveal on
  // scroll; chrome is visible from the start and only joins the fly-away.
  _mkItem(el, chrome) {
    const now = this.now();
    el.style.willChange = 'transform, opacity, filter';
    if (!chrome) el.style.opacity = '0';
    return {
      el,
      chrome: !!chrome,
      // which side of the viewport centre the block sits on — the entry
      // drifts in from that side (user bubbles right, cards left)
      dir: (el.getBoundingClientRect().left + el.getBoundingClientRect().width / 2) >= (window.innerWidth || 1200) / 2 ? 1 : -1,
      entryStart: chrome ? now - 1e6 : null,
      entryDone: !!chrome,
      seed: {
        x: Math.random() * 2 - 1,   // horizontal drift direction on fly-away
        r: Math.random() * 2 - 1,   // rotation direction
        delay: Math.random() * 0.22 // per-block stagger on fly-away
      }
    };
  }

  // Register a live-appended chat bubble so it reveals, shines and flies away
  // exactly like the preloaded blocks. Idempotent.
  addBubble(el) {
    if (!el || !this.fg || this.fg.some((it) => it.el === el)) return;
    this.fg.push(this._mkItem(el, false));
  }

  removeBubble(el) {
    if (this.fg) this.fg = this.fg.filter((it) => it.el !== el);
  }

  tickFg(now) {
    const items = this.fg;
    if (!items) return;
    const c = this.cfg;
    const vh = window.innerHeight || 800;   // VISIBLE viewport, not the tall page div

    // advance the fly tween (konami driver)
    let fp = this.flyP || 0;
    if (this.flyState === 'out' || this.flyState === 'in') {
      const t = this.clamp((now - this.flyStart) / this.flyDur, 0, 1);
      const e = t * t * (3 - 2 * t);            // smoothstep
      fp = this.flyState === 'out' ? e : (1 - e);
      this.flyP = fp;
      if (t >= 1) this.flyState = fp > 0.5 ? 'parked' : null;
    }

    // SCROLL-POSITION driver: a block's entry progress is a direct function of
    // where its top sits in the viewport — 0 as it enters the reveal window at
    // the bottom, 1 once it has risen to the settle line. The progress is
    // latched (Math.max) so it only ever moves FORWARD: scrolling back up never
    // rewinds a block that has already settled.
    // Scroll TRIGGERS the entry (once, when the block top crosses the start
    // line); the animation itself then runs on its own clock to completion.
    const startLine = vh * c.animStart;
    for (const it of items) {
      // --- entry channel (scroll drives progress, forward-only) ---
      let ey = 0, ex = 0, es = 1, eop = 1, eblur = 0, erx = 0, erz = 0, ebr = 1;
      if (!it.chrome) {
        if (it.entryStart == null) {
          const top = it.el.getBoundingClientRect().top;
          if (top < startLine) {
            // stagger blocks triggered in the same burst so they cascade
            if (now - (this._lastTrig || -1e9) < 300) this._stagSlot = (this._stagSlot || 0) + 1; else this._stagSlot = 0;
            this._lastTrig = now;
            it.entryStart = now + this._stagSlot * 120;
          } else {
            it.el.style.opacity = '0';
            continue;   // still below the trigger line — keep hidden
          }
        }
        const clockP = this.clamp((now - it.entryStart) / Math.max(60, c.animDur), 0, 1);
        // position floor: progress can never lag behind where the block already
        // IS in the viewport — a fast scroll (pill jump, flick) fast-forwards
        // the animation to match, so blocks never crawl while already on screen
        const topNow = it.el.getBoundingClientRect().top;
        const posP = this.clamp((startLine - topNow) / Math.max(1, startLine - vh * 0.30), 0, 1);
        const p = Math.max(clockP, posP, it.entryP || 0);
        it.entryP = p;
        if (p >= 1) it.entryDone = true;
        // smootherstep for an even, unhurried settle
        const e = p * p * p * (p * (p * 6 - 15) + 10);
        // SURFACE RISE: each block drifts in from its own side of the screen,
        // tilted back in depth and softly blurred, then sharpens, straightens
        // and grows to final size as it rises out of shadow into full light.
        // Forward-only latched; scale never overshoots or shrinks back.
        ey    = (1 - e) * c.animRise;                    // rises into place
        ex    = (1 - e) * c.animDrift * (it.dir || -1);  // lateral drift from its side
        erx   = (1 - e) * -c.animTilt;                   // depth tilt settling flat
        erz   = (1 - e) * c.animTilt * 0.1 * (it.dir || -1); // whisper of roll, follows Tilt
        es    = c.animScale + e * (1 - c.animScale);     // grows to 1, no overshoot
        eblur = (1 - e) * c.animBlur;                    // sharpens on arrival
        ebr   = 0.75 + e * 0.25;                         // out of shadow, into light
        eop   = this.clamp(p * 3, 0, 1);                 // brief anti-pop fade only
      }

      // --- fly channel (overlaid on the settled entry state) ---
      // Direction is per-block and radial: captured at trigger time from the
      // block's position relative to the viewport centre, so each flies toward
      // the edge nearest it (up-left blocks go up-left, right blocks go right…).
      let tx = ex, ty = ey, rot = erz, sc = es, op = eop, blur = eblur, rx = erx;
      if (fp > 0 && it.fly) {
        const dl = it.fly.delay || 0;
        const lp = this.clamp((fp - dl) / (1 - dl), 0, 1);
        const a = 1 - Math.pow(1 - lp, 2.6);    // sharp launch (blasted), then coast out
        tx = ex + it.fly.dx * it.fly.dist * a;
        ty = ey + it.fly.dy * it.fly.dist * a;
        rot = it.fly.rot * lp;
        sc = es * (1 + 0.08 * lp);
        op = eop * (1 - this.clamp((lp - 0.55) / 0.45, 0, 1));
        blur = Math.max(eblur, lp > 0.15 ? (lp - 0.15) * 13 : 0);
      }

      const el = it.el;
      el.style.opacity = String(op);
      el.style.transform = 'perspective(1200px) translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) rotateX(' + rx.toFixed(2) + 'deg) rotate(' + rot.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      el.style.filter = (blur > 0.05 || ebr < 0.995) ? ('blur(' + blur.toFixed(1) + 'px) brightness(' + ebr.toFixed(3) + ')') : 'none';
    }
  }

  // ---- EASTER EGG: konami code flies the foreground away (toggles back) ----
  installKonami() {
    const seq = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
    let i = 0;
    this._onKey = (e) => {
      const k = (e.key || '').toLowerCase();
      if (k === seq[i]) { i++; if (i === seq.length) { i = 0; this.toggleFly(); } }
      else { i = (k === seq[0]) ? 1 : 0; }
    };
    window.addEventListener('keydown', this._onKey);
  }

  // Fire the fly-away from an arbitrary origin point (viewport-relative px).
  // Blocks radiate AWAY from that origin — konami passes the screen centre,
  // the hotspot click passes the click point (a directional blast).
  fireFly(ox, oy, preDelay) {
    const goingOut = !(this.flyState === 'out' || this.flyState === 'parked');
    if (goingOut) this.computeFly(ox, oy);
    // preDelay holds the blocks briefly so the shockwave hits before they move
    this.flyStart = this.now() + (goingOut ? (preDelay || 0) : 0);
    this.flyState = goingOut ? 'out' : 'in';
    return goingOut;
  }

  computeFly(ox, oy) {
    if (!this.fg) return;
    const vw = window.innerWidth || 1200, vh = window.innerHeight || 800;
    const diag = Math.hypot(vw, vh);
    for (const it of this.fg) {
      const r = it.el.getBoundingClientRect();
      const ex = r.left + r.width / 2, ey = r.top + r.height / 2;
      let dx = ex - ox, dy = ey - oy, len = Math.hypot(dx, dy);
      if (len < 1) { const a = it.seed.x * Math.PI; dx = Math.cos(a); dy = Math.sin(a); len = 1; }
      // not real-world: the instant the blast lands, everything launches TOGETHER
      // at the same speed — no distance stagger, uniform travel.
      it.fly = { dx: dx / len, dy: dy / len, dist: diag * 1.65, rot: it.seed.r * 18, delay: 0 };
    }
  }

  toggleFly() { this.fireFly((window.innerWidth || 1200) / 2, (window.innerHeight || 800) / 2); }

  // ---- hotspot (warmer/colder) + particle burst ----
  initInteractive(root) {
    this.hotEl = root.querySelector('[data-hotspot]');
    this.hudEl = root.querySelector('[data-hud]');
    this.goEl = root.querySelector('[data-gameover]');
    this.goScoreEl = root.querySelector('[data-go-score]');
    this.goBestEl = root.querySelector('[data-go-best]');
    this.goBadgeEl = root.querySelector('[data-go-badge]');
    this.countWrap = root.querySelector('[data-count]');
    this.countEl = root.querySelector('[data-count-num]');
    this.burstCanvas = root.querySelector('[data-burst]');
    if (this.burstCanvas) { this.burstCtx = this.burstCanvas.getContext('2d'); this.sizeBurst(); }
    this.game = null; this.snake = [];
    this.particles = [];
    this.ring = null;
    this.mouse = null;
    this.positionHotspot();
    this._onMove = (e) => { this.mouse = { x: e.clientX, y: e.clientY }; this.updateBreakPill(); };
    window.addEventListener('pointermove', this._onMove, { passive: true });
    // "Take a break" pill: rises from behind the chat bar as the mouse nears
    // the send button; clicking it detonates + starts the game from the pill.
    this.breakPill = root.querySelector('[data-break-pill]');
    this.sendEl = root.querySelector('[data-send]');
    if (this.breakPill && !this.breakPill.querySelector('[data-pill-fill]')) {
      const rest = 'polygon(-40% 0%, -20% 0%, -40% 100%, -60% 100%)';
      const full = 'polygon(-40% 0%, 140% 0%, 120% 100%, -60% 100%)';
      const f = document.createElement('span');
      f.setAttribute('data-pill-fill', '');
      f.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:7px;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-weight:600;font-size:12.5px;white-space:nowrap;transition:clip-path .38s cubic-bezier(.4,0,.2,1);background:linear-gradient(180deg, rgba(96,52,20,0.95), rgba(66,36,14,0.92));color:#ffd9ae;";
      f.style.clipPath = rest; f.style.webkitClipPath = rest;
      f.innerHTML = '<span style="opacity:.9;font-size:11.5px;">✸</span>Take a break';
      this.breakPill.appendChild(f);
      this.breakPill.addEventListener('mouseenter', () => { f.style.clipPath = full; f.style.webkitClipPath = full; this.breakPill.style.borderColor = 'rgba(255,172,82,0.55)'; });
      this.breakPill.addEventListener('mouseleave', () => { f.style.clipPath = rest; f.style.webkitClipPath = rest; this.breakPill.style.borderColor = 'rgba(255,255,255,0.16)'; });
    }
    if (this.hotEl) this.hotEl.style.display = 'none';   // old corner sparkle retired
    if (this.breakPill) {
      this._onBreakClick = () => {
        if (this.game && this.game !== 'paused') return;   // busy: playing / counting in / game-over
        const r = this.breakPill.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (this.game === 'paused') {            // resume the game already in progress
          this.fireFly(cx, cy, 40);              // clear the UI again
          clearTimeout(this._snakeTimer);
          this._snakeTimer = setTimeout(() => this.startCountdown(true), 260);
          return;
        }
        this.spawnBurst(cx, cy);                // full detonation
        this.fireFly(cx, cy, 40);               // clear the UI
        this.spawnCell = this.cellAt(cx, cy);   // snake spawns from here
        clearTimeout(this._snakeTimer);
        this._snakeTimer = setTimeout(() => this.spawnSnake(), 380);
      };
      this.breakPill.addEventListener('click', this._onBreakClick);
    }
    this._onGameKey = (e) => this.gameKey(e);
    window.addEventListener('keydown', this._onGameKey);
    const againBtn = root.querySelector('[data-go-again]');
    const quitBtn = root.querySelector('[data-go-quit]');
    if (againBtn) againBtn.addEventListener('click', () => { clearTimeout(this._respawnTimer); this.spawnSnake(); });
    if (quitBtn) quitBtn.addEventListener('click', () => this.quitGame());
  }

  showGameOver() {
    if (!this.goEl) return;
    const best = Math.max(this.best || 0, this.score || 0);
    if (this.goScoreEl) this.goScoreEl.textContent = String(this.score || 0);
    if (this.goBestEl) this.goBestEl.textContent = String(best);
    if (this.goBadgeEl) this.goBadgeEl.style.visibility = this._newBest ? 'visible' : 'hidden';
    this.goEl.style.display = 'flex';
  }

  hideGameOver() { if (this.goEl) this.goEl.style.display = 'none'; }

  // No reserved anchor anymore — the marker lives in the dark, empty lower-left
  // corner (off the living field), so the algorithm evolves freely everywhere
  // and nothing gets overwritten.
  definePin() { this.pin = null; }
  stampPin() { /* removed: no reserved patch */ }

  positionHotspot() {
    // retired: the game entry is the "Take a break" pill by the chat bar now.
    this.hot = null;
    if (this.hotEl) this.hotEl.style.display = 'none';
  }

  // pill slides up into the pill row from behind the chat bar as the mouse
  // approaches the send button; smoothed so it glides rather than jitters
  updateBreakPill() {
    const pill = this.breakPill; if (!pill) return;
    // paused is NOT busy — the pill is how you resume; everything else hides it
    const busy = (this.game && this.game !== 'paused') || this.flyState === 'out' || this.flyState === 'parked';
    this.setPillLabel(this.game === 'paused' ? 'Resume game' : 'Take a break');
    let p = 0;
    if (!busy && this.mouse && this.sendEl) {
      const r = this.sendEl.getBoundingClientRect();
      const d = Math.hypot(this.mouse.x - (r.left + r.width / 2), this.mouse.y - (r.top + r.height / 2));
      p = this.clamp(1 - (d - 40) / 110, 0, 1);
    }
    this._breakP = (this._breakP == null) ? p : this._breakP + (p - this._breakP) * 0.22;
    const e = this._breakP * this._breakP * (3 - 2 * this._breakP);
    pill.style.transform = 'translateY(' + ((1 - e) * 150).toFixed(1) + '%)';
    pill.style.pointerEvents = e > 0.6 ? 'auto' : 'none';
  }

  // swap the pill's visible text (both the base layer and the orange fill layer)
  setPillLabel(txt) {
    if (this._pillLabel === txt || !this.breakPill) return;
    this._pillLabel = txt;
    const star = '<span style="opacity:.9;font-size:11.5px;color:#ffb45e;">✸</span>';
    const fill = this.breakPill.querySelector('[data-pill-fill]');
    for (const n of [...this.breakPill.childNodes]) { if (n !== fill) n.remove(); }
    this.breakPill.insertAdjacentHTML('afterbegin', star + txt);
    if (fill) fill.innerHTML = '<span style="opacity:.9;font-size:11.5px;">✸</span>' + txt;
  }

  sizeBurst() {
    const c = this.burstCanvas; if (!c) return;
    const w = window.innerWidth, h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
    c.style.width = w + 'px'; c.style.height = h + 'px';
    this.burstCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.bw = w; this.bh = h;
  }

  // warmer/colder: tight + subtle. Invisible until you're nearly on it —
  // proximity tease — driven purely by mouse position, no autonomous motion.
  // A single barely-there ring that quietly tightens + brightens as you close in.
  drawHoverRings(ctx, warm) {
    const w = warm * warm;                     // tight falloff
    const cx = this.hot.x, cy = this.hot.y;
    ctx.strokeStyle = 'hsl(30,100%,62%)';
    ctx.lineWidth = 1;
    // primary ring: radius contracts 44 → 22 as you approach, opacity stays low
    ctx.globalAlpha = 0.045 + w * 0.16;
    const r = 44 - w * 22;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.stroke();
    // a second inner ring only once you're genuinely close
    if (w > 0.5) {
      ctx.globalAlpha = 0.13 * ((w - 0.5) / 0.5);
      ctx.beginPath(); ctx.arc(cx, cy, r - 9, 0, 6.2832); ctx.stroke();
    }
  }

  // ---- spark burst: thin motion-blurred streaks flying outward, hot core
  //      cooling to ember, flickering — additive. Plus a quick pop-flash. ----
  spawnBurst(x, y, opts) {
    opts = opts || {};
    if (!this.particles) this.particles = [];
    const P = this.particles, rnd = Math.random;
    const nSpark = opts.sparks != null ? opts.sparks : 250;
    const nStar = opts.stars != null ? opts.stars : 80;
    const spd = opts.speed != null ? opts.speed : 1;
    // layer 0 — fast bright streaks (radial blast, minimal gravity → not a firework)
    for (let i = 0; i < nSpark; i++) {
      const a = rnd() * 6.2832, sp = (12 + Math.pow(rnd(), 0.5) * 52) * spd;
      P.push({ t: 0, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, decay: 0.55 + rnd() * 0.85, w: 0.6 + rnd() * 1.6, len: 1.1 + rnd() * 1.7,
        flick: rnd() * 6.283, fspd: 0.03 + rnd() * 0.09, grav: 0.09 });
    }
    // layer 2 — pinpoint stars, very fast
    for (let i = 0; i < nStar; i++) {
      const a = rnd() * 6.2832, sp = (22 + rnd() * 62) * spd;
      P.push({ t: 2, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, decay: 0.9 + rnd() * 1.1, w: 0.4 + rnd() * 0.8, len: 1.5 + rnd() * 2.0, grav: 0.07 });
    }
    if (opts.bloom !== false) this.bloom = { x, y, life: 1 };
    if (opts.flash !== false) this.screenFlash = { x, y, life: 1 };
    if (opts.shock !== false) this.shocks = [ { x, y, r: 4, life: 1, delay: 0 }, { x, y, r: 4, life: 1, delay: 0.05 }, { x, y, r: 4, life: 1, delay: 0.12 } ];
    this._burstLast = this.now();
  }

  tickBurst(now) {
    const ctx = this.burstCtx; if (!ctx) return;
    const burst = (this.particles && this.particles.length) || this.bloom || this.screenFlash || (this.shocks && this.shocks.length);
    // hover ripples only when in range AND not mid/post-blast
    const blasting = this.flyState === 'out' || this.flyState === 'parked';
    let warm = 0;
    if (this.mouse && this.hot && !blasting) {
      const d = Math.hypot(this.mouse.x - this.hot.x, this.mouse.y - this.hot.y);
      warm = this.clamp(1 - d / 210, 0, 1);
    }
    const active = burst || warm > 0.002 || this.game;
    if (!active) { if (this._burstDirty) { ctx.clearRect(0, 0, this.bw, this.bh); this._burstDirty = false; } return; }
    this._burstDirty = true;
    let dt = (now - (this._burstLast || now)) / 1000; this._burstLast = now;
    if (dt > 0.05 || dt < 0) dt = 0.016;
    const f = dt * 60;
    ctx.clearRect(0, 0, this.bw, this.bh);
    // snake sits under the additive fx (drawn solid)
    if (this.game === 'play' || this.game === 'countdown') this.drawSnake(ctx, now);   // visible while counting in; gone on death/pause
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';

    // proximity ripple tease (skipped automatically during a blast)
    if (warm > 0.002) this.drawHoverRings(ctx, warm);

    // a few little "fuse" sparkles once you're right on the spot — a gentle trickle
    if (warm > 0.9 && !blasting && Math.random() < 0.3) {
      if (!this.particles) this.particles = [];
      const a = Math.random() * 6.2832, sp = 1 + Math.random() * 3;
      this.particles.push({ t: 0, x: this.hot.x, y: this.hot.y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - Math.random() * 1.2,
        life: 1, decay: 1.8 + Math.random() * 1.4, w: 0.35 + Math.random() * 0.5,
        len: 0.7 + Math.random() * 0.7, flick: Math.random() * 6.283, fspd: 0.05 + Math.random() * 0.08, grav: 0.05 });
    }

    // warm full-field flash
    if (this.screenFlash) {
      const s = this.screenFlash; s.life -= 2.4 * dt;
      if (s.life > 0) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, Math.max(this.bw, this.bh) * 1.1);
        g.addColorStop(0, 'rgba(255,172,82,' + (0.38 * s.life).toFixed(3) + ')');
        g.addColorStop(0.55, 'rgba(255,120,46,' + (0.17 * s.life).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,110,36,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, this.bw, this.bh);
        // gentle uniform warm wash across the whole field
        ctx.fillStyle = 'rgba(255,138,58,' + (0.06 * s.life).toFixed(3) + ')';
        ctx.fillRect(0, 0, this.bw, this.bh);
      } else this.screenFlash = null;
    }

    // core bloom
    if (this.bloom) {
      const b = this.bloom; b.life -= 1.5 * dt;
      if (b.life > 0) {
        const r = 30 + (1 - b.life) * 170;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
        g.addColorStop(0, 'rgba(255,246,220,' + (0.6 * b.life).toFixed(3) + ')');
        g.addColorStop(0.35, 'rgba(255,176,86,' + (0.4 * b.life).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(255,120,40,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 6.2832); ctx.fill();
      } else this.bloom = null;
    }

    // shockwave rings (staggered)
    if (this.shocks) {
      const sk = [];
      for (const s of this.shocks) {
        if (s.delay > 0) { s.delay -= dt; sk.push(s); continue; }
        s.r += 560 * dt; s.life -= 2.0 * dt;
        if (s.life > 0) {
          sk.push(s);
          ctx.globalAlpha = this.clamp(s.life * 0.55, 0, 1);
          ctx.lineWidth = 2.5 * s.life + 0.5;
          ctx.strokeStyle = 'hsl(32,100%,64%)';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.stroke();
        }
      }
      this.shocks = sk;
    }

    // particles
    const keep = [];
    for (const p of this.particles) {
      // spark (0) / star (2)
      const drag = p.t === 2 ? 0.965 : 0.95;
      p.vx *= Math.pow(drag, f); p.vy *= Math.pow(drag, f); p.vy += (p.grav || 0.28) * f;
      p.x += p.vx * f; p.y += p.vy * f; p.life -= p.decay * dt;
      if (p.life <= 0) continue; keep.push(p);
      const sp = Math.hypot(p.vx, p.vy);
      const trail = this.clamp(sp * p.len * 1.6, 2, 52);
      const inv = sp > 0.001 ? 1 / sp : 0;
      const tx = p.x - p.vx * inv * trail, ty = p.y - p.vy * inv * trail;
      const flick = p.fspd ? (0.55 + 0.45 * Math.sin(now * p.fspd + (p.flick || 0))) : 1;
      const alpha = this.clamp(p.life, 0, 1) * flick;
      const L = 46 + p.life * 44, H = 16 + p.life * 28;
      // wide outer glow — this is what washes the field orange
      ctx.globalAlpha = alpha * 0.13;
      ctx.strokeStyle = 'hsl(' + (H + 4).toFixed(0) + ',100%,54%)';
      ctx.lineWidth = p.w * 11 * (0.5 + p.life);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
      // inner glow
      ctx.globalAlpha = alpha * 0.42;
      ctx.strokeStyle = 'hsl(' + H.toFixed(0) + ',100%,60%)';
      ctx.lineWidth = p.w * 4.8 * (0.45 + p.life);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
      // bright core
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = 'hsl(' + H.toFixed(0) + ',100%,' + L.toFixed(0) + '%)';
      ctx.lineWidth = p.w * (0.4 + p.life * 0.9);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
      // hot head
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'hsl(' + (H + 16).toFixed(0) + ',100%,' + Math.min(96, L + 26).toFixed(0) + '%)';
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.4, p.w * 0.75 * (0.4 + p.life)), 0, 6.2832); ctx.fill();
    }
    this.particles = keep;
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  // ============================================================
  //  SNAKE × GAME OF LIFE  (shares the GoL grid; own tick)
  // ============================================================
  cellAt(x, y) {
    const c = this.clamp(Math.floor(x / this.CELL), 0, (this.cols || 1) - 1);
    const r = this.clamp(Math.floor(y / this.CELL), 0, (this.rows || 1) - 1);
    return { c, r };
  }

  spawnSnake() {
    if (!this.cols || !this.rows) return;
    // fixed launch: horizontally centered, two-thirds of the way down, heading right
    const c0 = this.clamp(Math.round(this.cols * 0.5), 6, this.cols - 2);
    const r0 = this.clamp(Math.round(this.rows * (2 / 3)), 3, this.rows - 4);
    this.snake = [];
    for (let i = 0; i < 5; i++) this.snake.push({ c: this.clamp(c0 - i, 0, this.cols - 1), r: r0 });
    this.dir = { dc: 1, dr: 0 };           // pointing right
    this.pendingDir = this.dir;
    this.score = 0;
    this.snakeInterval = this.cfg.snakeBase;
    this.snakeAcc = 0;
    this.best = +(localStorage.getItem('sl_snake_best') || 0);
    this.hideGameOver();
    this.startCountdown(false);              // count in before it moves
  }

  // ---- count-in before the snake moves (fresh start OR resume) ----
  startCountdown(resume) {
    this.game = 'countdown';
    this.snakeAcc = 0;
    if (this.golCanvas) this.golCanvas.style.opacity = '1';   // food reads clearly
    this.hideGameOver();
    this.updateHud();
    const steps = ['3', '2', '1', 'GO'];
    let i = 0;
    const run = () => {
      if (this.game !== 'countdown') return;               // paused / quit mid-count
      if (i >= steps.length) { this.beginPlay(); return; }
      const label = steps[i], isGo = label === 'GO';
      if (this.countWrap && this.countEl) {
        this.countWrap.style.display = 'flex';
        this.countEl.textContent = label;
        this.countEl.style.color = isGo ? '#7ff0c0' : '#f4f7fd';
        this.countEl.style.animation = 'none'; void this.countEl.offsetWidth;
        this.countEl.style.animation = 'countPop .58s cubic-bezier(.2,.9,.3,1)';
      }
      i++;
      this._countTimer = setTimeout(run, isGo ? 480 : 640);
    };
    clearTimeout(this._countTimer);
    run();
  }

  beginPlay() {
    if (this.countWrap) this.countWrap.style.display = 'none';
    this.game = 'play';
    this.snakeAcc = 0;
    this._playAt = this.now();          // arrow fades out from here
    this.updateHud();
  }

  // ESC pauses: snake freezes + hides, the page comes back, state is kept.
  // clicking the marker again resumes with a fresh count-in — you continue.
  pauseGame() {
    if (this.game !== 'play' && this.game !== 'countdown') return;
    clearTimeout(this._countTimer);
    this.game = 'paused';
    if (this.countWrap) this.countWrap.style.display = 'none';
    if (this.golCanvas) this.golCanvas.style.opacity = String(this.cfg.golOpacity);
    this.updateHud();
    this.fireFly((window.innerWidth || 1200) / 2, (window.innerHeight || 800) / 2);   // bring the UI back
  }

  // snake runs on its OWN clock, faster as it grows (GoL keeps its own cadence)
  tickSnake(ld) {
    if (this.game !== 'play') return;
    this.snakeAcc = (this.snakeAcc || 0) + ld;
    let steps = 0;
    while (this.snakeAcc >= this.snakeInterval && steps < 4) {
      this.snakeAcc -= this.snakeInterval;
      this.stepSnake();
      steps++;
      if (this.game !== 'play') break;
    }
  }

  // rendered visibility of a GoL cell right now (accounts for the fade tween),
  // so a cell that's only ~10% visible is still edible.
  cellVisible(idx) {
    if (!this.grid) return 0;
    const p = this._phase == null ? 1 : this._phase;
    const e = p * p * (3 - 2 * p);
    const cur = this.grid[idx] ? 1 : 0, prev = this.prevGrid[idx] ? 1 : 0;
    return prev + (cur - prev) * e;
  }

  stepSnake() {
    const d = this.pendingDir; this.dir = d;
    const nc = (this.snake[0].c + d.dc + this.cols) % this.cols;
    const nr = (this.snake[0].r + d.dr + this.rows) % this.rows;
    const idx = nr * this.cols + nc;
    const ate = this.cellVisible(idx) > 0.1;   // eat anything at least faintly there
    const body = ate ? this.snake : this.snake.slice(0, -1);   // tail vacates unless eating
    if (body.some((s) => s.c === nc && s.r === nr)) { this.snakeDie(); return; }
    this.snake.unshift({ c: nc, r: nr });
    if (ate) {
      if (this.grid) this.grid[idx] = 0;
      if (this.prevGrid) this.prevGrid[idx] = 0;   // fully gone → alters next GoL gen
      this.score++;
      this.snakeInterval = Math.max(this.cfg.snakeMin, this.cfg.snakeBase - this.score * this.cfg.snakeRamp);
      const px = (nc + 0.5) * this.CELL, py = (nr + 0.5) * this.CELL;
      this.spawnBurst(px, py, { sparks: this.cfg.eatParticles, stars: Math.round(this.cfg.eatParticles * 0.25), speed: this.cfg.eatPower, flash: false, shock: false, bloom: false });
      this.paint();
      this.updateHud();
    } else {
      this.snake.pop();
    }
  }

  snakeDie() {
    this.game = 'dead';
    const h = this.snake[0];
    const px = (h.c + 0.5) * this.CELL, py = (h.r + 0.5) * this.CELL;
    this.spawnBurst(px, py);                 // full detonation
    this._newBest = this.score > (this.best || 0);
    if (this._newBest) { this.best = this.score; try { localStorage.setItem('sl_snake_best', String(this.best)); } catch (e) {} }
    this.updateHud();
    this.showGameOver();
  }

  quitGame() {
    if (!this.game) return;
    this.game = null;
    this.snake = [];
    clearTimeout(this._respawnTimer); clearTimeout(this._snakeTimer); clearTimeout(this._countTimer);
    if (this.countWrap) this.countWrap.style.display = 'none';
    this.hideGameOver();
    if (this.golCanvas) this.golCanvas.style.opacity = String(this.cfg.golOpacity);
    this.updateHud();
    this.paint();
    this.fireFly((window.innerWidth || 1200) / 2, (window.innerHeight || 800) / 2);   // bring the UI back
  }

  gameKey(e) {
    if (!this.game) return;
    const k = (e.key || '').toLowerCase();
    const dirs = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] };
    if (dirs[k]) {
      e.preventDefault();
      if (this.game !== 'play') return;   // no steering during the count-in — the start course is fixed
      const dc = dirs[k][0], dr = dirs[k][1];
      if (!(dc === -this.dir.dc && dr === -this.dir.dr)) this.pendingDir = { dc, dr };
      return;
    }
    if (k === 'escape') { e.preventDefault(); if (this.game === 'dead') this.quitGame(); else this.pauseGame(); return; }
    if (k === ' ' || k === 'enter') { if (this.game === 'dead') { e.preventDefault(); clearTimeout(this._respawnTimer); this.spawnSnake(); } }
  }

  rr(ctx, x, y, w, h, r) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  drawSnake(ctx, now) {
    if (!this.snake || !this.snake.length) return;
    const S = this.CELL, gap = this.cfg.snakeGap, inset = gap / 2, size = S - gap;   // gap px smaller than the cell
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = '#ffffff';
    for (let i = this.snake.length - 1; i >= 0; i--) {
      const s = this.snake[i];
      ctx.fillRect(s.c * S + inset, s.r * S + inset, size, size);
    }
    ctx.globalAlpha = 1;
    // count-in "heads up": an arrow punched OUT of the head itself (true cutout,
    // no fill/glow) pointing the fixed launch direction — fades out on takeoff.
    if (this.game === 'countdown') {
      this.cutSnakeArrow(ctx, 0.85 + 0.15 * Math.sin((now || 0) * 0.008));
    } else if (this.game === 'play' && this._playAt) {
      const t = ((now || this.now()) - this._playAt) / 280;
      if (t < 1) this.cutSnakeArrow(ctx, 1 - t);
    }
  }

  // cut a proper arrow-icon shape straight out of the head cell (a real glyph,
  // not hand-plotted triangle points) — reveals whatever's behind it, oriented
  // to the launch direction.
  cutSnakeArrow(ctx, alpha) {
    if (!this.snake || !this.snake.length || alpha <= 0.01) return;
    if (!this._arrowPath) this._arrowPath = new Path2D('M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z');
    const S = this.CELL, h = this.snake[0];
    const cx = h.c * S + S / 2, cy = h.r * S + S / 2;
    const d = this.dir || { dc: 0, dr: -1 };
    const angle = Math.atan2(d.dr, d.dc) + Math.PI / 2;   // glyph points up by default
    const scale = (S * 0.58) / 24;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = this.clamp(alpha, 0, 1);
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    ctx.translate(-12, -12);
    ctx.fill(this._arrowPath);
    ctx.restore();
  }

  updateHud() {
    const h = this.hudEl; if (!h) return;
    // paused reads as "back to the normal site" — no HUD, no hint of a game
    if (!this.game || this.game === 'dead' || this.game === 'paused') { h.style.opacity = '0'; return; }
    h.style.opacity = '1';
    const best = Math.max(this.best || 0, this.score || 0);
    h.textContent = 'SCORE ' + this.score + '   ·   BEST ' + best + '   ·   esc to return to work';
  }

  // ---- Conway's Game of Life background ----
  initLife(canvas) {
    if (!canvas) return;
    this.golCanvas = canvas;
    this.golCtx = canvas.getContext('2d');
    this.CELL = 30;
    this.sizeLife();
    this.seedLife();
    this.computeColors();
    this._fadeMs = Math.max(40, this.cfg.golFade);
    this._waitMs = Math.max(0, this.cfg.golWait);
    this._phase = 0;
    this._waitAcc = 0;
    this._golLast = this.now();
    this.golCanvas.style.opacity = String(this.cfg.golOpacity);
    this.paint();
    this._golTimer = setInterval(() => this.animLife(), 33);
  }

  animLife() {
    const now = this.now();
    let dt = now - this._golLast; this._golLast = now;
    if (dt > 500) dt = 33;
    if (!this.grid) return;
    if (this._phase < 1) {
      this._phase = Math.min(1, this._phase + dt / this._fadeMs);
    } else {
      this._waitAcc += dt;
      if (this._waitAcc >= this._waitMs) { this._waitAcc = 0; this.advanceGen(); }
    }
    this.paint();
  }

  advanceGen() {
    this.prevGrid.set(this.grid);
    this.stepLife();
    this.stampPin();
    // keep the field alive in ALL modes: if it thins out, seed a few more in.
    // in-game → moving gliders fed away from the snake; idle OR paused → a mix
    // of patterns so the background never drifts empty. (dead/countdown left
    // alone so the board you died on stays exactly as it was.)
    const alive = this._alive || 0;
    if (this.game === 'play') {
      if (alive < 26) this.spawnGliders(3);
    } else if (!this.game || this.game === 'paused') {
      const lowMark = Math.max(24, Math.round(this.cols * this.rows * 0.05));
      if (alive < lowMark) this.spawnFillers(this.clamp(Math.round((lowMark - alive) / 8), 3, 10));
      // steady drip regardless of count: still lifes keep the population high
      // while nothing moves, so periodically stir in fresh moving patterns.
      else if (this._gen % 36 === 0) this.spawnFillers(2);
    }
    this.computeColors();
    this._phase = 0;
  }

  // stamp a few gliders at random spots clear of the snake (in-game food top-up)
  spawnGliders(n) {
    if (!this.grid) return;
    const C = this.cols, R = this.rows, P = this.patterns().glider;
    const head = this.snake && this.snake[0];
    let placed = 0, tries = 0;
    while (placed < n && tries < 50) {
      tries++;
      const fx = Math.random() < 0.5, fy = Math.random() < 0.5;
      const ox = 2 + ((Math.random() * (C - 6)) | 0);
      const oy = 3 + ((Math.random() * (R - 9)) | 0);
      if (head && Math.abs(ox - head.c) + Math.abs(oy - head.r) < 11) continue;
      let bad = false;
      for (const [px, py] of P) {
        const x = ox + (fx ? -px : px), y = oy + (fy ? -py : py);
        if (!this.inField(x, y)) { bad = true; break; }
        if (this.snake && this.snake.some((s) => s.c === x && s.r === y)) { bad = true; break; }
      }
      if (bad) continue;
      this.stamp(P, ox, oy, fx, fy);
      placed++;
    }
  }

  // idle-background refill: scatter a mix of fresh patterns onto the current
  // board (additive — never clears), same soup as the seed.
  spawnFillers(n) {
    if (!this.grid) return;
    const C = this.cols, R = this.rows;
    const names = ['glider', 'blinker', 'toad', 'beacon', 'pulsar', 'penta', 'glider', 'blinker', 'toad'];
    const pats = this.patterns();
    let placed = 0, tries = 0;
    while (placed < n && tries < n * 16) {
      tries++;
      const P = pats[names[(Math.random() * names.length) | 0]];
      const fx = Math.random() < 0.5, fy = Math.random() < 0.5;
      const ox = 1 + ((Math.random() * (C - 2)) | 0);
      const oy = 2 + ((Math.random() * (R - 6)) | 0);
      let bad = false;
      for (const [px, py] of P) { const x = ox + (fx ? -px : px), y = oy + (fy ? -py : py); if (!this.inField(x, y)) { bad = true; break; } }
      if (bad) continue;
      this.stamp(P, ox, oy, fx, fy);
      placed++;
    }
  }

  sizeLife() {
    const c = this.golCanvas; if (!c) return;
    const w = window.innerWidth, h = window.innerHeight;
    this.vw = w; this.vh = h;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.ceil(w * dpr); c.height = Math.ceil(h * dpr);
    c.style.width = w + 'px'; c.style.height = h + 'px';
    this.golCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cols = Math.ceil(w / this.CELL);
    this.rows = Math.ceil(h / this.CELL);
    if (!this.grid || this.grid.length !== this.cols * this.rows) {
      const N = this.cols * this.rows;
      this.grid = new Uint8Array(N);
      this.prevGrid = new Uint8Array(N);
      this.hueBuf = new Float32Array(N).fill(240);
      this.lightBuf = new Float32Array(N).fill(64);
    }
  }

  inField(x, y) {
    return x >= 1 && x <= this.cols - 2 && y >= 2 && y <= this.rows - 4;
  }

  patterns() {
    return {
      blinker:[[0,0],[1,0],[2,0]],
      glider: [[1,0],[2,1],[0,2],[1,2],[2,2]],
      toad:   [[1,0],[2,0],[3,0],[0,1],[1,1],[2,1]],
      beacon: [[0,0],[1,0],[0,1],[3,2],[2,3],[3,3]],
      pulsar: [[2,0],[3,0],[4,0],[8,0],[9,0],[10,0],[0,2],[5,2],[7,2],[12,2],[0,3],[5,3],[7,3],[12,3],[0,4],[5,4],[7,4],[12,4],[2,5],[3,5],[4,5],[8,5],[9,5],[10,5],[2,7],[3,7],[4,7],[8,7],[9,7],[10,7],[0,8],[5,8],[7,8],[12,8],[0,9],[5,9],[7,9],[12,9],[0,10],[5,10],[7,10],[12,10],[2,12],[3,12],[4,12],[8,12],[9,12],[10,12]],
      penta:  [[0,1],[1,1],[2,0],[2,2],[3,1],[4,1],[5,1],[6,1],[7,0],[7,2],[8,1],[9,1]],
      gun:    [[1,5],[1,6],[2,5],[2,6],[11,5],[11,6],[11,7],[12,4],[12,8],[13,3],[13,9],[14,3],[14,9],[15,6],[16,4],[16,8],[17,5],[17,6],[17,7],[18,6],[21,3],[21,4],[21,5],[22,3],[22,4],[22,5],[23,2],[23,6],[25,1],[25,2],[25,6],[25,7],[35,3],[35,4],[36,3],[36,4]],
    };
  }

  stamp(cells, ox, oy, fx, fy) {
    const C = this.cols, R = this.rows, g = this.grid;
    for (const [px, py] of cells) {
      const x = ox + (fx ? -px : px), y = oy + (fy ? -py : py);
      if (x >= 0 && x < C && y >= 0 && y < R) g[y * C + x] = 1;
    }
  }

  fits(cells, ox, oy, fx, fy) {
    const C = this.cols, R = this.rows;
    for (const [px, py] of cells) {
      const x = ox + (fx ? -px : px), y = oy + (fy ? -py : py);
      if (x < 0 || x >= C || y < 0 || y >= R) return false;
    }
    return true;
  }

  dims(cells) { let mx = 0, my = 0; for (const [x, y] of cells) { if (x > mx) mx = x; if (y > my) my = y; } return { w: mx + 1, h: my + 1 }; }

  place(name, anchor, mx = 1, my = mx) {
    const P = this.patterns()[name]; const { w, h } = this.dims(P); const C = this.cols, R = this.rows;
    const ox = { l: mx, c: Math.floor((C - w) / 2), r: C - mx - w }[anchor[0]];
    const oy = { t: my, c: Math.floor((R - h) / 2), b: R - my - h }[anchor[1]];
    if (this.fits(P, ox, oy, false, false)) this.stamp(P, ox, oy, false, false);
  }

  seedLife() {
    this.grid.fill(0);
    const C = this.cols, R = this.rows;
    // RANDOM SOUP — scatter an assortment of patterns at random spots + flips
    // (common little ones weighted heavier so it doesn't turn into all pulsars).
    const names = ['glider', 'blinker', 'toad', 'beacon', 'pulsar', 'penta', 'glider', 'blinker', 'toad'];
    const pats = this.patterns();
    const target = this.clamp(Math.round((C * R) / 55), 16, 60);
    let placed = 0, tries = 0;
    while (placed < target && tries < target * 14) {
      tries++;
      const P = pats[names[(Math.random() * names.length) | 0]];
      const fx = Math.random() < 0.5, fy = Math.random() < 0.5;
      const ox = 1 + ((Math.random() * (C - 2)) | 0);
      const oy = 2 + ((Math.random() * (R - 6)) | 0);
      if (!this.fits(P, ox, oy, fx, fy)) continue;
      let bad = false;
      for (const [px, py] of P) { const x = ox + (fx ? -px : px), y = oy + (fy ? -py : py); if (!this.inField(x, y)) { bad = true; break; } }
      if (bad) continue;
      this.stamp(P, ox, oy, fx, fy);
      placed++;
    }
    // …plus a light dusting of random cells for a little extra churn
    for (let y = 2; y <= R - 4; y++) for (let x = 1; x <= C - 2; x++) {
      if (Math.random() < 0.07) this.grid[y * C + x] = 1;
    }
    this._gen = 0;
    this.stampPin();
  }

  stepLife() {
    if (!this.grid) return;
    const g = this.grid, C = this.cols, R = this.rows, n = new Uint8Array(C * R);
    let alive = 0;
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) {
      let s = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < C && ny >= 0 && ny < R) s += g[ny * C + nx];
      }
      const cur = g[y * C + x];
      let nv = (cur && (s === 2 || s === 3)) || (!cur && s === 3) ? 1 : 0;
      if (nv && !this.inField(x, y)) nv = 0;
      n[y * C + x] = nv; alive += nv;
    }
    this.grid = n;
    this._alive = alive;
    this._gen = (this._gen || 0) + 1;
    const crowded = alive > (C * R) * 0.4;
    this._stale = (alive < 8) ? (this._stale || 0) + 1 : 0;
    // never yank the board out from under a snake game (playing OR game-over) —
    // whatever the field is when you die/return, that's what stays. only reseed
    // once you've fully returned to work (game === null).
    if (!this.game && (this._stale > 2 || crowded || this._gen > 460)) { this.seedLife(); this._stale = 0; }
  }

  computeColors() {
    const C = this.cols, R = this.rows, g = this.grid, N = C * R;
    const label = this.labelBuf && this.labelBuf.length === N ? this.labelBuf.fill(0) : (this.labelBuf = new Int32Array(N));
    const sizes = [0];
    const stack = this.stackBuf || (this.stackBuf = new Int32Array(N));
    let next = 1;
    for (let i = 0; i < N; i++) {
      if (!g[i] || label[i]) continue;
      let sp = 0, count = 0; stack[sp++] = i; label[i] = next;
      while (sp) {
        const idx = stack[--sp]; count++;
        const x = idx % C, y = (idx / C) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= C || ny < 0 || ny >= R) continue;
          const ni = ny * C + nx;
          if (g[ni] && !label[ni]) { label[ni] = next; stack[sp++] = ni; }
        }
      }
      sizes[next++] = count;
    }
    for (let i = 0; i < N; i++) {
      if (!g[i]) continue;
      const f = Math.min(1, (sizes[label[i]] - 1) / 9);
      this.hueBuf[i] = 222 + f * 92;
      this.lightBuf[i] = 64 + f * 8;
    }
  }

  paint() {
    const ctx = this.golCtx; if (!ctx) return;
    const C = this.cols, R = this.rows, S = this.CELL, N = C * R;
    const g = this.grid, pg = this.prevGrid;
    const p = this._phase, e = p * p * (3 - 2 * p);
    ctx.clearRect(0, 0, this.vw || window.innerWidth, this.vh || window.innerHeight);
    const boost = (this.game === 'play' || this.game === 'countdown') ? 3.2 : 1;   // bright food only while actually playing
    for (let i = 0; i < N; i++) {
      const cur = g[i] ? 1 : 0, prev = pg[i] ? 1 : 0;
      if (!cur && !prev) continue;
      const av = prev + (cur - prev) * e;
      if (av < 0.012) continue;
      const x = i % C, y = (i / C) | 0;
      ctx.fillStyle = 'hsla(' + this.hueBuf[i] + ',80%,' + this.lightBuf[i] + '%,' + (av * 0.2 * boost).toFixed(3) + ')';
      ctx.fillRect(x * S + 7, y * S + 7, S - 14, S - 14);
    }
  }

  onResize = () => {
    if (this.golCanvas) { this.sizeLife(); this.definePin(); this.stampPin(); this.paint(); }
    if (this.burstCanvas) this.sizeBurst();
    this.positionHotspot();
  };
}