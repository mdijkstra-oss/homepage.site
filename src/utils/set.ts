import {Identifiable} from "@/utils/types";

export function keyBy<K, V>(set: V[], key: (v: V) => K): Map<K, V> {
    let map = new Map<K, V>()
    for (const entry of set) {
        map.set(key(entry), entry)
    }
    return map
}

export function keyByIdentifier<K extends Identifiable>(entries: K[]): Map<string, K> {
    return keyBy(entries, (entry) => entry.id)
}

export function mapValues<K, V>(mapper: (value: V, key: K) => V, dict: Map<K, V>): Map<K, V> {
    const newDict = new Map<K, V>();
    for (const [key, value] of dict) {
        newDict.set(key, mapper(value, key));
    }
    return newDict;
}