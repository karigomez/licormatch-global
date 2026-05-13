import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { COUNTRIES, TRANSLATIONS, type CountryCode, type Lang } from "./i18n";

type Ctx = {
  country: CountryCode;
  lang: Lang;
  setCountry: (c: CountryCode) => void;
  t: (key: string) => string;
};

const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>("CO");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lm_country") as CountryCode | null) : null;
    if (saved && COUNTRIES[saved]) setCountryState(saved);
  }, []);

  const setCountry = (c: CountryCode) => {
    setCountryState(c);
    if (typeof window !== "undefined") localStorage.setItem("lm_country", c);
  };

  const lang = COUNTRIES[country].lang;
  const t = (key: string) => TRANSLATIONS[lang][key] ?? key;

  return <LocaleCtx.Provider value={{ country, lang, setCountry, t }}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
