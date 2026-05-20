import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/context/ToastContext'
import { SITE_ADDRESS, SITE_EMAIL, SITE_PHONE } from '@/lib/constants'
import { submitContactMessage } from '@/services/contactService'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'

export function ContactPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitContactMessage(form)
      showToast('Message sent! We\'ll get back to you within 24 hours.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      showToast('Failed to send message. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-ocean-900">Contact Us</h1>
          <p className="mt-4 text-ocean-600">
            Have questions about a tank, custom build, or order? Our aquarist team is here to help.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-3">
          <div className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: SITE_EMAIL, href: `mailto:${SITE_EMAIL}` },
              { icon: Phone, label: 'Phone', value: SITE_PHONE, href: `tel:${SITE_PHONE}` },
              { icon: MapPin, label: 'Showroom', value: SITE_ADDRESS },
              { icon: Clock, label: 'Hours', value: 'Mon–Sat 9am–6pm PST' },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex gap-4 rounded-2xl bg-white p-5 shadow-soft">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ocean-100 text-ocean-600">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ocean-500">{label}</p>
                  {href ? (
                    <a href={href} className="text-ocean-900 hover:text-ocean-600 font-medium">
                      {value}
                    </a>
                  ) : (
                    <p className="text-ocean-900 font-medium">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 rounded-2xl bg-white p-8 shadow-soft space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <Input
              label="Subject"
              required
              value={form.subject}
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
            <Textarea
              label="Message"
              required
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            <Button type="submit" loading={loading} size="lg">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
