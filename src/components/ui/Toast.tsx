import { CheckCircle, Info } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface ToastMessage {
  id: string
  type: 'success' | 'error'
  message: string
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl px-4 py-3 shadow-float animate-slide-up',
        toast.type === 'success'
          ? 'bg-emerald-600 text-white'
          : 'bg-amber-500 text-slate-950',
      )}
      role="alert"
    >
      {toast.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/20"
        aria-label="Dismiss"
      >
        Got it
      </button>
    </div>
  )
}
