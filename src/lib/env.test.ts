import { describe, expect, it } from 'vitest';
import { requireAgentUrl } from './env';

describe('requireAgentUrl', () => {
  it.each([
    { name: 'rejects an unset value', env: {} },
    { name: 'rejects an undefined value', env: { VITE_AGENT_URL: undefined } },
    { name: 'rejects an empty value', env: { VITE_AGENT_URL: '' } },
    { name: 'rejects a whitespace-only value', env: { VITE_AGENT_URL: '  \t ' } },
    { name: 'rejects a path with no scheme or host', env: { VITE_AGENT_URL: '/cv' } },
    { name: 'rejects a host with no scheme', env: { VITE_AGENT_URL: 'localhost:8081/cv' } },
    { name: 'rejects a non-http scheme', env: { VITE_AGENT_URL: 'ftp://example.com/cv' } },
  ])('$name', ({ env }) => {
    expect(() => requireAgentUrl(env)).toThrow(/VITE_AGENT_URL/);
    expect(() => requireAgentUrl(env)).toThrow(/\.env\.example/);
  });

  it.each([
    { url: 'http://localhost:8081/cv' },
    { url: 'https://backend.example.com/cv' },
    { url: 'https://backend.example.com/prefix/cv' },
  ])('returns $url unchanged', ({ url }) => {
    expect(requireAgentUrl({ VITE_AGENT_URL: url })).toBe(url);
  });
});
