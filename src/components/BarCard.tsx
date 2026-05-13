import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import type { Bar } from "@/lib/bars-data";
import { useLocale } from "@/lib/locale-context";
import { formatPrice } from "@/lib/i18n";

export function BarCard({ bar, onBook }: { bar: Bar; onBook: (bar: Bar) => void }) {
  const { t, lang, country } = useLocale();
  return (
    <motion.div
      whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
      className="glass-card overflow-hidden"
    >
      <div className="relative h-40">
        <img src={bar.image} alt={bar.name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute top-3 right-3 glass-strong rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-semibold">
          <Star size={12} fill="currentColor" className="text-[var(--neon-cyan)]" /> {bar.rating}
        </div>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="glass-strong rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">{t(bar.ambience)}</span>
          {bar.available ? (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider" style={{background:"oklch(0.55 0.2 150)", color:"#0a0a0c"}}>{t("available")}</span>
          ) : (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-destructive text-destructive-foreground">{t("busy")}</span>
          )}
        </div>
        <div className="absolute bottom-2 left-3 right-3">
          <h3 className="text-lg font-bold text-white text-glow">{bar.name}</h3>
          <div className="flex items-center gap-1 text-xs text-white/80"><MapPin size={11}/> {bar.city}</div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground line-clamp-2">{bar.description[lang]}</p>
          <p className="text-sm font-bold mt-1">{formatPrice(bar.priceUsd, country)}<span className="text-xs text-muted-foreground font-normal">{t("perPerson")}</span></p>
        </div>
        <button
          onClick={() => onBook(bar)}
          disabled={!bar.available}
          className="btn-neon px-4 py-2 text-sm whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("book")}
        </button>
      </div>
    </motion.div>
  );
}
