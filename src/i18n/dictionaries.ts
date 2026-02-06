import type { Locale } from './config';
import { getDictionaryFromDB } from '@/lib/content/getDictionaryFromDB';

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
    blog: string;
  };
  hero: {
    tagline1: string;
    tagline2: string;
    description: string;
    madeInItaly: string;
    cta: string;
    imageAlt: string;
    mobileImageAlt: string;
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
    imageAlt: string;
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
    location: string;
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
    galleryTitle: string;
    story1Title: string;
    story1Subtitle: string;
    story1Text: string;
    story1Quote: string;
    story2Title: string;
    story2Subtitle: string;
    story2Text: string;
    story2Features: string[];
    story3Title: string;
    story3Subtitle: string;
    story3Text: string;
    trustCustomDesign: string;
    trustPremiumQuality: string;
  };
  consulting: {
    heroLabel: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    heroQuote: string;
    visionLabel: string;
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
    recommended: string;
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
    commitmentLabel: string;
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
    phone: string;
    locationLabel: string;
    hoursDetail: string;
    followUs: string;
    subjectLabel: string;
    selectTopic: string;
    privacyConsent: string;
    privacyPolicyLabel: string;
    responseTime: string;
    mapTitle: string;
    mapDescription: string;
    bookAppointment: string;
  };
  blog: {
    metaTitle: string;
    metaDescription: string;
    heroLabel: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    featuredLabel: string;
    featuredTitle: string;
    minRead: string;
    readMore: string;
    allArticlesLabel: string;
    allArticlesTitle: string;
    read: string;
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterPlaceholder: string;
    subscribe: string;
    articleNotFound: string;
    faqTitle: string;
    continueReading: string;
    relatedArticles: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    heroImageAlt: string;
  };
  aboutPage: {
    label: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImageAlt: string;
    nameImageAlt: string;
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

// Static dictionaries as fallback
const staticDictionaries: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import('./dictionaries/it.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

/**
 * Get dictionary for a locale
 * Tries database first, falls back to static JSON files
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    // Try to get dictionary from database (cached)
    return await getDictionaryFromDB(locale);
  } catch (error) {
    // Log error but don't expose to users
    console.error('Database dictionary failed, using static fallback:', error);
    // Fall back to static JSON files
    return staticDictionaries[locale]();
  }
};

/**
 * Get static dictionary directly (for development/debugging)
 */
export const getStaticDictionary = async (locale: Locale): Promise<Dictionary> => {
  return staticDictionaries[locale]();
};
