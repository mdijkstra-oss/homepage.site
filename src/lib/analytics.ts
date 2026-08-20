import posthog from 'posthog-js';

// A project token belongs to one PostHog region, so a token issued for the US
// cloud never authenticates against this host.
const HOST = 'https://eu.i.posthog.com';
const DEFAULTS = '2026-05-30';

let started = false;

export function startAnalytics(token: string | undefined): void {
  const key = token?.trim() ?? '';
  if (!key) return;
  // In-memory persistence stores nothing on the visitor's device, so the site
  // needs no ePrivacy consent prompt. The cost is that a returning visitor is
  // indistinguishable from a new one.
  posthog.init(key, { api_host: HOST, defaults: DEFAULTS, enable_heatmaps: true, persistence: 'memory' });
  started = true;
}

export function capture(event: string, properties: Record<string, unknown>): void {
  if (!started) return;
  posthog.capture(event, properties);
}
