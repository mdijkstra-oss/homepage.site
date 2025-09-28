export function typedEntries<T, K extends keyof T>(obj: T) {
  return Object.entries(obj) as [K, T[K]][]
}

export function wrapArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}
