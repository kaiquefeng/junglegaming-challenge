import { type ChildProcess, spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'
import desktopConfig from 'lighthouse/core/config/desktop-config.js'
import {
  BASE_URL,
  CATEGORIES,
  PAGES,
  PORT,
  PROFILES,
  type Profile,
  RUNS_PER_PAGE_PROFILE,
  TARGETS,
} from './config'

const REPORTS_DIR = path.join(import.meta.dirname, 'reports')
const noFail = process.argv.includes('--no-fail')

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[mid] as number)
    : ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2
}

function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('exit', (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${command} ${args.join(' ')} -> ${code}`)),
    )
  })
}

async function waitForServer(url: string) {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(url)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`Servidor não respondeu em ${url}`)
}

async function audit(url: string, profile: Profile, chromePort: number) {
  const result = await lighthouse(
    url,
    { port: chromePort, output: ['html', 'json'], logLevel: 'error' },
    profile === 'desktop' ? desktopConfig : undefined,
  )
  if (!result) throw new Error('Lighthouse não retornou resultado')
  const [html, json] = result.report as [string, string]
  const { lhr } = result
  return {
    html,
    json,
    version: lhr.lighthouseVersion,
    scores: Object.fromEntries(
      CATEGORIES.map((c) => [
        c,
        Math.round((lhr.categories[c]?.score ?? 0) * 100),
      ]),
    ) as Record<(typeof CATEGORIES)[number], number>,
    lcp: lhr.audits['largest-contentful-paint']?.numericValue ?? 0,
    cls: lhr.audits['cumulative-layout-shift']?.numericValue ?? 0,
    tbt: lhr.audits['total-blocking-time']?.numericValue ?? 0,
  }
}

async function main() {
  await mkdir(REPORTS_DIR, { recursive: true })

  await run('bun', ['run', 'build'])
  const server: ChildProcess = spawn(
    'bun',
    ['run', 'preview', '--port', String(PORT), '--strictPort'],
    { stdio: 'ignore' },
  )

  const chrome = await launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox'],
  })

  const lines: string[] = []
  let failed = false
  let lighthouseVersion = ''

  try {
    await waitForServer(BASE_URL)

    for (const page of PAGES) {
      for (const profile of PROFILES) {
        const runs = []
        for (let i = 1; i <= RUNS_PER_PAGE_PROFILE; i++) {
          const r = await audit(`${BASE_URL}${page.path}`, profile, chrome.port)
          lighthouseVersion = r.version
          const base = path.join(REPORTS_DIR, `${page.name}-${profile}-run${i}`)
          await writeFile(`${base}.html`, r.html)
          await writeFile(`${base}.json`, r.json)
          runs.push(r)
        }

        const row = (label: string, value: string) =>
          `| ${page.name} | ${profile} | ${label} | ${value} |`
        for (const category of CATEGORIES) {
          const m = median(runs.map((r) => r.scores[category]))
          const ok = m >= TARGETS[category]
          if (!ok) failed = true
          lines.push(
            row(
              category,
              `${m} (meta ≥ ${TARGETS[category]}) ${ok ? '✅' : '❌'}`,
            ),
          )
        }
        lines.push(
          row('LCP (ms)', String(Math.round(median(runs.map((r) => r.lcp))))),
        )
        lines.push(row('CLS', median(runs.map((r) => r.cls)).toFixed(3)))
        lines.push(
          row('TBT (ms)', String(Math.round(median(runs.map((r) => r.tbt))))),
        )
      }
    }
  } finally {
    await chrome.kill()
    server.kill()
  }

  const summary = [
    '# Lighthouse — resumo (mediana de 3 execuções)',
    '',
    `- Lighthouse: ${lighthouseVersion}`,
    `- Chromium (Playwright): ${chromium.name()} ${path.basename(chromium.executablePath())}`,
    `- Node: ${process.version} · bun: ${Bun.version}`,
    `- SO: ${os.type()} ${os.release()} (${os.arch()}) · CPUs: ${os.cpus().length}`,
    `- Alvo: build otimizado (\`vite build\`) servido por \`vite preview\` em ${BASE_URL}, mocks MSW ativos, cenário padrão`,
    `- Data: ${new Date().toISOString()}`,
    '',
    '| Página | Perfil | Métrica | Mediana |',
    '| --- | --- | --- | --- |',
    ...lines,
    '',
  ].join('\n')

  await writeFile(path.join(REPORTS_DIR, 'summary.md'), summary)
  console.log(summary)

  if (failed && !noFail) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
