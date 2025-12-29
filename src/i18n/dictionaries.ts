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
  collections: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    filterLabel: string;
    showingCount: string;
    noResults: string;
    exploreButton: string;
    categories: {
      all: string;
      cucina: string;
      living: string;
      dispensa: string;
      dettagli: string;
    };
  };
  consulting: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroQuote: string;
    philosophyTitle: string;
    philosophyText: string;
    processTitle: string;
    processSubtitle: string;
    steps: {
      questionnaire: { number: string; title: string; description: string };
      materials: { number: string; title: string; description: string };
      consultation: { number: string; title: string; description: string };
      creation: { number: string; title: string; description: string };
      refinement: { number: string; title: string; description: string };
    };
    servicesTitle: string;
    servicesSubtitle: string;
    services: {
      express: {
        name: string;
        tagline: string;
        price: string;
        description: string;
        features: string[];
        ideal: string;
      };
      singleRoom: {
        name: string;
        tagline: string;
        price: string;
        description: string;
        features: string[];
        ideal: string;
      };
      fullHouse: {
        name: string;
        tagline: string;
        price: string;
        priceNote: string;
        description: string;
        features: string[];
        ideal: string;
      };
    };
    deliverablesTitle: string;
    deliverables: {
      layouts: string;
      moodboards: string;
      furniture: string;
      lighting: string;
      renders: string;
      coordination: string;
    };
    promiseTitle: string;
    promiseText: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
    trustBadges: {
      experience: string;
      projects: string;
      satisfaction: string;
    };
  };
  contactPage: {
    label: string;
    heroTitle: string;
    heroSubtitle: string;
    infoLabel: string;
    infoTitle: string;
    infoDescription: string;
    formTitle: string;
    formSubmit: string;
    subjects: {
      consulting: string;
      boutique: string;
      collaboration: string;
      other: string;
    };
  };
  aboutPage: {
    label: string;
    heroTitle: string;
    heroSubtitle: string;
    nameSection: {
      label: string;
      title: string;
      paragraph1: string;
      paragraph2: string;
    };
    essenceTitle: string;
    valuesTitle: string;
    values: {
      quality: { title: string; description: string };
      authenticity: { title: string; description: string };
      uniqueness: { title: string; description: string };
      professionalism: { title: string; description: string };
    };
    madeInItaly: {
      title: string;
      description: string;
      badges: {
        craftsmanship: string;
        design: string;
        materials: string;
      };
    };
    ctaTitle: string;
    ctaDescription: string;
    ctaServices: string;
    ctaContact: string;
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import('./dictionaries/it.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]();
};
