import { useCallback, useEffect, useRef, useState } from 'react'
import { createSocket } from '@/utils/socket'

export function useSocketReducer<A, S>(url: string, reducer: (state: S, action: A) => S, initialState: S) {
  const [state, setState] = useState<S>(initialState)
  const socketRef = useRef<ReturnType<typeof createSocket<A, A>> | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socketRef.current = createSocket(
      url,
      (action: A) => setState((prev) => reducer(prev, action)),
      (error: Error) => console.error('Socket error:', error),
      (newState) => setConnected(newState === 'connected'),
    )

    return () => socketRef.current?.disconnect()
  }, [url, reducer])

  const dispatch = useCallback(
    (action: A) => {
      setState((prev) => reducer(prev, action))
      socketRef.current?.send(action)
    },
    [reducer],
  )

  return { state, dispatch, connected }
}
