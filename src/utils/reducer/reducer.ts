export type Reducer<S, A> = (state: S, action: A) => S

export type Action<T> = {
  type: string
  payload: T
}

export function combineReducers<S, A>(...reducers: Reducer<S, A>[]): Reducer<S, A> {
  return (state, action) => {
    for (const reducer of reducers) {
      state = reducer(state, action)
    }
    return state
  }
}

export function combineDictionaryReducers<V, T extends Record<string, V>, A>(reducers: {
  [K in keyof T]: Reducer<T[K], A>
}): Reducer<T, A> {
  return (state, action) => {
    const nextState = { ...state } as T
    for (const key in reducers) {
      nextState[key] = reducers[key](state?.[key], action)
    }
    return nextState
  }
}

export function plainPayloadReducer<T>(...types: Action<T>['type'][]) {
  return (state: Action<T>['payload'], action: Action<T>) => {
    if (types.includes(action.type)) {
      return action.payload
    }
    return state
  }
}

export function debugReducer<T, A>(reducer: Reducer<T, A>) {
  return (current: T, action: A) => {
    console.debug('Action', action)
    const state = reducer(current, action)
    console.debug('State', state)
    return state
  }
}
