"use client";

/**
 * Kuttanad Flood Prediction System — Data Inventory view.
 * The complete, honest catalogue of everything collected so far:
 * eight categories, forty-plus datasets, coverage timeline, and the
 * audit flags that keep the project honest.
 */
import { SectionHeading, Eyebrow, AuditChip, Tag, DataTable, Td, Stat } from "@/components/research/furniture";
import { CoverageGantt } from "@/components/research/charts";
import { inventory, auditFlags, inventorySummary } from "@/lib/content/inventory";
import {
  coverage,
  coverageLegend,
  coverageProvenance,
} from "@/lib/content/series";
import type { FlagSeverity } from "@/lib/content/inventory";

const severityStyle: Record<FlagSeverity, string> = {
  gap: "border-severe text-severe",
  caution: "border-flood text-flood",
  note: "border-paper-line text-ink-soft",
};

export function InventoryView() {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
      {/* header */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 border-t border-paper-line pt-3">
          <span className="font-mono text-[11px] font-semibold text-water">05</span>
          <Eyebrow>the data — collected till now, in detail</Eyebrow>
        </div>
        <h1 className="mt-5 font-serif text-4xl md:text-[52px] leading-[1.05] font-semibold tracking-tight">
          The Data Inventory
        </h1>
        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-ink-soft">
          Everything gathered for this project, filed by category and audited
          file by file. Each dataset below carries its temporal coverage, its
          resolution, its format, and an honest audit state —{" "}
          <span className="font-mono text-[12px] text-water">read</span> (opened in
          full), <span className="font-mono text-[12px] text-flood">preview</span>{" "}
          (first rows inspected), or{" "}
          <span className="font-mono text-[12px] text-ink-soft">catalogued</span>{" "}
          (known from structure, not yet opened). Where a dataset is broken, the
          defect is listed with it.
        </p>
      </div>

      {/* summary strip */}
      <div className="mb-10 grid grid-cols-2 gap-px border border-paper-line bg-paper-line sm:grid-cols-3 lg:grid-cols-6">
        {[
          { value: inventorySummary.categories, label: "categories", note: "by theme" },
          { value: inventorySummary.folders, label: "source folders", note: "audited" },
          { value: inventorySummary.span, label: "records span", note: "annual to 12-day" },
          { value: inventorySummary.datasets, label: "datasets", note: "catalogued" },
          { value: inventorySummary.agencies, label: "agencies", note: "CWC · IMD · KSEB…" },
          { value: "11", label: "audit flags", note: "filed in the open" },
        ].map((s) => (
          <div key={s.label} className="bg-paper">
            <Stat value={s.value} label={s.label} note={s.note} />
          </div>
        ))}
      </div>

      {/* coverage timeline */}
      <CoverageGantt
        rows={coverage}
        legend={coverageLegend}
        provenance={coverageProvenance}
      />

      {/* categories */}
      <div className="mt-16 space-y-16">
        {inventory.map((cat) => (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            {/* category header */}
            <div className="grid gap-6 border-t-2 border-ink pt-6 lg:grid-cols-[220px_1fr_260px] lg:gap-10">
              <div>
                <span className="font-mono text-[24px] font-semibold leading-none text-water">
                  {cat.no}
                </span>
                <h2 id={`cat-${cat.id}`} className="mt-3 font-serif text-[24px] font-semibold leading-tight text-ink">
                  {cat.title}
                </h2>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] leading-relaxed text-ink-soft">
                  sources — {cat.sources}
                </p>
              </div>
              <div>
                <p className="text-[14px] leading-7 text-ink-soft">{cat.summary}</p>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 self-start">
                {cat.highlights.map((h) => (
                  <div key={h.label} className="border-l border-paper-line pl-3">
                    <dt className="font-mono text-[15px] font-semibold tab-nums leading-none text-ink">
                      {h.value}
                    </dt>
                    <dd className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink-soft">
                      {h.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* datasets table */}
            <DataTable columns={["dataset", "coverage", "resolution", "format", "audit", "notes & flags"]} className="mt-6">
              {cat.datasets.map((d) => (
                <tr key={d.name} className="align-top hover:bg-paper-2/50">
                  <Td className="w-[24%]">
                    <span className="font-mono text-[11px] font-semibold leading-5 text-ink">
                      {d.name}
                    </span>
                  </Td>
                  <Td mono className="w-[13%]">{d.coverage}</Td>
                  <Td mono className="w-[14%]">{d.resolution}</Td>
                  <Td mono className="w-[13%]">{d.format}</Td>
                  <Td className="w-[7%]">
                    <AuditChip state={d.audit} />
                  </Td>
                  <Td className="w-[29%]">
                    <ul className="space-y-1.5">
                      {d.notes.map((n) => (
                        <li key={n} className="leading-5 text-ink-soft">{n}</li>
                      ))}
                      {d.flags?.map((f) => (
                        <li key={f} className="flex gap-2 leading-5 text-flood-deep">
                          <span className="mt-[7px] size-1 shrink-0 bg-flood" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </Td>
                </tr>
              ))}
            </DataTable>
          </section>
        ))}
      </div>

      {/* ============================ audit flags ============================ */}
      <section className="mt-20">
        <SectionHeading
          no="06"
          kicker="data audit"
          title="What's wrong with the data — on the record."
          lede="A research archive earns trust by publishing its defects. These eleven flags were filed during the audit; each carries the action required before the affected data enters the training pool."
        />
        <div className="grid gap-px border border-paper-line bg-paper-line md:grid-cols-2">
          {auditFlags.map((f) => (
            <div key={f.no} className="bg-paper p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] font-semibold text-ink-soft">
                  FLAG {f.no}
                </span>
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.14em] border px-2 py-0.5 ${severityStyle[f.severity]}`}
                >
                  {f.severity === "gap" ? "missing piece" : f.severity}
                </span>
              </div>
              <h3 className="mt-2.5 font-serif text-[17px] font-semibold leading-snug text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-ink-soft">{f.detail}</p>
              <p className="mt-2.5 border-l-2 border-water pl-2.5 text-[12px] leading-5 text-ink">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-water">
                  action ·{" "}
                </span>
                {f.action}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Tag tone="severe">missing piece — blocks training table</Tag>
          <Tag tone="flood">caution — fix before use</Tag>
          <Tag tone="outline">note — handle with care</Tag>
        </div>
      </section>
    </div>
  );
}
