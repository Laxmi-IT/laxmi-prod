import type { Locale } from './config';

// Dictionary type based on the structure
export interface Dictionary {
  metadata: {
    title: string;
    titleTemplate: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    home: string;
    consulting: string;
    collections: string;
    about: string;
    contact: string;
  };
  hero: {
    tagline1: string;
    tagline2: string;
    description: string;
    madeInItaly: string;
    cta: string;
  };
  values: {
    sectionLabel: string;
    sectionTitle: string;
    vision: { title: string; description: string };
    mission: { title: string; description: string };
    values: { title: string; description: string; highlight: string };
  };
  services: {
    sectionLabel: string;
    sectionTitle: string;
    service1: { title: string; description: string };
    service2: { title: string; description: string };
    service3: { title: string; description: string };
    discoverMore: string;
  };
  gallery: {
    sectionLabel: string;
    sectionTitle: string;
    description: string;
    viewAll: string;
    images: Array<{
      category: string;
      title: string;
      alt: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
  footer: {
    description: string;
    navigation: string;
    contact: string;
    quote: string;
    copyright: string;
  };
  booking: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      phone: string;
      phonePlaceholder: string;
      date: string;
      time: string;
      projectType: string;
      projectTypes: {
        residential: string;
        commercial: string;
        yacht: string;
        renovation: string;
        newBuild: string;
      };
      message: string;
      messagePlaceholder: string;
      submit: string;
    };
    experience: {
      title: string;
      steps: {
        request: { title: string; description: string };
        connect: { title: string; description: string };
        consult: { title: string; description: string };
        curate: { title: string; description: string };
        deliver: { title: string; description: string };
      };
    };
    contact: {
      phone: string;
      email: string;
      address: string;
    };
  };
  common: {
    madeInItaly: string;
    byAppointmentOnly: string;
    learnMore: string;
    contactUs: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import('./dictionaries/it.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
};
