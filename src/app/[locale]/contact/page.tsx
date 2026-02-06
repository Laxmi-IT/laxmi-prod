import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { getDictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import { SunburstLogo } from "@/components/laxmi-logo";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "it" || localeParam === "en" ? localeParam : "it") as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link href={`/${locale}`} className="flex flex-col items-center group">
            <SunburstLogo className="w-8 h-5 md:w-10 md:h-6 text-laxmi-bronze transition-transform duration-500 group-hover:scale-110" />
            <span className="text-lg md:text-xl tracking-[0.25em] md:tracking-[0.3em] font-serif font-light mt-0.5 md:mt-1">
              LAXMI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href={`/${locale}`} className="nav-link">{dict.nav.home}</Link>
            <Link href={`/${locale}/consulting`} className="nav-link">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link">{dict.nav.collections}</Link>
            <Link href={`/${locale}/blog`} className="nav-link">Blog</Link>
            <Link href={`/${locale}/about`} className="nav-link">{dict.nav.about}</Link>
            <Link href={`/${locale}/contact`} className="nav-link text-laxmi-gold">{dict.nav.contact}</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
            <MobileNav
              locale={locale}
              navItems={[
                { href: `/${locale}`, label: dict.nav.home },
                { href: `/${locale}/consulting`, label: dict.nav.consulting },
                { href: `/${locale}/collections`, label: dict.nav.collections },
                { href: `/${locale}/blog`, label: "Blog" },
                { href: `/${locale}/about`, label: dict.nav.about },
                { href: `/${locale}/contact`, label: dict.nav.contact },
              ]}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center pt-20 md:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-elegant-living.jpg"
            alt={locale === "it" ? "Contattaci - LAXMI" : "Contact Us - LAXMI"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-2xl animate-glass-fade">
            <div
              className="relative overflow-hidden rounded-2xl md:rounded-3xl"
            >
              <div
                className="absolute inset-0 rounded-2xl md:rounded-3xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-2xl md:rounded-3xl" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl md:rounded-3xl" />

              <div className="relative p-6 sm:p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-laxmi-gold to-laxmi-gold/50" />
                  <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-laxmi-gold font-medium">
                    {dict.contactPage?.label || (locale === "it" ? "Parliamo" : "Let's Talk")}
                  </span>
                </div>

                <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl text-white mb-4 leading-[1.1]">
                  {dict.contactPage?.heroTitle || (locale === "it" ? "Contattaci" : "Contact Us")}
                </h1>

                <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                  {dict.contactPage?.heroSubtitle || (locale === "it"
                    ? "Siamo qui per trasformare la tua visione in realtà"
                    : "We're here to transform your vision into reality")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content Section */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Contact Information */}
            <div className="space-y-10 animate-fade-in-up">
              <div>
                <p className="text-spaced text-laxmi-gold mb-4">
                  {dict.contactPage?.infoLabel || (locale === "it" ? "I Nostri Riferimenti" : "Our Details")}
                </p>
                <h2 className="font-serif font-light text-3xl md:text-4xl mb-6">
                  {dict.contactPage?.infoTitle || (locale === "it" ? "Inizia una Conversazione" : "Start a Conversation")}
                </h2>
                <div className="gold-line w-16" />
              </div>

              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                {dict.contactPage?.infoDescription || (locale === "it"
                  ? "Ogni grande progetto inizia con una semplice conversazione. Che tu abbia una visione chiara o stia cercando ispirazione, siamo qui per guidarti nel tuo percorso verso l'eccellenza."
                  : "Every great project begins with a simple conversation. Whether you have a clear vision or are seeking inspiration, we're here to guide you on your journey to excellence.")}
              </p>

              {/* Contact Details Cards */}
              <div className="space-y-6">
                {/* Email */}
                <div className="card-luxury p-6 flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-full bg-laxmi-champagne/50 flex items-center justify-center flex-shrink-0 group-hover:bg-laxmi-gold/20 transition-colors duration-300">
                    <svg className="w-5 h-5 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg mb-1">Email</h4>
                    <a href="mailto:thelaxmii07@gmail.com" className="text-muted-foreground hover:text-laxmi-bronze transition-colors">
                      thelaxmii07@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="card-luxury p-6 flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-full bg-laxmi-champagne/50 flex items-center justify-center flex-shrink-0 group-hover:bg-laxmi-gold/20 transition-colors duration-300">
                    <svg className="w-5 h-5 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg mb-1">
                      {locale === "it" ? "Telefono" : "Phone"}
                    </h4>
                    <a href="tel:+390000000000" className="text-muted-foreground hover:text-laxmi-bronze transition-colors">
                      +39 000 000 0000
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="card-luxury p-6 flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-full bg-laxmi-champagne/50 flex items-center justify-center flex-shrink-0 group-hover:bg-laxmi-gold/20 transition-colors duration-300">
                    <svg className="w-5 h-5 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg mb-1">
                      {locale === "it" ? "Sede" : "Location"}
                    </h4>
                    <p className="text-muted-foreground">
                      {locale === "it" ? "Milano, Italia" : "Milan, Italy"}
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="card-luxury p-6 flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-full bg-laxmi-champagne/50 flex items-center justify-center flex-shrink-0 group-hover:bg-laxmi-gold/20 transition-colors duration-300">
                    <svg className="w-5 h-5 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg mb-1">
                      {locale === "it" ? "Solo su Appuntamento" : "By Appointment Only"}
                    </h4>
                    <p className="text-muted-foreground">
                      {locale === "it"
                        ? "Lun - Ven: 9:00 - 18:00"
                        : "Mon - Fri: 9:00 AM - 6:00 PM"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <p className="text-spaced text-sm text-laxmi-bronze mb-4">
                  {locale === "it" ? "Seguici" : "Follow Us"}
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/laxmi.luxury"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-laxmi-gold/30 flex items-center justify-center hover:bg-laxmi-gold/10 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 text-laxmi-bronze" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.pinterest.com/laxmiluxury"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-laxmi-gold/30 flex items-center justify-center hover:bg-laxmi-gold/10 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5 text-laxmi-bronze" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up delay-200">
              <div className="card-luxury p-6 sm:p-8 md:p-10">
                <h3 className="font-serif text-2xl md:text-3xl mb-6">
                  {dict.contactPage?.formTitle || (locale === "it" ? "Inviaci un Messaggio" : "Send Us a Message")}
                </h3>
                <div className="gold-line w-12 mb-8" />

                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">
                        {dict.booking.form.name}
                      </label>
                      <input
                        type="text"
                        placeholder={dict.booking.form.namePlaceholder}
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-laxmi-gold/50 focus:ring-1 focus:ring-laxmi-gold/30 transition-all font-light"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground/80">
                        {dict.booking.form.email}
                      </label>
                      <input
                        type="email"
                        placeholder={dict.booking.form.emailPlaceholder}
                        className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-laxmi-gold/50 focus:ring-1 focus:ring-laxmi-gold/30 transition-all font-light"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      {dict.booking.form.phone}
                    </label>
                    <input
                      type="tel"
                      placeholder={dict.booking.form.phonePlaceholder}
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-laxmi-gold/50 focus:ring-1 focus:ring-laxmi-gold/30 transition-all font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      {locale === "it" ? "Oggetto" : "Subject"}
                    </label>
                    <select className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-laxmi-gold/50 focus:ring-1 focus:ring-laxmi-gold/30 transition-all font-light">
                      <option value="">{locale === "it" ? "Seleziona un argomento" : "Select a topic"}</option>
                      <option value="consulting">{locale === "it" ? "Consulenza Arredamento" : "Furniture Consulting"}</option>
                      <option value="boutique">{locale === "it" ? "Boutique" : "Boutique"}</option>
                      <option value="collaboration">{locale === "it" ? "Collaborazione" : "Collaboration"}</option>
                      <option value="other">{locale === "it" ? "Altro" : "Other"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground/80">
                      {dict.booking.form.message}
                    </label>
                    <textarea
                      rows={5}
                      placeholder={dict.booking.form.messagePlaceholder}
                      className="w-full px-4 py-3 bg-background border border-border/50 rounded-lg focus:outline-none focus:border-laxmi-gold/50 focus:ring-1 focus:ring-laxmi-gold/30 transition-all font-light resize-none"
                    />
                  </div>

                  {/* GDPR Consent Checkbox */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacy-consent"
                      required
                      className="mt-1 w-5 h-5 rounded border-border/50 text-laxmi-gold focus:ring-laxmi-gold/30 cursor-pointer"
                    />
                    <label htmlFor="privacy-consent" className="text-sm text-muted-foreground font-light leading-relaxed cursor-pointer">
                      {locale === "it" ? (
                        <>
                          Ho letto e accetto l&apos;<Link href={`/${locale}/privacy-policy`} className="text-laxmi-bronze hover:text-laxmi-gold underline">Informativa Privacy</Link> e acconsento al trattamento dei miei dati personali per rispondere alla mia richiesta. *
                        </>
                      ) : (
                        <>
                          I have read and accept the <Link href={`/${locale}/privacy-policy`} className="text-laxmi-bronze hover:text-laxmi-gold underline">Privacy Policy</Link> and consent to the processing of my personal data to respond to my request. *
                        </>
                      )}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-luxury-filled w-full"
                  >
                    {dict.contactPage?.formSubmit || (locale === "it" ? "Invia Messaggio" : "Send Message")}
                  </button>
                </form>

                <p className="text-sm text-muted-foreground mt-6 text-center">
                  {locale === "it"
                    ? "Ti risponderemo entro 24-48 ore lavorative."
                    : "We'll respond within 24-48 business hours."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Visual Section */}
      <section className="py-16 md:py-24 relative bg-laxmi-cream/30 dark:bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 animate-fade-in-up">
            <SunburstLogo className="w-12 h-8 text-laxmi-gold mx-auto mb-6" />
            <h2 className="font-serif font-light text-3xl md:text-4xl mb-4">
              {locale === "it" ? "Nel Cuore di Milano" : "In the Heart of Milan"}
            </h2>
            <p className="text-muted-foreground font-light max-w-xl mx-auto">
              {locale === "it"
                ? "La capitale mondiale del design, dove tradizione e innovazione si incontrano per creare eccellenza."
                : "The world's design capital, where tradition and innovation meet to create excellence."}
            </p>
          </div>

          {/* Elegant Map Placeholder */}
          <div className="relative max-w-4xl mx-auto animate-fade-in-up delay-200">
            <div className="aspect-[16/9] relative rounded-2xl overflow-hidden border border-laxmi-gold/20">
              <Image
                src="/images/hero-italian.jpg"
                alt={locale === "it" ? "Milano, Italia" : "Milan, Italy"}
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/80 via-laxmi-espresso/40 to-transparent" />

              {/* Location Pin */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-laxmi-gold/20 flex items-center justify-center animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-laxmi-gold/40 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-white mb-2">Milano, Italia</h3>
                    <p className="text-white/80 font-light">
                      {locale === "it" ? "Solo su Appuntamento" : "By Appointment Only"}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/book`}
                    className="btn-luxury text-white border-white/50 hover:bg-white hover:text-laxmi-espresso"
                  >
                    {locale === "it" ? "Prenota Appuntamento" : "Book Appointment"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-12 lg:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <SunburstLogo className="w-10 h-6 md:w-12 md:h-8 text-laxmi-bronze mb-2" />
                <span className="text-lg tracking-[0.3em] font-serif font-light">LAXMI</span>
              </div>
              <p className="text-muted-foreground font-light mt-4 max-w-sm">
                {dict.footer.description}
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{dict.footer.navigation}</h4>
              <ul className="space-y-1">
                <li><Link href={`/${locale}`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.home}</Link></li>
                <li><Link href={`/${locale}/consulting`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.consulting}</Link></li>
                <li><Link href={`/${locale}/collections`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.collections}</Link></li>
                <li><Link href={`/${locale}/about`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.about}</Link></li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{dict.footer.contact}</h4>
              <ul className="space-y-2 text-muted-foreground font-light">
                <li className="py-1">thelaxmii07@gmail.com</li>
                <li className="py-1">+39 000 000 0000</li>
                <li className="py-1">{locale === "it" ? "Milano, Italia" : "Milan, Italy"}</li>
              </ul>
            </div>
          </div>

          <div className="gold-line mt-8 md:mt-12 mb-6 md:mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-muted-foreground font-light order-2 md:order-1">
              &copy; {new Date().getFullYear()} LAXMI. {dict.footer.copyright}
            </p>
            <p className="text-sm text-muted-foreground font-light italic order-1 md:order-2">
              {dict.footer.quote}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
