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
    title: isItalian ? "Informativa Privacy | LAXMI" : "Privacy Policy | LAXMI",
    description: isItalian
      ? "Informativa sulla privacy e protezione dei dati personali di LAXMI secondo il GDPR"
      : "LAXMI privacy policy and personal data protection according to GDPR",
  };
}

const translations = {
  it: {
    title: "Informativa sulla Privacy",
    lastUpdated: "Ultimo aggiornamento",
    intro: {
      title: "1. Introduzione",
      content: `La presente Informativa sulla Privacy descrive come LAXMI ("noi", "nostro" o "Società") raccoglie, utilizza, conserva e protegge i tuoi dati personali quando utilizzi il nostro sito web e i nostri servizi, in conformità con il Regolamento (UE) 2016/679 (GDPR) e la normativa italiana in materia di protezione dei dati personali.`,
    },
    controller: {
      title: "2. Titolare del Trattamento",
      content: `Il Titolare del trattamento dei dati personali è:`,
      company: "LAXMI",
      address: "Milano, Italia",
      email: "Email: thelaxmii07@gmail.com",
      contact: "Per qualsiasi richiesta relativa alla privacy, puoi contattarci all'indirizzo email sopra indicato.",
    },
    dataCollected: {
      title: "3. Dati Personali Raccolti",
      intro: "Raccogliamo le seguenti categorie di dati personali:",
      categories: [
        {
          name: "Dati identificativi",
          items: ["Nome e cognome", "Indirizzo email", "Numero di telefono (se fornito)"],
        },
        {
          name: "Dati di navigazione",
          items: [
            "Indirizzo IP",
            "Tipo di browser",
            "Sistema operativo",
            "Pagine visitate e tempo di permanenza",
            "Data e ora dell'accesso",
          ],
        },
        {
          name: "Dati forniti volontariamente",
          items: [
            "Informazioni inserite nei moduli di contatto",
            "Preferenze di arredamento e stile",
            "Richieste specifiche di consulenza",
          ],
        },
      ],
    },
    purposes: {
      title: "4. Finalità e Base Giuridica del Trattamento",
      intro: "I tuoi dati personali sono trattati per le seguenti finalità:",
      items: [
        {
          purpose: "Rispondere alle richieste di contatto e fornire consulenza",
          basis: "Base giuridica: Esecuzione di misure precontrattuali (Art. 6.1.b GDPR)",
        },
        {
          purpose: "Fornire i nostri servizi di consulenza per arredamento di lusso",
          basis: "Base giuridica: Esecuzione del contratto (Art. 6.1.b GDPR)",
        },
        {
          purpose: "Invio di comunicazioni commerciali e newsletter",
          basis: "Base giuridica: Consenso dell'interessato (Art. 6.1.a GDPR)",
        },
        {
          purpose: "Analisi statistiche anonime per migliorare il sito web",
          basis: "Base giuridica: Legittimo interesse (Art. 6.1.f GDPR)",
        },
        {
          purpose: "Adempimento di obblighi legali e fiscali",
          basis: "Base giuridica: Obbligo legale (Art. 6.1.c GDPR)",
        },
      ],
    },
    cookies: {
      title: "5. Cookie e Tecnologie di Tracciamento",
      content: `Il nostro sito utilizza cookie tecnici necessari per il funzionamento del sito e, previo tuo consenso, cookie analitici e di profilazione. Per informazioni dettagliate sui cookie utilizzati, consulta la nostra`,
      link: "Cookie Policy",
    },
    retention: {
      title: "6. Periodo di Conservazione dei Dati",
      intro: "I dati personali saranno conservati per i seguenti periodi:",
      items: [
        "Dati di contatto e consulenza: 10 anni dall'ultimo contatto (per obblighi fiscali)",
        "Dati di navigazione: 24 mesi dalla raccolta",
        "Consenso marketing: fino alla revoca del consenso",
        "Cookie analitici: secondo quanto indicato nella Cookie Policy",
      ],
    },
    rights: {
      title: "7. I Tuoi Diritti",
      intro: "In qualità di interessato, hai diritto di:",
      items: [
        {
          right: "Accesso",
          description: "Ottenere conferma dell'esistenza di un trattamento e accedere ai tuoi dati",
        },
        {
          right: "Rettifica",
          description: "Correggere dati inesatti o integrare dati incompleti",
        },
        {
          right: "Cancellazione",
          description: 'Richiedere la cancellazione dei dati ("diritto all\'oblio")',
        },
        {
          right: "Limitazione",
          description: "Limitare il trattamento in determinati casi",
        },
        {
          right: "Portabilità",
          description: "Ricevere i dati in formato strutturato e trasferirli ad altro titolare",
        },
        {
          right: "Opposizione",
          description: "Opporti al trattamento basato su legittimo interesse",
        },
        {
          right: "Revoca del consenso",
          description: "Revocare il consenso in qualsiasi momento senza pregiudizio per il trattamento precedente",
        },
      ],
      exercise: "Per esercitare i tuoi diritti, contattaci all'indirizzo: thelaxmii07@gmail.com",
      complaint: "Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).",
    },
    sharing: {
      title: "8. Condivisione dei Dati",
      intro: "I tuoi dati personali potranno essere condivisi con:",
      items: [
        "Fornitori di servizi IT e hosting (per la gestione del sito web)",
        "Consulenti professionali (commercialisti, avvocati) per adempimenti legali",
        "Autorità competenti, quando richiesto dalla legge",
      ],
      note: "Non vendiamo né cediamo i tuoi dati personali a terzi per finalità di marketing.",
    },
    transfers: {
      title: "9. Trasferimenti Internazionali",
      content: "I tuoi dati sono conservati su server situati nell'Unione Europea. Nel caso di trasferimenti verso paesi terzi, ci assicuriamo che siano adottate le garanzie appropriate previste dal GDPR (es. clausole contrattuali standard).",
    },
    security: {
      title: "10. Sicurezza dei Dati",
      content: "Adottiamo misure tecniche e organizzative appropriate per proteggere i tuoi dati personali, tra cui:",
      items: [
        "Crittografia HTTPS per tutte le comunicazioni",
        "Accesso limitato ai dati personali solo al personale autorizzato",
        "Backup regolari dei dati",
        "Monitoraggio della sicurezza del sistema",
      ],
    },
    minors: {
      title: "11. Minori",
      content: "I nostri servizi non sono destinati a minori di 16 anni. Non raccogliamo consapevolmente dati personali di minori. Se sei un genitore o tutore e ritieni che tuo figlio ci abbia fornito dati personali, contattaci per la loro rimozione.",
    },
    changes: {
      title: "12. Modifiche all'Informativa",
      content: "Ci riserviamo il diritto di modificare questa informativa in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento. Ti invitiamo a consultare periodicamente questa pagina.",
    },
    contact: {
      title: "13. Contatti",
      content: "Per qualsiasi domanda relativa a questa informativa o al trattamento dei tuoi dati personali, puoi contattarci:",
      email: "Email: thelaxmii07@gmail.com",
      form: "Oppure utilizza il nostro",
      formLink: "modulo di contatto",
    },
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated",
    intro: {
      title: "1. Introduction",
      content: `This Privacy Policy describes how LAXMI ("we", "our" or "Company") collects, uses, stores and protects your personal data when you use our website and services, in compliance with Regulation (EU) 2016/679 (GDPR) and Italian data protection legislation.`,
    },
    controller: {
      title: "2. Data Controller",
      content: `The Data Controller for personal data processing is:`,
      company: "LAXMI",
      address: "Milan, Italy",
      email: "Email: thelaxmii07@gmail.com",
      contact: "For any privacy-related requests, you can contact us at the email address above.",
    },
    dataCollected: {
      title: "3. Personal Data Collected",
      intro: "We collect the following categories of personal data:",
      categories: [
        {
          name: "Identification data",
          items: ["Name and surname", "Email address", "Phone number (if provided)"],
        },
        {
          name: "Navigation data",
          items: [
            "IP address",
            "Browser type",
            "Operating system",
            "Pages visited and time spent",
            "Date and time of access",
          ],
        },
        {
          name: "Voluntarily provided data",
          items: [
            "Information entered in contact forms",
            "Furniture and style preferences",
            "Specific consultation requests",
          ],
        },
      ],
    },
    purposes: {
      title: "4. Purposes and Legal Basis for Processing",
      intro: "Your personal data is processed for the following purposes:",
      items: [
        {
          purpose: "Responding to contact requests and providing consultations",
          basis: "Legal basis: Performance of pre-contractual measures (Art. 6.1.b GDPR)",
        },
        {
          purpose: "Providing our luxury furniture consulting services",
          basis: "Legal basis: Contract performance (Art. 6.1.b GDPR)",
        },
        {
          purpose: "Sending commercial communications and newsletters",
          basis: "Legal basis: Data subject's consent (Art. 6.1.a GDPR)",
        },
        {
          purpose: "Anonymous statistical analysis to improve the website",
          basis: "Legal basis: Legitimate interest (Art. 6.1.f GDPR)",
        },
        {
          purpose: "Compliance with legal and tax obligations",
          basis: "Legal basis: Legal obligation (Art. 6.1.c GDPR)",
        },
      ],
    },
    cookies: {
      title: "5. Cookies and Tracking Technologies",
      content: `Our website uses necessary technical cookies for the site to function and, with your consent, analytics and profiling cookies. For detailed information about the cookies we use, please see our`,
      link: "Cookie Policy",
    },
    retention: {
      title: "6. Data Retention Period",
      intro: "Personal data will be retained for the following periods:",
      items: [
        "Contact and consultation data: 10 years from the last contact (for tax obligations)",
        "Navigation data: 24 months from collection",
        "Marketing consent: until consent is withdrawn",
        "Analytics cookies: as specified in the Cookie Policy",
      ],
    },
    rights: {
      title: "7. Your Rights",
      intro: "As a data subject, you have the right to:",
      items: [
        {
          right: "Access",
          description: "Obtain confirmation of processing and access your data",
        },
        {
          right: "Rectification",
          description: "Correct inaccurate data or complete incomplete data",
        },
        {
          right: "Erasure",
          description: 'Request deletion of data ("right to be forgotten")',
        },
        {
          right: "Restriction",
          description: "Restrict processing in certain cases",
        },
        {
          right: "Portability",
          description: "Receive data in a structured format and transfer to another controller",
        },
        {
          right: "Objection",
          description: "Object to processing based on legitimate interest",
        },
        {
          right: "Withdraw consent",
          description: "Withdraw consent at any time without affecting prior processing",
        },
      ],
      exercise: "To exercise your rights, contact us at: thelaxmii07@gmail.com",
      complaint: "You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante per la protezione dei dati personali - www.garanteprivacy.it).",
    },
    sharing: {
      title: "8. Data Sharing",
      intro: "Your personal data may be shared with:",
      items: [
        "IT and hosting service providers (for website management)",
        "Professional consultants (accountants, lawyers) for legal compliance",
        "Competent authorities, when required by law",
      ],
      note: "We do not sell or share your personal data with third parties for marketing purposes.",
    },
    transfers: {
      title: "9. International Transfers",
      content: "Your data is stored on servers located in the European Union. In case of transfers to third countries, we ensure appropriate safeguards as required by GDPR (e.g., standard contractual clauses) are in place.",
    },
    security: {
      title: "10. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal data, including:",
      items: [
        "HTTPS encryption for all communications",
        "Limited access to personal data only to authorized personnel",
        "Regular data backups",
        "System security monitoring",
      ],
    },
    minors: {
      title: "11. Minors",
      content: "Our services are not intended for minors under 16 years of age. We do not knowingly collect personal data from minors. If you are a parent or guardian and believe your child has provided us with personal data, please contact us for removal.",
    },
    changes: {
      title: "12. Changes to this Policy",
      content: "We reserve the right to modify this policy at any time. Changes will be published on this page with the updated date indicated. We encourage you to periodically review this page.",
    },
    contact: {
      title: "13. Contact Us",
      content: "For any questions about this policy or the processing of your personal data, you can contact us:",
      email: "Email: thelaxmii07@gmail.com",
      form: "Or use our",
      formLink: "contact form",
    },
  },
};

export default async function PrivacyPolicyPage({
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
              <p className="text-gray-700 leading-relaxed">{t.intro.content}</p>
            </section>

            {/* Data Controller */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.controller.title}</h2>
              <p className="text-gray-700 mb-4">{t.controller.content}</p>
              <div className="bg-white p-6 rounded-xl border border-laxmi-champagne/30">
                <p className="font-semibold text-laxmi-espresso">{t.controller.company}</p>
                <p className="text-gray-700">{t.controller.address}</p>
                <p className="text-gray-700">{t.controller.email}</p>
              </div>
              <p className="text-gray-700 mt-4">{t.controller.contact}</p>
            </section>

            {/* Data Collected */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.dataCollected.title}</h2>
              <p className="text-gray-700 mb-4">{t.dataCollected.intro}</p>
              {t.dataCollected.categories.map((category, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-lg font-semibold text-laxmi-espresso mb-2">{category.name}</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {category.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Purposes */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.purposes.title}</h2>
              <p className="text-gray-700 mb-4">{t.purposes.intro}</p>
              <div className="space-y-4">
                {t.purposes.items.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-laxmi-champagne/20">
                    <p className="font-medium text-laxmi-espresso mb-1">{item.purpose}</p>
                    <p className="text-sm text-laxmi-bronze">{item.basis}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.cookies.title}</h2>
              <p className="text-gray-700">
                {t.cookies.content}{" "}
                <Link href={`/${locale}/cookie-policy`} className="text-laxmi-bronze hover:text-laxmi-gold underline">
                  {t.cookies.link}
                </Link>.
              </p>
            </section>

            {/* Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.retention.title}</h2>
              <p className="text-gray-700 mb-4">{t.retention.intro}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {t.retention.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.rights.title}</h2>
              <p className="text-gray-700 mb-4">{t.rights.intro}</p>
              <div className="grid gap-3">
                {t.rights.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <span className="font-semibold text-laxmi-bronze min-w-[120px]">{item.right}:</span>
                    <span className="text-gray-700">{item.description}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-laxmi-cream/50 rounded-lg border border-laxmi-champagne/30">
                <p className="text-gray-700 mb-2">{t.rights.exercise}</p>
                <p className="text-sm text-gray-600">{t.rights.complaint}</p>
              </div>
            </section>

            {/* Sharing */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.sharing.title}</h2>
              <p className="text-gray-700 mb-4">{t.sharing.intro}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {t.sharing.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <p className="text-gray-700 mt-4 font-medium">{t.sharing.note}</p>
            </section>

            {/* International Transfers */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.transfers.title}</h2>
              <p className="text-gray-700">{t.transfers.content}</p>
            </section>

            {/* Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.security.title}</h2>
              <p className="text-gray-700 mb-4">{t.security.content}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {t.security.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Minors */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.minors.title}</h2>
              <p className="text-gray-700">{t.minors.content}</p>
            </section>

            {/* Changes */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.changes.title}</h2>
              <p className="text-gray-700">{t.changes.content}</p>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.contact.title}</h2>
              <p className="text-gray-700 mb-2">{t.contact.content}</p>
              <p className="text-gray-700">{t.contact.email}</p>
              <p className="text-gray-700 mt-2">
                {t.contact.form}{" "}
                <Link href={`/${locale}/contact`} className="text-laxmi-bronze hover:text-laxmi-gold underline">
                  {t.contact.formLink}
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
