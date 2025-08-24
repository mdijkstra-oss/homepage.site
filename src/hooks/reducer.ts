export type ReducerAction<T,P> = {
    type: T;
    payload: P;
}

export function createAction<T, P>(type: T, payload: P): ReducerAction<T, P> {
    return { type, payload };
}