import type * as React from 'react'

export type FormFieldProps = Omit<React.ComponentProps<'input'>, 'id'> & {
  id: string
  label: string
  required?: boolean
  // Quando informado, renderiza um <select> nativo com estas opções.
  options?: string[]
  containerClassName?: string
}
