import { typedEntries } from '@/utils/set'

export type FullAction<T> = {
  type: 'CREATE'
  payload: T
}

export type PartialAction<T> = {
  type: 'MERGE' | 'APPEND'
  payload: Partial<T>
}

export type EntityAction<T> = FullAction<T> | PartialAction<T>

export function entityReducer<T>(
  action: EntityAction<T>,
  current?: T,
  readonlyKeys?: readonly (keyof T)[],
): T | undefined {
  switch (action.type) {
    case 'CREATE':
      return { ...action.payload }
    case 'MERGE':
      return current ? { ...current, ...action.payload } : undefined
    case 'APPEND':
      if (!current) return undefined

      const result = { ...current }

      typedEntries(action.payload).forEach(([key, newValue]) => {
        const currentValue = current[key]

        if ((writeable(key, readonlyKeys) && isAppendable(currentValue)) || currentValue === undefined) {
          try {
            result[key] = appendValues(currentValue, newValue)
          } catch (error) {
            console.warn(`Append failed for key ${String(key)}:`, error)
          }
        }
      })

      return result
    default:
      return current
  }
}

function isAppendable(value: unknown): value is string | unknown[] {
  return typeof value === 'string' || Array.isArray(value)
}

function writeable<T>(key: keyof T, readonlyKeys?: readonly (keyof T)[]) {
  return readonlyKeys?.indexOf(key as keyof T) === -1
}

function appendValues<T>(current: T | undefined, newValue: T): T {
  if (current === undefined) {
    return newValue
  }

  if (typeof current === 'string' && typeof newValue === 'string') {
    return (current + newValue) as T
  }

  if (Array.isArray(current) && Array.isArray(newValue)) {
    return [...current, ...newValue] as T
  }

  throw new Error(`Cannot append ${typeof newValue} to ${typeof current}`)
}
