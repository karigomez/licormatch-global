import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Clock, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Bar } from "@/lib/bars-data";
import { useLocale } from "@/lib/locale-context";
import { formatPrice } from "@/lib/i18n";

// Pseudo-deterministic hours per bar id so it's stable across renders.
function hoursFor(bar: Bar) {
  const open = 18 + (bar.name.length % 4); // 18-21h
  const close = 2 + (bar.name.length % 4); // 2-5h next day
  return `${open}:00 — 0${close}:00`;
}

export function BarDrawer({
  bar, open, onClose, onReserve,
}: {
  bar: Bar | null;
  open: boolean;
  onClose: () => void;
  onReserve: (bar: Bar) => void;
}) {
  const { t, country, lang } = useLocale();

  return (
    <AnimatePresence>
      {open && bar && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            key={bar.id}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[61] w-full max-w-md glass-strong rounded-t-3xl border-t border-border overflow-hidden"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-white/15" />
            </div>

            <div className="px-4 pb-6">
              <div className="relative rounded-2xl overflow-hidden neon-border">
                <img src={bar.image} alt={bar.name} className="w-full h-44 object-cover"/>
                <button
                  onClick={onClose}
                  aria-label="close"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/55 backdrop-blur-sm hover:bg-black/75"
                >
                  <X size={16}/>
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-semibold text-[var(--neon-cyan)]">
                  <Star size={12} fill="currentColor"/>{bar.rating}
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-bold leading-tight">{bar.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{bar.city}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 neon-border-cyan text-[var(--neon-cyan)]">
                  <Sparkles size={12}/> {t(bar.ambience)}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground">
                  {t(bar.liquor)}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground flex items-center gap-1">
                  <Clock size={12}/> {hoursFor(bar)}
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{bar.description[lang]}</p>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">{t("price")}</span>
                <span className="text-lg font-bold gradient-text">
                  {formatPrice(bar.priceUsd, country)}<span className="text-xs text-muted-foreground font-normal">{t("perPerson")}</span>
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2">
                <Link
                  to="/bar/$barId"
                  params={{ barId: bar.id }}
                  onClick={onClose}
                  className="btn-neon py-3.5 text-sm flex items-center justify-center gap-2"
                >
                  {t("seeMoreReserve")} <ArrowRight size={16}/>
                </Link>
                <button
                  onClick={() => onReserve(bar)}
                  className="py-2.5 rounded-full text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-[var(--neon-violet)] transition"
                >
                  {t("reserveNow")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
