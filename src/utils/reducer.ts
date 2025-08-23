type ReducerAction<T,P> = {
    type: T;
    payload: P;
}

export namespace ArrayReducer {
    export type Actions = 'append'
    export type Action<T> = ReducerAction<Actions, T>

    export function create<A>(state: A[], action: Action<A>): A[] {
        switch(action.type) {
            case 'append':
                return [...state, action.payload];
            default:
                return state;
        }
    }
}

export function createAction<T, P>(type: T, payload: P): ReducerAction<T, P> {
    return { type, payload };
}