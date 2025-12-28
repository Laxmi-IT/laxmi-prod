import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LuxuryGallery } from "@/components/luxury-gallery";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";

// Sunburst Logo Component - Half circle with rays above center point
function SunburstLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rays emanating upward in half-circle pattern */}
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
      {/* Small center dot at base */}
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Decorative Line with Arrow
function DecorativeLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="0" y1="5" x2="110" y2="5" stroke="currentColor" strokeWidth="1" />
      <path d="M110 5L105 2.5V7.5L110 5Z" fill="currentColor" />
    </svg>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === 'it' || localeParam === 'en' ? localeParam : 'it') as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex flex-col items-center group">
            <SunburstLogo className="w-10 h-6 text-laxmi-bronze transition-transform duration-500 group-hover:scale-110" />
            <span className="text-xl tracking-[0.3em] font-serif font-light mt-1">
              LAXMI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link href={`/${locale}`} className="nav-link">{dict.nav.home}</Link>
            <Link href={`/${locale}/consulting`} className="nav-link">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link">{dict.nav.collections}</Link>
            <Link href={`/${locale}/about`} className="nav-link">{dict.nav.about}</Link>
            <Link href={`/${locale}/contact`} className="nav-link">{dict.nav.contact}</Link>
          </div>

          {/* Theme Toggle & Language Switcher */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Single S-Curve Image Layout */}
        <div className="absolute left-0 top-[80px] w-[52%] h-[calc(100vh-80px)]">
          <svg className="absolute" width="0" height="0">
            <defs>
              <clipPath id="hero-s-curve" clipPathUnits="objectBoundingBox">
                <path d="
                  M0,0
                  L0.75,0
                  C0.88,0 0.92,0.1 0.88,0.22
                  C0.84,0.34 0.78,0.42 0.72,0.5
                  C0.66,0.58 0.7,0.68 0.78,0.78
                  C0.86,0.88 0.82,1 0.7,1
                  L0,1
                  Z
                " />
              </clipPath>
            </defs>
          </svg>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: "url(#hero-s-curve)" }}
          >
            <Image
              src="/images/hero-italian.jpg"
              alt={locale === "it"
                ? "Soggiorno di lusso italiano con divani in velluto verde salvia e finestre ad arco"
                : "Luxury Italian living room with sage green velvet sofas and arched windows"
              }
              fill
              className="object-cover"
              style={{ objectPosition: "center center" }}
              priority
              sizes="52vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent" />
          </div>

          {/* Gold S-Curve Accent Line */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 520 1000"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M390,0
                 C458,0 478,100 458,220
                 C438,340 406,420 374,500
                 C342,580 364,680 406,780
                 C448,880 426,1000 364,1000"
              fill="none"
              stroke="#B8956E"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="hidden lg:block" />

            <div className="flex flex-col items-start lg:items-start space-y-8 animate-fade-in-up">
              {/* Main heading with sunburst above the I */}
              <h1 className="font-serif font-light text-foreground tracking-[0.25em] flex items-end">
                <span>LAXM</span>
                <span className="flex flex-col items-center">
                  <SunburstLogo className="w-12 h-10 text-laxmi-gold -mb-1" />
                  <span>I</span>
                </span>
              </h1>

              {/* Tagline */}
              <div className="space-y-2">
                <p className="text-spaced text-laxmi-bronze">
                  {dict.hero.tagline1}
                </p>
                <p className="text-spaced text-muted-foreground">
                  {dict.hero.tagline2}
                </p>
              </div>

              <DecorativeLine className="w-32 text-laxmi-gold opacity-60" />

              <p className="text-lg text-muted-foreground max-w-md leading-relaxed font-light">
                {dict.hero.description} <span className="text-laxmi-bronze font-normal">{dict.hero.madeInItaly}</span>
              </p>

              <Link
                href={`/${locale}/book`}
                className="btn-luxury text-laxmi-bronze border-laxmi-bronze hover:bg-laxmi-bronze hover:text-laxmi-cream mt-4"
              >
                {dict.hero.cta}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="w-px h-24 gold-line-vertical" />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-20 animate-fade-in-up">
            <p className="text-spaced text-laxmi-gold mb-4">{dict.values.sectionLabel}</p>
            <h2 className="font-serif font-light">{dict.values.sectionTitle}</h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Vision */}
            <div className="card-luxury text-center group animate-fade-in-up delay-100">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors duration-500">
                <svg className="w-6 h-6 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-4">{dict.values.vision.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {dict.values.vision.description}
              </p>
            </div>

            {/* Mission */}
            <div className="card-luxury text-center group animate-fade-in-up delay-200">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors duration-500">
                <svg className="w-6 h-6 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-4">{dict.values.mission.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {dict.values.mission.description}
              </p>
            </div>

            {/* Values */}
            <div className="card-luxury text-center group animate-fade-in-up delay-300">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors duration-500">
                <svg className="w-6 h-6 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-4">{dict.values.values.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {dict.values.values.description} <span className="text-laxmi-bronze font-medium">{dict.values.values.highlight}</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-laxmi-cream/30 dark:bg-card/30 relative overflow-hidden">
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-laxmi-champagne/20 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-fade-in-up">
              <div className="aspect-[4/5] relative">
                <div
                  className="absolute inset-0 border border-laxmi-gold/30"
                  style={{ borderRadius: "120px 120px 0 0" }}
                />
                <div
                  className="absolute inset-4 overflow-hidden"
                  style={{ borderRadius: "100px 100px 0 0" }}
                >
                  <Image
                    src="/images/services-interior.jpg"
                    alt={locale === "it"
                      ? "Elegante interior design italiano con archi e dettagli di lusso"
                      : "Elegant Italian interior design with arched doorways"
                    }
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/20 via-transparent to-transparent" />
                </div>
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

            <div className="space-y-8 animate-fade-in-up delay-200">
              <p className="text-spaced text-laxmi-gold">{dict.services.sectionLabel}</p>
              <h2 className="font-serif font-light">{dict.services.sectionTitle}</h2>
              <div className="gold-line w-16" />

              <div className="space-y-6 pt-4">
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:bg-laxmi-gold/10 transition-colors duration-300">
                    <span className="text-sm text-laxmi-bronze">01</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">{dict.services.service1.title}</h4>
                    <p className="text-muted-foreground font-light">{dict.services.service1.description}</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:bg-laxmi-gold/10 transition-colors duration-300">
                    <span className="text-sm text-laxmi-bronze">02</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">{dict.services.service2.title}</h4>
                    <p className="text-muted-foreground font-light">{dict.services.service2.description}</p>
                  </div>
                </div>

                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:bg-laxmi-gold/10 transition-colors duration-300">
                    <span className="text-sm text-laxmi-bronze">03</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">{dict.services.service3.title}</h4>
                    <p className="text-muted-foreground font-light">{dict.services.service3.description}</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 text-laxmi-bronze hover:text-laxmi-espresso transition-colors duration-300 mt-4"
              >
                <span className="text-spaced text-sm">{dict.services.discoverMore}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-spaced text-laxmi-gold mb-4">{dict.gallery.sectionLabel}</p>
            <h2 className="font-serif font-light">{dict.gallery.sectionTitle}</h2>
            <p className="text-muted-foreground font-light mt-6 max-w-xl mx-auto">
              {dict.gallery.description}
            </p>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          <LuxuryGallery />

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/collections`}
              className="inline-flex items-center gap-2 text-laxmi-bronze hover:text-laxmi-espresso transition-colors duration-300"
            >
              <span className="text-spaced text-sm">{dict.gallery.viewAll}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative bg-laxmi-cream/20 dark:bg-card/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <SunburstLogo className="w-20 h-12 text-laxmi-gold mx-auto mb-8" />
            <h2 className="font-serif font-light mb-6">{dict.cta.title}</h2>
            <p className="text-lg text-muted-foreground font-light mb-10 max-w-xl mx-auto">
              {dict.cta.description}
            </p>
            <Link href={`/${locale}/contact`} className="btn-luxury-filled">
              {dict.cta.button}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex flex-col items-start">
                <SunburstLogo className="w-12 h-8 text-laxmi-bronze mb-2" />
                <span className="text-lg tracking-[0.3em] font-serif font-light">LAXMI</span>
              </div>
              <p className="text-muted-foreground font-light mt-4 max-w-sm">
                {dict.footer.description}
              </p>
            </div>

            <div>
              <h4 className="text-spaced text-xs mb-6 text-laxmi-bronze">{dict.footer.navigation}</h4>
              <ul className="space-y-3">
                <li><Link href={`/${locale}`} className="text-muted-foreground hover:text-foreground transition-colors font-light">{dict.nav.home}</Link></li>
                <li><Link href={`/${locale}/consulting`} className="text-muted-foreground hover:text-foreground transition-colors font-light">{dict.nav.consulting}</Link></li>
                <li><Link href={`/${locale}/collections`} className="text-muted-foreground hover:text-foreground transition-colors font-light">{dict.nav.collections}</Link></li>
                <li><Link href={`/${locale}/about`} className="text-muted-foreground hover:text-foreground transition-colors font-light">{dict.nav.about}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-spaced text-xs mb-6 text-laxmi-bronze">{dict.footer.contact}</h4>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li>thelaxmii07@gmail.com</li>
                <li>+39 000 000 0000</li>
                <li>{locale === "it" ? "Milano, Italia" : "Milan, Italy"}</li>
              </ul>
            </div>
          </div>

          <div className="gold-line mt-12 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-light">
              &copy; {new Date().getFullYear()} LAXMI. {dict.footer.copyright}
            </p>
            <p className="text-sm text-muted-foreground font-light italic">
              {dict.footer.quote}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
