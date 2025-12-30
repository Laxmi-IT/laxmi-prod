import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

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

const translations = {
  it: {
    home: "Home",
    consulting: "Consulenza",
    collections: "Collezioni",
    blog: "Blog",
    about: "Chi Siamo",
    contact: "Contatti",
  },
  en: {
    home: "Home",
    consulting: "Consulting",
    collections: "Collections",
    blog: "Blog",
    about: "About",
    contact: "Contact",
  },
};

interface NavigationProps {
  locale: "it" | "en";
  activeLink?: "home" | "consulting" | "collections" | "blog" | "about" | "contact";
}

export function Navigation({ locale, activeLink }: NavigationProps) {
  const t = translations[locale];

  const navItems = [
    { href: `/${locale}`, label: t.home, key: "home" as const },
    { href: `/${locale}/consulting`, label: t.consulting, key: "consulting" as const },
    { href: `/${locale}/collections`, label: t.collections, key: "collections" as const },
    { href: `/${locale}/blog`, label: t.blog, key: "blog" as const },
    { href: `/${locale}/about`, label: t.about, key: "about" as const },
    { href: `/${locale}/contact`, label: t.contact, key: "contact" as const },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
        <Link href={`/${locale}`} className="flex flex-col items-center group">
          <SunburstLogo className="w-8 h-5 md:w-10 md:h-6 text-laxmi-bronze transition-transform duration-500 group-hover:scale-110" />
          <span className="text-lg md:text-xl tracking-[0.25em] md:tracking-[0.3em] font-serif font-light mt-0.5 md:mt-1">
            LAXMI
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`nav-link ${activeLink === item.key ? "text-laxmi-gold" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher locale={locale} />
          <ThemeToggle />
          <MobileNav
            locale={locale}
            navItems={navItems.map(({ href, label }) => ({ href, label }))}
          />
        </div>
      </div>
    </nav>
  );
}
