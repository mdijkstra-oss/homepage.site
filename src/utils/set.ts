export function typedEntries<T, K extends keyof T>(obj: T) {
  return Object.entries(obj) as [K, T[K]][]
}

export function wrapArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

export function setValueAtPath<T>(obj: object, path: PropertyKey, value: T): void {
  const keys = String(path).split('.')
  const lastKey = keys.pop()
  if (!lastKey) return

  const target = keys.reduce((acc, key) => {
    if (!(key in acc)) {
      acc[key] = {}
    }
    return acc[key]
  }, obj)

  target[lastKey] = value
}

export function getValueAtPath<T = unknown>(obj: object, path: PropertyKey): T | undefined {
  return String(path)
    .split('.')
    .reduce((acc, key) => acc?.[key], obj) as T | undefined
}
