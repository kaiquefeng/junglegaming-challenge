import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/input'
import { PasswordInput } from '@/components/password-input'
import { cn } from '@/lib/utils'
import type { FormFieldProps } from './form-field.types'

export function FormField({
  id,
  label,
  value,
  onValueChange,
  required,
  error,
  options,
  hideLabel,
  containerClassName,
  className,
  placeholder,
  ...props
}: FormFieldProps) {
  const errorId = `${id}-error`
  const aria = {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    'aria-required': required || undefined,
  } as const
  const border = error ? 'border-destructive' : 'border-border'

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      <label
        htmlFor={id}
        className={cn('flex items-center text-[15px]', hideLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span
            aria-hidden="true"
            className="text-[22px] leading-none text-[#f0805f]"
          >
            *
          </span>
        )}
      </label>
      {options ? (
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            className={cn(
              'h-10 w-full appearance-none rounded-[3px] border bg-transparent pr-8 pl-3 text-sm text-foreground outline-none focus-visible:border-ring',
              border,
              className,
            )}
            {...aria}
          >
            <option value="" disabled className="bg-background">
              {placeholder}
            </option>
            {options.map((option) => {
              const item =
                typeof option === 'string'
                  ? { value: option, label: option }
                  : option
              return (
                <option
                  key={item.value}
                  value={item.value}
                  className="bg-background"
                >
                  {item.label}
                </option>
              )
            })}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2 size-[18px] -translate-y-1/2 text-muted-foreground"
          />
        </div>
      ) : props.type === 'password' ? (
        <PasswordInput
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-10 rounded-[3px] px-3 text-sm shadow-none placeholder:text-[#b39463]',
            border,
            className,
          )}
          {...aria}
          {...props}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-10 rounded-[3px] px-3 text-sm shadow-none placeholder:text-[#b39463]',
            border,
            className,
          )}
          {...aria}
          {...props}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
