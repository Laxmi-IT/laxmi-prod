"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Minimal circular flag components
function ItalianFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <clipPath id="flagCircleIT">
        <circle cx="12" cy="12" r="10" />
      </clipPath>
      <g clipPath="url(#flagCircleIT)">
        <rect x="0" y="2" width="8" height="20" fill="#009246" />
        <rect x="8" y="2" width="8" height="20" fill="#ffffff" />
        <rect x="16" y="2" width="8" height="20" fill="#CE2B37" />
      </g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

function UKFlag({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <clipPath id="flagCircleUK">
        <circle cx="12" cy="12" r="10" />
      </clipPath>
      <g clipPath="url(#flagCircleUK)">
        {/* Blue background */}
        <rect x="2" y="2" width="20" height="20" fill="#012169" />
        {/* White diagonals */}
        <path d="M2,2 L22,22 M22,2 L2,22" stroke="#ffffff" strokeWidth="3" />
        {/* Red diagonals */}
        <path d="M2,2 L22,22 M22,2 L2,22" stroke="#C8102E" strokeWidth="1.5" />
        {/* White cross */}
        <path d="M12,2 L12,22 M2,12 L22,12" stroke="#ffffff" strokeWidth="5" />
        {/* Red cross */}
        <path d="M12,2 L12,22 M2,12 L22,12" stroke="#C8102E" strokeWidth="3" />
      </g>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

const CircularFlags: Record<Locale, React.FC<{ className?: string }>> = {
  it: ItalianFlag,
  en: UKFlag,
};

interface LanguageSwitcherProps {
  locale: Locale;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");
    router.push(newPathname);
  };

  const CurrentFlag = CircularFlags[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full flex items-center justify-center hover:ring-2 hover:ring-laxmi-gold/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-laxmi-gold/40"
          aria-label={`Current language: ${localeNames[locale]}`}
        >
          <CurrentFlag className="w-7 h-7" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[120px] bg-background/95 backdrop-blur-md border-laxmi-gold/20 p-1"
      >
        {locales.map((loc) => {
          const FlagComponent = CircularFlags[loc];
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`cursor-pointer font-light tracking-wide flex items-center gap-3 rounded-md ${
                loc === locale
                  ? "bg-laxmi-champagne/30 text-laxmi-bronze"
                  : "hover:bg-laxmi-champagne/20"
              }`}
            >
              <FlagComponent className="w-5 h-5" />
              <span className="text-sm">{localeNames[loc]}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
