import { getValueAtPath, setValueAtPath, typedEntries, wrapArray } from '@/utils/set'
import { Identifiable } from '@/utils/types'

export enum EntryAction {
  CREATE = 'CREATE',
  MERGE = 'MERGE',
  APPEND = 'APPEND',
}

export type FullAction<T extends object> = {
  type: EntryAction.CREATE
  payload: T
}

export type PartialAction<T extends object> = {
  type: EntryAction.MERGE | EntryAction.APPEND
  payload: Partial<T>
}

export type EntityAction<T extends object> = FullAction<T> | PartialAction<T>

export function entityReducer<T extends object>(
  action: EntityAction<T>,
  current?: T,
  readonlyKeys?: readonly (keyof T)[],
): T | undefined {
  switch (action.type) {
    case EntryAction.CREATE:
      return { ...action.payload }
    case EntryAction.MERGE:
      return current ? { ...current, ...action.payload } : undefined
    case EntryAction.APPEND:
      if (!current) return undefined

      const result = { ...current }

      typedEntries(action.payload).forEach(([key, newValue]) => {
        const currentValue = getValueAtPath(current, key)

        if ((writeable(key, readonlyKeys) && isAppendable(currentValue)) || currentValue === undefined) {
          try {
            setValueAtPath(result, key, appendValues(currentValue, newValue))
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

export function updateMatchingIdentity<T extends Identifiable>(entity: T, action: EntityAction<T>): T {
  if (entity.id !== action.payload.id) return entity
  return entityReducer(action, entity, ['id'])
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

  if (Array.isArray(current)) {
    return [...current, ...wrapArray(newValue)] as T
  }

  throw new Error(`Cannot append ${typeof newValue} to ${typeof current}`)
}
