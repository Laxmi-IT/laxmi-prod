import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { locales, defaultLocale, hreflangCodes, siteUrl, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata for each locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    languages[hreflangCodes[loc]] = `${siteUrl}/${loc}`;
  });
  languages["x-default"] = `${siteUrl}/${defaultLocale}`;

  return {
    title: {
      default: dict.metadata.title,
      template: dict.metadata.titleTemplate,
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages,
    },
    openGraph: {
      title: dict.metadata.ogTitle,
      description: dict.metadata.ogDescription,
      url: `${siteUrl}/${locale}`,
      siteName: "LAXMI",
      locale: hreflangCodes[locale],
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "LAXMI - Luxury Italian Furniture Consulting",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.ogTitle,
      description: dict.metadata.ogDescription,
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

// JSON-LD Structured Data for SEO
function StructuredData({ locale }: { locale: Locale }) {
  const isItalian = locale === "it";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LAXMI",
    description: isItalian
      ? "Consulenza esclusiva per arredamento di lusso italiano Made in Italy"
      : "Exclusive luxury Italian furniture consulting Made in Italy",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://www.instagram.com/laxmi.luxury",
      "https://www.pinterest.com/laxmiluxury",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+39-000-000-0000",
      contactType: "customer service",
      email: "thelaxmii07@gmail.com",
      availableLanguage: ["Italian", "English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: isItalian ? "Milano" : "Milan",
      addressCountry: "IT",
    },
  };

  const furnitureStoreSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: "LAXMI",
    description: isItalian
      ? "Consulenza arredamento di lusso e boutique di mobili italiani Made in Italy"
      : "Luxury furniture consulting and boutique of Italian Made in Italy furniture",
    url: siteUrl,
    telephone: "+39-000-000-0000",
    email: "thelaxmii07@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: isItalian ? "Milano" : "Milan",
      addressRegion: "Lombardia",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.4642,
      longitude: 9.19,
    },
    priceRange: "$$$$",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: {
      "@type": "Country",
      name: isItalian ? "Italia" : "Italy",
    },
    brand: {
      "@type": "Brand",
      name: "LAXMI",
      slogan: isItalian
        ? "Creato per intenditori. Made in Italy."
        : "Crafted for connoisseurs. Made in Italy.",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isItalian ? "Servizi di Consulenza" : "Consulting Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: isItalian ? "Consulenza Arredamento" : "Furniture Consulting",
            description: isItalian
              ? "Guida personalizzata per selezionare i pezzi perfetti"
              : "Personalized guidance to select the perfect pieces",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Boutique Reselling",
            description: isItalian
              ? "Collezione curata di mobili italiani di lusso"
              : "Curated collection of Italian luxury furniture",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Interior Styling",
            description: isItalian
              ? "Servizi completi di styling per dare vita alla tua visione"
              : "Complete styling services to bring your vision to life",
          },
        },
      ],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LAXMI",
    url: siteUrl,
    inLanguage: locale === "it" ? "it-IT" : "en-GB",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(furnitureStoreSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : defaultLocale) as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <StructuredData locale={locale} />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
