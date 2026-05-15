import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Star, Clock, MapPin, Sparkles } from "lucide-react";
import { BARS, type Bar } from "@/lib/bars-data";
import { useLocale } from "@/lib/locale-context";
import { COUNTRIES, formatPrice, type CountryCode } from "@/lib/i18n";
import { ReservationModal } from "@/components/ReservationModal";

export const Route = createFileRoute("/bar/$barId")({
  component: BarDetailPage,
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">Bar not found</p>
      <Link to="/map" className="btn-neon inline-block mt-4 px-5 py-2 text-sm">Back to map</Link>
    </div>
  ),
});

function BarDetailPage() {
  const { barId } = Route.useParams();
  const bar = BARS.find(b => b.id === barId);
  const { t, country, lang } = useLocale();
  const navigate = useNavigate();
  const [reserveOpen, setReserveOpen] = useState(false);

  const gallery = useMemo(() => buildGallery(bar), [bar]);
  const menu = useMemo(() => bar ? buildMenu(bar, country) : [], [bar, country]);

  if (!bar) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Bar not found</p>
        <Link to="/map" className="btn-neon inline-block mt-4 px-5 py-2 text-sm">Back to map</Link>
      </div>
    );
  }

  const open = 18 + (bar.name.length % 4);
  const close = 2 + (bar.name.length % 4);

  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="relative h-72 -mx-0">
        <img src={bar.image} alt={bar.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a0a0c]" />
        <button
          onClick={() => navigate({ to: "/map" })}
          className="absolute top-10 left-4 p-2.5 rounded-full glass-strong"
          aria-label={t("back")}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 text-xs text-[var(--neon-cyan)] mb-1">
            <Star size={12} fill="currentColor" />{bar.rating}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground flex items-center gap-1"><MapPin size={11} />{bar.city}, {COUNTRIES[bar.country].name}</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight">{bar.name}</h1>
        </div>
      </div>

      <div className="px-4 -mt-2 space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold neon-border-cyan text-[var(--neon-cyan)] flex items-center gap-1">
            <Sparkles size={12} /> {t(bar.ambience)}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground">
            {t(bar.liquor)}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground flex items-center gap-1">
            <Clock size={12} /> {open}:00 — 0{close}:00
          </span>
        </div>

        {/* Description */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t("description")}</h2>
          <p className="text-sm leading-relaxed">{bar.description[lang]}</p>
        </section>

        {/* Menu */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("menu")}</h2>
          <div className="glass-card p-4 space-y-3">
            {menu.map((m) => (
              <div key={m.name} className="flex items-baseline justify-between gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{m.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.note}</div>
                </div>
                <div className="font-bold text-sm gradient-text whitespace-nowrap">{m.price}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">{t("gallery")}</h2>
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border">
                <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky CTA */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-24 w-full max-w-md px-4 z-40 pointer-events-none">
        <button
          onClick={() => setReserveOpen(true)}
          className="pointer-events-auto w-full btn-neon py-4 text-base"
        >
          {t("startReservation")} · {formatPrice(bar.priceUsd, country)}
        </button>
      </div>

      <ReservationModal bar={bar} open={reserveOpen} onClose={() => setReserveOpen(false)} />
    </div>
  );
}

function buildGallery(bar: Bar | undefined): string[] {
  if (!bar) return [];
  // Pull 6 unique images from the same country pool, anchored on the bar's image.
  // Use BARS country siblings to get a variety of authentic country shots.
  const countryShots = Array.from(
    new Set(
      BARS.filter(b => b.country === bar.country).map(b => b.image)
    )
  );
  const startIdx = Math.max(0, countryShots.indexOf(bar.image));
  const out: string[] = [];
  for (let i = 0; i < 6; i++) {
    out.push(countryShots[(startIdx + i) % countryShots.length]);
  }
  return out;
}

const MENU_TEMPLATES: Record<string, Array<{ name: string; note: string; usd: number }>> = {
  cocktails: [
    { name: "Signature Negroni", note: "Gin, Campari, sweet vermouth", usd: 14 },
    { name: "Espresso Martini", note: "Vodka, espresso, kahlúa", usd: 13 },
    { name: "Smoked Old Fashioned", note: "Bourbon, bitters, oak smoke", usd: 16 },
    { name: "Tropical Spritz", note: "Aperol, prosecco, passion fruit", usd: 12 },
    { name: "Mezcal Paloma", note: "Mezcal, grapefruit, lime", usd: 15 },
  ],
  beer: [
    { name: "Hazy IPA — local tap", note: "440ml · 6.2%", usd: 8 },
    { name: "Belgian Tripel", note: "330ml · 9.0%", usd: 10 },
    { name: "Stout Nitro", note: "440ml · 5.5%", usd: 9 },
    { name: "Pilsner del Día", note: "330ml · 4.8%", usd: 7 },
    { name: "Tasting flight ×4", note: "4 × 150ml", usd: 14 },
  ],
  whisky: [
    { name: "Single malt 12y", note: "Highland, dram 50ml", usd: 18 },
    { name: "Japanese blend", note: "Smooth, 50ml", usd: 22 },
    { name: "Bourbon flight ×3", note: "3 × 25ml", usd: 24 },
    { name: "Whisky sour", note: "House classic", usd: 14 },
    { name: "Peated 10y", note: "Islay, 50ml", usd: 20 },
  ],
  wine: [
    { name: "House red — glass", note: "150ml", usd: 9 },
    { name: "Sparkling brut", note: "Coupe 125ml", usd: 12 },
    { name: "Natural orange", note: "150ml", usd: 11 },
    { name: "Reserva — bottle", note: "750ml", usd: 48 },
    { name: "Wine flight ×3", note: "3 × 75ml", usd: 18 },
  ],
  mezcal: [
    { name: "Espadín joven", note: "Smoky, 50ml", usd: 14 },
    { name: "Tobalá ancestral", note: "Wild agave, 50ml", usd: 22 },
    { name: "Mezcal flight ×3", note: "3 × 25ml", usd: 26 },
    { name: "Mezcal Negroni", note: "Twist on classic", usd: 15 },
    { name: "Sal de gusano + naranja", note: "Pairing", usd: 6 },
  ],
};

function buildMenu(bar: Bar, country: CountryCode) {
  const tmpl = MENU_TEMPLATES[bar.liquor] ?? MENU_TEMPLATES.cocktails;
  return tmpl.map(item => ({
    name: item.name,
    note: item.note,
    price: formatPrice(item.usd, country),
  }));
}
