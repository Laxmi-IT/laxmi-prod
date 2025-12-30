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
    title: isItalian ? "Termini di Servizio | LAXMI" : "Terms of Service | LAXMI",
    description: isItalian
      ? "Termini e condizioni per l'utilizzo dei servizi di consulenza LAXMI"
      : "Terms and conditions for using LAXMI consulting services",
  };
}

const translations = {
  it: {
    title: "Termini di Servizio",
    lastUpdated: "Ultimo aggiornamento",
    intro: {
      title: "1. Accettazione dei Termini",
      content: `Utilizzando il sito web di LAXMI e i nostri servizi di consulenza, accetti di essere vincolato dai presenti Termini di Servizio. Se non accetti questi termini, ti preghiamo di non utilizzare il nostro sito o i nostri servizi.

Questi termini si applicano a tutti i visitatori, utenti e clienti del sito e dei servizi di LAXMI.`,
    },
    services: {
      title: "2. Descrizione dei Servizi",
      content: "LAXMI offre servizi di consulenza per l'arredamento di lusso Made in Italy:",
      items: [
        {
          name: "Consulenza Personalizzata",
          description: "Guida esperta nella selezione di arredi di lusso italiani in base alle tue esigenze e preferenze.",
        },
        {
          name: "Interior Styling",
          description: "Servizi di progettazione e coordinamento estetico per i tuoi spazi.",
        },
        {
          name: "Boutique Reselling",
          description: "Vendita di una selezione curata di mobili di lusso Made in Italy.",
        },
        {
          name: "Mediazione con Produttori",
          description: "Facilitazione dei contatti con i migliori produttori italiani di alta gamma.",
        },
      ],
      note: "I servizi specifici, i costi e le tempistiche vengono concordati individualmente con ciascun cliente.",
    },
    process: {
      title: "3. Processo di Consulenza",
      steps: [
        {
          step: "Richiesta iniziale",
          description: "Il cliente ci contatta tramite il modulo sul sito o via email per esprimere il proprio interesse.",
        },
        {
          step: "Consulenza preliminare",
          description: "Organizziamo un incontro (di persona o virtuale) per comprendere le esigenze e le preferenze del cliente.",
        },
        {
          step: "Proposta",
          description: "Presentiamo una proposta personalizzata con i servizi suggeriti e i relativi costi.",
        },
        {
          step: "Conferma e contratto",
          description: "Una volta accettata la proposta, viene stipulato un contratto formale che definisce tutti i dettagli dell'incarico.",
        },
        {
          step: "Esecuzione",
          description: "Forniamo i servizi concordati secondo le tempistiche stabilite.",
        },
      ],
    },
    payments: {
      title: "4. Pagamenti e Fatturazione",
      content: `I termini di pagamento sono definiti nel contratto individuale stipulato con ciascun cliente. In generale:`,
      items: [
        "I pagamenti possono essere richiesti in anticipo, a rate o al completamento, a seconda del servizio",
        "Le fatture vengono emesse in conformità con la normativa fiscale italiana",
        "I metodi di pagamento accettati includono bonifico bancario e carta di credito",
        "In caso di ritardo nei pagamenti, LAXMI si riserva il diritto di sospendere i servizi",
      ],
    },
    cancellation: {
      title: "5. Cancellazione e Recesso",
      consumer: {
        title: "Per i Consumatori (B2C)",
        content: `Ai sensi del Codice del Consumo (D.Lgs. 206/2005), hai diritto di recedere dal contratto entro 14 giorni dalla conclusione dello stesso, senza dover fornire alcuna motivazione e senza penali, a condizione che l'esecuzione del servizio non sia già iniziata con il tuo consenso esplicito.

Per esercitare il diritto di recesso, invia una comunicazione scritta a thelaxmii07@gmail.com.`,
      },
      business: {
        title: "Per i Clienti Business (B2B)",
        content: "Le condizioni di cancellazione per i clienti business sono definite nel contratto individuale.",
      },
    },
    intellectual: {
      title: "6. Proprietà Intellettuale",
      content: `Tutti i materiali creati da LAXMI nell'ambito dei servizi di consulenza (moodboard, progetti, presentazioni, ecc.) rimangono di proprietà intellettuale di LAXMI fino al completamento del pagamento integrale.

Una volta completato il pagamento, i materiali specificamente creati per il cliente vengono ceduti in licenza d'uso non esclusiva al cliente stesso.

Il cliente non può rivendere, cedere o utilizzare commercialmente i materiali senza previo consenso scritto di LAXMI.`,
    },
    liability: {
      title: "7. Limitazione di Responsabilità",
      content: `LAXMI si impegna a fornire servizi di consulenza professionali e di alta qualità. Tuttavia:

- I consigli forniti sono basati sulle informazioni disponibili e sull'esperienza professionale
- LAXMI non garantisce risultati specifici derivanti dall'applicazione dei consigli forniti
- La responsabilità di LAXMI è limitata all'importo pagato per i servizi
- LAXMI non è responsabile per danni indiretti, incidentali o consequenziali
- Per gli acquisti di prodotti tramite terzi, le garanzie sono quelle fornite dai rispettivi produttori/venditori`,
    },
    confidentiality: {
      title: "8. Riservatezza",
      content: `LAXMI si impegna a mantenere la massima riservatezza su tutte le informazioni ricevute dai clienti durante la consulenza.

Il cliente, a sua volta, si impegna a non divulgare informazioni riservate su fornitori, prezzi o contatti professionali condivisi da LAXMI, salvo diverso accordo scritto.`,
    },
    website: {
      title: "9. Utilizzo del Sito Web",
      content: "Nell'utilizzare il nostro sito web, l'utente si impegna a:",
      items: [
        "Non utilizzare il sito per scopi illegali o non autorizzati",
        "Non tentare di accedere ad aree riservate del sito",
        "Non interferire con il funzionamento del sito",
        "Fornire informazioni accurate nei moduli di contatto",
        "Rispettare i diritti di proprietà intellettuale",
      ],
    },
    changes: {
      title: "10. Modifiche ai Termini",
      content: "LAXMI si riserva il diritto di modificare questi Termini di Servizio in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento. L'uso continuato dei servizi dopo la pubblicazione delle modifiche costituisce accettazione dei nuovi termini.",
    },
    law: {
      title: "11. Legge Applicabile e Foro Competente",
      content: `Questi Termini di Servizio sono regolati dalla legge italiana.

Per le controversie con consumatori, è competente il foro del luogo di residenza del consumatore.

Per le controversie con clienti business, è competente in via esclusiva il Foro di Milano.

Piattaforma ODR per la risoluzione delle controversie online:`,
      odrLink: "https://ec.europa.eu/consumers/odr/",
    },
    contact: {
      title: "12. Contatti",
      content: "Per qualsiasi domanda relativa a questi Termini di Servizio:",
      email: "Email: thelaxmii07@gmail.com",
    },
  },
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated",
    intro: {
      title: "1. Acceptance of Terms",
      content: `By using the LAXMI website and our consulting services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.

These terms apply to all visitors, users, and customers of the LAXMI website and services.`,
    },
    services: {
      title: "2. Description of Services",
      content: "LAXMI offers consulting services for luxury Made in Italy furniture:",
      items: [
        {
          name: "Personalized Consulting",
          description: "Expert guidance in selecting Italian luxury furniture based on your needs and preferences.",
        },
        {
          name: "Interior Styling",
          description: "Design and aesthetic coordination services for your spaces.",
        },
        {
          name: "Boutique Reselling",
          description: "Sale of a curated selection of Made in Italy luxury furniture.",
        },
        {
          name: "Manufacturer Mediation",
          description: "Facilitating connections with the best high-end Italian manufacturers.",
        },
      ],
      note: "Specific services, costs, and timelines are agreed individually with each client.",
    },
    process: {
      title: "3. Consulting Process",
      steps: [
        {
          step: "Initial request",
          description: "The client contacts us via the website form or email to express their interest.",
        },
        {
          step: "Preliminary consultation",
          description: "We arrange a meeting (in-person or virtual) to understand the client's needs and preferences.",
        },
        {
          step: "Proposal",
          description: "We present a personalized proposal with suggested services and related costs.",
        },
        {
          step: "Confirmation and contract",
          description: "Once the proposal is accepted, a formal contract is drawn up defining all the details of the engagement.",
        },
        {
          step: "Execution",
          description: "We deliver the agreed services according to the established timelines.",
        },
      ],
    },
    payments: {
      title: "4. Payments and Invoicing",
      content: `Payment terms are defined in the individual contract with each client. In general:`,
      items: [
        "Payments may be required in advance, in installments, or upon completion, depending on the service",
        "Invoices are issued in compliance with Italian tax regulations",
        "Accepted payment methods include bank transfer and credit card",
        "In case of late payment, LAXMI reserves the right to suspend services",
      ],
    },
    cancellation: {
      title: "5. Cancellation and Withdrawal",
      consumer: {
        title: "For Consumers (B2C)",
        content: `Under the Italian Consumer Code (Legislative Decree 206/2005), you have the right to withdraw from the contract within 14 days of its conclusion, without providing any reason and without penalty, provided that service execution has not already begun with your explicit consent.

To exercise your right of withdrawal, send a written communication to thelaxmii07@gmail.com.`,
      },
      business: {
        title: "For Business Clients (B2B)",
        content: "Cancellation conditions for business clients are defined in the individual contract.",
      },
    },
    intellectual: {
      title: "6. Intellectual Property",
      content: `All materials created by LAXMI as part of consulting services (moodboards, projects, presentations, etc.) remain the intellectual property of LAXMI until full payment is completed.

Once payment is completed, materials specifically created for the client are licensed for non-exclusive use by the client.

The client may not resell, transfer, or commercially use the materials without prior written consent from LAXMI.`,
    },
    liability: {
      title: "7. Limitation of Liability",
      content: `LAXMI is committed to providing professional, high-quality consulting services. However:

- Advice given is based on available information and professional experience
- LAXMI does not guarantee specific results from applying the advice provided
- LAXMI's liability is limited to the amount paid for services
- LAXMI is not liable for indirect, incidental, or consequential damages
- For product purchases through third parties, warranties are those provided by the respective manufacturers/sellers`,
    },
    confidentiality: {
      title: "8. Confidentiality",
      content: `LAXMI commits to maintaining maximum confidentiality regarding all information received from clients during consultation.

The client, in turn, agrees not to disclose confidential information about suppliers, prices, or professional contacts shared by LAXMI, unless otherwise agreed in writing.`,
    },
    website: {
      title: "9. Website Use",
      content: "When using our website, the user agrees to:",
      items: [
        "Not use the site for illegal or unauthorized purposes",
        "Not attempt to access restricted areas of the site",
        "Not interfere with the site's operation",
        "Provide accurate information in contact forms",
        "Respect intellectual property rights",
      ],
    },
    changes: {
      title: "10. Changes to Terms",
      content: "LAXMI reserves the right to modify these Terms of Service at any time. Changes will be posted on this page with the update date. Continued use of the services after publication of changes constitutes acceptance of the new terms.",
    },
    law: {
      title: "11. Applicable Law and Jurisdiction",
      content: `These Terms of Service are governed by Italian law.

For disputes with consumers, the court of the consumer's place of residence has jurisdiction.

For disputes with business clients, the Court of Milan has exclusive jurisdiction.

ODR platform for online dispute resolution:`,
      odrLink: "https://ec.europa.eu/consumers/odr/",
    },
    contact: {
      title: "12. Contact Us",
      content: "For any questions about these Terms of Service:",
      email: "Email: thelaxmii07@gmail.com",
    },
  },
};

export default async function TermsOfServicePage({
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
              <p className="text-gray-700 whitespace-pre-line">{t.intro.content}</p>
            </section>

            {/* Services */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.services.title}</h2>
              <p className="text-gray-700 mb-4">{t.services.content}</p>
              <div className="space-y-4">
                {t.services.items.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-laxmi-champagne/20">
                    <h3 className="font-semibold text-laxmi-espresso mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-laxmi-bronze mt-4 italic">{t.services.note}</p>
            </section>

            {/* Process */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.process.title}</h2>
              <div className="space-y-4">
                {t.process.steps.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-laxmi-espresso text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-laxmi-espresso">{item.step}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payments */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.payments.title}</h2>
              <p className="text-gray-700 mb-4">{t.payments.content}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {t.payments.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Cancellation */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.cancellation.title}</h2>
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">{t.cancellation.consumer.title}</h3>
                  <p className="text-green-700 text-sm whitespace-pre-line">{t.cancellation.consumer.content}</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-2">{t.cancellation.business.title}</h3>
                  <p className="text-gray-700 text-sm">{t.cancellation.business.content}</p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.intellectual.title}</h2>
              <p className="text-gray-700 whitespace-pre-line">{t.intellectual.content}</p>
            </section>

            {/* Liability */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.liability.title}</h2>
              <p className="text-gray-700 whitespace-pre-line">{t.liability.content}</p>
            </section>

            {/* Confidentiality */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.confidentiality.title}</h2>
              <p className="text-gray-700 whitespace-pre-line">{t.confidentiality.content}</p>
            </section>

            {/* Website Use */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.website.title}</h2>
              <p className="text-gray-700 mb-4">{t.website.content}</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {t.website.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Changes */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.changes.title}</h2>
              <p className="text-gray-700">{t.changes.content}</p>
            </section>

            {/* Applicable Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.law.title}</h2>
              <p className="text-gray-700 whitespace-pre-line mb-4">{t.law.content}</p>
              <a
                href={t.law.odrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-laxmi-bronze hover:text-laxmi-gold underline"
              >
                {t.law.odrLink}
              </a>
            </section>

            {/* Contact */}
            <section className="mb-10">
              <h2 className="text-2xl font-serif text-laxmi-espresso mb-4">{t.contact.title}</h2>
              <p className="text-gray-700">{t.contact.content}</p>
              <p className="text-gray-700">{t.contact.email}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
