"use client";

/**
 * Kuttanad Flood Prediction System — audit register.
 * Data defects presented as first-class research findings,
 * grouped by their impact on model development.
 */
import { auditFlags, auditGroups, type FlagSeverity, type FlagStatus } from "@/lib/content/inventory";
import { cn } from "@/lib/utils";

const severityStyle: Record<FlagSeverity, string> = {
  gap: "border-severe text-severe",
  caution: "border-flood text-flood",
  note: "border-paper-line text-ink-soft",
};

const severityLabel: Record<FlagSeverity, string> = {
  gap: "missing piece",
  caution: "caution",
  note: "note",
};

const statusStyle: Record<FlagStatus, string> = {
  open: "border-paper-line text-ink-soft",
  mitigated: "border-water text-water",
};

const statusLabel: Record<FlagStatus, string> = {
  open: "open — action defined",
  mitigated: "mitigated — convention in place",
};

export function AuditRegister() {
  return (
    <div className="space-y-10">
      {auditGroups.map((g) => {
        const flags = auditFlags.filter((f) => f.impact === g.id);
        if (flags.length === 0) return null;
        return (
          <section key={g.id} aria-labelledby={`impact-${g.id}`}>
            <div className="grid gap-2 border-t-2 border-ink pt-4 lg:grid-cols-[260px_1fr] lg:gap-8">
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  id={`impact-${g.id}`}
                  className="font-serif text-[20px] font-semibold leading-tight text-ink"
                >
                  {g.label}
                </h3>
                <span className="font-mono text-[11px] font-semibold tab-nums text-flood">
                  ×{flags.length}
                </span>
              </div>
              <p className="max-w-2xl text-[14px] leading-6 text-ink-soft">{g.blurb}</p>
            </div>
            <div className="mt-5 grid gap-px border border-paper-line bg-paper-line md:grid-cols-2">
              {flags.map((f) => (
                <article key={f.no} className="bg-paper p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-soft">
                      FLAG {f.no}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "font-mono text-[9px] uppercase tracking-[0.12em] border px-2 py-0.5",
                          severityStyle[f.severity]
                        )}
                      >
                        {severityLabel[f.severity]}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-[9px] uppercase tracking-[0.12em] border px-2 py-0.5",
                          statusStyle[f.status]
                        )}
                      >
                        {statusLabel[f.status]}
                      </span>
                    </span>
                  </div>
                  <h4 className="mt-2.5 font-serif text-[17px] font-semibold leading-snug text-ink">
                    {f.title}
                  </h4>
                  <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">{f.detail}</p>
                  <p className="mt-2.5 font-mono text-[10.5px] leading-5 text-ink-soft/80">
                    <span className="uppercase tracking-[0.12em] text-ink-soft">affects — </span>
                    {f.affects}
                  </p>
                  <p className="mt-2.5 border-l-2 border-water pl-3 text-[12.5px] leading-6 text-ink">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-water">
                      action ·{" "}
                    </span>
                    {f.action}
                  </p>
                </article>
              ))}
            </div>
          </section>
        );
      })}
      <p className="border-l-2 border-paper-line pl-4 text-[13px] leading-6 text-ink-soft">
        Severity is not drama — it is triage. A{" "}
        <span className="font-mono text-[11.5px] text-severe">missing piece</span> blocks the
        training table; a <span className="font-mono text-[11.5px] text-flood">caution</span>{" "}
        must be fixed before the affected data enters modelling; a{" "}
        <span className="font-mono text-[11.5px] text-ink-soft">note</span> is handled by
        documented convention. Every flag names the dataset it touches and the next
        corrective action.
      </p>
    </div>
  );
}
