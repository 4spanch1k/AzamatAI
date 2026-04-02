import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { translations, type AppMessages, type Language } from './messages';

const STORAGE_KEY = 'azamatai.language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  locale: string;
  messages: AppMessages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'ru';
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'kz' ? 'kz' : 'ru';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === 'kz' ? 'kk' : 'ru';
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      locale: translations[language].locale,
      messages: translations[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
