export type Result<T, E = Error> = {
    success: boolean;
    value?: T;
    error?: E;
}

export function success<T>(v: T): Result<T> {
    return { success: true, value: v };
}

export function error<T>(desc: string): Result<T> {
    return { success: false, error: new Error(desc) };
}

export type Maybe<T> = T | null;
