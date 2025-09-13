export type Reducer<S, A> = (action: A, state: S) => S

export function combineReducers<S, A>(...reducers: Reducer<S, A>[]): Reducer<S, A> {
  return (action, state) => {
    for (const reducer of reducers) {
      state = reducer(action, state)
    }
    return state
  }
}
