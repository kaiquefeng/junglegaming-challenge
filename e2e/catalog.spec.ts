import { expect, test } from '@playwright/test'
import { gotoScenario, KAIQUE, login, mocks, waitForMocks } from './support'

test.describe('catálogo e favoritos (desktop)', () => {
  test.skip(({ isMobile }) => isMobile, 'layout desktop')

  test('busca, filtros combinados, ordenação, paginação e histórico', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }),
    ).toBeVisible()

    await page.getByRole('searchbox', { name: 'Buscar NFTs' }).fill('golden')
    await expect(page).toHaveURL(/q=golden/)
    await expect(
      page.getByRole('heading', { name: 'Golden Beat #207' }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }),
    ).toHaveCount(0)

    await page.getByRole('button', { name: /Música/ }).click()
    await expect(page).toHaveURL(/collection=musica/)
    await expect(page).toHaveURL(/q=golden/)
    await expect(page).toHaveURL(/page=1/)

    await page.getByRole('combobox', { name: /Ordenar por/ }).click()
    await page.getByRole('option', { name: 'Menor preço' }).click()
    await expect(page).toHaveURL(/sort=price-asc/)
    const first = page.getByRole('heading', { level: 3 }).first()
    await expect(first).toHaveText('Golden Signal #160')

    await page.goBack()
    await expect(page).not.toHaveURL(/sort=price-asc/)
    await expect(page).toHaveURL(/collection=musica/)
    await page.goBack()
    await expect(page).not.toHaveURL(/collection=musica/)

    await page.reload()
    await expect(
      page.getByRole('searchbox', { name: 'Buscar NFTs' }),
    ).toHaveValue('golden')
  })

  test('resultado vazio mostra mensagem', async ({ page }) => {
    await page.goto('/?q=zzzz')
    await expect(
      page.getByText('Nenhum NFT encontrado para os filtros selecionados.'),
    ).toBeVisible()
  })

  test('cenário "empty" não retorna NFTs', async ({ page }) => {
    await page.goto('/?scenario=empty')
    await expect(
      page.getByText('Nenhum NFT encontrado para os filtros selecionados.'),
    ).toBeVisible()
  })

  test('favoritos: persistem para o usuário e visitante é levado ao login', async ({
    page,
  }) => {
    await page.goto('/')
    await page
      .getByRole('button', { name: 'Favoritar Sage Nomad #009' })
      .click()
    await expect(page).toHaveURL(/\/login/)

    await login(page, KAIQUE)
    await page.goto('/')

    await expect(
      page.getByRole('button', {
        name: 'Remover Emerald Ape #042 dos favoritos',
      }),
    ).toBeVisible()
    const saved = page.waitForResponse(
      (r) =>
        r.request().method() === 'PUT' &&
        new URL(r.url()).pathname === '/api/favorites/2',
    )
    await page
      .getByRole('button', { name: 'Favoritar Sage Nomad #009' })
      .click()
    await expect(
      page.getByRole('button', {
        name: 'Remover Sage Nomad #009 dos favoritos',
      }),
    ).toBeVisible()
    await saved
    await page.reload()
    await expect(
      page.getByRole('button', {
        name: 'Remover Sage Nomad #009 dos favoritos',
      }),
    ).toBeVisible()
  })

  test('favoritos: falha na mutation faz rollback e avisa', async ({
    page,
  }) => {
    await gotoScenario(page, 'favorites-fail')
    await login(page, KAIQUE)
    await page.goto('/')
    const button = page.getByRole('button', {
      name: 'Favoritar Sage Nomad #009',
    })
    await button.click()

    await expect(
      page.getByText(/Não foi possível atualizar os favoritos/),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Favoritar Sage Nomad #009' }),
    ).toHaveAttribute('aria-pressed', 'false')

    await mocks(page, 'setScenario', 'default')
    await page
      .getByRole('button', { name: 'Favoritar Sage Nomad #009' })
      .click()
    await expect(
      page.getByRole('button', {
        name: 'Remover Sage Nomad #009 dos favoritos',
      }),
    ).toBeVisible()
  })
})

test.describe('latência, falhas e recuperação (desktop)', () => {
  test.skip(({ isMobile }) => isMobile, 'layout desktop')

  test('skeletons durante carregamento lento e conteúdo depois', async ({
    page,
  }) => {
    await page.goto('/?scenario=slow')
    await expect(page.getByText('Carregando NFTs')).toBeAttached()
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }),
    ).toBeVisible({ timeout: 20_000 })
    await expect(page.getByText('Carregando NFTs')).toHaveCount(0)
  })

  test('erro HTTP 500 mostra feedback e recupera com nova tentativa', async ({
    page,
  }) => {
    await page.goto('/?scenario=server-error')
    await expect(
      page.getByText('Não foi possível carregar os NFTs.'),
    ).toBeVisible({ timeout: 20_000 })

    await waitForMocks(page)
    await mocks(page, 'setScenario', 'default')
    await page.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }),
    ).toBeVisible()
  })

  test('falha de conexão (offline) é tratada e recuperável', async ({
    page,
  }) => {
    await page.goto('/?scenario=offline')
    await expect(
      page.getByText('Não foi possível carregar os NFTs.'),
    ).toBeVisible({ timeout: 20_000 })
    await waitForMocks(page)
    await mocks(page, 'setScenario', 'default')
    await page.getByRole('button', { name: 'Tentar novamente' }).click()
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }),
    ).toBeVisible()
  })

  test('respostas fora de ordem não sobrescrevem a consulta mais recente', async ({
    page,
  }) => {
    await page.goto('/?scenario=out-of-order')
    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }),
    ).toBeVisible()
    const search = page.getByRole('searchbox', { name: 'Buscar NFTs' })

    await search.fill('golden')
    await expect(page).toHaveURL(/q=golden/)
    await search.fill('')
    await expect(page).not.toHaveURL(/q=/)
    await page.waitForTimeout(2200)

    await expect(
      page.getByRole('heading', { name: 'Emerald Ape #042' }),
    ).toBeVisible()
    await expect(
      page.getByRole('searchbox', { name: 'Buscar NFTs' }),
    ).toHaveValue('')
  })

  test('detalhe: skeleton durante carregamento lento', async ({ page }) => {
    await page.goto('/nft/1?scenario=slow')
    await expect(page.getByText('Carregando NFT')).toBeAttached()
    await expect(
      page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' }),
    ).toBeVisible({ timeout: 20_000 })
  })
})

test.describe('acessibilidade', () => {
  test.skip(({ isMobile }) => isMobile, 'layout desktop')

  test('diálogo de login prende o foco, fecha com Escape e associa erros aos campos', async ({
    page,
  }) => {
    await page.goto('/login')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab')
      const inside = await page.evaluate(() =>
        Boolean(document.activeElement?.closest('[role=dialog]')),
      )
      expect(inside).toBe(true)
    }

    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    const email = page.getByLabel('E-mail')
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    const describedBy = await email.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    await expect(page.locator(`#${describedBy}`)).toHaveText(
      'Campo obrigatório.',
    )

    await page.keyboard.press('Escape')
    await expect(page).toHaveURL('/')
  })

  test('detalhe é operável só pelo teclado e o foco fica visível', async ({
    page,
  }) => {
    await page.goto('/nft/1')
    await expect(
      page.getByRole('heading', { level: 1, name: 'Emerald Ape #042' }),
    ).toBeVisible()
    const add = page.getByRole('button', { name: 'Adicionar ao carrinho' })
    await add.focus()
    await expect(add).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(
      page.getByText('Emerald Ape #042 adicionado ao carrinho.'),
    ).toBeVisible()
  })

  test('senha pode ser mostrada/ocultada por teclado', async ({ page }) => {
    await page.goto('/login')
    const password = page.getByLabel('Senha', { exact: true })
    await expect(password).toHaveAttribute('type', 'password')
    await page.getByRole('button', { name: 'Mostrar senha' }).focus()
    await page.keyboard.press('Enter')
    await expect(password).toHaveAttribute('type', 'text')
  })
})
