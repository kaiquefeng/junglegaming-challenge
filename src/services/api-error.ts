import { isAxiosError } from 'axios'
import type { ApiErrorBody } from './contracts'

export class ApiError extends Error {
  readonly status: number | undefined
  readonly body: ApiErrorBody

  constructor(body: ApiErrorBody, status?: number) {
    super(body.message)
    this.name = 'ApiError'
    this.body = body
    this.status = status
  }

  get code() {
    return this.body.code
  }

  get fields() {
    return this.body.fields ?? {}
  }
}

const networkError = (message: string): ApiErrorBody => ({
  code: 'transient',
  message,
})

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body && typeof body.code === 'string') {
      return new ApiError(body, error.response?.status)
    }

    if (body && typeof body.message === 'string' && error.response) {
      return new ApiError(
        {
          code: error.response.status === 422 ? 'validation' : 'transient',
          message: body.message,
        },
        error.response.status,
      )
    }
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError(networkError('A requisição demorou demais.'))
    }
    if (!error.response) {
      return new ApiError(networkError('Sem conexão com o servidor.'))
    }
    return new ApiError(
      networkError('Falha inesperada no servidor.'),
      error.response.status,
    )
  }
  return new ApiError(networkError('Erro inesperado.'))
}

export const isApiError = (error: unknown, code?: ApiErrorBody['code']) =>
  error instanceof ApiError && (code === undefined || error.code === code)
