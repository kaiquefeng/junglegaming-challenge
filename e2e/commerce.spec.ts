import { expect, test } from '@playwright/test'
import { addToCart, BRUNO, connectWallet, KAIQUE, login } from './support'

test.skip(({ isMobile }) => isMobile, 'fluxos de compra cobertos no desktop')

test('detalhe: acesso direto, NFT inexistente e limite de quantidade', async ({
  page,
}) => {
  await page.goto('/nft/3')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Neon Vessel #552' }),
  ).toBeVisible()

  await expect(
    page.getByRole('button', { name: '1/1 (esgotada)' }),
  ).toBeDisabled()

  await page.goto('/nft/999')
  await expect(
    page.getByRole('heading', { name: 'NFT não encontrado' }),
  ).toBeVisible()
})

test('detalhe: quantidade respeita o limite por pedido', async ({ page }) => {
  await page.goto('/nft/1')
  await page.getByRole('button', { name: '1/10', exact: true }).click()
  const more = page.getByRole('button', { name: 'Aumentar quantidade' })
  for (let i = 0; i < 12; i += 1) if (await more.isEnabled()) await more.click()
  await expect(page.getByText('10', { exact: true }).first()).toBeVisible()
  await expect(more).toBeDisabled()
  await expect(page.getByText('Limite por pedido')).toBeVisible()
})

test('carrinho: quantidades, remoção, cupom e persistência após refresh', async ({
  page,
}) => {
  await addToCart(page, '1')
  await addToCart(page, '6')
  await page.goto('/cart')

  await expect(
    page.getByRole('link', { name: 'Emerald Ape #042' }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Aumentar quantidade de Emerald Ape #042' })
    .click()
  await expect(page.getByText('2.38 ETH').first()).toBeVisible()

  await page.getByLabel('Código promocional').fill('NAOEXISTE')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Código promocional inválido.')).toBeVisible()
  await page.getByLabel('Código promocional').fill('EXPIRED20')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('Este código promocional expirou.')).toBeVisible()
  await page.getByLabel('Código promocional').fill('kurio10')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await expect(page.getByText('KURIO10 (-10%)')).toBeVisible()

  await expect(page.getByText('4.17 ETH')).toBeVisible()
  await expect(page.getByText('3.769 ETH')).toBeVisible()

  await page.reload()
  await expect(page.getByText('KURIO10 (-10%)')).toBeVisible()
  await expect(page.getByText('3.769 ETH')).toBeVisible()

  await page.getByRole('button', { name: 'Remover Ivory Baron #088' }).click()
  await expect(
    page.getByRole('link', { name: 'Ivory Baron #088' }),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'Remover cupom' }).click()
  await expect(page.getByText('KURIO10 (-10%)')).toHaveCount(0)
})

test('carrinho do visitante é preservado ao autenticar', async ({ page }) => {
  await addToCart(page, '1')
  await login(page, BRUNO)
  await expect(page).toHaveURL('/')
  await page.goto('/cart')
  await expect(
    page.getByRole('link', { name: 'Emerald Ape #042' }),
  ).toBeVisible()
})

test('compra completa: catálogo → detalhe → carrinho → pagamento → recibo', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await expect(page).toHaveURL('/')
  await page.getByRole('link', { name: 'Sage Nomad #009' }).first().click()
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sage Nomad #009' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'COMPRAR' }).click()

  await expect(page).toHaveURL(/\/cart/)
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click()
  await expect(page).toHaveURL(/\/checkout/)

  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(
    page.getByText('Conecte a carteira antes de confirmar.'),
  ).toBeVisible()

  await connectWallet(page)
  await page.getByRole('button', { name: 'Confirmar compra' }).click()

  await expect(page).toHaveURL(/\/orders\/ord-/)
  await expect(
    page.getByRole('heading', { name: 'Processando pagamento' }),
  ).toBeVisible()
  await expect(
    page.getByText('Seus NFTs agora estão na sua carteira'),
  ).toBeVisible({ timeout: 15_000 })

  await expect(
    page.getByRole('dialog').getByText('Sage Nomad #009'),
  ).toBeVisible()
  await expect(page.getByText('1.706 ETH').first()).toBeVisible()

  await page.keyboard.press('Escape')
  await page.goto('/cart')
  await expect(page.getByText('Seu carrinho está vazio.')).toBeVisible()
})

test('checkout valida os campos antes de enviar', async ({ page }) => {
  await login(page, BRUNO)
  await addToCart(page, '1')
  await page.goto('/checkout')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page.getByText('Campo obrigatório.').first()).toBeVisible()
  await page.locator('#address').fill('0x123')
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page.getByText(/Endereço 0x inválido/)).toBeVisible()
  await expect(page.locator('#address')).toHaveAttribute('aria-invalid', 'true')
})

test('conexão da carteira: recusa e desconexão', async ({ page }) => {
  await login(page, KAIQUE)
  await addToCart(page, '1')
  await page.goto('/checkout')
  await expect(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).toBeEnabled()
  await page.locator('#network').selectOption('solana')
  await page.locator('#wallet-type').selectOption('Coinbase Wallet')
  await page.getByRole('button', { name: 'Conectar carteira' }).click()
  await expect(
    page.getByText('Coinbase Wallet recusou: rede Solana não suportada.'),
  ).toBeVisible()

  await page.locator('#network').selectOption('ethereum')
  await connectWallet(page)
  await page.getByRole('button', { name: 'Desconectar carteira' }).click()
  await expect(page.getByText('Nenhuma carteira conectada.')).toBeVisible()
})
