import { cn } from '@/lib/utils'
import { useState, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
  const isPassword = props.type === 'password'
  const [showPassword, setShowPassword] = useState(false)
  const actualType = isPassword && showPassword ? 'text' : props.type
  const { type: _type, ...inputProps } = props

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ocean-800">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={actualType}
          className={cn(
            'w-full rounded-xl border border-ocean-200 bg-white px-4 py-2.5 text-ocean-900',
            'placeholder:text-ocean-400 transition-colors',
            'focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20',
            isPassword && 'pr-12',
            error && 'border-coral-500 focus:border-coral-500 focus:ring-coral-500/20',
            className,
          )}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-ocean-500 transition-colors hover:text-ocean-700"
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 3l18 18" />
                <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                <path d="M9.88 5.09A10.94 10.94 0 0112 5c5.55 0 9.55 4.5 10.5 7a11.87 11.87 0 01-4.1 5.05" />
                <path d="M6.1 6.1C3.9 7.5 2.3 9.7 1.5 12c.93 2.5 4.95 7 10.5 7 1.14 0 2.22-.15 3.21-.43" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-coral-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-sm text-ocean-500">{hint}</p>}
    </div>
  )
}
