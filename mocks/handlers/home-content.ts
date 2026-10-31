import { delay, HttpResponse, http } from 'msw'
import {
  footer,
  hero,
  journal,
  promos,
  siteHeader,
} from '../fixtures/home-content'

const LATENCY_MS = 400

export const homeContentHandlers = [
  http.get('/api/site-header', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(siteHeader)
  }),

  http.get('/api/home/hero', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(hero)
  }),

  http.get('/api/promos', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(promos)
  }),

  http.get('/api/articles', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(journal)
  }),

  http.get('/api/footer', async () => {
    await delay(LATENCY_MS)
    return HttpResponse.json(footer)
  }),

  http.post('/api/newsletter', async ({ request }) => {
    const { email } = (await request.json()) as { email?: string }
    await delay(LATENCY_MS)

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return HttpResponse.json(
        { message: 'Informe um e-mail válido.' },
        { status: 422 },
      )
    }
    return HttpResponse.json(
      { message: 'Inscrição confirmada. Obrigado!' },
      { status: 201 },
    )
  }),
]
