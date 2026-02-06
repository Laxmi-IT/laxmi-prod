import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { getDictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import {
  getPublishedPosts,
  getFeaturedPosts,
  getCategories,
  getAuthors,
  getCategoryById,
  getAuthorById,
} from "@/lib/blog/queries";
import type { Metadata } from "next";
import { SunburstLogo, LogoText } from "@/components/laxmi-logo";
import { blurDataMap, DYNAMIC_BLUR_DATA_URL } from "@/lib/image/blur-data";

// Enable ISR for blog pages
export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = localeParam === "it" ? "it" : "en";
  const dict = await getDictionary(locale as Locale);

  const title = dict.blog.metaTitle;
  const description = dict.blog.metaDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "it" || localeParam === "en" ? localeParam : "it") as Locale;
  const dict = await getDictionary(locale);

  // Fetch data from database
  const [allPosts, featuredPosts, categories, authors] = await Promise.all([
    getPublishedPosts(),
    getFeaturedPosts(),
    getCategories(),
    getAuthors(),
  ]);

  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "it" ? "it-IT" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            <Link href={`/${locale}/blog`} className="nav-link text-laxmi-gold">{dict.nav.blog}</Link>
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
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center pt-20 md:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-elegant-living.jpg"
            alt={dict.blog.heroImageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
            placeholder="blur"
            blurDataURL={blurDataMap["/images/hero-elegant-living.jpg"]}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent md:from-black/70 md:via-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-2xl lg:max-w-3xl animate-glass-fade">
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
                    {dict.blog.heroLabel}
                  </span>
                </div>

                <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6 leading-[1.1]">
                  {dict.blog.heroTitle}
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light mb-6 md:mb-8 leading-relaxed">
                  {dict.blog.heroSubtitle}
                </p>

                <div className="w-16 h-px bg-laxmi-gold/60 mb-6 md:mb-8" />

                <p className="text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed max-w-xl">
                  {dict.blog.heroDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-10 h-px bg-laxmi-gold" />
              <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                {dict.blog.featuredLabel}
              </span>
              <div className="w-10 h-px bg-laxmi-gold" />
            </div>

            <h2 className="font-serif font-light text-3xl md:text-4xl text-center text-laxmi-espresso dark:text-foreground mb-12">
              {dict.blog.featuredTitle}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, idx) => {
                const category = getCategoryById(categories, post.category);
                return (
                  <Link
                    key={post.id}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group relative overflow-hidden rounded-2xl animate-fade-in-up"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={locale === "it" ? post.featuredImageAltIT : post.featuredImageAlt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={85}
                        placeholder="blur"
                        blurDataURL={DYNAMIC_BLUR_DATA_URL}
                        {...(idx === 0 ? { priority: true } : {})}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs tracking-[0.15em] uppercase text-laxmi-gold">
                          {locale === "it" ? category?.nameIT : category?.name}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/40" />
                        <span className="text-xs text-white/60">
                          {post.readingTime} {dict.blog.minRead}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl md:text-2xl lg:text-3xl text-white mb-3 leading-tight group-hover:text-laxmi-gold transition-colors duration-300">
                        {locale === "it" ? post.titleIT : post.title}
                      </h3>

                      <p className="text-sm md:text-base text-white/70 font-light line-clamp-2">
                        {locale === "it" ? post.excerptIT : post.excerpt}
                      </p>

                      <div className="flex items-center gap-2 mt-4 text-laxmi-gold">
                        <span className="text-sm tracking-wider uppercase">
                          {dict.blog.readMore}
                        </span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12 md:py-16 bg-laxmi-cream/30 dark:bg-card/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="px-4 md:px-6 py-2 md:py-3 rounded-full border border-laxmi-champagne dark:border-border text-sm tracking-wide text-laxmi-espresso dark:text-foreground hover:border-laxmi-gold hover:text-laxmi-gold transition-colors duration-300"
              >
                {locale === "it" ? category.nameIT : category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-10 h-px bg-laxmi-gold" />
            <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
              {dict.blog.allArticlesLabel}
            </span>
            <div className="w-10 h-px bg-laxmi-gold" />
          </div>

          <h2 className="font-serif font-light text-3xl md:text-4xl text-center text-laxmi-espresso dark:text-foreground mb-12">
            {dict.blog.allArticlesTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post, idx) => {
              const category = getCategoryById(categories, post.category);
              const author = getAuthorById(authors, post.author);
              return (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group card-luxury overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden -mx-6 -mt-6 mb-6">
                    <Image
                      src={post.featuredImage}
                      alt={locale === "it" ? post.featuredImageAltIT : post.featuredImageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={80}
                      placeholder="blur"
                      blurDataURL={DYNAMIC_BLUR_DATA_URL}
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs tracking-[0.15em] uppercase text-laxmi-gold">
                      {locale === "it" ? category?.nameIT : category?.name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-laxmi-champagne" />
                    <span className="text-xs text-muted-foreground">
                      {post.readingTime} min
                    </span>
                  </div>

                  <h3 className="font-serif text-xl md:text-2xl text-laxmi-espresso dark:text-foreground mb-3 leading-tight group-hover:text-laxmi-bronze transition-colors duration-300 line-clamp-2">
                    {locale === "it" ? post.titleIT : post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground font-light line-clamp-3 mb-4">
                    {locale === "it" ? post.excerptIT : post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-laxmi-champagne/30">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="text-xs text-laxmi-bronze group-hover:text-laxmi-gold transition-colors flex items-center gap-1">
                      {dict.blog.read}
                      <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-laxmi-espresso" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-laxmi-gold/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <SunburstLogo className="w-16 h-10 mx-auto mb-8" />

            <h2 className="font-serif font-light text-3xl md:text-4xl text-laxmi-cream mb-4">
              {dict.blog.newsletterTitle}
            </h2>

            <p className="text-laxmi-champagne/80 font-light mb-8">
              {dict.blog.newsletterDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={dict.blog.newsletterPlaceholder}
                className="flex-1 px-4 py-3 bg-white/10 border border-laxmi-gold/30 rounded-lg text-laxmi-cream placeholder:text-laxmi-champagne/50 focus:outline-none focus:border-laxmi-gold transition-colors"
              />
              <button className="px-6 py-3 bg-laxmi-gold text-laxmi-espresso text-sm tracking-wider uppercase font-medium rounded-lg hover:bg-white transition-colors">
                {dict.blog.subscribe}
              </button>
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
                <li><Link href={`/${locale}/blog`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.blog}</Link></li>
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
