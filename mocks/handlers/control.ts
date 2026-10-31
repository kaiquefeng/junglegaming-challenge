import { HttpResponse, http } from 'msw'
import { resetDb } from '../db/db'
import { type ScenarioName, scenarios, setScenario } from '../scenarios'

export const controlHandlers = [
  http.post('/api/__mocks/reset', async () => {
    await resetDb()
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/__mocks/scenario', async ({ request }) => {
    const { name } = (await request.json()) as { name: ScenarioName }
    if (!(name in scenarios))
      return HttpResponse.json(
        { message: 'Cenário inexistente' },
        { status: 404 },
      )
    setScenario(name)
    return new HttpResponse(null, { status: 204 })
  }),
]
