import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { COUNTRIES } from "@/lib/i18n";
import { BARS, CITIES } from "@/lib/bars-data";
import { MapView } from "@/components/MapView";
import { CountryDrawer } from "@/components/CountryDrawer";
import { ReservationModal } from "@/components/ReservationModal";
import { BarDrawer } from "@/components/BarDrawer";
import type { Bar } from "@/lib/bars-data";

export const Route = createFileRoute("/map")({ component: MapPage });

const CITY_KEY = "lm_map_city";

function MapPage() {
  const { t, country } = useLocale();
  const cities = CITIES[country];
  const [city, setCity] = useState(() => {
    if (typeof window === "undefined") return cities[0].name;
    const saved = sessionStorage.getItem(CITY_KEY + ":" + country);
    return saved && cities.some(c => c.name === saved) ? saved : cities[0].name;
  });
  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState<Bar | null>(null);
  const [barDrawerOpen, setBarDrawerOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  const currentCity = cities.find(c => c.name === city) ?? cities[0];
  const bars = useMemo(
    () => BARS.filter(b => b.country === country && b.city === currentCity.name),
    [country, currentCity.name],
  );

  const selectCity = (name: string) => {
    setCity(name);
    if (typeof window !== "undefined") sessionStorage.setItem(CITY_KEY + ":" + country, name);
  };

  return (
    <div className="fixed inset-0 mx-auto max-w-md">
      <MapView
        bars={bars}
        center={{ lat: currentCity.lat, lng: currentCity.lng }}
        viewKey={`${country}:${currentCity.name}`}
        onPinClick={(b) => { setActive(b); setBarDrawerOpen(true); }}
      />

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-10 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={() => setDrawer(true)} className="glass-strong rounded-full px-3 py-2 flex items-center gap-2">
            <span className="text-lg">{COUNTRIES[country].flag}</span>
            <ChevronDown size={14} />
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
            {cities.map(c => (
              <button
                key={c.name}
                onClick={() => selectCity(c.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold ${
                  currentCity.name === c.name ? "neon-border" : "glass-strong text-muted-foreground"
                }`}
                style={currentCity.name === c.name ? { background: "var(--gradient-neon)", color: "#0a0a0c" } : {}}
              >{c.name}</button>
            ))}
          </div>
        </div>
        {/* keep t() referenced so it stays in scope for future top overlay strings */}
        <span className="sr-only">{t("map")}</span>
      </div>

      <BarDrawer
        bar={active}
        open={barDrawerOpen}
        onClose={() => setBarDrawerOpen(false)}
        onReserve={(b) => { setActive(b); setBarDrawerOpen(false); setReserveOpen(true); }}
      />

      <CountryDrawer open={drawer} onClose={() => setDrawer(false)} />
      <ReservationModal
        bar={active}
        open={reserveOpen}
        onClose={() => { setReserveOpen(false); }}
      />
    </div>
  );
}
