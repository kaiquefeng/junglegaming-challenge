import { HttpResponse, http } from 'msw'
import { db, save } from '../db/db'
import { nftIndex } from '../lib/domain'
import { authenticate, errors, simulateLatency } from '../lib/http'
import { getScenario } from '../scenarios'

export const favoritesHandlers = [
  http.get('/api/favorites', async ({ request }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    return HttpResponse.json({ ids: db().favorites[auth.user.id] ?? [] })
  }),

  http.put('/api/favorites/:nftId', async ({ request, params }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    if (getScenario().failFavorites) return errors.transient()
    const nftId = String(params.nftId)
    if (nftIndex(nftId) < 0) return errors.notFound('NFT não encontrado.')

    const state = db()
    const list = state.favorites[auth.user.id] ?? []
    state.favorites[auth.user.id] = list
    if (!list.includes(nftId)) list.push(nftId)
    save()
    return HttpResponse.json({ ids: list })
  }),

  http.delete('/api/favorites/:nftId', async ({ request, params }) => {
    await simulateLatency()
    const auth = authenticate(request)
    if (!auth.ok) return auth.response
    if (getScenario().failFavorites) return errors.transient()

    const state = db()
    state.favorites[auth.user.id] = (
      state.favorites[auth.user.id] ?? []
    ).filter((id) => id !== String(params.nftId))
    save()
    return HttpResponse.json({ ids: state.favorites[auth.user.id] })
  }),
]
