/**
 * Kuttanad Flood Prediction System — editorial furniture.
 * The small typographic pieces that make the site read like a
 * technical dossier: eyebrows, tags, figures, stat cells, rules.
 */
import { cn } from "@/lib/utils";

/* ------------------------------ Eyebrow ------------------------------ */

export function Eyebrow({
  children,
  tone = "ink",
  className,
}: {
  children: React.ReactNode;
  tone?: "ink" | "paper" | "water";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.22em] font-medium",
        tone === "ink" && "text-ink-soft",
        tone === "paper" && "text-paper-dim",
        tone === "water" && "text-water",
        className
      )}
    >
      {children}
    </p>
  );
}

/* --------------------------- Section heading --------------------------- */

export function SectionHeading({
  no,
  kicker,
  title,
  lede,
  dark,
}: {
  no: string;
  kicker: string;
  title: string;
  lede?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <div
        className={cn(
          "flex items-baseline gap-3 border-t pt-3",
          dark ? "border-night-line" : "border-paper-line"
        )}
      >
        <span className="font-mono text-[11px] font-semibold text-water">
          {no}
        </span>
        <Eyebrow tone={dark ? "paper" : "ink"}>{kicker}</Eyebrow>
      </div>
      <h2
        className={cn(
          "mt-5 font-serif text-3xl md:text-[42px] leading-[1.08] font-semibold tracking-tight max-w-3xl",
          dark ? "text-paper" : "text-ink"
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[15px] leading-7",
            dark ? "text-paper-dim" : "text-ink-soft"
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- Tag -------------------------------- */

export type TagTone = "neutral" | "water" | "flood" | "severe" | "outline" | "dark";

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: TagTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium px-2 py-1 border whitespace-nowrap",
        tone === "neutral" && "bg-paper-2 text-ink-soft border-paper-line",
        tone === "water" && "bg-water text-paper border-water",
        tone === "flood" && "bg-flood text-paper border-flood",
        tone === "severe" && "bg-severe text-paper border-severe",
        tone === "outline" && "bg-transparent text-ink-soft border-paper-line",
        tone === "dark" && "bg-night text-paper border-night-line",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------- Status pill ----------------------------- */

export function StatusPill({ state }: { state: string }) {
  const map: Record<string, string> = {
    complete: "bg-water text-paper border-water",
    active: "bg-flood text-paper border-flood",
    next: "bg-paper text-ink border-paper-line",
    planned: "bg-transparent text-ink-soft border-paper-line",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] font-medium px-2 py-1 border",
        map[state] ?? map.planned
      )}
    >
      {state === "active" && (
        <span className="size-1.5 rounded-full bg-paper animate-pulse" />
      )}
      {state === "complete" && <span className="size-1.5 rounded-full bg-paper" />}
      {state}
    </span>
  );
}

/* ------------------------------ Audit chip ------------------------------ */

export function AuditChip({ state }: { state: "read" | "preview" | "catalogued" }) {
  const tone =
    state === "read" ? "water" : state === "preview" ? "flood" : "outline";
  return <Tag tone={tone as TagTone}>{state}</Tag>;
}

/* -------------------------------- Stat -------------------------------- */

export function Stat({
  value,
  label,
  note,
  dark,
  className,
}: {
  value: string;
  label: string;
  note?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("px-5 py-5", className)}>
      <div
        className={cn(
          "font-serif text-[26px] md:text-[30px] leading-none font-semibold tab-nums tracking-tight",
          dark ? "text-paper" : "text-ink"
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-2 font-mono text-[9.5px] uppercase tracking-[0.14em] font-medium",
          dark ? "text-water-bright" : "text-water"
        )}
      >
        {label}
      </div>
      {note && (
        <div
          className={cn(
            "mt-1 font-mono text-[9px] tracking-[0.06em]",
            dark ? "text-paper-dim" : "text-ink-soft"
          )}
        >
          {note}
        </div>
      )}
    </div>
  );
}

/* ------------------------------- Figure ------------------------------- */

export function Figure({
  src,
  alt,
  figNo,
  caption,
  provenance,
  dark,
  className,
  imgClassName,
  priority,
}: {
  src: string;
  alt: string;
  figNo: string;
  caption: string;
  provenance?: string;
  dark?: boolean;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div
        className={cn(
          "border overflow-hidden bg-night",
          dark ? "border-night-line" : "border-paper-line"
        )}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className={cn(
            "w-full h-auto object-cover",
            dark ? "plate-dark" : "plate",
            imgClassName
          )}
        />
      </div>
      <figcaption
        className={cn(
          "border-x border-b px-4 py-3",
          dark ? "border-night-line bg-night-2 text-paper-dim" : "border-paper-line bg-paper-2 text-ink-soft"
        )}
      >
        <span className={cn("font-mono text-[10px] font-semibold tracking-[0.1em]", dark ? "text-water-bright" : "text-water")}>
          FIG. {figNo}
        </span>
        <span className="ml-2 font-mono text-[10px] tracking-[0.04em]">{caption}</span>
        {provenance && (
          <span className="block mt-1 font-mono text-[9px] tracking-[0.04em] opacity-75">
            {provenance}
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/* ------------------------------ Data table ------------------------------ */

export function DataTable({
  columns,
  children,
  className,
}: {
  columns: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-x-auto slim-scroll", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className={cn("border-y border-paper-line bg-paper-2/60")}>
            {columns.map((c) => (
              <th
                key={c}
                className="px-3 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] font-medium text-ink-soft"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  mono,
  className,
}: {
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <td
      className={cn(
        "border-b border-paper-line/70 px-3 py-3 align-top text-[13px] leading-6 text-ink-soft",
        mono && "font-mono text-[11.5px] tab-nums",
        className
      )}
    >
      {children}
    </td>
  );
}
