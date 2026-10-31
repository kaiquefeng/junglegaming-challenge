import { setupWorker } from 'msw/browser'
import { db, initDb, resetDb, save } from './db/db'
import { handlers } from './handlers'
import { publishNftUpdated, updateNft } from './lib/domain'
import { initScenario, type ScenarioName, setScenario } from './scenarios'
import { disconnectAll, socketHandlers } from './socket'
import { publish } from './socket/bus'

const worker = setupWorker(...handlers, ...socketHandlers)

const controls = {
  reset: () => resetDb(),
  setScenario: (name: ScenarioName) => setScenario(name),
  updateNft,
  republishNft: publishNftUpdated,

  publishStale(nftId: string) {
    publish({
      id: 'evt-stale-1',
      name: 'nft.updated',
      resource: 'nft',
      resourceId: nftId,
      version: 0,
      at: new Date(0).toISOString(),
      data: {
        price: '9.99',
        previousPrice: undefined,
        soldOut: false,
        editions: [],
      },
    })
  },
  disconnectSockets: disconnectAll,
  expireSessions() {
    for (const session of Object.values(db().sessions))
      session.expiresAt = Date.now() - 1
    save()
  },
}

export type KurioMocks = typeof controls

declare global {
  interface Window {
    __kurioMocks?: KurioMocks
  }
}

export async function startMocking() {
  const url = new URL(window.location.href)
  if (url.searchParams.has('reset')) {
    window.localStorage.removeItem('kurio.mocks.db.v2')
    window.localStorage.removeItem('kurio.token')
    url.searchParams.delete('reset')
    window.history.replaceState(null, '', url)
  }
  await initDb()
  initScenario()
  window.__kurioMocks = controls
  return worker.start({ onUnhandledFrame: 'bypass', quiet: true })
}
