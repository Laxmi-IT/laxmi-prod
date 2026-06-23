import type { Locale } from '@/i18n/config';

export interface ProcessStep {
  title: string;
  description: string;
}

/**
 * The canonical LAXMI client journey ("L'Esperienza" / "The Experience").
 *
 * Single source of truth so the process is described identically on every
 * page that shows it (Consulting, Booking and Contact). Update it here once
 * and all pages stay in sync.
 */
export const processSteps: Record<Locale, ProcessStep[]> = {
  it: [
    { title: 'Richiesta', description: 'Condividi la tua visione e le tue preferenze con i dettagli del progetto.' },
    { title: 'Contatto', description: 'Il nostro design concierge ti contatta personalmente entro 24-48 ore.' },
    { title: 'Consulenza', description: 'Una sessione privata su misura per comprendere la tua visione.' },
    { title: 'Selezione', description: 'Curiamo una proposta su misura di arredo italiano esclusivo.' },
    { title: 'Consegna', description: 'Gestione completa fino all’installazione finale, con servizio impeccabile.' },
  ],
  en: [
    { title: 'Request', description: 'Share your vision and preferences along with your project details.' },
    { title: 'Connect', description: 'Our design concierge personally contacts you within 24-48 hours.' },
    { title: 'Consult', description: 'A private session tailored to you to understand your vision.' },
    { title: 'Curate', description: 'We curate a bespoke proposal of exclusive Italian furniture.' },
    { title: 'Deliver', description: 'Complete management through to final, white-glove installation.' },
  ],
};
