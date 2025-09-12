
export type Reducer<S, A> = (action: A, state: S) => S;

export function combineReducers<S, A>(...reducers: Reducer<S, A>[]): Reducer<S, A> {
    return (action, state) => Object.keys(reducers).reduce((newState, key) => {
        newState[key] = reducers[key](action, state[key]);
        return newState;
    }, state);
}