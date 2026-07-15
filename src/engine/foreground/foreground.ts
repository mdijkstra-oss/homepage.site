import { clamp } from '../../lib/clamp';
import { smoothstep } from '../../lib/easing';
import {
  computeEntryFrame,
  computeEntryProgress,
  computeFlyOffset,
  computeFlyVector,
  type EntryFrame,
  type FlyVector,
  type ForegroundConfig,
} from './motion';

interface ForegroundItem {
  el: HTMLElement;
  chrome: boolean;
  dir: 1 | -1;
  entryStart: number | null;
  entryP: number;
  fly: FlyVector | null;
  seed: { x: number; r: number };
}

export interface ForegroundHandle {
  tick: (now: number) => void;
  addBubble: (el: HTMLElement | null) => void;
  removeBubble: (el: HTMLElement | null) => void;
  fireFly: (origin: { x: number; y: number }, preDelay?: number) => boolean;
  toggleFly: () => void;
}

const REST_FRAME: EntryFrame = { x: 0, y: 0, scale: 1, blur: 0, brightness: 1, rotX: 0, rotZ: 0, opacity: 1 };

function makeItem(el: HTMLElement, chrome: boolean, now: number): ForegroundItem {
  el.style.willChange = 'transform, opacity, filter';
  if (!chrome) el.style.opacity = '0';
  const rect = el.getBoundingClientRect();
  const dir: 1 | -1 = rect.left + rect.width / 2 >= (window.innerWidth || 1200) / 2 ? 1 : -1;
  return {
    el, chrome, dir,
    entryStart: chrome ? now - 1e6 : null,
    entryP: 0,
    fly: null,
    seed: { x: Math.random() * 2 - 1, r: Math.random() * 2 - 1 },
  };
}

function applyFrame(el: HTMLElement, frame: EntryFrame): void {
  el.style.opacity = String(frame.opacity);
  el.style.transform =
    `perspective(1200px) translate(${frame.x.toFixed(1)}px,${frame.y.toFixed(1)}px) ` +
    `rotateX(${frame.rotX.toFixed(2)}deg) rotate(${frame.rotZ.toFixed(2)}deg) scale(${frame.scale.toFixed(3)})`;
  el.style.filter = frame.blur > 0.05 || frame.brightness < 0.995
    ? `blur(${frame.blur.toFixed(1)}px) brightness(${frame.brightness.toFixed(3)})`
    : 'none';
}

export function createForeground(root: HTMLElement, cfg: ForegroundConfig): ForegroundHandle {
  const flyDurationMs = Math.max(300, cfg.flyDurationMs);
  const startNow = performance.now();
  let items: ForegroundItem[] = [
    ...[...root.querySelectorAll<HTMLElement>('[data-bubble]')].map((el) => makeItem(el, false, startNow)),
    ...[...root.querySelectorAll<HTMLElement>('[data-chrome]')].map((el) => makeItem(el, true, startNow)),
  ];

  let flyState: 'out' | 'in' | 'parked' | null = null;
  let flyStart = 0;
  let flyP = 0;
  let lastTrigAt = -1e9;
  let stagSlot = 0;

  function addBubble(el: HTMLElement | null): void {
    if (!el || items.some((it) => it.el === el)) return;
    const item = makeItem(el, false, performance.now());
    item.entryStart = performance.now();
    items.push(item);
  }

  function removeBubble(el: HTMLElement | null): void {
    items = items.filter((it) => it.el !== el);
  }

  function computeFly(origin: { x: number; y: number }): void {
    const viewport = { w: window.innerWidth || 1200, h: window.innerHeight || 800 };
    for (const it of items) {
      const r = it.el.getBoundingClientRect();
      it.fly = computeFlyVector({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, origin, it.seed, viewport);
    }
  }

  function fireFly(origin: { x: number; y: number }, preDelay = 0): boolean {
    const goingOut = !(flyState === 'out' || flyState === 'parked');
    if (goingOut) computeFly(origin);
    flyStart = performance.now() + (goingOut ? preDelay : 0);
    flyState = goingOut ? 'out' : 'in';
    return goingOut;
  }

  function toggleFly(): void {
    fireFly({ x: (window.innerWidth || 1200) / 2, y: (window.innerHeight || 800) / 2 });
  }

  function tick(now: number): void {
    const vh = window.innerHeight || 800;
    if (flyState === 'out' || flyState === 'in') {
      const t = clamp((now - flyStart) / flyDurationMs, 0, 1);
      const e = smoothstep(t);
      flyP = flyState === 'out' ? e : 1 - e;
      if (t >= 1) flyState = flyP > 0.5 ? 'parked' : null;
    }

    const startLine = vh * cfg.revealViewportRatio;
    for (const it of items) {
      let entry = REST_FRAME;
      if (!it.chrome) {
        if (it.entryStart == null) {
          const top = it.el.getBoundingClientRect().top;
          if (top < startLine) {
            stagSlot = now - lastTrigAt < 300 ? stagSlot + 1 : 0;
            lastTrigAt = now;
            it.entryStart = now + stagSlot * 120;
          } else {
            it.el.style.opacity = '0';
            continue;
          }
        }
        const clockP = clamp((now - it.entryStart) / Math.max(60, cfg.revealDurationMs), 0, 1);
        const topNow = it.el.getBoundingClientRect().top;
        const posP = clamp((startLine - topNow) / Math.max(1, startLine - vh * 0.3), 0, 1);
        it.entryP = computeEntryProgress(clockP, posP, it.entryP);
        entry = computeEntryFrame(it.entryP, cfg, it.dir);
      }
      applyFrame(it.el, flyP > 0 && it.fly ? computeFlyOffset(flyP, it.fly, entry) : entry);
    }
  }

  return { tick, addBubble, removeBubble, fireFly, toggleFly };
}
