import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { COUNTRIES, TRANSLATIONS, type CountryCode, type Lang } from "./i18n";

type Ctx = {
  country: CountryCode;
  lang: Lang;
  setCountry: (c: CountryCode) => void;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LocaleCtx = createContext<Ctx | null>(null);

const LANGS: Lang[] = ["es", "en", "pt", "it", "fr"];

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>("CO");
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedC = localStorage.getItem("lm_country") as CountryCode | null;
    if (savedC && COUNTRIES[savedC]) setCountryState(savedC);
    const savedL = localStorage.getItem("lm_lang") as Lang | null;
    if (savedL && LANGS.includes(savedL)) {
      setLangState(savedL);
    } else if (savedC && COUNTRIES[savedC]) {
      setLangState(COUNTRIES[savedC].lang);
    } else {
      setLangState(COUNTRIES["CO"].lang);
    }
  }, []);

  const setCountry = (c: CountryCode) => {
    setCountryState(c);
    if (typeof window !== "undefined") localStorage.setItem("lm_country", c);
    // Do NOT change the UI language — language is independent from country.
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lm_lang", l);
  };

  const t = (key: string) => TRANSLATIONS[lang][key] ?? key;

  return <LocaleCtx.Provider value={{ country, lang, setCountry, setLang, t }}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
