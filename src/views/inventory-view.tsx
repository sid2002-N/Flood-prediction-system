"use client";

/**
 * Kuttanad Flood Prediction System — Data Inventory view.
 * Opening summary, coverage timeline, the category narrative,
 * the searchable dataset register, and the impact-grouped audit.
 */
import { SectionHeading, Eyebrow, Stat } from "@/components/research/furniture";
import { CoverageGantt, SarChart } from "@/components/research/charts";
import { DatasetExplorer } from "@/components/research/dataset-explorer";
import { AuditRegister } from "@/components/research/audit-register";
import { inventorySummary } from "@/lib/content/inventory";
import {
  coverage,
  coverageLegend,
  coverageProvenance,
  sarProvenance,
} from "@/lib/content/series";
import { inventory } from "@/lib/content/inventory";
import {
  driveRoot,
  driveCaveat,
  categoryDriveLinks,
} from "@/lib/content/drive-links";
import { ExternalLink } from "lucide-react";

export function InventoryView() {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20">
      {/* ------------------------------ 05 — header ------------------------------ */}
      <div className="mb-10">
        <div className="flex items-baseline gap-3 border-t border-paper-line pt-3">
          <span className="font-mono text-[11px] font-semibold text-water">05</span>
          <Eyebrow>the data — collected till now, in detail</Eyebrow>
        </div>
        <h1 className="mt-5 font-serif text-4xl md:text-[52px] leading-[1.05] font-semibold tracking-tight">
          The Data Inventory
        </h1>
        <p className="mt-5 max-w-3xl text-[16px] leading-8 text-ink-soft">
          Everything gathered for this project, filed by category and audited
          file by file. The register below is the primary record: every dataset
          carries its temporal coverage, resolution, format and an honest audit
          state —{" "}
          <span className="font-mono text-[13px] text-water">read</span> (opened in
          full), <span className="font-mono text-[13px] text-flood">preview</span>{" "}
          (first rows inspected), or{" "}
          <span className="font-mono text-[13px] text-ink-soft">catalogued</span>{" "}
          (known from structure, not yet opened). Where a dataset is broken, the
          defect is listed with it — nothing is smoothed over.
        </p>
        <a
          href={driveRoot.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/15 bg-paper-2/60 px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:border-water hover:text-water"
        >
          <ExternalLink className="size-4" />
          Open the Drive archive — 22 folders
        </a>
        <p className="mt-3 max-w-3xl text-[12.5px] leading-5 text-ink-soft/80">
          {driveCaveat}
        </p>
      </div>

      {/* summary strip */}
      <div className="mb-10 grid grid-cols-2 gap-px border border-paper-line bg-paper-line sm:grid-cols-3 lg:grid-cols-6">
        {[
          { value: inventorySummary.categories, label: "categories", note: "by theme" },
          { value: inventorySummary.folders, label: "source folders", note: "audited" },
          { value: inventorySummary.span, label: "records span", note: "annual to 12-day" },
          { value: inventorySummary.datasets, label: "datasets", note: "in the register" },
          { value: inventorySummary.agencies, label: "agencies", note: "CWC · IMD · KSEB…" },
          { value: "11", label: "audit flags", note: "grouped by impact" },
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

      {/* satellite extent evidence */}
      <div className="mt-8">
        <SarChart provenance={sarProvenance} />
      </div>

      {/* --------------------------- category narrative --------------------------- */}
      <section className="mt-20" aria-label="Category summaries">
        <div className="mb-10 md:mb-12">
          <div className="flex items-baseline gap-3 border-t border-paper-line pt-3">
            <span className="font-mono text-[11px] font-semibold text-water">05</span>
            <Eyebrow>continued — the eight categories</Eyebrow>
          </div>
          <h2 className="mt-5 font-serif text-[30px] md:text-[38px] leading-[1.08] font-semibold tracking-tight text-ink">
            What was collected, and why it matters.
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-8 text-ink-soft">
            Each category is a working part of the forecasting chain — labels,
            targets, features, physics, exposure and upstream control. The
            summaries state what each block contributes and what is still wrong
            with it.
          </p>
        </div>
        <div className="grid gap-px border border-paper-line bg-paper-line lg:grid-cols-2">
          {inventory.map((cat) => (
            <article key={cat.id} className="bg-paper p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[20px] font-semibold leading-none text-water">
                  {cat.no}
                </span>
                <h3 className="text-[19px] font-semibold leading-tight tracking-[-0.01em] text-ink">
                  {cat.title}
                </h3>
              </div>
              <p className="mt-2 text-[12px] font-medium text-ink-soft">
                Sources — {cat.sources}
              </p>
              <p className="mt-3 text-[14px] leading-7 text-ink-soft">{cat.summary}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-paper-line/70 pt-3">
                {cat.highlights.map((h) => (
                  <div key={h.label} className="min-w-[110px]">
                    <div className="font-mono text-[13px] font-semibold tab-nums leading-none text-ink">
                      {h.value}
                    </div>
                    <div className="mt-1 text-[12px] leading-4 text-ink-soft">{h.label}</div>
                  </div>
                ))}
              </div>
              {(categoryDriveLinks[cat.id]?.length ?? 0) > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-paper-line/70 pt-3">
                  <span className="text-[12px] font-semibold text-ink-soft/70">
                    Drive ·
                  </span>
                  {categoryDriveLinks[cat.id].map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 border border-paper-line px-1.5 py-0.5 font-mono text-[9.5px] text-ink-soft transition-colors hover:border-water hover:text-water"
                    >
                      {l.label}
                      <ExternalLink className="size-2.5" />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* --------------------------- 06 — dataset register --------------------------- */}
      <section className="mt-20">
        <SectionHeading
          no="06"
          kicker="the dataset register"
          title="Search the archive."
          lede="The complete dataset record: search by name or content, filter by category and audit depth, sort, and expand any row for its file notes, open flags and source provenance. Rows with open issues are marked — nothing is hidden behind a summary."
        />
        <DatasetExplorer />
      </section>

      {/* --------------------------- 07 — audit register --------------------------- */}
      <section className="mt-20">
        <SectionHeading
          no="07"
          kicker="data audit"
          title="What's wrong with the data — on the record."
          lede="A research archive earns trust by publishing its defects. Eleven flags were filed during the audit, grouped here by what each one does to model development. Every flag carries the dataset it affects and the next corrective action."
        />
        <AuditRegister />
      </section>
    </div>
  );
}
