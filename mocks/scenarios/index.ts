export type ScenarioName =
  | 'default'
  | 'empty'
  | 'slow'
  | 'variable-latency'
  | 'out-of-order'
  | 'flaky'
  | 'offline'
  | 'server-error'
  | 'order-timeout'
  | 'payment-declined'
  | 'favorites-fail'
  | 'forbidden-profile'

export type Scenario = {
  name: ScenarioName

  latency: number
  jitter: number
  emptyCatalog: boolean

  catalogFailure: number | 'network' | null

  catalogFailEveryN: number

  outOfOrder: boolean
  orderOutcome: 'confirm' | 'decline'

  orderResponseDelay: number
  failFavorites: boolean
  forbidProfile: boolean

  orderSettleMs: number
}

const base: Scenario = {
  name: 'default',
  latency: 150,
  jitter: 0,
  emptyCatalog: false,
  catalogFailure: null,
  catalogFailEveryN: 0,
  outOfOrder: false,
  orderOutcome: 'confirm',
  orderResponseDelay: 0,
  failFavorites: false,
  forbidProfile: false,
  orderSettleMs: 2500,
}

export const scenarios: Record<ScenarioName, Scenario> = {
  default: base,
  empty: { ...base, name: 'empty', emptyCatalog: true },
  slow: { ...base, name: 'slow', latency: 2500 },
  'variable-latency': {
    ...base,
    name: 'variable-latency',
    latency: 100,
    jitter: 1400,
  },
  'out-of-order': { ...base, name: 'out-of-order', outOfOrder: true },
  flaky: { ...base, name: 'flaky', catalogFailEveryN: 2 },
  offline: { ...base, name: 'offline', catalogFailure: 'network' },
  'server-error': { ...base, name: 'server-error', catalogFailure: 500 },
  'order-timeout': {
    ...base,
    name: 'order-timeout',
    orderResponseDelay: 12_000,
  },
  'payment-declined': {
    ...base,
    name: 'payment-declined',
    orderOutcome: 'decline',
  },
  'favorites-fail': { ...base, name: 'favorites-fail', failFavorites: true },
  'forbidden-profile': {
    ...base,
    name: 'forbidden-profile',
    forbidProfile: true,
  },
}

const STORAGE_KEY = 'kurio.scenario'

function isScenario(name: string | null): name is ScenarioName {
  return name !== null && name in scenarios
}

export function resolveScenarioName(): ScenarioName {
  const fromUrl = new URLSearchParams(window.location.search).get('scenario')
  if (isScenario(fromUrl)) {
    window.localStorage.setItem(STORAGE_KEY, fromUrl)
    return fromUrl
  }
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isScenario(stored)) return stored
  const fromEnv = import.meta.env.VITE_MOCK_SCENARIO as string | undefined
  return isScenario(fromEnv ?? null) ? (fromEnv as ScenarioName) : 'default'
}

let current: Scenario = base

export const getScenario = () => current

export function setScenario(name: ScenarioName) {
  current = scenarios[name]
  window.localStorage.setItem(STORAGE_KEY, name)
}

export function initScenario() {
  current = scenarios[resolveScenarioName()]
}
