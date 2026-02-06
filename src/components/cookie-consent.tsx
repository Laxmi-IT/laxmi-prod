"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentProps {
  locale: "it" | "en";
}

const translations = {
  it: {
    title: "Questo sito utilizza i cookie",
    description: "Utilizziamo cookie tecnici necessari per il funzionamento del sito e, con il tuo consenso, cookie analitici e di profilazione per migliorare la tua esperienza.",
    acceptAll: "Accetta tutti",
    rejectAll: "Rifiuta tutti",
    customize: "Personalizza",
    save: "Salva preferenze",
    close: "Chiudi",
    manageCookies: "Gestisci Cookie",
    privacyPolicy: "Informativa Privacy",
    cookiePolicy: "Cookie Policy",
    categories: {
      necessary: {
        title: "Cookie Necessari",
        description: "Essenziali per il funzionamento del sito. Non possono essere disattivati.",
      },
      analytics: {
        title: "Cookie Analitici",
        description: "Ci aiutano a capire come i visitatori interagiscono con il sito.",
      },
      marketing: {
        title: "Cookie di Marketing",
        description: "Utilizzati per mostrare annunci pertinenti ai tuoi interessi.",
      },
      preferences: {
        title: "Cookie di Preferenza",
        description: "Permettono di ricordare le tue preferenze e personalizzazioni.",
      },
    },
  },
  en: {
    title: "This site uses cookies",
    description: "We use necessary technical cookies for the site to function and, with your consent, analytics and profiling cookies to improve your experience.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    customize: "Customize",
    save: "Save preferences",
    close: "Close",
    manageCookies: "Manage Cookies",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    categories: {
      necessary: {
        title: "Necessary Cookies",
        description: "Essential for the website to function. Cannot be disabled.",
      },
      analytics: {
        title: "Analytics Cookies",
        description: "Help us understand how visitors interact with the site.",
      },
      marketing: {
        title: "Marketing Cookies",
        description: "Used to show ads relevant to your interests.",
      },
      preferences: {
        title: "Preference Cookies",
        description: "Allow us to remember your preferences and customizations.",
      },
    },
  },
};

export function CookieConsent({ locale }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const t = translations[locale];

  useEffect(() => {
    // Check if consent has been given
    const consent = localStorage.getItem("laxmi_cookie_consent");
    if (!consent) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch {
        setShowBanner(true);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    // Save consent with timestamp for compliance records
    const consentRecord = {
      ...prefs,
      timestamp: new Date().toISOString(),
      version: "1.0",
    };
    localStorage.setItem("laxmi_cookie_consent", JSON.stringify(consentRecord));
    setPreferences(prefs);
    setShowBanner(false);
    setShowDetails(false);

    // Here you would typically initialize/disable analytics based on consent
    if (prefs.analytics) {
      // Initialize analytics (e.g., Google Analytics, PostHog)
      console.log("Analytics cookies enabled");
    }
    if (prefs.marketing) {
      // Initialize marketing cookies
      console.log("Marketing cookies enabled");
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const saveCustomPreferences = () => {
    saveConsent(preferences);
  };

  const closeBanner = () => {
    // Close without setting non-necessary cookies (Italian Garante compliant)
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-[998]" onClick={closeBanner} />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[999] p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-laxmi-champagne/30 dark:border-gray-700 overflow-hidden">
          {/* Close button (X) - Italian Garante requirement */}
          <button
            onClick={closeBanner}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label={t.close}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6 md:p-8">
            {!showDetails ? (
              <>
                {/* Main Banner */}
                <div className="pr-8">
                  <h2 className="text-lg md:text-xl font-serif text-laxmi-espresso dark:text-white mb-3">
                    {t.title}
                  </h2>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {t.description}{" "}
                    <Link
                      href={`/${locale}/privacy-policy`}
                      className="text-laxmi-bronze hover:text-laxmi-gold underline"
                    >
                      {t.privacyPolicy}
                    </Link>
                    {" | "}
                    <Link
                      href={`/${locale}/cookie-policy`}
                      className="text-laxmi-bronze hover:text-laxmi-gold underline"
                    >
                      {t.cookiePolicy}
                    </Link>
                  </p>
                </div>

                {/* Buttons - Same styling for Accept/Reject per Italian Garante */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-6 py-3 bg-laxmi-espresso text-white text-sm font-medium tracking-wide rounded-lg hover:bg-laxmi-bronze transition-colors"
                  >
                    {t.acceptAll}
                  </button>
                  <button
                    onClick={rejectAll}
                    className="flex-1 px-6 py-3 bg-laxmi-espresso text-white text-sm font-medium tracking-wide rounded-lg hover:bg-laxmi-bronze transition-colors"
                  >
                    {t.rejectAll}
                  </button>
                  <button
                    onClick={() => setShowDetails(true)}
                    className="flex-1 px-6 py-3 border border-laxmi-espresso text-laxmi-espresso dark:text-white dark:border-white text-sm font-medium tracking-wide rounded-lg hover:bg-laxmi-cream/50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t.customize}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Detailed Preferences */}
                <div className="pr-8">
                  <h2 className="text-lg md:text-xl font-serif text-laxmi-espresso dark:text-white mb-6">
                    {t.customize}
                  </h2>

                  <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
                    {/* Necessary Cookies - Always enabled */}
                    <div className="flex items-start justify-between p-4 bg-laxmi-cream/30 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h3 className="font-medium text-laxmi-espresso dark:text-white mb-1">
                          {t.categories.necessary.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t.categories.necessary.description}
                        </p>
                      </div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="sr-only"
                        />
                        <div className="w-11 h-6 bg-laxmi-gold rounded-full cursor-not-allowed opacity-70">
                          <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                        </div>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start justify-between p-4 bg-laxmi-cream/30 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h3 className="font-medium text-laxmi-espresso dark:text-white mb-1">
                          {t.categories.analytics.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t.categories.analytics.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                        className="relative"
                        role="switch"
                        aria-checked={preferences.analytics}
                      >
                        <div className={`w-11 h-6 rounded-full transition-colors ${preferences.analytics ? 'bg-laxmi-gold' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences.analytics ? 'right-0.5' : 'left-0.5'}`} />
                        </div>
                      </button>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-start justify-between p-4 bg-laxmi-cream/30 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h3 className="font-medium text-laxmi-espresso dark:text-white mb-1">
                          {t.categories.marketing.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t.categories.marketing.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                        className="relative"
                        role="switch"
                        aria-checked={preferences.marketing}
                      >
                        <div className={`w-11 h-6 rounded-full transition-colors ${preferences.marketing ? 'bg-laxmi-gold' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences.marketing ? 'right-0.5' : 'left-0.5'}`} />
                        </div>
                      </button>
                    </div>

                    {/* Preference Cookies */}
                    <div className="flex items-start justify-between p-4 bg-laxmi-cream/30 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 pr-4">
                        <h3 className="font-medium text-laxmi-espresso dark:text-white mb-1">
                          {t.categories.preferences.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t.categories.preferences.description}
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences({ ...preferences, preferences: !preferences.preferences })}
                        className="relative"
                        role="switch"
                        aria-checked={preferences.preferences}
                      >
                        <div className={`w-11 h-6 rounded-full transition-colors ${preferences.preferences ? 'bg-laxmi-gold' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences.preferences ? 'right-0.5' : 'left-0.5'}`} />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={saveCustomPreferences}
                    className="flex-1 px-6 py-3 bg-laxmi-espresso text-white text-sm font-medium tracking-wide rounded-lg hover:bg-laxmi-bronze transition-colors"
                  >
                    {t.save}
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="flex-1 px-6 py-3 border border-laxmi-espresso text-laxmi-espresso dark:text-white dark:border-white text-sm font-medium tracking-wide rounded-lg hover:bg-laxmi-cream/50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {t.close}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Cookie Settings Button for footer - allows users to change preferences
export function CookieSettingsButton({ locale }: { locale: "it" | "en" }) {
  const handleClick = () => {
    localStorage.removeItem("laxmi_cookie_consent");
    window.location.reload();
  };

  return (
    <button
      onClick={handleClick}
      className="text-muted-foreground hover:text-foreground transition-colors font-light"
    >
      {translations[locale].manageCookies}
    </button>
  );
}
