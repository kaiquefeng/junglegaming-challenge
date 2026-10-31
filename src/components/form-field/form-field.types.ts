import type * as React from 'react'

export type FieldOption = { value: string; label: string }

export type FormFieldProps = Omit<
  React.ComponentProps<'input'>,
  'id' | 'value' | 'onChange' | 'defaultValue'
> & {
  id: string
  label: string
  value: string
  onValueChange: (value: string) => void
  required?: boolean
  error?: string

  options?: (string | FieldOption)[]
  hideLabel?: boolean

  containerClassName?: string
}
