'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SunburstLogo } from "@/components/laxmi-logo";

const text = {
  it: {
    heading: "Qualcosa è andato storto",
    message: "Si è verificato un errore imprevisto. Riprova o torna alla home page.",
    tryAgain: "Riprova",
    home: "Torna alla Home",
  },
  en: {
    heading: "Something went wrong",
    message: "An unexpected error occurred. Please try again or return to the home page.",
    tryAgain: "Try Again",
    home: "Return Home",
  },
};

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/it") ? "it" : "en";
  const t = text[locale];

  return (
    <div className="min-h-screen flex items-center justify-center bg-laxmi-cream dark:bg-laxmi-espresso px-6">
      <div className="text-center max-w-md">
        <SunburstLogo className="w-16 h-16 mx-auto mb-8 text-laxmi-bronze" />

        <h1 className="font-serif text-5xl font-light text-laxmi-bronze mb-4">
          500
        </h1>
        <h2 className="font-serif text-2xl font-light text-laxmi-espresso dark:text-laxmi-cream mb-4">
          {t.heading}
        </h2>
        <p className="text-muted-foreground font-light mb-10">
          {t.message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-luxury-filled"
          >
            {t.tryAgain}
          </button>
          <Link
            href={`/${locale}`}
            className="btn-luxury text-laxmi-bronze"
          >
            {t.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
