import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, defaultLocale, siteUrl, type Locale } from "@/i18n/config";
import { SunburstLogo, LogoText } from "@/components/laxmi-logo";
import { blurDataMap } from "@/lib/image/blur-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.metadata.aboutTitle,
    description: dict.metadata.aboutDescription,
    openGraph: {
      title: dict.metadata.aboutTitle,
      description: dict.metadata.aboutDescription,
      url: `${siteUrl}/${locale}/about`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "it" || localeParam === "en" ? localeParam : "it") as Locale;
  const dict = await getDictionary(locale);

  const values = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: dict.aboutPage.values.quality.title,
      description: dict.aboutPage.values.quality.description
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      ),
      title: dict.aboutPage.values.authenticity.title,
      description: dict.aboutPage.values.authenticity.description
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: dict.aboutPage.values.uniqueness.title,
      description: dict.aboutPage.values.uniqueness.description
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: dict.aboutPage.values.professionalism.title,
      description: dict.aboutPage.values.professionalism.description
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link href={`/${locale}`} className="flex items-center group">
            <LogoText className="h-8 md:h-10 w-auto transition-transform duration-500 group-hover:scale-110" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href={`/${locale}`} className="nav-link">{dict.nav.home}</Link>
            <Link href={`/${locale}/consulting`} className="nav-link">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link">{dict.nav.collections}</Link>
            <Link href={`/${locale}/blog`} className="nav-link">{dict.nav.blog}</Link>
            <Link href={`/${locale}/about`} className="nav-link text-laxmi-gold">{dict.nav.about}</Link>
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
                { href: `/${locale}/blog`, label: dict.nav.blog },
                { href: `/${locale}/about`, label: dict.nav.about },
                { href: `/${locale}/contact`, label: dict.nav.contact },
              ]}
              ctaLabel={dict.hero.cta}
              location={dict.common.location}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center pt-20 md:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/services-interior.jpg"
            alt={dict.aboutPage.heroImageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
            placeholder="blur"
            blurDataURL={blurDataMap["/images/services-interior.jpg"]}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl animate-glass-fade">
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
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

              <div className="relative p-6 sm:p-8 md:p-12 lg:p-14">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-laxmi-gold to-laxmi-gold/50" />
                  <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-laxmi-gold font-medium">
                    {dict.aboutPage.label}
                  </span>
                </div>

                <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6 leading-[1.1]">
                  {dict.aboutPage.heroTitle}
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light leading-relaxed">
                  {dict.aboutPage.heroSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative animate-fade-in-up order-2 lg:order-1">
              <div className="aspect-[4/5] relative mx-auto max-w-md">
                <div
                  className="absolute inset-0 border border-laxmi-gold/30"
                  style={{ borderRadius: "120px 120px 0 0" }}
                />
                <div
                  className="absolute inset-4 overflow-hidden"
                  style={{ borderRadius: "100px 100px 0 0" }}
                >
                  <Image
                    src="/images/hero-italian.jpg"
                    alt={dict.aboutPage.nameImageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={85}
                    placeholder="blur"
                    blurDataURL={blurDataMap["/images/hero-italian.jpg"]}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/30 via-transparent to-transparent" />
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-2 -left-2 w-4 h-4">
                  <div className="w-full h-px bg-laxmi-gold/50 absolute top-1/2" />
                  <div className="h-full w-px bg-laxmi-gold/50 absolute left-1/2" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4">
                  <div className="w-full h-px bg-laxmi-gold/50 absolute top-1/2" />
                  <div className="h-full w-px bg-laxmi-gold/50 absolute left-1/2" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8 animate-fade-in-up delay-200 order-1 lg:order-2">
              <div>
                <p className="text-label-sm text-laxmi-gold mb-4 label-dotted">
                  {dict.aboutPage.nameSection.label}
                </p>
                <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl mb-6">
                  {dict.aboutPage.nameSection.title}
                </h2>
                <div className="gold-line w-16" />
              </div>

              <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg">
                <p>
                  {dict.aboutPage.nameSection.paragraph1}
                </p>
                <p>
                  {dict.aboutPage.nameSection.paragraph2}
                </p>
              </div>

              <blockquote className="border-l-2 border-laxmi-gold/60 pl-6 py-2">
                <p className="text-foreground/90 italic font-serif text-xl md:text-2xl">
                  {dict.footer.quote}
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16 md:py-24 lg:py-32 bg-laxmi-cream/30 dark:bg-card/30 relative overflow-hidden">
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-laxmi-champagne/20 blur-3xl pointer-events-none hidden md:block" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <SunburstLogo className="w-12 h-8 mx-auto mb-6" />
            <p className="text-label-sm text-laxmi-gold mb-4 label-flanked">{dict.values.sectionLabel}</p>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl">
              {dict.aboutPage.essenceTitle}
            </h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Vision */}
            <div className="card-luxury p-8 md:p-10 text-center animate-fade-in-up delay-100">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center">
                <svg className="w-7 h-7 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">{dict.values.vision.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                {dict.values.vision.description}
              </p>
            </div>

            {/* Mission */}
            <div className="card-luxury p-8 md:p-10 text-center animate-fade-in-up delay-200">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center">
                <svg className="w-7 h-7 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">{dict.values.mission.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed text-lg">
                {dict.values.mission.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <p className="text-label-sm text-laxmi-gold mb-4 label-dotted justify-center">
              {dict.aboutPage.valuesTitle}
            </p>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl">
              {dict.values.values.title}
            </h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="card-luxury p-6 md:p-8 text-center group animate-fade-in-up"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-laxmi-champagne/50 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors duration-500 text-laxmi-bronze">
                  {value.icon}
                </div>
                <h3 className="font-serif text-xl md:text-2xl mb-3">{value.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Made in Italy Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-elegant-living.jpg"
            alt={dict.common.madeInItaly}
            fill
            className="object-cover"
            quality={75}
            placeholder="blur"
            blurDataURL={blurDataMap["/images/hero-elegant-living.jpg"]}
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <SunburstLogo className="w-16 h-10 mx-auto mb-8" />
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-white mb-6">
              {dict.aboutPage.madeInItaly.title}
            </h2>
            <p className="text-white/80 font-light text-lg md:text-xl leading-relaxed mb-8">
              {dict.aboutPage.madeInItaly.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-white/70">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {dict.aboutPage.madeInItaly.badges.craftsmanship}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {dict.aboutPage.madeInItaly.badges.design}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {dict.aboutPage.madeInItaly.badges.materials}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32 relative bg-laxmi-cream/20 dark:bg-card/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <h2 className="font-serif font-light text-3xl md:text-4xl mb-6">
              {dict.aboutPage.ctaTitle}
            </h2>
            <p className="text-muted-foreground font-light text-lg mb-8">
              {dict.aboutPage.ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/consulting`} className="btn-luxury-filled">
                {dict.aboutPage.ctaServices}
              </Link>
              <Link href={`/${locale}/contact`} className="btn-luxury text-laxmi-bronze border-laxmi-bronze hover:bg-laxmi-bronze hover:text-laxmi-cream">
                {dict.aboutPage.ctaContact}
              </Link>
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
                <LogoText className="h-8 md:h-10 w-auto" />
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
                <li className="py-1">{dict.common.location}</li>
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
