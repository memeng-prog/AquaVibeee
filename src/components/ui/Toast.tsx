import { CheckCircle, X, XCircle } from 'lucide-react'
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
        toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-coral-600 text-white',
      )}
      role="alert"
    >
      {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="rounded-lg p-1 hover:bg-white/20"
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  )
}
