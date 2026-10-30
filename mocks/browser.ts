import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { socketHandlers } from './socket'

const worker = setupWorker(...handlers, ...socketHandlers)

export function startMocking() {
  return worker.start({ onUnhandledFrame: 'bypass' })
}
