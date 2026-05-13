import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { t } = useLocale();
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (user) navigate({ to: "/" }); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    const res = mode === "login"
      ? await signIn(email, password)
      : await signUp(email, password, name || email.split("@")[0]);
    setBusy(false);
    if (res.error) setErr(res.error);
  };

  return (
    <div className="px-5 pt-16 pb-10">
      <Link to="/" className="text-xs text-muted-foreground">← {t("explore")}</Link>
      <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} className="text-center mt-8 mb-8">
        <Sparkles className="mx-auto text-[var(--neon-cyan)] mb-2" size={32}/>
        <h1 className="text-3xl font-bold gradient-text">{t("appName")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("tagline")}</p>
      </motion.div>

      <div className="glass-card p-6 neon-border">
        <div className="flex gap-1 mb-5 p-1 rounded-full" style={{background:"oklch(0.16 0.04 290)"}}>
          {(["login","signup"] as const).map(m => (
            <button key={m} onClick={()=>setMode(m)}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${mode===m ? "" : "text-muted-foreground"}`}
              style={mode===m ? {background:"var(--gradient-neon)", color:"#0a0a0c"} : {}}>
              {m === "login" ? t("login") : t("signup")}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode==="signup" && (
            <input value={name} onChange={e=>setName(e.target.value)} placeholder={t("name")}
              className="w-full bg-input/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-violet)]"/>
          )}
          <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder={t("email")}
            className="w-full bg-input/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-violet)]"/>
          <input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder={t("password")}
            className="w-full bg-input/50 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--neon-violet)]"/>
          {err && <p className="text-xs text-destructive">{err}</p>}
          <button type="submit" disabled={busy} className="w-full btn-neon py-3 text-base disabled:opacity-50">
            {busy ? "…" : (mode==="login" ? t("login") : t("signup"))}
          </button>
        </form>
      </div>
    </div>
  );
}
