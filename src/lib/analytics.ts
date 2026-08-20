import posthog from 'posthog-js';

// A project token belongs to one PostHog region, so a token issued for the US
// cloud never authenticates against this host.
const HOST = 'https://eu.i.posthog.com';
const DEFAULTS = '2026-05-30';

let started = false;

export function startAnalytics(token: string | undefined): void {
  const key = token?.trim() ?? '';
  if (!key) return;
  posthog.init(key, { api_host: HOST, defaults: DEFAULTS, enable_heatmaps: true });
  started = true;
}

export function capture(event: string, properties: Record<string, unknown>): void {
  if (!started) return;
  posthog.capture(event, properties);
}
