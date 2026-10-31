import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/input'
import { cn } from '@/lib/utils'

type PasswordInputProps = React.ComponentProps<'input'> & {
  invalid?: boolean
}

export function PasswordInput({
  className,
  invalid,
  type: _ignoredType,
  ...props
}: PasswordInputProps) {
  void _ignoredType
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        aria-invalid={invalid || undefined}
        className={cn('pr-12', className)}
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#b39463] outline-none hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        {visible ? (
          <EyeOff aria-hidden="true" className="size-[18px]" />
        ) : (
          <Eye aria-hidden="true" className="size-[18px]" />
        )}
      </button>
    </div>
  )
}
