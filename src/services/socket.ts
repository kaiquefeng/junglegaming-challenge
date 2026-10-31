import type { Socket } from 'socket.io-client'

let instance: Promise<Socket> | null = null

export function getSocket(): Promise<Socket> {
  instance ??= Promise.all([
    import('socket.io-client'),
    import('engine.io-client'),
  ]).then(([{ io }, { WebSocket: EngineWebSocket }]) => {
    class LiveWebSocket extends EngineWebSocket {
      createSocket(uri: string, protocols: string | string[] | undefined) {
        return protocols
          ? new globalThis.WebSocket(uri, protocols)
          : new globalThis.WebSocket(uri)
      }
    }

    return io(import.meta.env.VITE_WS_URL || window.location.origin, {
      autoConnect: false,
      transports: [LiveWebSocket as never],
    })
  })
  return instance
}
