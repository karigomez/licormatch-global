import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Globe, User as UserIcon, Mail } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES } from "@/lib/i18n";
import { CountryDrawer } from "@/components/CountryDrawer";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const { t, country } = useLocale();
  const { user, signOut } = useAuth();
  const [name, setName] = useState<string>("");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle()
      .then(({ data }) => setName(data?.display_name ?? user.email?.split("@")[0] ?? ""));
  }, [user]);

  if (!user) {
    return (
      <div className="px-5 pt-12">
        <h1 className="text-2xl font-bold gradient-text mb-2">{t("profile")}</h1>
        <p className="text-sm text-muted-foreground mb-6">{t("needLogin")}</p>
        <Link to="/login" className="btn-neon block text-center py-3">{t("login")}</Link>
      </div>
    );
  }

  const initials = (name || user.email || "?").slice(0, 2).toUpperCase();
  const c = COUNTRIES[country];

  return (
    <div className="px-5 pt-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold neon-border mb-3"
          style={{background:"var(--gradient-neon)", color:"#0a0a0c"}}>{initials}</div>
        <h1 className="text-2xl font-bold">{name || "—"}</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><Mail size={12}/>{user.email}</p>
      </div>

      <div className="space-y-3">
        <button onClick={()=>setDrawer(true)} className="w-full glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:"oklch(0.2 0.06 295)"}}>
            <Globe size={18} className="text-[var(--neon-cyan)]"/>
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-muted-foreground">{t("country")}</p>
            <p className="font-semibold">{c.flag} {c.name} · {c.currency}</p>
          </div>
        </button>

        <Link to="/reservations" className="w-full glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:"oklch(0.2 0.06 295)"}}>
            <UserIcon size={18} className="text-[var(--neon-violet)]"/>
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs text-muted-foreground">{t("history")}</p>
            <p className="font-semibold">{t("reservations")}</p>
          </div>
        </Link>

        <button onClick={signOut}
          className="w-full glass-card p-4 flex items-center gap-3 hover:border-destructive/50 transition-colors">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive/20">
            <LogOut size={18} className="text-destructive"/>
          </div>
          <span className="font-semibold text-destructive">{t("logout")}</span>
        </button>
      </div>

      <CountryDrawer open={drawer} onClose={()=>setDrawer(false)} />
    </div>
  );
}
