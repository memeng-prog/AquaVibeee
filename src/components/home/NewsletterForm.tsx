import { Button } from '@/components/ui/Button'
import { useToast } from '@/context/ToastContext'
import { subscribeNewsletter } from '@/services/contactService'
import { useState } from 'react'

interface NewsletterFormProps {
  variant?: 'default' | 'footer' | 'inline'
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      await subscribeNewsletter({ email: email.trim() })
      showToast('Welcome to the Meng\'s newsletter!')
      setEmail('')
    } catch {
      showToast('Subscription failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const isFooter = variant === 'footer'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className={
          isFooter
            ? 'flex-1 rounded-xl border border-ocean-700 bg-ocean-900 px-4 py-2.5 text-sm text-white placeholder:text-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500'
            : 'flex-1 rounded-xl border border-ocean-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500/20'
        }
      />
      <Button
        type="submit"
        loading={loading}
        variant={isFooter ? 'primary' : 'primary'}
        className={isFooter ? 'shrink-0' : ''}
      >
        Subscribe
      </Button>
    </form>
  )
}
