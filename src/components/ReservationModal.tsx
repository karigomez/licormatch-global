import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertTriangle, Users, Calendar, Clock } from "lucide-react";
import type { Bar } from "@/lib/bars-data";
import { useLocale } from "@/lib/locale-context";
import { formatPrice, COUNTRIES } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";

type Phase = "form" | "syncing" | "success" | "rollback" | "released";

export function ReservationModal({ bar, open, onClose, forceRollback = false }: {
  bar: Bar | null; open: boolean; onClose: () => void; forceRollback?: boolean;
}) {
  const { t, country, lang } = useLocale();
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>("form");
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("21:00");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  const reset = () => { setPhase("form"); setGuests(2); setTime("21:00"); };

  const handleClose = () => { reset(); onClose(); };

  const handleConfirm = async () => {
    if (!bar || !user) return;
    setPhase("syncing");
    // simulate distributed node latency
    await new Promise((r) => setTimeout(r, 1800));

    if (forceRollback) {
      setPhase("rollback");
      await new Promise((r) => setTimeout(r, 1400));
      setPhase("released");
      await new Promise((r) => setTimeout(r, 1500));
      handleClose();
      return;
    }

    const c = COUNTRIES[country];
    const reservation_time = new Date(`${date}T${time}:00`).toISOString();
    const { error } = await supabase.from("reservations").insert({
      user_id: user.id,
      bar_id: bar.id,
      bar_name: bar.name,
      city: bar.city,
      country_code: bar.country,
      guests,
      reservation_time,
      price_amount: bar.priceUsd * c.rate * guests,
      currency: c.currency,
      status: "confirmed",
    });
    if (error) {
      console.error(error);
      setPhase("rollback");
      await new Promise((r) => setTimeout(r, 1200));
      setPhase("released");
      await new Promise((r) => setTimeout(r, 1500));
      handleClose();
      return;
    }
    setPhase("success");
    await new Promise((r) => setTimeout(r, 1800));
    handleClose();
  };

  const total = bar ? bar.priceUsd * guests : 0;

  return (
    <AnimatePresence>
      {open && bar && (
        <>
          <motion.div
            className="fixed inset-0 z-[1100] bg-black/85 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={phase === "form" ? handleClose : undefined}
          />
          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[1101] w-full max-w-md glass-strong rounded-t-3xl border-t border-border p-5 pb-10"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {phase === "form" && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{bar.name}</h3>
                    <p className="text-xs text-muted-foreground">{bar.city} · {COUNTRIES[bar.country].flag} {COUNTRIES[bar.country].name}</p>
                  </div>
                  <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/5"><X size={20}/></button>
                </div>
                <p className="text-sm text-muted-foreground mb-5">{bar.description[lang]}</p>

                {!user ? (
                  <Link to="/login" className="block btn-neon text-center py-3 mb-2" onClick={handleClose}>{t("needLogin")}</Link>
                ) : (
                  <>
                    <div className="space-y-3 mb-5">
                      <Field icon={<Users size={16}/>} label={t("guests")}>
                        <div className="flex gap-2">
                          {[1,2,3,4,5,6].map(n => (
                            <button key={n} onClick={() => setGuests(n)}
                              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${guests===n ? "neon-border" : "border border-border"}`}
                              style={guests===n ? {background:"var(--gradient-neon)", color:"#0a0a0c"} : {}}
                            >{n}</button>
                          ))}
                        </div>
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field icon={<Calendar size={16}/>} label={t("date")}>
                          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--neon-violet)]"/>
                        </Field>
                        <Field icon={<Clock size={16}/>} label={t("time")}>
                          <input type="time" value={time} onChange={e=>setTime(e.target.value)}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--neon-violet)]"/>
                        </Field>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-2xl font-bold gradient-text">{formatPrice(total, country)}</span>
                    </div>
                    <button onClick={handleConfirm} className="w-full btn-neon py-3.5 text-base">{t("confirm")}</button>
                  </>
                )}
              </>
            )}

            {phase === "syncing" && (
              <div className="py-10 text-center">
                <Loader2 className="mx-auto text-[var(--neon-violet)] animate-spin mb-4" size={48} />
                <p className="font-semibold mb-1">{t("syncing")}</p>
                <p className="text-sm text-muted-foreground">[{COUNTRIES[country].name}] {COUNTRIES[country].flag}</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[0,1,2].map(i => (
                    <motion.span key={i} className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]"
                      animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.2, repeat: Infinity, delay: i*0.2 }} />
                  ))}
                </div>
              </div>
            )}

            {phase === "success" && (
              <motion.div initial={{scale:0.8}} animate={{scale:1}} className="py-10 text-center">
                <CheckCircle2 className="mx-auto text-[var(--neon-cyan)] mb-4" size={56} />
                <p className="font-bold text-lg">{t("booked")}</p>
                <p className="text-sm text-muted-foreground mt-1">{bar.name} · {date} · {time}</p>
              </motion.div>
            )}

            {phase === "rollback" && (
              <motion.div initial={{x:-10}} animate={{x:[10,-10,10,-10,0]}} transition={{duration:0.5}} className="py-10 text-center">
                <AlertTriangle className="mx-auto text-destructive mb-4" size={56} />
                <p className="font-bold text-lg text-destructive">{t("rollbackTitle")}</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{t("rollbackDesc")}</p>
              </motion.div>
            )}

            {phase === "released" && (
              <div className="py-10 text-center">
                <Loader2 className="mx-auto text-[var(--neon-cyan)] animate-spin mb-4" size={40} />
                <p className="font-semibold">{t("releasing")}</p>
                <p className="text-xs text-muted-foreground mt-2">✓ {t("integrityOk")}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">{icon}{label}</div>
      {children}
    </div>
  );
}
