'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { type Locale } from '@/i18n/config'

const CONTACT_EMAIL = 'thelaxmii07@gmail.com'

// Translations for the booking page
const translations = {
  it: {
    back: '← Indietro',
    subtitle: 'Solo su Appuntamento',
    title: 'Richiedi una Consulenza',
    description: 'Condividi le tue preferenze e il nostro design concierge organizzerà personalmente la tua consulenza privata in un orario a te comodo.',
    form: {
      title: 'Le Tue Preferenze',
      name: 'Nome Completo *',
      namePlaceholder: 'Il tuo nome completo',
      email: 'Email *',
      emailPlaceholder: 'la-tua@email.com',
      phone: 'Telefono',
      phonePlaceholder: '+39 XXX XXX XXXX',
      date: 'Data Preferita',
      time: 'Orario Preferito',
      timeSelect: 'Seleziona un orario',
      message: 'Dettagli del Progetto',
      messagePlaceholder: 'Raccontaci del tuo spazio, le tue preferenze di stile e qualsiasi requisito specifico...',
      submit: 'RICHIEDI CONSULENZA',
      submitting: 'Invio in corso...',
    },
    success: {
      title: 'Richiesta Ricevuta',
      message1: 'Grazie per il tuo interesse in LAXMI.',
      message2: 'Il nostro design concierge ti contatterà personalmente a',
      message3: 'entro 24 ore per confermare la tua consulenza privata.',
      immediate: 'Per assistenza immediata, contattaci direttamente.',
      contact: 'Contattaci',
      another: 'Invia un\'altra Richiesta',
    },
    experience: {
      title: 'L\'Esperienza',
      steps: [
        { step: 'Richiesta', desc: 'Condividi la tua visione e preferenze' },
        { step: 'Contatto', desc: 'Chiamata personale dal nostro design concierge' },
        { step: 'Consulenza', desc: 'Sessione privata su misura per te' },
        { step: 'Selezione', desc: 'Selezione di mobili italiani su misura' },
        { step: 'Consegna', desc: 'Servizio di installazione esclusivo' },
      ],
    },
    contact: {
      title: 'Contatto Diretto',
      location: 'Milano, Italia',
    },
    hours: {
      title: 'Orari Consulenze',
      days: 'Lunedì – Venerdì',
      time: '9:00 – 18:00 CET',
    },
  },
  en: {
    back: '← Back',
    subtitle: 'By Appointment Only',
    title: 'Request a Consultation',
    description: 'Share your preferences and our design concierge will personally arrange your private consultation at a time that suits you.',
    form: {
      title: 'Your Preferences',
      name: 'Full Name *',
      namePlaceholder: 'Your full name',
      email: 'Email *',
      emailPlaceholder: 'your@email.com',
      phone: 'Phone',
      phonePlaceholder: '+39 XXX XXX XXXX',
      date: 'Preferred Date',
      time: 'Preferred Time',
      timeSelect: 'Select a time',
      message: 'Project Details',
      messagePlaceholder: 'Tell us about your space, style preferences, and any specific requirements...',
      submit: 'REQUEST CONSULTATION',
      submitting: 'Submitting...',
    },
    success: {
      title: 'Request Received',
      message1: 'Thank you for your interest in LAXMI.',
      message2: 'Our design concierge will personally contact you at',
      message3: 'within 24 hours to confirm your private consultation.',
      immediate: 'For immediate assistance, please contact us directly.',
      contact: 'Contact Us',
      another: 'Submit Another Request',
    },
    experience: {
      title: 'The Experience',
      steps: [
        { step: 'Request', desc: 'Share your vision and preferences' },
        { step: 'Connect', desc: 'Personal call from our design concierge' },
        { step: 'Consult', desc: 'Private session tailored to you' },
        { step: 'Curate', desc: 'Bespoke Italian furniture selection' },
        { step: 'Deliver', desc: 'White-glove installation service' },
      ],
    },
    contact: {
      title: 'Direct Contact',
      location: 'Milan, Italy',
    },
    hours: {
      title: 'Consultation Hours',
      days: 'Monday – Friday',
      time: '9:00 AM – 6:00 PM CET',
    },
  },
}

const TIME_SLOTS = [
  { value: '09:00', label: '9:00' },
  { value: '10:00', label: '10:00' },
  { value: '11:00', label: '11:00' },
  { value: '14:00', label: '14:00' },
  { value: '15:00', label: '15:00' },
  { value: '16:00', label: '16:00' },
  { value: '17:00', label: '17:00' },
]

const getMinDate = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

const getMaxDate = () => {
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  return maxDate.toISOString().split('T')[0]
}

export default function BookPage() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'it'
  const t = translations[locale]

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
        body: JSON.stringify({ ...formData, locale }),
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
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link href={`/${locale}`} className="text-lg md:text-xl tracking-[0.25em] md:tracking-[0.3em] font-serif font-light text-foreground">
            LAXMI
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <Link
              href={`/${locale}`}
              className="text-sm tracking-wider text-muted-foreground hover:text-foreground transition-colors min-h-[44px] flex items-center"
            >
              {t.back}
            </Link>
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-10 md:mb-12 lg:mb-16">
            <p className="text-spaced text-laxmi-bronze mb-3 md:mb-4">{t.subtitle}</p>
            <h1 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6 text-foreground">
              {t.title}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              {t.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
            {/* Booking Form - 3 columns */}
            <div className="lg:col-span-3 bg-white dark:bg-card rounded-xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-sm border border-laxmi-gold/10">
              {submitStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-laxmi-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-10 h-10 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl mb-3 text-foreground">{t.success.title}</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    {t.success.message1}
                  </p>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {t.success.message2} <strong className="text-foreground">{formData.email}</strong> {t.success.message3}
                  </p>
                  <div className="pt-4 border-t border-laxmi-gold/10">
                    <p className="text-sm text-muted-foreground mb-6">
                      {t.success.immediate}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="btn-luxury text-laxmi-bronze border-laxmi-bronze hover:bg-laxmi-bronze hover:text-white"
                      >
                        {t.success.contact}
                      </a>
                      <button
                        onClick={resetForm}
                        className="btn-luxury text-muted-foreground border-muted-foreground/30 hover:border-muted-foreground hover:text-foreground"
                      >
                        {t.success.another}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl mb-8 text-foreground">{t.form.title}</h2>

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-700 dark:text-red-400 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">{t.form.name}</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 min-h-[48px] text-base border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                        placeholder={t.form.namePlaceholder}
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">{t.form.email}</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3.5 min-h-[48px] text-base border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                          placeholder={t.form.emailPlaceholder}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">{t.form.phone}</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3.5 min-h-[48px] text-base border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                          placeholder={t.form.phonePlaceholder}
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">{t.form.date}</label>
                        <input
                          type="date"
                          required
                          min={getMinDate()}
                          max={getMaxDate()}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full px-4 py-3.5 min-h-[48px] text-base border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">{t.form.time}</label>
                        <select
                          required
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-4 py-3.5 min-h-[48px] text-base border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all"
                        >
                          <option value="">{t.form.timeSelect}</option>
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
                      <label className="block text-sm font-medium mb-2 text-foreground">{t.form.message}</label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3.5 text-base border border-laxmi-gold/20 rounded-lg bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-laxmi-gold/30 focus:border-laxmi-gold/40 transition-all resize-none"
                        placeholder={t.form.messagePlaceholder}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 min-h-[52px] text-base bg-laxmi-bronze text-white font-medium tracking-wider rounded-lg hover:bg-laxmi-espresso transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t.form.submitting}
                        </span>
                      ) : (
                        t.form.submit
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Sidebar - 2 columns */}
            <div className="lg:col-span-2 space-y-5 md:space-y-6">
              {/* The Experience */}
              <div className="bg-laxmi-gold/5 dark:bg-card/50 rounded-xl p-5 sm:p-6 md:p-8 border border-laxmi-gold/10">
                <h3 className="font-serif text-xl mb-6 text-foreground">{t.experience.title}</h3>
                <ul className="space-y-5">
                  {t.experience.steps.map((item, i) => (
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
              <div className="bg-white dark:bg-card rounded-xl p-5 sm:p-6 md:p-8 shadow-sm border border-laxmi-gold/10">
                <h3 className="font-serif text-xl mb-6 text-foreground">{t.contact.title}</h3>
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
                    <span className="text-sm">{t.contact.location}</span>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="text-center text-sm text-muted-foreground py-4">
                <p className="font-medium text-foreground mb-1">{t.hours.title}</p>
                <p>{t.hours.days}</p>
                <p>{t.hours.time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
