import { io } from 'socket.io-client'

// Conexão manual: a feature "realtime" decide quando conectar (após autenticar).
export const socket = io(
  import.meta.env.VITE_WS_URL ?? window.location.origin,
  {
    autoConnect: false,
    transports: ['websocket'],
  },
)
