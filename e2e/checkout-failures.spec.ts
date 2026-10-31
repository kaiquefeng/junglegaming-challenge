import { expect, test } from '@playwright/test'
import {
  addToCart,
  BRUNO,
  connectWallet,
  gotoScenario,
  KAIQUE,
  login,
} from './support'

test.skip(({ isMobile }) => isMobile, 'cenários de falha cobertos no desktop')

async function startCheckout(
  page: import('@playwright/test').Page,
  scenario?: string,
) {
  if (scenario) await gotoScenario(page, scenario)
  else await page.goto('/')
  await login(page, KAIQUE)
  await addToCart(page, '1')
  await page.goto('/checkout')
  await expect(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).toBeEnabled()
  await connectWallet(page)
}

test('pagamento recusado preserva os itens e permite tentar de novo', async ({
  page,
}) => {
  await startCheckout(page, 'payment-declined')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()

  await expect(
    page.getByRole('heading', { name: 'Pagamento recusado' }),
  ).toBeVisible({ timeout: 15_000 })
  await expect(
    page.getByText('Seus NFTs agora estão na sua carteira'),
  ).toHaveCount(0)

  await page.goto('/cart')
  await expect(
    page.getByRole('link', { name: 'Emerald Ape #042' }),
  ).toBeVisible()
})

test('clique repetido não cria pedidos duplicados', async ({ page }) => {
  const created: string[] = []
  page.on('request', (request) => {
    if (
      request.method() === 'POST' &&
      new URL(request.url()).pathname === '/api/orders'
    ) {
      created.push(request.headers()['idempotency-key'] ?? '')
    }
  })
  await startCheckout(page)
  const confirm = page.getByRole('button', { name: 'Confirmar compra' })
  await confirm.dblclick()
  await expect(page).toHaveURL(/\/orders\/ord-/)

  expect(created.length).toBe(1)
})

test('timeout após criar o pedido recupera o MESMO pedido pela idempotência', async ({
  page,
}) => {
  const keys: string[] = []
  page.on('request', (request) => {
    if (
      request.method() === 'POST' &&
      new URL(request.url()).pathname === '/api/orders'
    ) {
      keys.push(request.headers()['idempotency-key'] ?? '')
    }
  })
  await startCheckout(page, 'order-timeout')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()

  await expect(page).toHaveURL(/\/orders\/ord-/, { timeout: 25_000 })
  expect(keys.length).toBeGreaterThanOrEqual(2)
  expect(new Set(keys).size).toBe(1)

  await expect(
    page.getByText('Seus NFTs agora estão na sua carteira'),
  ).toBeVisible({ timeout: 15_000 })
  const orders = await page.evaluate(() => {
    const raw = globalThis.localStorage.getItem('kurio.mocks.db.v2')
    return raw ? (JSON.parse(raw) as { orders: unknown[] }).orders.length : -1
  })
  expect(orders).toBe(1)
})

test('refresh com pedido pendente retoma o mesmo pedido, sem nova compra', async ({
  page,
}) => {
  await startCheckout(page)
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/orders\/ord-/)
  const url = page.url()
  await expect(
    page.getByRole('heading', { name: 'Processando pagamento' }),
  ).toBeVisible()

  await page.reload()
  await expect(page).toHaveURL(url)
  await expect(
    page.getByText('Seus NFTs agora estão na sua carteira'),
  ).toBeVisible({ timeout: 15_000 })

  await page.goto('/checkout')
  await expect(
    page.getByRole('heading', { name: 'Seu carrinho está vazio' }),
  ).toBeVisible()
})

test('pedido de outro usuário não é acessível', async ({ page }) => {
  await startCheckout(page)
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page).toHaveURL(/\/orders\/ord-/)
  const path = new URL(page.url()).pathname

  await page.getByRole('button', { name: 'Sair' }).click()
  await login(page, BRUNO, path)

  await expect(
    page.getByRole('heading', { name: 'Pedido não encontrado' }),
  ).toBeVisible()
  await expect(
    page.getByText('Seus NFTs agora estão na sua carteira'),
  ).toHaveCount(0)
})
