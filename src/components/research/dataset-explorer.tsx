"use client";

/**
 * Kuttanad Flood Prediction System — dataset explorer.
 * The primary detailed view of the data inventory: every dataset
 * searchable, filterable, sortable, with expandable provenance and
 * audit detail per row.
 */
import { Fragment, useMemo, useState } from "react";
import { ChevronDown, ExternalLink, Search } from "lucide-react";
import { inventory, type AuditState, type Dataset } from "@/lib/content/inventory";
import { datasetDriveLinks } from "@/lib/content/drive-links";
import { AuditChip } from "@/components/research/furniture";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Row extends Dataset {
  category: string;
  catNo: string;
  sources: string;
  issueCount: number;
}

const ROWS: Row[] = inventory.flatMap((cat) =>
  cat.datasets.map((d) => ({
    ...d,
    category: cat.title,
    catNo: cat.no,
    sources: cat.sources,
    issueCount: d.flags?.length ?? 0,
  }))
);

const AUDIT_ORDER: Record<AuditState, number> = { read: 0, preview: 1, catalogued: 2 };

type SortKey = "category" | "name" | "audit" | "issues";

function sortRows(rows: Row[], sort: SortKey): Row[] {
  const r = [...rows];
  switch (sort) {
    case "name":
      return r.sort((a, b) => a.name.localeCompare(b.name));
    case "audit":
      return r.sort(
        (a, b) => AUDIT_ORDER[a.audit] - AUDIT_ORDER[b.audit] || a.catNo.localeCompare(b.catNo)
      );
    case "issues":
      return r.sort((a, b) => b.issueCount - a.issueCount || a.catNo.localeCompare(b.catNo));
    case "category":
    default:
      return r.sort(
        (a, b) => a.catNo.localeCompare(b.catNo) || a.name.localeCompare(b.name)
      );
  }
}

export function DatasetExplorer() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [audit, setAudit] = useState("all");
  const [sort, setSort] = useState<SortKey>("category");
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = ROWS.filter((r) => {
      if (cat !== "all" && r.catNo !== cat) return false;
      if (audit !== "all" && r.audit !== audit) return false;
      if (flaggedOnly && r.issueCount === 0) return false;
      if (!q) return true;
      const hay = [r.name, r.category, r.coverage, r.resolution, r.format, ...r.notes, ...(r.flags ?? [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    return sortRows(rows, sort);
  }, [query, cat, audit, sort, flaggedOnly]);

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectBtn =
    "h-9 rounded-lg border border-black/10 bg-paper text-[13px] text-ink hover:border-black/25 [&>span]:tracking-[0]";

  return (
    <div className="apple-shadow overflow-hidden rounded-xl border border-black/[0.08] bg-paper">
      {/* control bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-black/[0.06] bg-paper-2/60 px-4 py-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets, notes, flags…"
            aria-label="Search datasets"
            className="h-9 rounded-[10px] border-black/10 bg-paper pl-9 text-[13px] text-ink placeholder:text-ink-soft/60"
          />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger aria-label="Filter by category" className={cn(selectBtn, "w-[220px]")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-black/10 bg-paper text-[13px] text-ink">
            <SelectItem value="all">All categories</SelectItem>
            {inventory.map((c) => (
              <SelectItem key={c.id} value={c.no}>
                {c.no} · {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={audit} onValueChange={setAudit}>
          <SelectTrigger aria-label="Filter by audit state" className={cn(selectBtn, "w-[170px]")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-black/10 bg-paper text-[13px] text-ink">
            <SelectItem value="all">Any audit state</SelectItem>
            <SelectItem value="read">read</SelectItem>
            <SelectItem value="preview">preview</SelectItem>
            <SelectItem value="catalogued">catalogued</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger aria-label="Sort datasets" className={cn(selectBtn, "w-[180px]")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-black/10 bg-paper text-[13px] text-ink">
            <SelectItem value="category">Category</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="audit">Audit depth</SelectItem>
            <SelectItem value="issues">Open issues</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex min-h-[36px] cursor-pointer items-center gap-2 text-[13px] font-medium text-ink-soft">
          <Checkbox
            checked={flaggedOnly}
            onCheckedChange={(v) => setFlaggedOnly(v === true)}
            aria-label="Show only datasets with open flags"
            className="border-black/20 data-[state=checked]:border-water data-[state=checked]:bg-water"
          />
          Flagged only
        </label>
      </div>

      {/* table */}
      <div className="overflow-x-auto slim-scroll">
        <table className="w-full min-w-[880px] border-collapse text-left">
          <thead>
            <tr className="border-b border-black/[0.08] bg-black/[0.02]">
              {["dataset", "category", "coverage", "resolution", "format", "audit", "issues"].map(
                (c, i) => (
                  <th
                    key={c}
                    className={cn(
                      "px-3 py-2.5 text-[12px] font-medium text-ink-soft",
                      i === 0 && "pl-4"
                    )}
                  >
                    {c}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const open = expanded.has(r.name);
              return (
                <Fragment key={r.name}>
                  <tr className="border-b border-black/[0.06] align-top hover:bg-paper-2/50">
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => toggle(r.name)}
                          aria-expanded={open}
                          aria-label={open ? `Collapse details for ${r.name}` : `Expand details for ${r.name}`}
                          className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-ink-soft transition-colors hover:bg-black/[0.09] hover:text-ink"
                        >
                          <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
                        </button>
                        <span className="text-[13px] font-medium leading-5 text-ink">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[12.5px] leading-5 text-ink-soft">
                      <span className="font-mono text-[11px] font-semibold text-water">{r.catNo}</span>{" "}
                      <span className="whitespace-nowrap">{r.category}</span>
                    </td>
                    <td className="px-3 py-3 font-mono text-[11.5px] tab-nums leading-5 text-ink-soft">
                      {r.coverage}
                    </td>
                    <td className="px-3 py-3 text-[12.5px] leading-5 text-ink-soft">{r.resolution}</td>
                    <td className="px-3 py-3 font-mono text-[11px] leading-5 text-ink-soft">{r.format}</td>
                    <td className="px-3 py-3">
                      <AuditChip state={r.audit} />
                    </td>
                    <td className="px-3 py-3 pr-4">
                      {r.issueCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-flood/10 px-2 py-0.5 text-[12px] font-semibold text-flood-deep">
                          <span className="size-1.5 rounded-full bg-flood" />
                          {r.issueCount}
                        </span>
                      ) : (
                        <span className="text-[12px] text-ink-soft/50">—</span>
                      )}
                    </td>
                  </tr>
                  {open && (
                    <tr className="border-b border-black/[0.06] bg-paper-2/60">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
                          <div>
                            <p className="text-[13px] font-semibold text-ink-soft">
                              File notes
                            </p>
                            <ul className="mt-2 space-y-1.5">
                              {r.notes.map((n) => (
                                <li key={n} className="flex gap-2.5 text-[13px] leading-6 text-ink-soft">
                                  <span className="mt-[11px] h-px w-3 shrink-0 bg-paper-dim" />
                                  {n}
                                </li>
                              ))}
                            </ul>
                            {r.flags && r.flags.length > 0 && (
                              <>
                                <p className="mt-4 text-[13px] font-semibold text-flood-deep">
                                  Open flags
                                </p>
                                <ul className="mt-2 space-y-1.5">
                                  {r.flags.map((f) => (
                                    <li key={f} className="flex gap-2.5 text-[13px] leading-6 text-flood-deep">
                                      <span className="mt-[10px] size-1 shrink-0 bg-flood" />
                                      {f}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            )}
                          </div>
                          <div className="self-start border-l border-black/[0.08] pl-4">
                            <p className="text-[13px] font-semibold text-ink-soft">
                              Sources &amp; provenance
                            </p>
                            <p className="mt-2 text-[12.5px] leading-6 text-ink">{r.sources}</p>
                            <p className="mt-3 text-[12px] leading-5 text-ink-soft/80">
                              Audit state — {r.audit}
                              {r.audit === "catalogued" && ": described from file names and folder structure only; not yet opened."}
                              {r.audit === "preview" && ": first rows inspected; full review pending."}
                              {r.audit === "read" && ": file opened and reviewed in full."}
                            </p>
                            {(datasetDriveLinks[r.name]?.length ?? 0) > 0 && (
                              <div className="mt-3">
                                <p className="text-[13px] font-semibold text-ink-soft">
                                  Files on Drive
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {datasetDriveLinks[r.name].map((l) => (
                                    <a
                                      key={l.url}
                                      href={l.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 rounded-md border border-black/10 px-1.5 py-0.5 text-[12px] text-ink-soft transition-colors hover:border-water hover:text-water"
                                    >
                                      {l.label}
                                      <ExternalLink className="size-3" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-ink-soft">
                  No datasets match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] bg-paper-2/60 px-4 py-2.5">
        <span className="text-[12.5px] font-medium tab-nums text-ink-soft">
          Showing {filtered.length} of {ROWS.length} catalogued datasets
        </span>
        <span className="text-[12px] text-ink-soft/70">
          Audit states — read · preview · catalogued — describe how far each file has actually been opened
        </span>
      </div>
    </div>
  );
}
