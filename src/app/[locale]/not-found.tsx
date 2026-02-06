'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SunburstLogo } from "@/components/laxmi-logo";

const text = {
  it: {
    heading: "Pagina non trovata",
    message: "La pagina che stai cercando non esiste o è stata spostata.",
    home: "Torna alla Home",
    contact: "Contattaci",
  },
  en: {
    heading: "Page not found",
    message: "The page you are looking for does not exist or has been moved.",
    home: "Return Home",
    contact: "Contact Us",
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/it") ? "it" : "en";
  const t = text[locale];

  return (
    <div className="min-h-screen flex items-center justify-center bg-laxmi-cream dark:bg-laxmi-espresso px-6">
      <div className="text-center max-w-md">
        <SunburstLogo className="w-16 h-16 mx-auto mb-8 text-laxmi-bronze" />

        <h1 className="font-serif text-7xl font-light text-laxmi-bronze mb-4">
          404
        </h1>
        <h2 className="font-serif text-2xl font-light text-laxmi-espresso dark:text-laxmi-cream mb-4">
          {t.heading}
        </h2>
        <p className="text-muted-foreground font-light mb-10">
          {t.message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${locale}`}
            className="btn-luxury-filled"
          >
            {t.home}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="btn-luxury text-laxmi-bronze"
          >
            {t.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
