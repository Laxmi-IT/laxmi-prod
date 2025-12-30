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
    title: isItalian ? "Note Legali | LAXMI" : "Legal Notice | LAXMI",
    description: isItalian
      ? "Informazioni legali e identificazione del titolare del sito LAXMI"
      : "Legal information and website owner identification for LAXMI",
  };
}

const translations = {
  it: {
    title: "Note Legali",
    subtitle: "Informazioni ai sensi del D.Lgs. 70/2003",
    lastUpdated: "Ultimo aggiornamento",
    owner: {
      title: "Titolare del Sito",
      content: "Il presente sito web è di proprietà e gestito da:",
      company: "LAXMI",
      type: "Attività di consulenza per arredamento di lusso",
      address: "Milano, Italia",
      email: "Email: thelaxmii07@gmail.com",
      note: "I dati fiscali completi (Partita IVA, Codice Fiscale, ecc.) saranno pubblicati non appena disponibili in conformità con la normativa vigente.",
    },
    services: {
      title: "Servizi Offerti",
      content: "LAXMI offre servizi di consulenza per l'arredamento di lusso Made in Italy, tra cui:",
      items: [
        "Consulenza personalizzata per la selezione di arredi",
        "Servizi di interior styling",
        "Mediazione con produttori italiani di alta gamma",
        "Boutique reselling di mobili di lusso",
      ],
    },
    intellectual: {
      title: "Proprietà Intellettuale",
      content: `Tutti i contenuti presenti su questo sito, inclusi ma non limitati a: testi, grafica, loghi, immagini, clip audio, download digitali e compilazioni di dati, sono di proprietà di LAXMI o dei rispettivi licenziatari e sono protetti dalle leggi italiane e internazionali sul diritto d'autore.

I marchi, i loghi e i marchi di servizio visualizzati sul sito sono marchi registrati o non registrati di LAXMI. Non è consentito l'utilizzo di tali marchi senza previa autorizzazione scritta.`,
      permissions: "Per richieste di utilizzo di contenuti, contattare:",
    },
    disclaimer: {
      title: "Esclusione di Responsabilità",
      content: `Le informazioni contenute in questo sito sono fornite a solo scopo informativo e non costituiscono un'offerta al pubblico ai sensi dell'art. 1336 del Codice Civile.

LAXMI si riserva il diritto di modificare i contenuti del sito in qualsiasi momento senza preavviso.

Pur impegnandoci per garantire l'accuratezza delle informazioni, non garantiamo la completezza o l'attualità dei contenuti. LAXMI non sarà responsabile per eventuali errori od omissioni, né per eventuali danni derivanti dall'utilizzo delle informazioni contenute nel sito.`,
    },
    links: {
      title: "Link a Siti Terzi",
      content: "Questo sito può contenere link a siti web di terze parti. Tali link sono forniti esclusivamente per comodità dell'utente. LAXMI non ha alcun controllo su tali siti e non si assume alcuna responsabilità per i loro contenuti o le loro pratiche sulla privacy.",
    },
    law: {
      title: "Legge Applicabile e Foro Competente",
      content: "Il presente sito e le sue condizioni d'uso sono regolati dalla legge italiana. Per qualsiasi controversia relativa all'utilizzo del sito, sarà competente in via esclusiva il Foro di Milano, salvo il foro inderogabile del consumatore.",
    },
    consumer: {
      title: "Diritti dei Consumatori",
      content: "Per i servizi prestati a consumatori, si applicano le tutele previste dal Codice del Consumo (D.Lgs. 206/2005), incluso il diritto di recesso entro 14 giorni dalla conclusione del contratto per i servizi non ancora eseguiti.",
      odr: "Piattaforma ODR (Online Dispute Resolution) dell'UE:",
      odrLink: "https://ec.europa.eu/consumers/odr/",
    },
    related: {
      title: "Documenti Correlati",
      privacy: "Informativa Privacy",
      cookies: "Cookie Policy",
      terms: "Termini di Servizio",
    },
    contact: {
      title: "Contatti",
      content: "Per qualsiasi informazione o chiarimento, puoi contattarci:",
      email: "Email: thelaxmii07@gmail.com",
      form: "Modulo di contatto",
    },
  },
  en: {
    title: "Legal Notice",
    subtitle: "Information pursuant to Italian Legislative Decree 70/2003",
    lastUpdated: "Last updated",
    owner: {
      title: "Website Owner",
      content: "This website is owned and operated by:",
      company: "LAXMI",
      type: "Luxury furniture consulting business",
      address: "Milan, Italy",
      email: "Email: thelaxmii07@gmail.com",
      note: "Complete tax details (VAT number, Tax Code, etc.) will be published as soon as available in compliance with applicable regulations.",
    },
    services: {
      title: "Services Offered",
      content: "LAXMI offers luxury furniture consulting services Made in Italy, including:",
      items: [
        "Personalized furniture selection consulting",
        "Interior styling services",
        "Mediation with high-end Italian manufacturers",
        "Boutique reselling of luxury furniture",
      ],
    },
    intellectual: {
      title: "Intellectual Property",
      content: `All content on this website, including but not limited to: text, graphics, logos, images, audio clips, digital downloads, and data compilations, are the property of LAXMI or its licensors and are protected by Italian and international copyright laws.

The trademarks, logos, and service marks displayed on the site are registered or unregistered trademarks of LAXMI. Use of these marks is not permitted without prior written authorization.`,
      permissions: "For content usage requests, please contact:",
    },
    disclaimer: {
      title: "Disclaimer",
      content: `The information contained on this website is provided for informational purposes only and does not constitute a public offer pursuant to Article 1336 of the Italian Civil Code.

LAXMI reserves the right to modify the content of the site at any time without prior notice.

While we strive to ensure the accuracy of information, we do not guarantee the completeness or currency of the content. LAXMI shall not be liable for any errors or omissions, or for any damages arising from the use of information contained on the site.`,
    },
    links: {
      title: "Third-Party Links",
      content: "This website may contain links to third-party websites. Such links are provided solely for user convenience. LAXMI has no control over such sites and assumes no responsibility for their content or privacy practices.",
    },
    law: {
      title: "Applicable Law and Jurisdiction",
      content: "This website and its terms of use are governed by Italian law. For any disputes relating to the use of the site, the Court of Milan shall have exclusive jurisdiction, except for the mandatory jurisdiction of the consumer.",
    },
    consumer: {
      title: "Consumer Rights",
      content: "For services provided to consumers, the protections provided by the Italian Consumer Code (Legislative Decree 206/2005) apply, including the right of withdrawal within 14 days of the conclusion of the contract for services not yet performed.",
      odr: "EU Online Dispute Resolution (ODR) Platform:",
      odrLink: "https://ec.europa.eu/consumers/odr/",
    },
    related: {
      title: "Related Documents",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      terms: "Terms of Service",
    },
    contact: {
      title: "Contact Us",
      content: "For any information or clarification, you can contact us:",
      email: "Email: thelaxmii07@gmail.com",
      form: "Contact form",
    },
  },
};

export default async function LegalNoticePage({
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
            <h1 className="text-4xl md:text-5xl font-serif text-laxmi-espresso mb-2">
              {t.title}
            </h1>
            <p className="text-lg text-laxmi-bronze mb-4">{t.subtitle}</p>
            <p className="text-gray-600">
              {t.lastUpdated}: 30 December 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {/* Owner */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.owner.title}</h2>
              <p className="text-gray-700 mb-4">{t.owner.content}</p>
              <div className="bg-white p-6 rounded-xl border border-laxmi-champagne/30 mb-4">
                <p className="font-serif text-2xl text-laxmi-espresso mb-2">{t.owner.company}</p>
                <p className="text-gray-700">{t.owner.type}</p>
                <p className="text-gray-700">{t.owner.address}</p>
                <p className="text-gray-700">{t.owner.email}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm">{t.owner.note}</p>
              </div>
            </section>

            {/* Services */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.services.title}</h2>
              <p className="text-gray-700 mb-4">{t.services.content}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {t.services.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.intellectual.title}</h2>
              <p className="text-gray-700 whitespace-pre-line mb-4">{t.intellectual.content}</p>
              <p className="text-gray-700">
                {t.intellectual.permissions}{" "}
                <a href="mailto:thelaxmii07@gmail.com" className="text-laxmi-bronze hover:text-laxmi-gold underline">
                  thelaxmii07@gmail.com
                </a>
              </p>
            </section>

            {/* Disclaimer */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.disclaimer.title}</h2>
              <p className="text-gray-700 whitespace-pre-line">{t.disclaimer.content}</p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.links.title}</h2>
              <p className="text-gray-700">{t.links.content}</p>
            </section>

            {/* Applicable Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.law.title}</h2>
              <p className="text-gray-700">{t.law.content}</p>
            </section>

            {/* Consumer Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.consumer.title}</h2>
              <p className="text-gray-700 mb-4">{t.consumer.content}</p>
              <p className="text-gray-700">
                {t.consumer.odr}{" "}
                <a
                  href={t.consumer.odrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-laxmi-bronze hover:text-laxmi-gold underline"
                >
                  {t.consumer.odrLink}
                </a>
              </p>
            </section>

            {/* Related Documents */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.related.title}</h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="px-6 py-3 bg-white border border-laxmi-champagne/30 rounded-lg text-laxmi-espresso hover:bg-laxmi-cream transition-colors"
                >
                  {t.related.privacy}
                </Link>
                <Link
                  href={`/${locale}/cookie-policy`}
                  className="px-6 py-3 bg-white border border-laxmi-champagne/30 rounded-lg text-laxmi-espresso hover:bg-laxmi-cream transition-colors"
                >
                  {t.related.cookies}
                </Link>
                <Link
                  href={`/${locale}/terms-of-service`}
                  className="px-6 py-3 bg-white border border-laxmi-champagne/30 rounded-lg text-laxmi-espresso hover:bg-laxmi-cream transition-colors"
                >
                  {t.related.terms}
                </Link>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.contact.title}</h2>
              <p className="text-gray-700">{t.contact.content}</p>
              <p className="text-gray-700 mb-2">{t.contact.email}</p>
              <Link
                href={`/${locale}/contact`}
                className="text-laxmi-bronze hover:text-laxmi-gold underline"
              >
                {t.contact.form}
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
