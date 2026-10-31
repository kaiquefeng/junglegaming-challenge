export type Rule = (value: string) => string | undefined

export const required: Rule = (value) =>
  value.trim() ? undefined : 'Campo obrigatório.'

export const email: Rule = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ? undefined
    : 'Informe um e-mail válido.'

export const minLength =
  (length: number, message?: string): Rule =>
  (value) =>
    value.length >= length
      ? undefined
      : (message ?? `Use ao menos ${length} caracteres.`)

export const walletAddress: Rule = (value) =>
  /^0x[0-9a-fA-F]{40}$/.test(value.trim())
    ? undefined
    : 'Endereço 0x inválido (42 caracteres hexadecimais).'

export const optionalWalletAddress: Rule = (value) =>
  value.trim() ? walletAddress(value) : undefined

export const matches =
  (other: () => string, message = 'Os valores não conferem.'): Rule =>
  (value) =>
    value === other() ? undefined : message

export function validate<T extends Record<string, string>>(
  values: T,
  rules: { [K in keyof T]?: Rule[] },
) {
  const errors: Partial<Record<keyof T, string>> = {}
  for (const name of Object.keys(rules) as (keyof T)[]) {
    for (const rule of rules[name] ?? []) {
      const message = rule(values[name] ?? '')
      if (message) {
        errors[name] = message
        break
      }
    }
  }
  return errors
}
