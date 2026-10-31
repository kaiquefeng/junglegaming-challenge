import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/input'
import { cn } from '@/lib/utils'
import type { FormFieldProps } from './form-field.types'

export function FormField({
  id,
  label,
  required,
  options,
  containerClassName,
  className,
  placeholder,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      <label htmlFor={id} className="flex items-center text-[15px]">
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
            required={required}
            defaultValue=""
            className={cn(
              'h-10 w-full appearance-none rounded-[3px] border border-border bg-transparent pr-8 pl-3 text-sm text-foreground outline-none focus-visible:border-ring',
              className,
            )}
          >
            <option value="" disabled className="bg-background">
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option} className="bg-background">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-2 size-[18px] -translate-y-1/2 text-muted-foreground"
          />
        </div>
      ) : (
        <Input
          id={id}
          required={required}
          placeholder={placeholder}
          className={cn(
            'h-10 rounded-[3px] border-border px-3 text-sm shadow-none placeholder:text-[#b39463]',
            className,
          )}
          {...props}
        />
      )}
    </div>
  )
}
