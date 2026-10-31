import { expect, test } from '@playwright/test'
import {
  addToCart,
  connectWallet,
  KAIQUE,
  login,
  mocks,
  waitForMocks,
} from './support'

test.skip(({ isMobile }) => isMobile, 'tempo real coberto no desktop')

test('mudança de preço via Socket.IO atualiza o carrinho e bloqueia o checkout até nova confirmação', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await addToCart(page, '1')
  await page.goto('/checkout')
  await expect(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).toBeEnabled()
  await waitForMocks(page)

  await mocks(page, 'updateNft', '1', { price: '1.50' })

  await expect(
    page.getByText(/O preço de Emerald Ape #042 mudou de 1.19 para 1.50 ETH/),
  ).toBeVisible()
  await expect(page.getByText('Os valores do pedido mudaram')).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).toBeDisabled()

  await page.getByRole('button', { name: 'Aceitar novos valores' }).click()
  await expect(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).toBeEnabled()
  await expect(page.getByText('1.516 ETH').first()).toBeVisible()
})

test('o carrinho mostra alerta de preço e permite aceitar os novos valores', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await addToCart(page, '1')
  await page.goto('/cart')
  await waitForMocks(page)

  await mocks(page, 'updateNft', '1', { price: '2.00' })
  await expect(page.getByText('Alguns itens mudaram')).toBeVisible()
  await expect(page.getByText('2.00 ETH').first()).toBeVisible()
  await page.getByRole('button', { name: 'Aceitar novos valores' }).click()
  await expect(page.getByText('Alguns itens mudaram')).toHaveCount(0)
})

test('disponibilidade esgotada durante a compra impede o envio', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await addToCart(page, '1')
  await page.goto('/cart')
  await waitForMocks(page)

  await mocks(page, 'updateNft', '1', { editions: { '1/50': 0 } })
  await expect(page.getByText(/só 0 unidade/)).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Conectar e finalizar' }),
  ).toBeDisabled()
})

test('eventos duplicados e antigos não regridem o estado', async ({ page }) => {
  await page.goto('/nft/1')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' }),
  ).toBeVisible()
  await waitForMocks(page)

  await mocks(page, 'updateNft', '1', { price: '1.30' })
  await expect(page.getByText('1.30 ETH').first()).toBeVisible()

  await mocks(page, 'publishStale', '1')
  await mocks(page, 'publishStale', '1')
  await mocks(page, 'republishNft', '1')
  await page.waitForTimeout(500)
  await expect(page.getByText('1.30 ETH').first()).toBeVisible()
  await expect(page.getByText('9.99')).toHaveCount(0)
})

test('após desconexão o cliente reconecta e reconcilia com a API', async ({
  page,
}) => {
  await page.goto('/nft/1')
  await waitForMocks(page)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' }),
  ).toBeVisible()

  const priceChanged = page.waitForResponse(
    (r) => new URL(r.url()).pathname === '/api/nfts/1',
  )
  await mocks(page, 'disconnectSockets')
  await mocks(page, 'updateNft', '1', { price: '1.77' })
  await priceChanged
  await expect(page.getByText('1.77 ETH').first()).toBeVisible({
    timeout: 15_000,
  })
})

test('pedido pendente conclui via order.updated sem polling manual', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await addToCart(page, '1')
  await page.goto('/checkout')
  await expect(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).toBeEnabled()
  await connectWallet(page)
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(
    page.getByRole('heading', { name: 'Processando pagamento' }),
  ).toBeVisible()
  await expect(
    page.getByText('Seus NFTs agora estão na sua carteira'),
  ).toBeVisible({ timeout: 15_000 })
})
