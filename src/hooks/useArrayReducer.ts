import { useReducer } from 'react';
import {ReducerAction} from "@/hooks/reducer";

export type Actions = 'append'
export type Action<T> = ReducerAction<Actions, T>

function reducer<A>(state: A[], action: Action<A>): A[] {
    switch(action.type) {
        case 'append':
            return [...state, action.payload];
        default:
            return state;
    }
}

export function useArrayReducer<T>(defaultValue: T[] = []) {
    return  useReducer<T[], Action<T>>(reducer, defaultValue);
}