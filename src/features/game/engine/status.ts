export interface StatusChannel<T> {
  notify: () => void;
  subscribe: (listener: (status: T) => void) => () => void;
}

export function createStatusChannel<T>(selectStatus: () => T): StatusChannel<T> {
  let listener: ((status: T) => void) | null = null;

  function notify(): void {
    listener?.(selectStatus());
  }

  function subscribe(nextListener: (status: T) => void): () => void {
    listener = nextListener;
    nextListener(selectStatus());
    return () => {
      if (listener === nextListener) listener = null;
    };
  }

  return { notify, subscribe };
}
