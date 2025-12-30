import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isItalian = locale === "it";

  return {
    title: isItalian ? "Cookie Policy | LAXMI" : "Cookie Policy | LAXMI",
    description: isItalian
      ? "Informativa sui cookie utilizzati dal sito LAXMI secondo la normativa italiana ed europea"
      : "Information about cookies used by the LAXMI website according to Italian and European regulations",
  };
}

const translations = {
  it: {
    title: "Cookie Policy",
    lastUpdated: "Ultimo aggiornamento",
    intro: {
      title: "1. Cosa sono i Cookie",
      content: `I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Permettono al sito di riconoscere il tuo dispositivo e memorizzare alcune informazioni sulle tue preferenze o azioni passate.`,
      legal: `Questa Cookie Policy è redatta in conformità con:
      - Regolamento (UE) 2016/679 (GDPR)
      - Direttiva 2002/58/CE (ePrivacy)
      - D.Lgs. 196/2003 (Codice Privacy italiano)
      - Linee Guida del Garante Privacy sui Cookie del 10 giugno 2021`,
    },
    types: {
      title: "2. Tipologie di Cookie Utilizzati",
      necessary: {
        title: "Cookie Tecnici/Necessari",
        description: "Essenziali per il funzionamento del sito. Non richiedono consenso.",
        cookies: [
          {
            name: "laxmi_cookie_consent",
            purpose: "Memorizza le tue preferenze sui cookie",
            duration: "1 anno",
            provider: "LAXMI (prima parte)",
          },
          {
            name: "NEXT_LOCALE",
            purpose: "Memorizza la preferenza della lingua",
            duration: "Sessione",
            provider: "LAXMI (prima parte)",
          },
        ],
      },
      analytics: {
        title: "Cookie Analitici",
        description: "Ci aiutano a capire come i visitatori interagiscono con il sito, raccogliendo informazioni in forma anonima.",
        cookies: [
          {
            name: "_ga, _ga_*",
            purpose: "Google Analytics - Distingue gli utenti unici",
            duration: "2 anni",
            provider: "Google LLC",
          },
          {
            name: "_gid",
            purpose: "Google Analytics - Distingue gli utenti",
            duration: "24 ore",
            provider: "Google LLC",
          },
        ],
        note: "I cookie analitici sono attivati solo con il tuo consenso esplicito.",
      },
      marketing: {
        title: "Cookie di Marketing/Profilazione",
        description: "Utilizzati per tracciare i visitatori attraverso i siti web e mostrare annunci pertinenti.",
        cookies: [
          {
            name: "_fbp",
            purpose: "Meta Pixel - Tracciamento conversioni",
            duration: "3 mesi",
            provider: "Meta Platforms Inc.",
          },
        ],
        note: "I cookie di marketing sono attivati solo con il tuo consenso esplicito.",
      },
      preferences: {
        title: "Cookie di Preferenza",
        description: "Permettono di memorizzare le tue preferenze come la lingua, il layout o altre personalizzazioni.",
        cookies: [
          {
            name: "theme",
            purpose: "Memorizza la preferenza tema chiaro/scuro",
            duration: "1 anno",
            provider: "LAXMI (prima parte)",
          },
        ],
        note: "I cookie di preferenza sono attivati solo con il tuo consenso.",
      },
    },
    thirdParty: {
      title: "3. Cookie di Terze Parti",
      content: "Il nostro sito potrebbe contenere cookie di terze parti per i seguenti servizi:",
      services: [
        {
          name: "Google Analytics",
          purpose: "Analisi del traffico web",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Google Fonts",
          purpose: "Caricamento font tipografici",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Vercel",
          purpose: "Hosting e performance",
          privacy: "https://vercel.com/legal/privacy-policy",
        },
      ],
    },
    manage: {
      title: "4. Come Gestire i Cookie",
      intro: "Puoi gestire le tue preferenze sui cookie in diversi modi:",
      banner: {
        title: "Tramite il nostro Banner Cookie",
        description: "Al primo accesso al sito, un banner ti permette di accettare, rifiutare o personalizzare i cookie. Puoi modificare le tue scelte in qualsiasi momento cliccando su \"Gestisci Cookie\" nel footer del sito.",
      },
      browser: {
        title: "Tramite le Impostazioni del Browser",
        description: "Puoi configurare il tuo browser per bloccare o eliminare i cookie. Di seguito i link alle guide dei principali browser:",
        browsers: [
          { name: "Chrome", url: "https://support.google.com/chrome/answer/95647" },
          { name: "Firefox", url: "https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop" },
          { name: "Safari", url: "https://support.apple.com/it-it/guide/safari/sfri11471/mac" },
          { name: "Edge", url: "https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
        ],
      },
      warning: "Nota: La disabilitazione di alcuni cookie potrebbe compromettere il funzionamento di alcune parti del sito.",
    },
    consent: {
      title: "5. Base Giuridica",
      content: `In conformità con le Linee Guida del Garante Privacy italiano:

      - I cookie tecnici/necessari non richiedono consenso preventivo
      - I cookie analitici, di marketing e di preferenza richiedono il tuo consenso esplicito prima dell'installazione
      - Il consenso deve essere libero, specifico, informato e revocabile in qualsiasi momento
      - Il banner di consenso presenta opzioni equivalenti per accettare e rifiutare i cookie`,
    },
    retention: {
      title: "6. Durata dei Cookie",
      content: "I cookie hanno durate diverse a seconda della loro funzione:",
      items: [
        "Cookie di sessione: vengono eliminati alla chiusura del browser",
        "Cookie persistenti: rimangono sul dispositivo per la durata specificata nella tabella sopra",
      ],
    },
    rights: {
      title: "7. I Tuoi Diritti",
      content: "Per maggiori informazioni sui tuoi diritti in merito ai dati personali e ai cookie, consulta la nostra",
      link: "Informativa Privacy",
    },
    contact: {
      title: "8. Contatti",
      content: "Per qualsiasi domanda relativa a questa Cookie Policy, puoi contattarci:",
      email: "Email: thelaxmii07@gmail.com",
    },
    changes: {
      title: "9. Aggiornamenti",
      content: "Questa Cookie Policy può essere aggiornata periodicamente. Ti invitiamo a consultarla regolarmente. La data dell'ultimo aggiornamento è indicata in cima a questa pagina.",
    },
  },
  en: {
    title: "Cookie Policy",
    lastUpdated: "Last updated",
    intro: {
      title: "1. What are Cookies",
      content: `Cookies are small text files that are stored on your device when you visit a website. They allow the site to recognize your device and store some information about your preferences or past actions.`,
      legal: `This Cookie Policy is drafted in compliance with:
      - Regulation (EU) 2016/679 (GDPR)
      - Directive 2002/58/EC (ePrivacy)
      - Italian Legislative Decree 196/2003 (Italian Privacy Code)
      - Italian Data Protection Authority Cookie Guidelines of June 10, 2021`,
    },
    types: {
      title: "2. Types of Cookies Used",
      necessary: {
        title: "Technical/Necessary Cookies",
        description: "Essential for the website to function. They do not require consent.",
        cookies: [
          {
            name: "laxmi_cookie_consent",
            purpose: "Stores your cookie preferences",
            duration: "1 year",
            provider: "LAXMI (first party)",
          },
          {
            name: "NEXT_LOCALE",
            purpose: "Stores language preference",
            duration: "Session",
            provider: "LAXMI (first party)",
          },
        ],
      },
      analytics: {
        title: "Analytics Cookies",
        description: "Help us understand how visitors interact with the site by collecting information anonymously.",
        cookies: [
          {
            name: "_ga, _ga_*",
            purpose: "Google Analytics - Distinguishes unique users",
            duration: "2 years",
            provider: "Google LLC",
          },
          {
            name: "_gid",
            purpose: "Google Analytics - Distinguishes users",
            duration: "24 hours",
            provider: "Google LLC",
          },
        ],
        note: "Analytics cookies are only activated with your explicit consent.",
      },
      marketing: {
        title: "Marketing/Profiling Cookies",
        description: "Used to track visitors across websites and display relevant advertisements.",
        cookies: [
          {
            name: "_fbp",
            purpose: "Meta Pixel - Conversion tracking",
            duration: "3 months",
            provider: "Meta Platforms Inc.",
          },
        ],
        note: "Marketing cookies are only activated with your explicit consent.",
      },
      preferences: {
        title: "Preference Cookies",
        description: "Allow us to remember your preferences such as language, layout, or other customizations.",
        cookies: [
          {
            name: "theme",
            purpose: "Stores light/dark theme preference",
            duration: "1 year",
            provider: "LAXMI (first party)",
          },
        ],
        note: "Preference cookies are only activated with your consent.",
      },
    },
    thirdParty: {
      title: "3. Third-Party Cookies",
      content: "Our website may contain third-party cookies for the following services:",
      services: [
        {
          name: "Google Analytics",
          purpose: "Web traffic analysis",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Google Fonts",
          purpose: "Loading typographic fonts",
          privacy: "https://policies.google.com/privacy",
        },
        {
          name: "Vercel",
          purpose: "Hosting and performance",
          privacy: "https://vercel.com/legal/privacy-policy",
        },
      ],
    },
    manage: {
      title: "4. How to Manage Cookies",
      intro: "You can manage your cookie preferences in several ways:",
      banner: {
        title: "Via our Cookie Banner",
        description: "On your first visit to the site, a banner allows you to accept, reject, or customize cookies. You can change your choices at any time by clicking \"Manage Cookies\" in the site footer.",
      },
      browser: {
        title: "Via Browser Settings",
        description: "You can configure your browser to block or delete cookies. Below are links to guides for the main browsers:",
        browsers: [
          { name: "Chrome", url: "https://support.google.com/chrome/answer/95647" },
          { name: "Firefox", url: "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" },
          { name: "Safari", url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
          { name: "Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
        ],
      },
      warning: "Note: Disabling some cookies may affect the functionality of certain parts of the website.",
    },
    consent: {
      title: "5. Legal Basis",
      content: `In compliance with the Italian Data Protection Authority Guidelines:

      - Technical/necessary cookies do not require prior consent
      - Analytics, marketing, and preference cookies require your explicit consent before installation
      - Consent must be free, specific, informed, and revocable at any time
      - The consent banner presents equivalent options to accept and reject cookies`,
    },
    retention: {
      title: "6. Cookie Duration",
      content: "Cookies have different durations depending on their function:",
      items: [
        "Session cookies: deleted when you close the browser",
        "Persistent cookies: remain on your device for the duration specified in the table above",
      ],
    },
    rights: {
      title: "7. Your Rights",
      content: "For more information about your rights regarding personal data and cookies, please see our",
      link: "Privacy Policy",
    },
    contact: {
      title: "8. Contact Us",
      content: "For any questions about this Cookie Policy, you can contact us:",
      email: "Email: thelaxmii07@gmail.com",
    },
    changes: {
      title: "9. Updates",
      content: "This Cookie Policy may be updated periodically. We encourage you to review it regularly. The date of the last update is indicated at the top of this page.",
    },
  },
};

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : defaultLocale) as Locale;
  const t = translations[locale];

  return (
    <div className="min-h-screen bg-laxmi-cream">
      <Navigation locale={locale} />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-laxmi-espresso mb-4">
              {t.title}
            </h1>
            <p className="text-laxmi-bronze">
              {t.lastUpdated}: 30 December 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.intro.title}</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{t.intro.content}</p>
              <div className="bg-white p-4 rounded-lg border border-laxmi-champagne/30">
                <p className="text-sm text-gray-600 whitespace-pre-line">{t.intro.legal}</p>
              </div>
            </section>

            {/* Types of Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-6">{t.types.title}</h2>

              {/* Necessary Cookies */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-laxmi-espresso mb-2">{t.types.necessary.title}</h3>
                <p className="text-gray-700 mb-4">{t.types.necessary.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-laxmi-espresso text-white">
                        <th className="p-3 text-left">Cookie</th>
                        <th className="p-3 text-left">{locale === "it" ? "Finalità" : "Purpose"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Durata" : "Duration"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Fornitore" : "Provider"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.types.necessary.cookies.map((cookie, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-laxmi-cream/50"}>
                          <td className="p-3 font-mono text-xs">{cookie.name}</td>
                          <td className="p-3">{cookie.purpose}</td>
                          <td className="p-3">{cookie.duration}</td>
                          <td className="p-3">{cookie.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-laxmi-espresso mb-2">{t.types.analytics.title}</h3>
                <p className="text-gray-700 mb-4">{t.types.analytics.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-laxmi-espresso text-white">
                        <th className="p-3 text-left">Cookie</th>
                        <th className="p-3 text-left">{locale === "it" ? "Finalità" : "Purpose"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Durata" : "Duration"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Fornitore" : "Provider"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.types.analytics.cookies.map((cookie, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-laxmi-cream/50"}>
                          <td className="p-3 font-mono text-xs">{cookie.name}</td>
                          <td className="p-3">{cookie.purpose}</td>
                          <td className="p-3">{cookie.duration}</td>
                          <td className="p-3">{cookie.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-laxmi-bronze mt-2 italic">{t.types.analytics.note}</p>
              </div>

              {/* Marketing Cookies */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-laxmi-espresso mb-2">{t.types.marketing.title}</h3>
                <p className="text-gray-700 mb-4">{t.types.marketing.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-laxmi-espresso text-white">
                        <th className="p-3 text-left">Cookie</th>
                        <th className="p-3 text-left">{locale === "it" ? "Finalità" : "Purpose"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Durata" : "Duration"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Fornitore" : "Provider"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.types.marketing.cookies.map((cookie, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-laxmi-cream/50"}>
                          <td className="p-3 font-mono text-xs">{cookie.name}</td>
                          <td className="p-3">{cookie.purpose}</td>
                          <td className="p-3">{cookie.duration}</td>
                          <td className="p-3">{cookie.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-laxmi-bronze mt-2 italic">{t.types.marketing.note}</p>
              </div>

              {/* Preference Cookies */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-laxmi-espresso mb-2">{t.types.preferences.title}</h3>
                <p className="text-gray-700 mb-4">{t.types.preferences.description}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-laxmi-espresso text-white">
                        <th className="p-3 text-left">Cookie</th>
                        <th className="p-3 text-left">{locale === "it" ? "Finalità" : "Purpose"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Durata" : "Duration"}</th>
                        <th className="p-3 text-left">{locale === "it" ? "Fornitore" : "Provider"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.types.preferences.cookies.map((cookie, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-laxmi-cream/50"}>
                          <td className="p-3 font-mono text-xs">{cookie.name}</td>
                          <td className="p-3">{cookie.purpose}</td>
                          <td className="p-3">{cookie.duration}</td>
                          <td className="p-3">{cookie.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-laxmi-bronze mt-2 italic">{t.types.preferences.note}</p>
              </div>
            </section>

            {/* Third Party */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.thirdParty.title}</h2>
              <p className="text-gray-700 mb-4">{t.thirdParty.content}</p>
              <div className="space-y-3">
                {t.thirdParty.services.map((service, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-laxmi-champagne/20">
                    <p className="font-semibold text-laxmi-espresso">{service.name}</p>
                    <p className="text-gray-600 text-sm">{service.purpose}</p>
                    <a
                      href={service.privacy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-laxmi-bronze hover:text-laxmi-gold text-sm underline"
                    >
                      Privacy Policy
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Manage Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.manage.title}</h2>
              <p className="text-gray-700 mb-4">{t.manage.intro}</p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-laxmi-espresso mb-2">{t.manage.banner.title}</h3>
                <p className="text-gray-700">{t.manage.banner.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-laxmi-espresso mb-2">{t.manage.browser.title}</h3>
                <p className="text-gray-700 mb-3">{t.manage.browser.description}</p>
                <ul className="space-y-2">
                  {t.manage.browser.browsers.map((browser, idx) => (
                    <li key={idx}>
                      <a
                        href={browser.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-laxmi-bronze hover:text-laxmi-gold underline"
                      >
                        {browser.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm">{t.manage.warning}</p>
              </div>
            </section>

            {/* Consent */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.consent.title}</h2>
              <p className="text-gray-700 whitespace-pre-line">{t.consent.content}</p>
            </section>

            {/* Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.retention.title}</h2>
              <p className="text-gray-700 mb-4">{t.retention.content}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {t.retention.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.rights.title}</h2>
              <p className="text-gray-700">
                {t.rights.content}{" "}
                <Link href={`/${locale}/privacy-policy`} className="text-laxmi-bronze hover:text-laxmi-gold underline">
                  {t.rights.link}
                </Link>.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.contact.title}</h2>
              <p className="text-gray-700">{t.contact.content}</p>
              <p className="text-gray-700">{t.contact.email}</p>
            </section>

            {/* Changes */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.changes.title}</h2>
              <p className="text-gray-700">{t.changes.content}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
