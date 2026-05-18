import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Loader2, CheckCircle2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { Link } from "@tanstack/react-router";

type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

type Phase = "idle" | "syncing" | "success";

export function BarReviews({
  barId,
  fallbackRating,
  onAverageChange,
}: {
  barId: string;
  fallbackRating: number;
  onAverageChange?: (avg: number, count: number) => void;
}) {
  const { user } = useAuth();
  const { t } = useLocale();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");

  const load = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("bar_id", barId)
      .order("created_at", { ascending: false });
    const list = (data ?? []) as Review[];
    setReviews(list);
    if (list.length && onAverageChange) {
      const avg = list.reduce((s, r) => s + r.rating, 0) / list.length;
      onAverageChange(avg, list.length);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [barId]);

  const computedAvg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : fallbackRating;

  const submit = async () => {
    if (!user || rating === 0) return;
    setPhase("syncing");
    // simulate distributed sync latency
    await new Promise((r) => setTimeout(r, 1500));
    const { error } = await supabase.from("reviews").insert({
      bar_id: barId,
      user_id: user.id,
      rating,
      comment: comment.trim() || null,
    });
    if (error) { console.error(error); setPhase("idle"); return; }
    setPhase("success");
    setComment("");
    setRating(0);
    await load();
    setTimeout(() => setPhase("idle"), 1400);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t("reviews")}</h2>
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} fill="currentColor" className="text-[var(--neon-cyan)]" />
          <span className="font-bold">{computedAvg.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviews.length})</span>
        </div>
      </div>

      <div className="glass-card p-4 space-y-3">
        {!user ? (
          <Link to="/login" className="block text-center text-sm text-[var(--neon-cyan)] py-2">
            {t("loginToReview")}
          </Link>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t("yourRating")}</span>
              <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = (hover || rating) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      aria-label={`${n} stars`}
                      className="p-0.5 transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={active ? "text-[var(--neon-cyan)]" : "text-muted-foreground/40"}
                        fill={active ? "currentColor" : "none"}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 500))}
              placeholder={t("reviewPlaceholder")}
              rows={3}
              className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[var(--neon-violet)] resize-none"
            />
            <button
              onClick={submit}
              disabled={rating === 0 || phase !== "idle"}
              className="w-full btn-neon py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {phase === "syncing" ? (
                <><Loader2 size={16} className="animate-spin" /> {t("syncingReview")}</>
              ) : phase === "success" ? (
                <><CheckCircle2 size={16} /> {t("reviewSent")}</>
              ) : (
                <><Send size={14} /> {t("sendReview")}</>
              )}
            </button>
            <AnimatePresence>
              {phase === "syncing" && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[11px] text-center text-[var(--neon-cyan)]"
                >
                  {t("syncingReview")}
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="mt-3 space-y-2">
          {reviews.slice(0, 5).map((r) => (
            <div key={r.id} className="glass-card p-3">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11}
                    className={i < r.rating ? "text-[var(--neon-cyan)]" : "text-muted-foreground/30"}
                    fill={i < r.rating ? "currentColor" : "none"} />
                ))}
                <span className="text-[10px] text-muted-foreground ml-2">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.comment && <p className="text-xs text-foreground/85">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
