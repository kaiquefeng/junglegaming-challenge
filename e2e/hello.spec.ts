import { expect, test } from '@playwright/test'

test('home renderiza hero, catálogo, banners, diário e rodapé com dados do MSW', async ({
  page,
}) => {
  const apiCalls: string[] = []
  page.on('request', (request) => {
    const { pathname } = new URL(request.url())
    if (pathname.startsWith('/api/')) apiCalls.push(pathname)
  })

  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: /seja dono do futuro/i }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042' }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Diário da Cunhagem' }),
  ).toBeVisible()
  await expect(
    page.getByText('© 2026 Kurio. Propriedade digital para todos.'),
  ).toBeVisible()

  expect(apiCalls).toEqual(
    expect.arrayContaining([
      '/api/home/hero',
      '/api/nfts',
      '/api/collections',
      '/api/networks',
      '/api/promos',
      '/api/articles',
      '/api/footer',
    ]),
  )
})

test('aba, paginação e filtro de coleção atualizam o catálogo e a URL', async ({
  page,
}) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { name: 'Emerald Ape #042' }),
  ).toBeVisible()

  await page.getByRole('link', { name: 'Página 2' }).click()
  await expect(page).toHaveURL(/page=2/)
  await expect(
    page.getByRole('heading', { name: 'Golden Echo #411' }),
  ).toBeVisible()

  await page.getByRole('button', { name: /Música/ }).click()
  await expect(page).toHaveURL(/collection=musica/)
  await expect(page).toHaveURL(/page=1/)

  await page.getByRole('tab', { name: 'Em alta' }).click()
  await expect(page).toHaveURL(/tab=trending/)
})

test('newsletter confirma a inscrição e valida o e-mail', async ({ page }) => {
  await page.goto('/')
  const input = page.getByLabel('Antecipe-se ao próximo lançamento')

  await input.fill('invalido')
  await page.getByRole('button', { name: 'Enviar' }).click()
  await expect(page.getByText('Informe um e-mail válido.')).toBeVisible()

  await input.fill('colecionador@email.com')
  await page.getByRole('button', { name: 'Enviar' }).click()
  await expect(page.getByText('Inscrição confirmada. Obrigado!')).toBeVisible()
})

test('rota inexistente mostra a página de não encontrado', async ({ page }) => {
  await page.goto('/rota-que-nao-existe')

  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible()
})
