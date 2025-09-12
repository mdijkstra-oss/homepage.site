type Reducer<A, C> = (action: A, current: C) => C;

export function accumulate<A, C>(reducer: Reducer<A, C>, initial?: C): Reducer<A,C> {
    let current = initial

    return (action: A) => {
        current = reducer(action, current)
        return current;
    };
}