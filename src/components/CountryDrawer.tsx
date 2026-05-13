import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { COUNTRIES, type CountryCode } from "@/lib/i18n";

export function CountryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { country, setCountry, t } = useLocale();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[61] glass-strong rounded-t-3xl border-t border-border p-5 pb-8"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold gradient-text">{t("selectCountry")}</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5"><X size={20}/></button>
            </div>
            <div className="space-y-2">
              {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                const c = COUNTRIES[code];
                const active = code === country;
                return (
                  <button
                    key={code}
                    onClick={() => { setCountry(code); onClose(); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${active ? "neon-border" : "hover:bg-white/5"}`}
                    style={active ? { background: "var(--gradient-card)" } : { background: "rgba(255,255,255,0.02)" }}
                  >
                    <span className="text-3xl">{c.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.currency} · {c.lang.toUpperCase()}</div>
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
