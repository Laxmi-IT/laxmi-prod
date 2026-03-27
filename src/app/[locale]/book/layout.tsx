import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { getPageAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : defaultLocale) as Locale;
  const isItalian = locale === "it";

  return {
    ...getPageAlternates(locale, "book"),
    title: isItalian
      ? "Richiedi una Consulenza | LAXMI"
      : "Request a Consultation | LAXMI",
    description: isItalian
      ? "Prenota una consulenza privata con il nostro design concierge. Arredamento di lusso italiano su misura, solo su appuntamento."
      : "Book a private consultation with our design concierge. Bespoke Italian luxury furniture, by appointment only.",
    openGraph: {
      title: isItalian
        ? "Richiedi una Consulenza | LAXMI"
        : "Request a Consultation | LAXMI",
      description: isItalian
        ? "Prenota una consulenza privata per arredamento di lusso italiano su misura."
        : "Book a private consultation for bespoke Italian luxury furniture.",
    },
  };
}

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
