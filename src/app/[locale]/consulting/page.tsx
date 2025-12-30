import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { getDictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";

// Sunburst Logo Component
function SunburstLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -180 + (i * 180) / 8;
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + Math.cos(rad) * 4;
        const y1 = 22 + Math.sin(rad) * 4;
        const x2 = 20 + Math.cos(rad) * 12;
        const y2 = 22 + Math.sin(rad) * 12;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default async function ConsultingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "it" || localeParam === "en" ? localeParam : "it") as Locale;
  const dict = await getDictionary(locale);

  const steps = [
    dict.consulting.steps.questionnaire,
    dict.consulting.steps.materials,
    dict.consulting.steps.consultation,
    dict.consulting.steps.creation,
    dict.consulting.steps.refinement,
  ];

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
            <Link href={`/${locale}/consulting`} className="nav-link text-laxmi-gold">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link">{dict.nav.collections}</Link>
            <Link href={`/${locale}/blog`} className="nav-link">Blog</Link>
            <Link href={`/${locale}/about`} className="nav-link">{dict.nav.about}</Link>
            <Link href={`/${locale}/contact`} className="nav-link">{dict.nav.contact}</Link>
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

      {/* Hero Section with Premium Glassmorphism - Same as Collections */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center pt-20 md:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-elegant-living.jpg"
            alt={locale === "it" ? "Interior design di lusso" : "Luxury interior design"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Sophisticated overlay - stronger for mobile readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Content with Glassmorphism Card */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-2xl lg:max-w-3xl animate-glass-fade">
            {/* Glassmorphism Card - Premium Effect */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
              {/* Glass background - Safari compatible with webkit prefix */}
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

              {/* Content */}
              <div className="relative p-6 sm:p-8 md:p-12 lg:p-14">
                {/* Gold accent line */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-laxmi-gold to-laxmi-gold/50" />
                  <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-laxmi-gold font-medium">
                    {locale === "it" ? "Servizio Esclusivo" : "Exclusive Service"}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6 leading-[1.1]">
                  {dict.consulting.heroTitle}
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light mb-6 md:mb-8 leading-relaxed">
                  {dict.consulting.heroSubtitle}
                </p>

                {/* Decorative divider */}
                <div className="w-16 h-px bg-laxmi-gold/60 mb-6 md:mb-8" />

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed max-w-xl mb-8">
                  {dict.consulting.heroDescription}
                </p>

                {/* Quote */}
                <blockquote className="border-l-2 border-laxmi-gold/60 pl-6 py-2">
                  <p className="text-white/90 italic font-serif text-base md:text-lg">
                    &ldquo;{dict.consulting.heroQuote}&rdquo;
                  </p>
                </blockquote>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-6 right-6 w-8 h-8 hidden md:block">
                <div className="absolute top-0 right-0 w-full h-px bg-laxmi-gold/40" />
                <div className="absolute top-0 right-0 h-full w-px bg-laxmi-gold/40" />
              </div>
              <div className="absolute bottom-6 left-6 w-8 h-8 hidden md:block">
                <div className="absolute bottom-0 left-0 w-full h-px bg-laxmi-gold/40" />
                <div className="absolute bottom-0 left-0 h-full w-px bg-laxmi-gold/40" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <SunburstLogo className="w-16 h-10 text-laxmi-gold mx-auto mb-8" />

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-laxmi-gold" />
              <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                {locale === "it" ? "La Nostra Visione" : "Our Vision"}
              </span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-laxmi-gold" />
            </div>

            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-espresso dark:text-foreground mb-8 leading-tight">
              {dict.consulting.philosophyTitle}
            </h2>

            <div className="gold-line w-16 mx-auto mb-10" />

            <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed">
              {dict.consulting.philosophyText}
            </p>
          </div>
        </div>
      </section>

      {/* Process Section - Storytelling Style */}
      <section className="py-20 md:py-32 bg-laxmi-cream/30 dark:bg-card/20 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-10 h-px bg-laxmi-gold" />
              <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                {dict.consulting.processSubtitle}
              </span>
              <div className="w-10 h-px bg-laxmi-gold" />
            </div>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-espresso dark:text-foreground">
              {dict.consulting.processTitle}
            </h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          {/* Process Steps - Premium Cards */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Connector line (desktop only) */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-laxmi-gold/40 to-laxmi-gold/10" />
                )}

                <div className="card-luxury text-center h-full">
                  {/* Number circle */}
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-6 rounded-full border-2 border-laxmi-gold/40 bg-background flex items-center justify-center">
                    <span className="text-lg md:text-xl font-light text-laxmi-bronze">
                      {step.number}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl md:text-2xl text-laxmi-espresso dark:text-foreground mb-3">
                    {step.title}
                  </h4>

                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Premium Pricing Cards */}
      <section id="services" className="py-20 md:py-32 relative scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-10 h-px bg-laxmi-gold" />
              <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                {dict.consulting.servicesSubtitle}
              </span>
              <div className="w-10 h-px bg-laxmi-gold" />
            </div>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-espresso dark:text-foreground">
              {dict.consulting.servicesTitle}
            </h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Express */}
            <div className="card-luxury flex flex-col h-full animate-fade-in-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-laxmi-gold" />
                <span className="text-xs tracking-[0.2em] uppercase text-laxmi-bronze">
                  {dict.consulting.services.express.tagline}
                </span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl text-laxmi-espresso dark:text-foreground mb-2">
                {dict.consulting.services.express.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl md:text-5xl font-light text-laxmi-espresso dark:text-foreground">
                  &euro;{dict.consulting.services.express.price}
                </span>
              </div>

              <div className="w-full h-px bg-laxmi-champagne mb-6" />

              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                {dict.consulting.services.express.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {dict.consulting.services.express.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-laxmi-gold mt-2 shrink-0" />
                    <span className="text-sm text-foreground/80 font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs tracking-wider uppercase text-muted-foreground mt-auto pt-4 border-t border-laxmi-champagne/50">
                {dict.consulting.services.express.ideal}
              </p>
            </div>

            {/* Single Room - Featured */}
            <div className="relative flex flex-col h-full animate-fade-in-up delay-100">
              {/* Featured badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="relative text-xs tracking-[0.15em] uppercase text-laxmi-espresso font-medium px-4 py-2 rounded-full overflow-hidden">
                  <span className="absolute inset-0 bg-laxmi-gold" />
                  <span className="relative z-10">{locale === "it" ? "Consigliato" : "Recommended"}</span>
                </span>
              </div>

              <div className="bg-laxmi-espresso text-laxmi-cream p-6 sm:p-8 rounded-lg ring-2 ring-laxmi-gold shadow-2xl flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-px bg-laxmi-gold" />
                  <span className="text-xs tracking-[0.2em] uppercase text-laxmi-champagne">
                    {dict.consulting.services.singleRoom.tagline}
                  </span>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl text-laxmi-cream mb-2">
                  {dict.consulting.services.singleRoom.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl md:text-5xl font-light text-laxmi-gold">
                    &euro;{dict.consulting.services.singleRoom.price}
                  </span>
                </div>

                <div className="w-full h-px bg-laxmi-gold/30 mb-6" />

                <p className="text-sm text-laxmi-cream/80 font-light leading-relaxed mb-6">
                  {dict.consulting.services.singleRoom.description}
                </p>

                <ul className="space-y-3 mb-8 flex-1">
                  {dict.consulting.services.singleRoom.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-4 h-4 mt-0.5 shrink-0 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-laxmi-cream/90 font-light">{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs tracking-wider uppercase text-laxmi-champagne/70 mt-auto pt-4 border-t border-laxmi-gold/20">
                  {dict.consulting.services.singleRoom.ideal}
                </p>
              </div>
            </div>

            {/* Full House */}
            <div className="card-luxury flex flex-col h-full animate-fade-in-up delay-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-laxmi-gold" />
                <span className="text-xs tracking-[0.2em] uppercase text-laxmi-bronze">
                  {dict.consulting.services.fullHouse.tagline}
                </span>
              </div>

              <h3 className="font-serif text-2xl md:text-3xl text-laxmi-espresso dark:text-foreground mb-2">
                {dict.consulting.services.fullHouse.name}
              </h3>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl md:text-5xl font-light text-laxmi-espresso dark:text-foreground">
                  &euro;{dict.consulting.services.fullHouse.price}
                </span>
                <span className="text-sm text-muted-foreground">+</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">{dict.consulting.services.fullHouse.priceNote}</p>

              <div className="w-full h-px bg-laxmi-champagne mb-6" />

              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                {dict.consulting.services.fullHouse.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {dict.consulting.services.fullHouse.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-laxmi-gold mt-2 shrink-0" />
                    <span className="text-sm text-foreground/80 font-light">{feature}</span>
                  </li>
                ))}
              </ul>

              <p className="text-xs tracking-wider uppercase text-muted-foreground mt-auto pt-4 border-t border-laxmi-champagne/50">
                {dict.consulting.services.fullHouse.ideal}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Section - Dark with Pattern */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-laxmi-espresso" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-laxmi-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-laxmi-gold/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-cream">
              {dict.consulting.deliverablesTitle}
            </h2>
            <div className="w-24 h-px bg-laxmi-gold mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
            {Object.entries(dict.consulting.deliverables).map(([key, value], idx) => (
              <div
                key={key}
                className="text-center animate-fade-in-up group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:border-laxmi-gold group-hover:bg-laxmi-gold/10 transition-all duration-300">
                  {key === "layouts" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )}
                  {key === "moodboards" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {key === "furniture" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {key === "lighting" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {key === "renders" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  )}
                  {key === "coordination" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  )}
                </div>
                <p className="font-light text-laxmi-champagne">{value as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <div className="relative text-center py-12">
              {/* Large quote mark */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-laxmi-gold/10 font-serif text-[120px] md:text-[180px] leading-none select-none pointer-events-none">
                &ldquo;
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-10 h-px bg-laxmi-gold" />
                  <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                    {locale === "it" ? "Il Nostro Impegno" : "Our Commitment"}
                  </span>
                  <div className="w-10 h-px bg-laxmi-gold" />
                </div>

                <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-espresso dark:text-foreground mb-8">
                  {dict.consulting.promiseTitle}
                </h2>

                <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-light leading-relaxed italic max-w-3xl mx-auto">
                  {dict.consulting.promiseText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium with Image Background */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-interior.jpg"
            alt="LAXMI Interior Design"
            fill
            className="object-cover"
            sizes="100vw"
          />
          {/* Much darker overlay for better readability */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-laxmi-espresso/90 to-black/85" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-laxmi-gold/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <SunburstLogo className="w-20 h-12 text-laxmi-gold mx-auto mb-8" />

            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-white mb-6">
              {dict.consulting.ctaTitle}
            </h2>

            <p className="text-base md:text-lg text-white/80 font-light mb-10 max-w-xl mx-auto">
              {dict.consulting.ctaText}
            </p>

            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-laxmi-gold text-laxmi-espresso text-sm md:text-base tracking-[0.15em] uppercase font-medium rounded-full hover:bg-white transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
            >
              {dict.consulting.ctaButton}
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-white/60 text-xs md:text-sm tracking-wider uppercase">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  10+ {locale === "it" ? "Anni Esperienza" : "Years Experience"}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  200+ {locale === "it" ? "Progetti" : "Projects"}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Made in Italy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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

          <div className="gold-line mt-10 md:mt-12 mb-6 md:mb-8" />

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
