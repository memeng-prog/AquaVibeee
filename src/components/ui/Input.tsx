import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ocean-800">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-ocean-200 bg-white px-4 py-2.5 text-ocean-900',
          'placeholder:text-ocean-400 transition-colors',
          'focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20',
          error && 'border-coral-500 focus:border-coral-500 focus:ring-coral-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-coral-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-ocean-500">{hint}</p>}
    </div>
  )
}
