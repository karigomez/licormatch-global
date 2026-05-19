import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import type { Lang } from "@/lib/i18n";

const LANGS: { code: Lang; name: string; flag: string; native: string }[] = [
  { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
  { code: "en", name: "English", flag: "🇬🇧", native: "English" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", native: "Português" },
  { code: "it", name: "Italian", flag: "🇮🇹", native: "Italiano" },
  { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
];

const TITLE: Record<Lang, string> = {
  es: "Selecciona tu idioma",
  en: "Select your language",
  pt: "Selecione seu idioma",
  it: "Seleziona la tua lingua",
  fr: "Sélectionnez votre langue",
};

export function LanguageDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, setLang } = useLocale();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[1200] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[1201] w-full max-w-md glass-strong rounded-t-3xl border-t border-border p-5 pb-8"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold gradient-text">{TITLE[lang]}</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5"><X size={20}/></button>
            </div>
            <div className="space-y-2">
              {LANGS.map((l) => {
                const active = l.code === lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); onClose(); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${active ? "neon-border" : "hover:bg-white/5"}`}
                    style={active ? { background: "var(--gradient-card)" } : { background: "rgba(255,255,255,0.02)" }}
                  >
                    <span className="text-3xl">{l.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{l.native}</div>
                      <div className="text-xs text-muted-foreground">{l.name} · {l.code.toUpperCase()}</div>
                    </div>
                    {active && <Check size={20} className="text-[var(--neon-cyan)]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
