import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'

// Intercepta o handshake do socket.io-client (transporte websocket). Eventos
// `nft.updated` e `order.updated` serão emitidos a partir daqui, derivados do
// mesmo estado que alimenta os handlers REST.
const realtime = ws.link('ws://localhost:5173/socket.io/')

export const socketHandlers = [
  realtime.addEventListener('connection', (connection) => {
    toSocketIo(connection)
  }),
]
