'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

const CONTACT_EMAIL = 'thelaxmii07@gmail.com'

// Generate available time slots
const TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
]

// Get minimum date (tomorrow)
const getMinDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

// Get maximum date (3 months from now)
const getMaxDate = () => {
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  return maxDate.toISOString().split('T')[0]
}

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setSubmitStatus('success')
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', date: '', time: '', message: '' })
    setSubmitStatus('idle')
  }

  return (
    <main className="min-h-screen bg-laxmi-cream dark:bg-background transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-laxmi-cream/95 dark:bg-background/95 backdrop-blur-md border-b border-laxmi-gold/10">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <Link href="/" className="text-xl tracking-[0.3em] font-serif font-light text-foreground">
            LAXMI
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <p className="text-spaced text-laxmi-bronze mb-4">By Appointment Only</p>
            <h1 className="font-serif font-light text-4xl md:text-5xl mb-6 text-foreground">
              Request a Consultation
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Share your preferences and our design concierge will personally
              arrange your private consultation at a time that suits you.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Booking Form - 3 columns */}
            <div className="lg:col-span-3 bg-white dark:bg-card rounded-xl p-8 md:p-10 shadow-sm border border-laxmi-gold/10">
              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-laxmi-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-10 h-10 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl mb-3 text-foreground">Request Received</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Thank you for your interest in LAXMI.
                  </p>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Our design concierge will personally contact you at <strong className="text-foreground">{formData.email}</strong> within 24 hours to confirm your private consultation.
                  </p>
                  <div className="pt-4 border-t border-laxmi-gold/10">
                    <p className="text-sm text-muted-foreground mb-6">
                      For immediate assistance, please contact us directly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="btn-luxury text-laxmi-bronze border-laxmi-bronze hover:bg-laxmi-bronze hover:text-white"
                      >
                        Contact Us
                      </a>
                      <button
                        onClick={resetForm}
                        className="btn-luxury text-muted-foreground border-muted-foreground/30 hover:border-muted-foreground hover:text-foreground"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl mb-8 text-foreground">Your Preferences</h2>

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                        placeholder="Your full name"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3.5 border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3.5 border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                          placeholder="+39 XXX XXX XXXX"
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Preferred Date</label>
                        <input
                          type="date"
                          required
                          min={getMinDate()}
                          max={getMaxDate()}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-3.5 border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Preferred Time</label>
                        <select
                          required
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-3.5 border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                        >
                          <option value="">Select a time</option>
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot.value} value={slot.value}>
                              {slot.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Project Details</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3.5 border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all resize-none"
                        placeholder="Tell us about your space, style preferences, and any specific requirements..."
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-laxmi-bronze text-white font-medium tracking-wider rounded-lg hover:bg-laxmi-espresso transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'REQUEST CONSULTATION'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Sidebar - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* The Experience */}
              <div className="bg-laxmi-gold/5 dark:bg-card/50 rounded-xl p-8 border border-laxmi-gold/10">
                <h3 className="font-serif text-xl mb-6 text-foreground">The Experience</h3>
                <ul className="space-y-5">
                  {[
                    { step: 'Request', desc: 'Share your vision and preferences' },
                    { step: 'Connect', desc: 'Personal call from our design concierge' },
                    { step: 'Consult', desc: 'Private session tailored to you' },
                    { step: 'Curate', desc: 'Bespoke Italian furniture selection' },
                    { step: 'Deliver', desc: 'White-glove installation service' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-laxmi-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-laxmi-bronze text-xs font-medium">{i + 1}</span>
                      </span>
                      <div>
                        <span className="text-foreground font-medium">{item.step}</span>
                        <p className="text-muted-foreground text-sm">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-white dark:bg-card rounded-xl p-8 shadow-sm border border-laxmi-gold/10">
                <h3 className="font-serif text-xl mb-6 text-foreground">Direct Contact</h3>
                <div className="space-y-4">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span className="w-10 h-10 rounded-full bg-laxmi-gold/10 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors">
                      <svg className="w-5 h-5 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="text-sm">{CONTACT_EMAIL}</span>
                  </a>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="w-10 h-10 rounded-full bg-laxmi-gold/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <span className="text-sm">Milan, Italy</span>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="text-center text-sm text-muted-foreground py-4">
                <p className="font-medium text-foreground mb-1">Consultation Hours</p>
                <p>Monday – Friday</p>
                <p>9:00 AM – 6:00 PM CET</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
