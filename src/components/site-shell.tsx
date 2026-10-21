"use client";

/**
 * Kuttanad Flood Prediction System — site shell.
 * Single-route dossier: five views, all permanently mounted and
 * toggled via `hidden` — view switches never unmount content, so
 * there is no image reload, no layout collapse and no flash.
 * Apple design science: SF system type, translucent material chrome,
 * hairline rules, tinted pills.
 */
import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { OverviewView } from "@/views/overview";
import { InventoryView } from "@/views/inventory-view";
import { LabView } from "@/views/lab";
import { StatusView } from "@/views/status";
import { BriefingView } from "@/views/briefing";
import { site, sourceRegistry } from "@/lib/content/site";
import { cn } from "@/lib/utils";

export type ViewKey = "overview" | "data" | "model" | "status" | "briefing";

const NAV: { key: ViewKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "data", label: "Data" },
  { key: "model", label: "Model" },
  { key: "status", label: "Status" },
  { key: "briefing", label: "Briefing" },
];

const ORDER: ViewKey[] = ["overview", "data", "model", "status", "briefing"];

const VIEWS: Record<
  ViewKey,
  (p: { navigate: (v: ViewKey) => void; active?: boolean }) => React.ReactNode
> = {
  overview: OverviewView,
  data: InventoryView,
  model: LabView,
  status: StatusView,
  briefing: BriefingView,
};

export function SiteShell() {
  const [view, setView] = useState<ViewKey>("overview");

  // hash boot + maintenance
  useEffect(() => {
    const boot = () => {
      const h = window.location.hash.replace("#", "") as ViewKey;
      if (h in VIEWS && h !== "overview") setView(h);
    };
    boot();
  }, []);

  const navigate = (v: ViewKey) => {
    if (v === view) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    setView(v);
    if (history.replaceState) {
      history.replaceState(null, "", v === "overview" ? "#" : `#${v}`);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-paper"
        >
          Skip to content
        </a>

        {/* ================================ HEADER ================================ */}
        <header className="apple-material sticky top-0 z-40 border-b border-black/10">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="flex h-12 items-center justify-between gap-4">
              <button
                onClick={() => navigate("overview")}
                className="group flex items-center gap-2.5"
                aria-label="Kuttanad Flood Prediction System — home"
              >
                <span className="flex size-7 items-center justify-center rounded-[7px] bg-water text-[13px] font-bold text-white transition-colors group-hover:bg-water-deep">
                  K·
                </span>
                <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink sm:text-[15px]">
                  {site.brand}
                </span>
              </button>
              <div className="hidden items-center gap-3 md:flex">
                <span className="rounded-full bg-water/10 px-2.5 py-1 text-[12px] font-medium text-water">
                  LSTM v1.0 · demo
                </span>
                <span className="text-[12px] font-medium text-ink-soft">
                  {site.coords}
                </span>
              </div>
            </div>
            <nav
              aria-label="Primary"
              className="no-scrollbar -mx-1 flex overflow-x-auto"
            >
              {NAV.map((n) => (
                <button
                  key={n.key}
                  onClick={() => navigate(n.key)}
                  aria-current={view === n.key ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1.5 text-[12.5px] transition-colors my-1",
                    view === n.key
                      ? "font-semibold text-ink"
                      : "font-normal text-ink-soft hover:bg-black/[0.04] hover:text-ink"
                  )}
                >
                  {n.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* ================================ MAIN ================================ */}
        {/*
         * All five views stay mounted; the active one is revealed with a
         * short crossfade. No unmount → nothing re-loads → no flash.
         */}
        <main id="main" className="flex-1">
          {ORDER.map((k) => {
            const isActive = view === k;
            const View = VIEWS[k];
            return (
              <motion.div
                key={k}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                hidden={!isActive}
                inert={!isActive}
                aria-hidden={!isActive}
              >
                <View navigate={navigate} active={isActive} />
              </motion.div>
            );
          })}
        </main>

        {/* ================================ FOOTER ================================ */}
        <footer className="mt-auto bg-night text-paper">
          <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-14">
            <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-[7px] bg-water-bright text-[13px] font-bold text-night">
                    K·
                  </span>
                  <span className="text-[15px] font-semibold tracking-[-0.01em]">
                    {site.brand}
                  </span>
                </div>
                <p className="mt-1 text-[13px] font-medium text-water-bright">
                  {site.brandLong}
                </p>
                <p className="mt-4 max-w-sm text-[13px] leading-6 text-paper-dim">
                  {site.siteNote}
                </p>
                <p className="mt-4 text-[12px] text-paper-dim/70">
                  {site.location} · {site.coords} · {site.period}
                </p>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white/90">
                  Data partners &amp; sources
                </p>
                <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                  {sourceRegistry.map((s) => (
                    <li key={s.name} className="text-[13px] text-paper-dim">
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white/90">
                  Dossier integrity
                </p>
                <ul className="mt-4 space-y-2 text-[13px] leading-5 text-paper-dim">
                  <li>Every figure carries its provenance line.</li>
                  <li>
                    Charts tagged RECONSTRUCTED are peak-exact,
                    shape-illustrative.
                  </li>
                  <li>Console outputs are labelled DEMO or LIVE — never both.</li>
                  <li>Eleven data defects published in the open audit.</li>
                </ul>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <span className="text-[12px] text-paper-dim/60">
                © 2026 {site.brand} — {site.tagline}
              </span>
              <span className="text-[12px] text-paper-dim/60">
                Rev. 1.0 · {site.location}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
