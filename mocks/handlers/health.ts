import { HttpResponse, http } from 'msw'

export const healthHandlers = [
  http.get('/api/health', () => HttpResponse.json({ message: 'Hello World' })),
]
