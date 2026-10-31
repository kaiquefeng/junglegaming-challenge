import { expect, test } from '@playwright/test'
import {
  BRUNO,
  headerProfileLink,
  KAIQUE,
  login,
  mocks,
  waitForMocks,
} from './support'

test.skip(({ isMobile }) => isMobile, 'fluxos de conta cobertos no desktop')

test('cadastro valida campos, trata conflito e cria a sessão', async ({
  page,
}) => {
  await page.goto('/signup')
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click()
  await expect(page.getByText('Campo obrigatório.')).toHaveCount(2)

  await page.getByLabel('Nome de usuário').fill('ab')
  await page.getByLabel('E-mail').fill('invalido')
  await page.getByLabel('Senha', { exact: true }).fill('123')
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click()
  await expect(page.getByText('Use ao menos 3 caracteres.')).toBeVisible()
  await expect(page.getByText('Informe um e-mail válido.')).toBeVisible()
  await expect(
    page.getByText('A senha deve ter ao menos 8 caracteres.'),
  ).toBeVisible()
  await expect(page.getByLabel('E-mail')).toHaveAttribute(
    'aria-invalid',
    'true',
  )

  await page.getByLabel('Nome de usuário').fill('nova.pessoa')
  await page.getByLabel('E-mail').fill(KAIQUE.email)
  await page.getByLabel('Senha', { exact: true }).fill('Senha@123')
  await page.getByLabel('Confirmar senha', { exact: true }).fill('Senha@123')
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click()
  await expect(page.getByText('Este e-mail já está cadastrado.')).toBeVisible()

  await page.getByLabel('E-mail').fill('nova@kurio.test')
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click()
  await expect(page).toHaveURL('/')
  await expect(headerProfileLink(page)).toBeVisible()
})

test('login com senha errada mostra erro; login correto volta ao fluxo anterior', async ({
  page,
}) => {
  await page.goto('/checkout')

  await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout/)

  await page.getByLabel('E-mail').fill(KAIQUE.email)
  await page.getByLabel('Senha', { exact: true }).fill('errada123')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByText('E-mail ou senha incorretos.')).toBeVisible()

  await page.getByLabel('Senha', { exact: true }).fill(KAIQUE.password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()

  await expect(page).toHaveURL(/\/checkout/)
})

test('sessão persiste após refresh; logout e troca de usuário limpam dados privados', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await expect(page).toHaveURL('/')
  await page.reload()
  await expect(headerProfileLink(page)).toContainText('Kaique Feng')

  await page.getByRole('button', { name: 'Sair' }).click()
  await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible()
  await expect(page).toHaveURL('/')

  await login(page, BRUNO)
  await expect(headerProfileLink(page)).toContainText('Bruno Lima')
  await expect(
    page.getByRole('button', {
      name: /Remover Emerald Ape #042 dos favoritos/,
    }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Favoritar Emerald Ape #042' }),
  ).toBeVisible()
})

test('sessão expirada durante a navegação leva ao login e retoma o destino', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await expect(page).toHaveURL('/')
  await page.goto('/profile')
  await expect(
    page.getByRole('heading', { name: 'Perfil do colecionador' }),
  ).toBeVisible()

  await waitForMocks(page)
  await mocks(page, 'expireSessions')
  await page.getByRole('link', { name: 'Carteiras' }).click()

  await expect(page).toHaveURL(/\/login\?.*expired=true/)
  await expect(page.getByText('Sua sessão expirou.')).toBeVisible()

  await page.getByLabel('E-mail').fill(KAIQUE.email)
  await page.getByLabel('Senha', { exact: true }).fill(KAIQUE.password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/wallets/)
})
