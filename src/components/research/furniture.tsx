/**
 * Kuttanad Flood Prediction System — design-system furniture.
 * Apple design science: SF system type with negative display
 * tracking, tinted rounded-full pills, soft-elevation cards,
 * hairline rules. Mono is reserved for coordinates, numerics and
 * provenance — never for identity typography.
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
        "text-[13px] font-semibold tracking-[0.01em]",
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
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "text-[13px] font-semibold tab-nums",
            dark ? "text-water-bright" : "text-water"
          )}
        >
          {no}
        </span>
        <span
          className={cn(
            "text-[13px] font-semibold",
            dark ? "text-paper-dim" : "text-ink-soft"
          )}
        >
          · {kicker}
        </span>
      </div>
      <h2
        className={cn(
          "mt-3 max-w-3xl text-[34px] font-semibold leading-[1.07] tracking-[-0.02em] md:text-[46px]",
          dark ? "text-paper" : "text-ink"
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-[17px] leading-7 md:text-[18px] md:leading-8",
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

export type TagTone =
  | "neutral"
  | "water"
  | "flood"
  | "severe"
  | "outline"
  | "dark";

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
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium",
        tone === "neutral" && "bg-black/[0.05] text-ink-soft",
        tone === "water" && "bg-water/10 text-water",
        tone === "flood" && "bg-flood/10 text-flood",
        tone === "severe" && "bg-severe/10 text-severe",
        tone === "outline" && "border border-black/10 text-ink-soft",
        tone === "dark" && "bg-night text-paper",
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
    complete: "bg-water/10 text-water",
    active: "bg-flood/10 text-flood",
    blocked: "bg-severe/10 text-severe",
    next: "bg-black/[0.05] text-ink-soft",
    planned: "bg-black/[0.03] text-ink-soft/80",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium",
        map[state] ?? map.planned
      )}
    >
      {state === "active" && (
        <span className="size-1.5 rounded-full bg-flood animate-pulse" />
      )}
      {state === "complete" && <span className="size-1.5 rounded-full bg-water" />}
      {state === "blocked" && <span className="size-1.5 rounded-full bg-severe" />}
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
          "text-[32px] font-semibold leading-none tab-nums tracking-[-0.02em] md:text-[38px]",
          dark ? "text-paper" : "text-ink"
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-2 text-[13px] font-semibold",
          dark ? "text-water-bright" : "text-water"
        )}
      >
        {label}
      </div>
      {note && (
        <div
          className={cn(
            "mt-1 text-[13px] leading-5",
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
          "apple-shadow overflow-hidden rounded-xl bg-night",
          dark && "rounded-none shadow-none"
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
          "px-1 pt-3",
          dark ? "text-paper-dim" : "text-ink-soft"
        )}
      >
        <span
          className={cn(
            "text-[13px] font-semibold",
            dark ? "text-water-bright" : "text-water"
          )}
        >
          Fig. {figNo}
        </span>
        <span
          className={cn(
            "ml-2 text-[14px] leading-snug",
            dark ? "text-paper" : "text-ink"
          )}
        >
          {caption}
        </span>
        {provenance && (
          <span
            className={cn(
              "mt-1 block font-mono text-[11px] tracking-[0.01em]",
              dark ? "text-paper-dim/80" : "text-ink-soft/90"
            )}
          >
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
    <div
      className={cn(
        "slim-scroll overflow-x-auto rounded-xl border border-black/[0.08] bg-paper",
        className
      )}
    >
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-black/[0.08] bg-black/[0.02]">
            {columns.map((c) => (
              <th
                key={c}
                className="px-3 py-2.5 text-[12px] font-medium text-ink-soft"
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
        "border-b border-black/[0.06] px-3 py-3 align-top text-[13.5px] leading-6 text-ink-soft",
        mono && "font-mono text-[12px] tab-nums",
        className
      )}
    >
      {children}
    </td>
  );
}
