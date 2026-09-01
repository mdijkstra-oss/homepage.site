// Better Stack's browser tag: front-end errors, web vitals, page views and
// session replay. The token is the application's public js_tag_token, so it is
// safe in a bundle, and an absent one leaves the page untouched — which is what
// a local build without the variable gets.
//
// Loaded here rather than from index.html so that a missing token is a no-op
// rather than an unreplaced placeholder in the served HTML. The cost is that an
// error thrown before this runs is not captured.

const SRC = 'https://betterstack.net/b.js';

interface BetterStackQueue {
  (...args: unknown[]): void;
  q?: unknown[][];
  l?: number;
}

declare global {
  interface Window {
    betterstack?: BetterStackQueue;
  }
}

export function startMonitoring(token: string | undefined): void {
  const key = token?.trim() ?? '';
  if (!key || window.betterstack) return;

  // The queue stands in for the real client until the script arrives, so calls
  // made in the meantime are replayed rather than lost.
  const queue: BetterStackQueue = (...args: unknown[]) => {
    queue.q = queue.q ?? [];
    queue.q.push(args);
  };
  queue.l = Date.now();
  window.betterstack = queue;

  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `${SRC}?t=${encodeURIComponent(key)}`;
  document.head.appendChild(script);

  window.betterstack('init', { environment: 'production' });
}
