export type FullAction<T> = {
    type: 'CREATE';
    payload: T;
}

export type PartialAction<T> = {
    type: 'MERGE' | 'APPEND';
    payload: Partial<T>
}

export type EntityAction<T> =
    | FullAction<T>
    | PartialAction<T>

export function entityReducer<T>(action: EntityAction<T>, current?: T): T | undefined {
    switch (action.type) {
        case "CREATE":
            return { ...action.payload };
        case "MERGE":
            return current ? { ...current, ...action.payload } : undefined;
        case "APPEND":
            if (!current) return undefined;

            const result = { ...current };

            Object.entries(action.payload).forEach(([key, newValue]) => {
                const currentValue = current[key as keyof T];

                if (isAppendable(currentValue) || currentValue === undefined) {
                    try {
                        (result as any)[key] = appendValues(currentValue, newValue);
                    } catch (error) {
                        console.warn(`Append failed for key ${key}:`, error);
                    }
                }
            });

            return result;
        default:
            throw new Error(`Unimplemented Action Type ${(action as any).type}`);
    }
}

function isAppendable(value: unknown): value is string | unknown[] {
    return typeof value === 'string' || Array.isArray(value);
}

function appendValues<T>(current: T | undefined, newValue: T): T {
    if (current === undefined) {
        return newValue;
    }

    if (typeof current === 'string' && typeof newValue === 'string') {
        return (current + newValue) as T;
    }

    if (Array.isArray(current) && Array.isArray(newValue)) {
        return [...current, ...newValue] as T;
    }

    throw new Error(`Cannot append ${typeof newValue} to ${typeof current}`);
}
