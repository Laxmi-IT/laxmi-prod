import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { LogoText } from "./laxmi-logo";

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
        <Link href={`/${locale}`} className="flex items-center group">
          <LogoText className="h-8 md:h-10 w-auto transition-transform duration-500 group-hover:scale-110" />
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
