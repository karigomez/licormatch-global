import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Star, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/lib/locale-context";
import { COUNTRIES } from "@/lib/i18n";
import { BARS, CITIES } from "@/lib/bars-data";
import { MapView } from "@/components/MapView";
import { CountryDrawer } from "@/components/CountryDrawer";
import { ReservationModal } from "@/components/ReservationModal";
import type { Bar } from "@/lib/bars-data";

export const Route = createFileRoute("/map")({ component: MapPage });

function MapPage() {
  const { t, country } = useLocale();
  const cities = CITIES[country];
  const [city, setCity] = useState(cities[0].name);
  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState<Bar | null>(null);
  const [modal, setModal] = useState(false);

  const currentCity = cities.find(c => c.name === city) ?? cities[0];
  const bars = useMemo(() => BARS.filter(b => b.country === country && b.city === currentCity.name), [country, currentCity.name]);

  return (
    <div className="fixed inset-0 mx-auto max-w-md">
      <MapView bars={bars} center={{lat: currentCity.lat, lng: currentCity.lng}} onPinClick={(b)=>setActive(b)} />

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-10 pointer-events-none">
        <div className="flex gap-2 pointer-events-auto">
          <button onClick={()=>setDrawer(true)} className="glass-strong rounded-full px-3 py-2 flex items-center gap-2">
            <span className="text-lg">{COUNTRIES[country].flag}</span>
            <ChevronDown size={14}/>
          </button>
          <div className="flex-1 flex gap-2 overflow-x-auto no-scrollbar">
            {cities.map(c => (
              <button key={c.name} onClick={()=>setCity(c.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold ${currentCity.name===c.name ? "neon-border" : "glass-strong text-muted-foreground"}`}
                style={currentCity.name===c.name ? {background:"var(--gradient-neon)", color:"#0a0a0c"} : {}}
              >{c.name}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating bar card */}
      <AnimatePresence>
        {active && (
          <motion.div
            key={active.id}
            initial={{y:200, opacity:0}} animate={{y:0, opacity:1}} exit={{y:200, opacity:0}}
            className="absolute left-4 right-4 bottom-28 glass-strong rounded-2xl overflow-hidden neon-border"
          >
            <div className="flex">
              <img src={active.image} alt={active.name} className="w-24 h-24 object-cover" />
              <div className="flex-1 p-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold truncate">{active.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10}/>{active.city}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-xs font-semibold text-[var(--neon-cyan)]">
                    <Star size={11} fill="currentColor"/>{active.rating}
                  </div>
                </div>
                <button onClick={()=>{setModal(true);}} className="mt-2 btn-neon px-3 py-1.5 text-xs">{t("reserveNow")}</button>
                <button onClick={()=>setActive(null)} className="ml-2 mt-2 text-xs text-muted-foreground">{t("cancel")}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CountryDrawer open={drawer} onClose={()=>setDrawer(false)} />
      <ReservationModal bar={active} open={modal} onClose={()=>{setModal(false); setActive(null);}} />
    </div>
  );
}
