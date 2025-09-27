type OnIncomingMessage<R> = (message: R) => void
type OnError = (error: Error) => void

type SocketState = 'connected' | 'disconnected'
type OnStateChange = (state: SocketState) => void

export function createSocket<S, R>(
  url: string,
  onIncomingMessage: OnIncomingMessage<R>,
  onError: OnError,
  onStateChange: OnStateChange,
) {
  const ws = new WebSocket(url)

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    console.log(message)
    onIncomingMessage(message)
  }

  ws.onclose = () => onStateChange('disconnected')
  ws.onopen = () => onStateChange('connected')

  ws.onerror = (event: ErrorEvent) => onError(event.error)

  const disconnect = () => ws.close()

  const send = (message: S) => {
    if (ws.readyState !== WebSocket.OPEN) return
    ws.send(JSON.stringify(message))
  }

  return { send, disconnect }
}
