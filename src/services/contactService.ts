import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type { ContactMessage, NewsletterSubscription } from '@/types'

export async function submitContactMessage(data: ContactMessage): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabase()!
    const { error } = await supabase.from('contact_messages').insert(data as never)
    if (error) throw error
    return
  }

  await simulateDelay()
  const messages = JSON.parse(localStorage.getItem('mft_contact') ?? '[]')
  messages.push({ ...data, id: Date.now(), createdAt: new Date().toISOString() })
  localStorage.setItem('mft_contact', JSON.stringify(messages))
}

export async function subscribeNewsletter(data: NewsletterSubscription): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = getSupabase()!
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: data.email } as never)
    if (error) throw error
    return
  }

  await simulateDelay()
  const subs = JSON.parse(localStorage.getItem('mft_newsletter') ?? '[]')
  if (!subs.includes(data.email)) {
    subs.push(data.email)
    localStorage.setItem('mft_newsletter', JSON.stringify(subs))
  }
}

function simulateDelay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
