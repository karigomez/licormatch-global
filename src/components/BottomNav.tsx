import { Link, useLocation } from "@tanstack/react-router";
import { Compass, Map as MapIcon, Calendar, User } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export function BottomNav() {
  const { t } = useLocale();
  const { pathname } = useLocation();

  const items = [
    { to: "/", icon: Compass, label: t("explore") },
    { to: "/map", icon: MapIcon, label: t("map") },
    { to: "/reservations", icon: Calendar, label: t("reservations") },
    { to: "/profile", icon: User, label: t("profile") },
  ] as const;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]"
      style={{ background: "linear-gradient(to top, rgba(10,10,12,0.95), rgba(10,10,12,0.7) 70%, transparent)" }}
    >
      <div className="mx-auto max-w-md px-3 pt-3 pb-3">
        <div className="glass-strong rounded-full px-2 py-2 flex items-center justify-around border-border">
          {items.map(({ to, icon: Icon, label }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-full transition-all"
                style={
                  active
                    ? { background: "var(--gradient-neon)", color: "oklch(0.08 0.02 290)", boxShadow: "var(--shadow-glow-violet)" }
                    : { color: "var(--color-muted-foreground)" }
                }
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
