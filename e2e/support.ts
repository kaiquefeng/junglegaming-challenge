import { expect, type Page } from '@playwright/test'

export const KAIQUE = {
  email: 'kaique@dev.com',
  password: 'Senha@123',
  name: 'Kaique Feng',
}
export const BRUNO = {
  email: 'bruno@kurio.test',
  password: 'Senha@123',
  name: 'Bruno Lima',
}

export async function login(page: Page, user = KAIQUE, redirect?: string) {
  await page.goto(
    redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login',
  )
  await page.getByLabel('E-mail').fill(user.email)
  await page.getByLabel('Senha', { exact: true }).fill(user.password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()

  await page.waitForURL((url) => !url.pathname.startsWith('/login'))
}

export const headerProfileLink = (page: Page) =>
  page.getByRole('banner').getByRole('link', { name: 'Meu perfil' })

export async function mocks(page: Page, method: string, ...args: unknown[]) {
  return page.evaluate(
    ([name, params]) => {
      const api = (
        globalThis as unknown as {
          __kurioMocks: Record<string, (...a: unknown[]) => unknown>
        }
      ).__kurioMocks
      return api[name as string]?.(...(params as unknown[]))
    },
    [method, args] as const,
  )
}

export async function waitForMocks(page: Page) {
  await page.waitForFunction(() =>
    Boolean((globalThis as { __kurioMocks?: unknown }).__kurioMocks),
  )
}

export async function addToCart(page: Page, nftId = '1') {
  await page.goto(`/nft/${nftId}`)
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page.getByText(/adicionado ao carrinho/)).toBeVisible()
}

export async function connectWallet(page: Page) {
  await page.getByRole('button', { name: 'Conectar carteira' }).click()
  await expect(
    page.getByRole('button', { name: 'Desconectar carteira' }),
  ).toBeVisible()
}

export async function gotoScenario(page: Page, scenario: string, path = '/') {
  await page.goto(`${path}?scenario=${scenario}`)
  await waitForMocks(page)
  await page.waitForFunction(
    (name) => globalThis.localStorage.getItem('kurio.scenario') === name,
    scenario,
  )
}
