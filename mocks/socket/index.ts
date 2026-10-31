import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import { db } from '../db/db'
import { type ServerEvent, subscribe } from './bus'

const realtime = ws.link('*')

type Connection = {
  userId: string | null
  emit: (event: ServerEvent) => void
  close: () => void
}

const connections = new Set<Connection>()

export function disconnectAll() {
  for (const connection of [...connections]) connection.close()
}

export const socketHandlers = [
  realtime.addEventListener('connection', (connection) => {
    if (!connection.client.url.pathname.startsWith('/socket.io')) {
      connection.server.connect()
      return
    }

    const { client } = toSocketIo(connection)
    const entry: Connection = {
      userId: null,
      emit: (event) => client.emit(event.name, event),
      close: () => connection.client.close(1006, 'connection lost'),
    }
    connections.add(entry)

    client.on('session', (_event, token: string | null) => {
      const session = token ? db().sessions[token] : undefined
      entry.userId =
        session && session.expiresAt > Date.now() ? session.userId : null
    })

    const unsubscribe = subscribe((event) => {
      if (event.userId && event.userId !== entry.userId) return

      const { userId: _userId, ...payload } = event
      entry.emit(payload as ServerEvent)
    })

    connection.client.addEventListener('close', () => {
      unsubscribe()
      connections.delete(entry)
    })
  }),
]
