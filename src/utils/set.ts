export function typedEntries<T, K extends keyof T>(obj: T) {
    return Object.entries(obj) as [K, T[K]][];
}
