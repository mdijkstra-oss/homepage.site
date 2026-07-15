import type { PointerEvent } from 'react';

function paint(el: HTMLElement, xPct: number, yPct: number): void {
  el.style.backgroundImage =
    `radial-gradient(260px circle at ${xPct.toFixed(1)}% ${yPct.toFixed(1)}%, rgba(255,255,255,0.13), transparent 72%), ` +
    'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05))';
}

// Mouse-follow highlight: `fillEl` is painted based on the pointer's position
// relative to the event's own target, so a card can paint a separate overlay
// while a self-contained row paints directly onto itself.
export function shineOnMove(fillEl: HTMLElement, e: PointerEvent<HTMLElement>): void {
  const r = e.currentTarget.getBoundingClientRect();
  paint(fillEl, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
}

export function shineOnLeave(fillEl: HTMLElement): void {
  fillEl.style.backgroundImage = 'none';
}
