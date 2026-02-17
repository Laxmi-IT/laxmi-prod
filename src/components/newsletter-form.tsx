'use client'

import { useState } from 'react'

interface NewsletterFormProps {
  locale: string
  placeholder: string
  submitLabel: string
  successMessage: string
  alreadyMessage: string
  errorMessage: string
}

export function NewsletterForm({
  locale,
  placeholder,
  submitLabel,
  successMessage,
  alreadyMessage,
  errorMessage,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || status === 'loading') return

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        return
      }

      setStatus(data.alreadySubscribed ? 'already' : 'success')
      if (!data.alreadySubscribed) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success' || status === 'already') {
    return (
      <p className="text-laxmi-gold font-light text-sm tracking-wide animate-fade-in-up">
        {status === 'success' ? successMessage : alreadyMessage}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
        placeholder={placeholder}
        required
        className="flex-1 px-4 py-3 bg-white/10 border border-laxmi-gold/30 rounded-lg text-laxmi-cream placeholder:text-laxmi-champagne/50 focus:outline-none focus:border-laxmi-gold transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-laxmi-gold text-laxmi-espresso text-sm tracking-wider uppercase font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        {status === 'loading' ? '...' : submitLabel}
      </button>
      {status === 'error' && (
        <p className="sm:absolute sm:-bottom-8 text-red-300 text-xs mt-1 sm:mt-0">{errorMessage}</p>
      )}
    </form>
  )
}
