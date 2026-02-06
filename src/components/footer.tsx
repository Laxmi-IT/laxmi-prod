"use client";

import Link from "next/link";
import { CookieSettingsButton } from "./cookie-consent";
import { LogoText } from "./laxmi-logo";

const translations = {
  it: {
    navigation: "Navigazione",
    contact: "Contatti",
    legal: "Informazioni Legali",
    home: "Home",
    consulting: "Consulenza",
    collections: "Collezioni",
    about: "Chi Siamo",
    blog: "Blog",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    termsOfService: "Termini di Servizio",
    legalNotice: "Note Legali",
    manageCookies: "Gestisci Cookie",
    description: "Consulenza esclusiva per arredamento di lusso Made in Italy. Creiamo spazi che raccontano storie di eccellenza italiana.",
    copyright: "Tutti i diritti riservati.",
    quote: "Creato per intenditori. Made in Italy.",
    location: "Milano, Italia",
  },
  en: {
    navigation: "Navigation",
    contact: "Contact",
    legal: "Legal Information",
    home: "Home",
    consulting: "Consulting",
    collections: "Collections",
    about: "About",
    blog: "Blog",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    termsOfService: "Terms of Service",
    legalNotice: "Legal Notice",
    manageCookies: "Manage Cookies",
    description: "Exclusive luxury furniture consulting Made in Italy. We create spaces that tell stories of Italian excellence.",
    copyright: "All rights reserved.",
    quote: "Crafted for connoisseurs. Made in Italy.",
    location: "Milan, Italy",
  },
};

interface FooterProps {
  locale: "it" | "en";
}

export function Footer({ locale }: FooterProps) {
  const t = translations[locale];

  return (
    <footer className="py-10 md:py-12 lg:py-16 border-t border-border/30 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
            <Link href={`/${locale}`} className="inline-flex items-center group">
              <LogoText className="h-8 md:h-10 w-auto text-laxmi-bronze transition-transform duration-300 group-hover:scale-110" />
            </Link>
            <p className="text-muted-foreground font-light mt-4 max-w-sm">
              {t.description}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{t.navigation}</h4>
            <ul className="space-y-1">
              <li>
                <Link href={`/${locale}`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/consulting`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.consulting}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/collections`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.collections}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{t.contact}</h4>
            <ul className="space-y-2 text-muted-foreground font-light">
              <li className="py-1">
                <a href="mailto:thelaxmii07@gmail.com" className="hover:text-foreground transition-colors">
                  thelaxmii07@gmail.com
                </a>
              </li>
              <li className="py-1">
                <a href="tel:+390000000000" className="hover:text-foreground transition-colors">
                  +39 000 000 0000
                </a>
              </li>
              <li className="py-1">{t.location}</li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{t.legal}</h4>
            <ul className="space-y-1">
              <li>
                <Link href={`/${locale}/privacy-policy`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/cookie-policy`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.cookiePolicy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms-of-service`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.termsOfService}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal-notice`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">
                  {t.legalNotice}
                </Link>
              </li>
              <li className="pt-2">
                <CookieSettingsButton locale={locale} />
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-line mt-8 md:mt-12 mb-6 md:mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-sm text-muted-foreground font-light order-2 md:order-1">
            &copy; {new Date().getFullYear()} LAXMI. {t.copyright}
          </p>
          <p className="text-sm text-muted-foreground font-light italic order-1 md:order-2">
            {t.quote}
          </p>
        </div>
      </div>
    </footer>
  );
}
