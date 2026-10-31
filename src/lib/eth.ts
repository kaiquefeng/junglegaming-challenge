const DECIMALS = 18
const SCALE = 10n ** BigInt(DECIMALS)

export function parseEth(value: string): bigint {
  const match = /^(\d+)(?:\.(\d{1,18}))?$/.exec(value.trim())
  if (!match) throw new Error(`Valor ETH inválido: "${value}"`)
  const whole = BigInt(match[1] ?? '0')
  const fraction = BigInt((match[2] ?? '').padEnd(DECIMALS, '0'))
  return whole * SCALE + fraction
}

export function stringifyEth(units: bigint): string {
  const whole = units / SCALE
  const fraction = (units % SCALE)
    .toString()
    .padStart(DECIMALS, '0')
    .replace(/0+$/, '')
  return fraction ? `${whole}.${fraction}` : `${whole}`
}

export const addEth = (a: string, b: string) =>
  stringifyEth(parseEth(a) + parseEth(b))

export const subEth = (a: string, b: string) =>
  stringifyEth(parseEth(a) - parseEth(b))

export const mulEth = (value: string, quantity: number) =>
  stringifyEth(parseEth(value) * BigInt(quantity))

export const percentOfEth = (value: string, percent: number) =>
  stringifyEth((parseEth(value) * BigInt(percent)) / 100n)

export const compareEth = (a: string, b: string) => {
  const diff = parseEth(a) - parseEth(b)
  return diff === 0n ? 0 : diff < 0n ? -1 : 1
}

export function formatEth(value: string, minDecimals = 2) {
  const [whole = '0', fraction = ''] = stringifyEth(parseEth(value)).split('.')
  return `${whole}.${fraction.padEnd(minDecimals, '0')}`
}

export const formatEthWithSymbol = (value: string, minDecimals = 2) =>
  `${formatEth(value, minDecimals)} ETH`
