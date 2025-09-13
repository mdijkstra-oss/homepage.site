// Todo: Add tests for more scenarios
import { serialize, deserialize, CommandSequence, commandStringToCommandSequence } from '@/domain/command/parse/parse'
import { shortB64Decode, shortB64Encode, trimChars } from '@/utils/string'

const defaultRoutes = {
  '/': ['fetch', 'fetch | uppercase'],
}

export function mapCommandSequencesToRoute(list: CommandSequence[]): string {
  const concatenated = list.map(serialize).join('\n')
  return shortB64Encode(concatenated)
}

export function mapRouteToCommandSequences(route: string): CommandSequence[] {
  const defaultRoute = resolveDefaultRoute(route)

  if (defaultRoute) {
    return defaultRoute.map(commandStringToCommandSequence)
  }

  try {
    const entries = shortB64Decode(trimChars(route, ['/'])).split('\n')
    return entries.map(deserialize)
  } catch (error) {
    // Ignoring invalid urls
    console.error(error)
  }

  return []
}

function resolveDefaultRoute(path: string): string[] | undefined {
  const sanitized = trimChars(path, ['/']).toLowerCase()
  const defaults = defaultRoutes[`/${sanitized}`]
  if (defaults) return ['clear', ...defaults]
}
