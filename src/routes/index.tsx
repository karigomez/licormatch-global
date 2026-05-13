import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, ChevronDown, SlidersHorizontal, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { COUNTRIES } from "@/lib/i18n";
import { BARS, CITIES } from "@/lib/bars-data";
import { BarCard } from "@/components/BarCard";
import { CountryDrawer } from "@/components/CountryDrawer";
import { ReservationModal } from "@/components/ReservationModal";
import type { Bar } from "@/lib/bars-data";

export const Route = createFileRoute("/")({ component: ExplorePage });

const LIQUORS = ["all","cocktails","whisky","wine","mezcal","beer"] as const;

function ExplorePage() {
  const { t, country } = useLocale();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [liquor, setLiquor] = useState<typeof LIQUORS[number]>("all");
  const [maxPriceUsd, setMaxPriceUsd] = useState(60);
  const [city, setCity] = useState<string>(CITIES[country][0].name);
  const [activeBar, setActiveBar] = useState<Bar | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // when country changes, reset city
  const cities = CITIES[country];
  const currentCity = cities.find(c => c.name === city) ? city : cities[0].name;

  const filtered = useMemo(() => {
    return BARS.filter(b =>
      b.country === country &&
      b.city === currentCity &&
      (liquor === "all" || b.liquor === liquor) &&
      b.priceUsd <= maxPriceUsd &&
      (search === "" || b.name.toLowerCase().includes(search.toLowerCase()) || t(b.ambience).toLowerCase().includes(search.toLowerCase()))
    );
  }, [country, currentCity, liquor, maxPriceUsd, search, t]);

  const topRated = useMemo(() => [...BARS].filter(b=>b.country===country).sort((a,b)=>b.rating-a.rating).slice(0,5), [country]);

  const openBook = (bar: Bar) => { setActiveBar(bar); setModalOpen(true); };

  return (
    <div className="px-5 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-xs text-muted-foreground">{t("welcome")} 🌙</p>
          <h1 className="text-2xl font-bold gradient-text">{t("appName")}</h1>
        </div>
        <button onClick={() => setDrawerOpen(true)}
          className="glass-card px-3 py-2 flex items-center gap-2 rounded-full">
          <span className="text-xl leading-none">{COUNTRIES[country].flag}</span>
          <span className="text-xs font-semibold">{COUNTRIES[country].currency}</span>
          <ChevronDown size={14} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-5">{t("subtitle")}</p>

      {/* Search */}
      <div className="glass-card flex items-center gap-2 px-4 py-3 mb-3">
        <Search size={18} className="text-muted-foreground" />
        <input
          value={search} onChange={e=>setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="bg-transparent flex-1 text-sm focus:outline-none placeholder:text-muted-foreground"
        />
        <button onClick={() => setShowFilters(s=>!s)} className="p-1 -mr-1">
          <SlidersHorizontal size={18} className={showFilters ? "text-[var(--neon-violet)]" : "text-muted-foreground"} />
        </button>
      </div>

      {/* City selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 -mx-5 px-5">
        {cities.map(c => (
          <button key={c.name} onClick={()=>setCity(c.name)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${currentCity===c.name ? "neon-border" : "border border-border text-muted-foreground"}`}
            style={currentCity===c.name ? {background:"var(--gradient-neon)", color:"#0a0a0c"} : {}}
          >
            <MapPin size={11} className="inline mr-1 -mt-0.5"/>{c.name}
          </button>
        ))}
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div initial={{height:0, opacity:0}} animate={{height:"auto", opacity:1}} className="glass-card p-4 mb-4 overflow-hidden">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t("liquor")}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {LIQUORS.map(l => (
              <button key={l} onClick={()=>setLiquor(l)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${liquor===l ? "neon-border-cyan" : "border border-border text-muted-foreground"}`}
                style={liquor===l ? {background:"var(--neon-cyan)", color:"#0a0a0c"} : {}}
              >{t(l)}</button>
            ))}
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t("price")} (≤ ${maxPriceUsd})</p>
          <input type="range" min={10} max={60} value={maxPriceUsd} onChange={e=>setMaxPriceUsd(Number(e.target.value))}
            className="w-full accent-[var(--neon-violet)]" />
        </motion.div>
      )}

      {/* Top rated row */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold flex items-center gap-1.5"><Sparkles size={14} className="text-[var(--neon-cyan)]"/> {t("topRated")}</h2>
          <Link to="/map" className="text-xs text-[var(--neon-violet)] font-semibold">{t("openMap")} →</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
          {topRated.map(bar => (
            <button key={bar.id} onClick={()=>openBook(bar)} className="shrink-0 w-32 text-left">
              <div className="relative h-32 rounded-2xl overflow-hidden glass-card">
                <img src={bar.image} alt={bar.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent"/>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-bold text-white truncate">{bar.name}</p>
                  <p className="text-[10px] text-white/70">{bar.city} · ★{bar.rating}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bars list */}
      <h2 className="text-sm font-bold mb-3">{t("nearYou")} · {currentCity}</h2>
      <div className="grid gap-4">
        {filtered.map(bar => <BarCard key={bar.id} bar={bar} onBook={openBook}/>)}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No results.</p>
        )}
      </div>

      <CountryDrawer open={drawerOpen} onClose={()=>setDrawerOpen(false)} />
      <ReservationModal bar={activeBar} open={modalOpen} onClose={()=>setModalOpen(false)} />
    </div>
  );
}
