import type { PointerEvent } from 'react';

export function clearPointerSpotlight(element: HTMLElement): void {
  element.style.backgroundImage = 'none';
}

export function paintPointerSpotlight(element: HTMLElement, event: PointerEvent<HTMLElement>): void {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;
  element.style.backgroundImage =
    `radial-gradient(260px circle at ${x.toFixed(1)}% ${y.toFixed(1)}%, rgba(255,255,255,0.13), transparent 72%), ` +
    'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05))';
}
