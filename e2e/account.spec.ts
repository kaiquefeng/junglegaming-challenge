import { expect, test } from '@playwright/test'
import { BRUNO, gotoScenario, KAIQUE, login } from './support'

test.skip(({ isMobile }) => isMobile, 'fluxos de conta cobertos no desktop')

test('perfil: valida, salva e mantém os dados após refresh', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await page.goto('/profile')
  await expect(page.locator('#display-name')).toHaveValue('Kaique Feng')

  await page.locator('#display-name').fill('')
  await page.locator('#email').fill('invalido')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page.getByText('Campo obrigatório.').first()).toBeVisible()
  await expect(page.getByText('Informe um e-mail válido.')).toBeVisible()

  await page.locator('#display-name').fill('Kaique F.')
  await page.locator('#email').fill(BRUNO.email)
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page.getByText('Este e-mail já está em uso.')).toBeVisible()

  await page.locator('#email').fill('kaique.novo@dev.com')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page.getByText('Perfil atualizado.')).toBeVisible()

  await page.reload()
  await expect(page.locator('#display-name')).toHaveValue('Kaique F.')
  await expect(page.locator('#email')).toHaveValue('kaique.novo@dev.com')

  await expect(
    page.getByRole('banner').getByRole('link', { name: 'Meu perfil' }),
  ).toContainText('Kaique F.')
})

test('perfil: envia e remove o avatar', async ({ page }) => {
  await login(page, KAIQUE)
  await page.goto('/profile')
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64',
  )
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'a.png', mimeType: 'image/png', buffer: png })
  await expect(page.getByText('Avatar atualizado.')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Seu avatar' })).toBeVisible()

  await page.reload()
  await expect(page.getByRole('img', { name: 'Seu avatar' })).toBeVisible()
  await page.getByRole('button', { name: 'Remover', exact: true }).click()
  await expect(page.getByText('Avatar removido.')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Seu avatar' })).toHaveCount(0)

  await page.locator('input[type=file]').setInputFiles({
    name: 'a.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('oi'),
  })
  await expect(page.getByText('Envie um arquivo de imagem.')).toBeVisible()
})

test('senha: valida, recusa a atual errada e permite entrar com a nova', async ({
  page,
}) => {
  await login(page, KAIQUE)
  await page.goto('/profile')
  await page.getByRole('button', { name: 'Alterar senha' }).click()
  await expect(page.getByText('Campo obrigatório.')).toBeVisible()

  await page.locator('#current-password').fill('errada123')
  await page.locator('#new-password').fill('NovaSenha@1')
  await page.locator('#confirm-password').fill('Outra@123')
  await page.getByRole('button', { name: 'Alterar senha' }).click()
  await expect(page.getByText('As senhas não conferem.')).toBeVisible()

  await page.locator('#confirm-password').fill('NovaSenha@1')
  await page.getByRole('button', { name: 'Alterar senha' }).click()
  await expect(page.getByText('Senha atual incorreta.')).toBeVisible()

  await page.locator('#current-password').fill(KAIQUE.password)
  await page.getByRole('button', { name: 'Alterar senha' }).click()
  await expect(page.getByText('Senha alterada.')).toBeVisible()

  await page.getByRole('banner').getByRole('button', { name: 'Sair' }).click()
  await login(page, { ...KAIQUE, password: 'NovaSenha@1' })
  await expect(page).toHaveURL('/')
})

test('carteiras: valida, salva principal e secundária e rejeita endereço repetido', async ({
  page,
}) => {
  await login(page, BRUNO)
  await page.goto('/wallets')
  await expect(
    page.getByRole('heading', { name: 'Carteira principal' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Salvar carteira' }).click()
  await expect(page.getByText('Campo obrigatório.').first()).toBeVisible()

  const fill = async (prefix: string, address: string) => {
    await page.locator(`#${prefix}-display-name`).fill('Bruno Lima')
    await page.locator(`#${prefix}-alias`).fill(`Carteira ${prefix}`)
    await page.locator(`#${prefix}-network`).selectOption('ethereum')
    await page.locator(`#${prefix}-profile-name`).fill('bruno.lima')
    await page.locator(`#${prefix}-address`).fill(address)
    await page.locator(`#${prefix}-wallet-type`).selectOption('MetaMask')
    await page.locator(`#${prefix}-referral`).fill('KURIO-BRUNO')
    await page.locator(`#${prefix}-email`).fill('bruno@kurio.test')
    await page.locator(`#${prefix}-ens-name`).fill('brunolima')
  }
  const primaryAddress = `0x${'a'.repeat(40)}`
  await fill('primary', '0x123')
  await page.getByRole('button', { name: 'Salvar carteira' }).click()
  await expect(page.getByText(/Endereço 0x inválido/)).toBeVisible()
  await page.locator('#primary-address').fill(primaryAddress)
  await page.getByRole('button', { name: 'Salvar carteira' }).click()
  await expect(page.getByText('Carteira principal salva.')).toBeVisible()

  await page.reload()
  await expect(page.locator('#primary-address')).toHaveValue(primaryAddress)

  await page.getByRole('button', { name: 'Adicionar' }).click()
  await fill('secondary', primaryAddress)
  await page.getByRole('button', { name: 'Salvar carteira' }).nth(1).click()
  await expect(
    page.getByText('Este endereço já está cadastrado em outra carteira.'),
  ).toBeVisible()
  await page.locator('#secondary-address').fill(`0x${'b'.repeat(40)}`)
  await page.getByRole('button', { name: 'Salvar carteira' }).nth(1).click()
  await expect(page.getByText('Carteira secundária salva.')).toBeVisible()
})

test('acesso privado exige login e preserva o destino', async ({ page }) => {
  await page.goto('/wallets')
  await expect(page).toHaveURL(/\/login\?redirect=%2Fwallets/)
})

test('perfil proibido mostra erro de permissão com nova tentativa', async ({
  page,
}) => {
  await gotoScenario(page, 'forbidden-profile')
  await login(page, KAIQUE)
  await page.goto('/profile')
  await expect(
    page.getByText('Você não tem permissão para ver este perfil.'),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Tentar novamente' }),
  ).toBeVisible()
})
