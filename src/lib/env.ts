const AGENT_URL_KEY = 'VITE_AGENT_URL';

export function requireAgentUrl(env: Record<string, string | undefined>): string {
  const url = env[AGENT_URL_KEY]?.trim() ?? '';
  if (!url) throw agentUrlError('is not set');
  if (!isAbsoluteHttpUrl(url)) throw agentUrlError(`is not an absolute http or https URL: ${url}`);
  return url;
}

function agentUrlError(problem: string): Error {
  return new Error(`${AGENT_URL_KEY} ${problem}. Copy .env.example to .env.local, or set the repository variable.`);
}

function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}
