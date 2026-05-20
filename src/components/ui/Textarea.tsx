import { cn } from '@/lib/utils'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ocean-800">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full resize-y rounded-xl border border-ocean-200 bg-white px-4 py-2.5 text-ocean-900',
          'placeholder:text-ocean-400 transition-colors min-h-[120px]',
          'focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20',
          error && 'border-coral-500',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-coral-600">{error}</p>}
    </div>
  )
}
