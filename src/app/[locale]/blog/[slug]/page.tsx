import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { getDictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import {
  getPostBySlug,
  getPublishedPosts,
  getRelatedPosts,
  getCategories,
  getAuthors,
  getCategoryById,
  getAuthorById,
} from "@/lib/blog/queries";
import type { Metadata } from "next";
import { SunburstLogo, LogoText } from "@/components/laxmi-logo";

// Enable ISR for blog posts
export const revalidate = 60;

// Generate static paths for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    const locales = ["it", "en"];

    return locales.flatMap((locale) =>
      posts.map((post) => ({
        locale,
        slug: post.slug,
      }))
    );
  } catch (error) {
    // During build time, env vars may not be available
    console.warn('Unable to generate static params for blog posts:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam === "it" ? "it" : "en";
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const title = locale === "it" ? post.seoTitleIT : post.seoTitle;
  const description = locale === "it" ? post.seoDescriptionIT : post.seoDescription;
  const keywords = locale === "it" ? post.seoKeywordsIT : post.seoKeywords;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["LAXMI Editorial"],
      images: [
        {
          url: post.featuredImage,
          alt: locale === "it" ? post.featuredImageAltIT : post.featuredImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Simple markdown to HTML converter for blog content
function renderMarkdown(content: string): string {
  let html = content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="font-serif text-xl md:text-2xl text-laxmi-espresso dark:text-foreground mt-10 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-serif text-2xl md:text-3xl text-laxmi-espresso dark:text-foreground mt-12 mb-6 pb-2 border-b border-laxmi-champagne/30">$1</h2>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-medium text-laxmi-espresso dark:text-foreground">$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-3 mb-2"><span class="w-1.5 h-1.5 rounded-full bg-laxmi-gold mt-2 shrink-0"></span><span>$1</span></li>')
    // Ordered lists (numbered)
    .replace(/^(\d+)\. (.+)$/gm, '<li class="flex items-start gap-3 mb-2"><span class="text-laxmi-gold font-medium">$1.</span><span>$2</span></li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-12 border-t border-laxmi-champagne/50" />')
    // Paragraphs
    .replace(/^(?!<[hlu]|<li|<hr)(.+)$/gm, '<p class="text-muted-foreground font-light leading-relaxed mb-6">$1</p>');

  // Wrap consecutive list items in ul
  html = html.replace(/(<li[^>]*>[\s\S]*?<\/li>\n?)+/g, (match) => {
    return `<ul class="mb-8 space-y-1">${match}</ul>`;
  });

  return html;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = (localeParam === "it" || localeParam === "en" ? localeParam : "it") as Locale;
  const dict = await getDictionary(locale);

  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  // Fetch categories, authors, and related posts
  const [categories, authors, relatedPostsData] = await Promise.all([
    getCategories(),
    getAuthors(),
    post.relatedPosts.length > 0 ? getRelatedPosts(post.relatedPosts) : Promise.resolve([]),
  ]);

  const category = getCategoryById(categories, post.category);
  const author = getAuthorById(authors, post.author);
  const relatedPosts = relatedPostsData;

  const content = locale === "it" ? post.contentIT : post.content;
  const title = locale === "it" ? post.titleIT : post.title;
  const excerpt = locale === "it" ? post.excerptIT : post.excerpt;
  const tags = locale === "it" ? post.tagsIT : post.tags;
  const faqs = post.faqs;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "it" ? "it-IT" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Schema.org structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.schemaType,
    headline: title,
    description: excerpt,
    image: `https://laxmi-prod.vercel.app${post.featuredImage}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: author?.name || "LAXMI Editorial",
    },
    publisher: {
      "@type": "Organization",
      name: "LAXMI",
      logo: {
        "@type": "ImageObject",
        url: "https://laxmi-prod.vercel.app/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://laxmi-prod.vercel.app/${locale}/blog/${post.slug}`,
    },
  };

  // FAQ Schema if present
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: locale === "it" ? faq.questionIT : faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: locale === "it" ? faq.answerIT : faq.answer,
      },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link href={`/${locale}`} className="flex items-center group">
            <LogoText className="h-8 md:h-10 w-auto text-laxmi-bronze transition-transform duration-500 group-hover:scale-110" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href={`/${locale}`} className="nav-link">{dict.nav.home}</Link>
            <Link href={`/${locale}/consulting`} className="nav-link">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link">{dict.nav.collections}</Link>
            <Link href={`/${locale}/blog`} className="nav-link text-laxmi-gold">Blog</Link>
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

      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-end pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src={post.featuredImage}
            alt={locale === "it" ? post.featuredImageAltIT : post.featuredImageAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10 pb-12 md:pb-16">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6 text-white/60">
              <Link href={`/${locale}/blog`} className="hover:text-laxmi-gold transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-laxmi-gold">
                {locale === "it" ? category?.nameIT : category?.name}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs tracking-[0.15em] uppercase text-laxmi-gold">
                {locale === "it" ? category?.nameIT : category?.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="text-xs text-white/60">
                {post.readingTime} {locale === "it" ? "min di lettura" : "min read"}
              </span>
            </div>

            <h1 className="font-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              {title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>{locale === "it" ? author?.roleIT : author?.role}</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="max-w-3xl mx-auto">
            {/* Lead paragraph */}
            <p className="text-lg md:text-xl text-laxmi-espresso dark:text-foreground/90 font-light leading-relaxed mb-10 pb-10 border-b border-laxmi-champagne/30">
              {excerpt}
            </p>

            {/* Main content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-laxmi-champagne/30">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs tracking-wide text-laxmi-bronze bg-laxmi-cream dark:bg-card rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-laxmi-cream/30 dark:bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-16">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-px bg-laxmi-gold" />
                <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                  {locale === "it" ? "Domande Frequenti" : "Frequently Asked Questions"}
                </span>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="card-luxury">
                    <h3 className="font-serif text-lg md:text-xl text-laxmi-espresso dark:text-foreground mb-3">
                      {locale === "it" ? faq.questionIT : faq.question}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed">
                      {locale === "it" ? faq.answerIT : faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-10 h-px bg-laxmi-gold" />
              <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                {locale === "it" ? "Continua a Leggere" : "Continue Reading"}
              </span>
              <div className="w-10 h-px bg-laxmi-gold" />
            </div>

            <h2 className="font-serif font-light text-3xl md:text-4xl text-center text-laxmi-espresso dark:text-foreground mb-12">
              {locale === "it" ? "Articoli Correlati" : "Related Articles"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {relatedPosts.map((relatedPost) => {
                const relatedCategory = getCategoryById(categories, relatedPost.category);
                return (
                  <Link
                    key={relatedPost.id}
                    href={`/${locale}/blog/${relatedPost.slug}`}
                    className="group card-luxury overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden -mx-6 -mt-6 mb-6">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={locale === "it" ? relatedPost.featuredImageAltIT : relatedPost.featuredImageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>

                    <span className="text-xs tracking-[0.15em] uppercase text-laxmi-gold mb-2 block">
                      {locale === "it" ? relatedCategory?.nameIT : relatedCategory?.name}
                    </span>

                    <h3 className="font-serif text-lg text-laxmi-espresso dark:text-foreground leading-tight group-hover:text-laxmi-bronze transition-colors line-clamp-2">
                      {locale === "it" ? relatedPost.titleIT : relatedPost.title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-interior.jpg"
            alt="LAXMI Interior Design"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-laxmi-espresso/90 to-black/85" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <SunburstLogo className="w-20 h-12 text-laxmi-gold mx-auto mb-8" />

            <h2 className="font-serif font-light text-3xl md:text-4xl text-white mb-6">
              {locale === "it" ? "Inizia il Tuo Viaggio" : "Begin Your Journey"}
            </h2>

            <p className="text-base md:text-lg text-white/80 font-light mb-10 max-w-xl mx-auto">
              {locale === "it"
                ? "Lascia che i nostri esperti ti guidino nella creazione dello spazio dei tuoi sogni."
                : "Let our experts guide you in creating the space of your dreams."}
            </p>

            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-laxmi-gold text-laxmi-espresso text-sm tracking-[0.15em] uppercase font-medium rounded-full hover:bg-white transition-all duration-300 group"
            >
              {locale === "it" ? "Contattaci" : "Contact Us"}
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <LogoText className="h-8 md:h-10 w-auto text-laxmi-bronze" />
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
                <li><Link href={`/${locale}/blog`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">Blog</Link></li>
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
