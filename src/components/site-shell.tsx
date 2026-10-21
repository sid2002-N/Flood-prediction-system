"use client";

/**
 * KAYAL — site shell.
 * Single-route dossier: five views switched in-page, hash-linked for
 * shareability, sticky-footer layout, dark masthead footer.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OverviewView } from "@/views/overview";
import { InventoryView } from "@/views/inventory-view";
import { LabView } from "@/views/lab";
import { StatusView } from "@/views/status";
import { BriefingView } from "@/views/briefing";
import { site, sourceRegistry } from "@/lib/content/site";
import { cn } from "@/lib/utils";

export type ViewKey = "overview" | "data" | "model" | "status" | "briefing";

const NAV: { key: ViewKey; label: string }[] = [
  { key: "overview", label: "overview" },
  { key: "data", label: "data" },
  { key: "model", label: "model" },
  { key: "status", label: "status" },
  { key: "briefing", label: "briefing" },
];

const VIEWS: Record<ViewKey, (p: { navigate: (v: ViewKey) => void }) => React.ReactNode> = {
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
    setView(v);
    if (history.replaceState) {
      history.replaceState(null, "", v === "overview" ? "#" : `#${v}`);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const Active = VIEWS[view];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:text-paper"
      >
        skip to content
      </a>

      {/* ================================ HEADER ================================ */}
      <header className="sticky top-0 z-40 border-b border-paper-line bg-paper/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="flex h-12 items-center justify-between gap-4 md:h-14">
            <button
              onClick={() => navigate("overview")}
              className="group flex items-baseline gap-2.5"
              aria-label="KAYAL home"
            >
              <span className="flex size-5 items-center justify-center bg-ink font-mono text-[10px] font-semibold text-paper group-hover:bg-water">
                K·
              </span>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
                {site.brand}
                <span className="ml-2 hidden font-normal tracking-[0.1em] text-ink-soft sm:inline">
                  — {site.brandLong}
                </span>
              </span>
            </button>
            <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-soft lg:flex">
              <span className="border border-paper-line px-2 py-1 text-water">
                lstm v1.0 · trained
              </span>
              <span>{site.coords}</span>
            </div>
          </div>
          <nav
            aria-label="Primary"
            className="slim-scroll no-scrollbar -mx-2 flex overflow-x-auto border-t border-paper-line/60"
          >
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => navigate(n.key)}
                aria-current={view === n.key ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors md:px-4 md:py-3",
                  view === n.key
                    ? "font-semibold text-ink"
                    : "text-ink-soft hover:text-ink"
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute inset-x-2 bottom-0 h-[2px]",
                    view === n.key ? "bg-water" : "bg-transparent"
                  )}
                />
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ================================ MAIN ================================ */}
      <main id="main" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <Active navigate={navigate} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ================================ FOOTER ================================ */}
      <footer className="mt-auto grid-night border-t border-night-line bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
            <div>
              <div className="flex items-baseline gap-2.5">
                <span className="flex size-5 items-center justify-center bg-water-bright font-mono text-[10px] font-semibold text-night">
                  K·
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
                  {site.brand} — {site.brandLong}
                </span>
              </div>
              <p className="mt-4 max-w-sm text-[13px] leading-6 text-paper-dim">
                {site.siteNote}
              </p>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-paper-dim/60">
                {site.location} · {site.coords} · {site.period}
              </p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-water-bright">
                data partners & sources
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                {sourceRegistry.map((s) => (
                  <li key={s.name} className="font-mono text-[10px] text-paper-dim">
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-water-bright">
                dossier integrity
              </p>
              <ul className="mt-4 space-y-2 text-[11.5px] leading-5 text-paper-dim">
                <li>Every figure carries its provenance line.</li>
                <li>Charts tagged RECONSTRUCTED are peak-exact, shape-illustrative.</li>
                <li>Console outputs are labelled DEMO or LIVE — never both.</li>
                <li>Eleven data defects published in the open audit.</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-night-line pt-5">
            <span className="font-mono text-[9px] tracking-[0.12em] text-paper-dim/60">
              © 2026 {site.brand} — compiled for research review · single-page dossier
            </span>
            <span className="font-mono text-[9px] tracking-[0.12em] text-paper-dim/60">
              rev. 1.0 · {site.tagline}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
