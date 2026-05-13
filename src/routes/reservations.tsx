import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, Trash2, AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/i18n";
import { ReservationModal } from "@/components/ReservationModal";
import { BARS } from "@/lib/bars-data";

export const Route = createFileRoute("/reservations")({ component: ReservationsPage });

type Row = {
  id: string; bar_name: string; city: string; country_code: string;
  guests: number; reservation_time: string; price_amount: number;
  currency: string; status: string;
};

function ReservationsPage() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollbackOpen, setRollbackOpen] = useState(false);

  const load = async () => {
    if (!user) { setRows([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase.from("reservations").select("*").order("reservation_time", { ascending: false });
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const cancel = async (id: string) => {
    await supabase.from("reservations").update({ status: "cancelled" }).eq("id", id);
    load();
  };

  const sampleBar = BARS[0];

  if (!user) {
    return (
      <div className="px-5 pt-12">
        <h1 className="text-2xl font-bold gradient-text mb-2">{t("reservations")}</h1>
        <p className="text-muted-foreground text-sm mb-6">{t("needLogin")}</p>
        <Link to="/login" className="btn-neon block text-center py-3">{t("login")}</Link>
      </div>
    );
  }

  return (
    <div className="px-5 pt-12">
      <h1 className="text-2xl font-bold gradient-text mb-1">{t("history")}</h1>
      <p className="text-xs text-muted-foreground mb-4">{t("reservations")}</p>

      {/* Rollback test */}
      <div className="glass-card p-4 mb-5 border border-destructive/40">
        <div className="flex items-start gap-2 mb-2">
          <AlertTriangle size={18} className="text-destructive shrink-0 mt-0.5"/>
          <div>
            <p className="text-sm font-bold">Rollback Test</p>
            <p className="text-xs text-muted-foreground">{t("rollbackDesc")}</p>
          </div>
        </div>
        <button onClick={()=>setRollbackOpen(true)}
          className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
          {t("rollback")}
        </button>
      </div>

      {loading && <p className="text-center text-muted-foreground py-8">…</p>}
      {!loading && rows.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-muted-foreground mb-2" size={48}/>
          <p className="text-muted-foreground text-sm">{t("noReservations")}</p>
        </div>
      )}

      <div className="grid gap-3">
        {rows.map(r => {
          const flag = COUNTRIES[r.country_code as keyof typeof COUNTRIES]?.flag ?? "🌎";
          const date = new Date(r.reservation_time);
          return (
            <div key={r.id} className="glass-card p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold truncate">{r.bar_name}</h3>
                  <p className="text-xs text-muted-foreground">{flag} {r.city}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {date.toLocaleDateString()} · {date.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})} · {r.guests} {t("guests")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{r.currency} {Math.round(r.price_amount)}</p>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${r.status==="cancelled" ? "bg-destructive/20 text-destructive" : "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]"}`}>
                    {r.status === "cancelled" ? t("cancelled") : t("confirmed")}
                  </span>
                </div>
              </div>
              {r.status !== "cancelled" && (
                <button onClick={()=>cancel(r.id)} className="mt-3 text-xs text-destructive flex items-center gap-1 hover:underline">
                  <Trash2 size={12}/> {t("cancel")}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <ReservationModal bar={sampleBar} open={rollbackOpen} onClose={()=>{setRollbackOpen(false); load();}} forceRollback />
    </div>
  );
}
