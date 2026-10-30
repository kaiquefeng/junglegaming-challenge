import { expect, test } from '@playwright/test'

test('home exibe o Hello World vindo da API simulada pelo MSW', async ({
  page,
}) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Hello World' }),
  ).toBeVisible()
  await expect(page.getByText('API simulada (MSW): Hello World')).toBeVisible()
})

test('rota inexistente mostra a página de não encontrado', async ({ page }) => {
  await page.goto('/rota-que-nao-existe')

  await expect(
    page.getByRole('heading', { name: 'Página não encontrada' }),
  ).toBeVisible()
})
