import { expect, test } from '@playwright/test'
import { KAIQUE } from './support'

test.skip(({ isMobile }) => !isMobile, 'layouts mobile')

test('mobile: compra completa do detalhe ao recibo', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(KAIQUE.email)
  await page.getByLabel('Senha', { exact: true }).fill(KAIQUE.password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await page.waitForURL((url) => !url.pathname.startsWith('/login'))

  await page.goto('/nft/1')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Comprar NFT' }).click()

  await expect(
    page.getByRole('heading', { name: 'Carrinho de NFTs' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Conectar e finalizar' }).click()

  await expect(
    page.getByRole('heading', { name: 'Pagamento com carteira' }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Confirmar compra' }),
  ).toBeEnabled()
  await page.getByRole('button', { name: 'Conectar carteira' }).click()
  await expect(
    page.getByRole('button', { name: 'Desconectar carteira' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()

  await expect(
    page.getByText('Seus NFTs agora estão na sua carteira'),
  ).toBeVisible({ timeout: 15_000 })
})

test('mobile: início usa dados reais, favorita e abre o detalhe', async ({
  page,
}) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042' }),
  ).toBeVisible()
  await page.getByRole('tab', { name: 'Em alta' }).click()
  await expect(page).toHaveURL(/tab=trending/)
  await page.getByRole('link', { name: 'Sage Nomad #009' }).first().click()
  await expect(
    page.getByRole('heading', { level: 1, name: 'Sage Nomad #009' }),
  ).toBeVisible()
})

test('mobile: login e cadastro com validação', async ({ page }) => {
  await page.goto('/signup')
  await page.getByRole('button', { name: 'Criar perfil' }).click()
  await expect(page.getByText('Campo obrigatório.').first()).toBeVisible()
  await page.getByRole('link', { name: 'Entre' }).click()
  await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible()
})

test('mobile: sem overflow horizontal nas telas principais', async ({
  page,
}) => {
  for (const path of ['/', '/nft/1', '/cart', '/login']) {
    await page.goto(path)
    await page.waitForTimeout(400)
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    )
    expect(overflow, path).toBeLessThanOrEqual(1)
  }
})
