/**
 * Kuttanad Flood Prediction System — research diagrams.
 * The approach pipeline and the LSTM architecture, drawn in the Apple
 * design language — rounded cards, SF system type, soft elevation.
 */
import { cn } from "@/lib/utils";

/* ---------------------------- Approach pipeline ---------------------------- */

const PIPE_STEPS = [
  {
    no: "S1",
    title: "Data collection",
    desc: "8 categories, 22 folders, 1901–2026",
    status: "complete",
  },
  {
    no: "S2",
    title: "Audit & cleaning",
    desc: "raw → manual-cleaned → cleaned; 11 flags filed",
    status: "complete",
  },
  {
    no: "S3",
    title: "Feature engineering",
    desc: "lags 1/3/7 d · rolling 3/7/30 d · terrain grid join",
    status: "complete",
  },
  {
    no: "S4",
    title: "LSTM training",
    desc: "sequence model trained — v1.0 exists",
    status: "complete",
  },
  {
    no: "S5",
    title: "Model integration",
    desc: "this console: adapter live, weights pending",
    status: "active",
  },
  {
    no: "S6",
    title: "Unified labels",
    desc: "one merged table with a flood target",
    status: "next",
  },
] as const;

const statusDot: Record<string, string> = {
  complete: "bg-water rounded-full",
  active: "bg-flood animate-pulse rounded-full",
  next: "bg-transparent border border-ink-soft/50 rounded-full",
};

export function ApproachPipeline({ dark }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {PIPE_STEPS.map((s) => (
        <div
          key={s.no}
          className={cn(
            "apple-shadow rounded-xl border border-black/[0.06] p-5",
            dark ? "border-white/10 bg-night" : "bg-paper"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold tab-nums text-water">
              {s.no}
            </span>
            <span className={cn("size-2", statusDot[s.status])} />
          </div>
          <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.01em] text-ink">
            {s.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-6 text-ink-soft">
            {s.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- LSTM architecture --------------------------- */

const ARCH = [
  {
    x: 20,
    w: 150,
    h: 120,
    title: "Input sequence",
    sub: "30 days × 14 features",
    tensor: "(batch, 30, 14)",
    body: ["rainfall (lag 1/3/7)", "rolling sums 3/7/30", "temp · wind · ET₀", "humidity · pressure", "antecedent discharge"],
    tone: "outline",
  },
  {
    x: 210,
    w: 130,
    h: 120,
    title: "LSTM layer 1",
    sub: "128 units",
    tensor: "(batch, 30, 128)",
    body: ["returns full sequence", "dropout 0.2"],
    tone: "water",
  },
  {
    x: 380,
    w: 130,
    h: 120,
    title: "LSTM layer 2",
    sub: "64 units",
    tensor: "(batch, 128)",
    body: ["last hidden state", "dropout 0.2"],
    tone: "water",
  },
  {
    x: 550,
    w: 130,
    h: 120,
    title: "Dense head",
    sub: "ReLU 32 → linear",
    tensor: "(batch, H)",
    body: ["per-horizon output", "ŷ t+1 … t+H"],
    tone: "outline",
  },
  {
    x: 720,
    w: 150,
    h: 120,
    title: "Threshold classifier",
    sub: "flood stage ≥ 12",
    tensor: "post-model step",
    body: ["severe ≥ 15", "risk: low · elevated", "· flood · severe"],
    tone: "flood",
  },
];

export function ArchDiagram({ provenance }: { provenance?: string }) {
  const y = 46;
  return (
    <figure className="apple-shadow rounded-xl border border-black/[0.08] bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">
          <span className="text-water">Fig. 08 — </span>Model architecture — Kuttanad-LSTM v1.0
        </span>
        <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[12px] font-medium text-ink-soft">
          Spec — edit in model-config
        </span>
      </div>
      <div className="overflow-x-auto slim-scroll p-4">
        <svg
          viewBox="0 0 900 240"
          className="h-auto w-full min-w-[720px]"
          role="img"
          aria-label="LSTM architecture: input sequence through two LSTM layers and a dense head to a threshold classifier"
        >
          {ARCH.map((b, i) => {
            const fill =
              b.tone === "water" ? "#0e7490" : b.tone === "flood" ? "#c2410c" : "none";
            const stroke =
              b.tone === "water" ? "#0e7490" : b.tone === "flood" ? "#c2410c" : "#1d1d1f";
            const textFill = b.tone === "outline" ? "#1d1d1f" : "#ffffff";
            const subFill = b.tone === "outline" ? "#0e7490" : "#ffffff";
            const isPost = b.title === "Threshold classifier";
            return (
              <g key={b.title}>
                <rect
                  x={b.x}
                  y={y}
                  width={b.w}
                  height={b.h}
                  rx="10"
                  fill={fill === "none" ? "#f5f5f7" : fill}
                  stroke={stroke}
                  strokeWidth="1.2"
                  strokeDasharray={isPost ? "6 4" : "none"}
                />
                <text x={b.x + 14} y={y + 26} className="font-sans" fontSize="12.5" fontWeight="600" fill={textFill}>
                  {b.title}
                </text>
                <text x={b.x + 14} y={y + 43} className="font-mono" fontSize="10" fill={subFill} opacity="0.85">
                  {b.sub}
                </text>
                {b.body.map((line, j) => (
                  <text key={line} x={b.x + 14} y={y + 65 + j * 13} className="font-mono" fontSize="9.5" fill={textFill} opacity="0.72">
                    {line}
                  </text>
                ))}
                {/* tensor shape under each block */}
                <text x={b.x + 14} y={y + b.h - 10} className="font-mono" fontSize="9" fill="#6e6e73" opacity="0.9">
                  {b.tensor}
                </text>
                {i < ARCH.length - 1 && (
                  <g>
                    <line
                      x1={b.x + b.w}
                      y1={y + b.h / 2}
                      x2={ARCH[i + 1].x - 6}
                      y2={y + b.h / 2}
                      stroke="#1d1d1f"
                      strokeWidth="1.4"
                      strokeDasharray={i === 3 ? "4 3" : "none"}
                    />
                    <polygon
                      points={`${ARCH[i + 1].x - 6},${y + b.h / 2 - 4} ${ARCH[i + 1].x},${y + b.h / 2} ${ARCH[i + 1].x - 6},${y + b.h / 2 + 4}`}
                      fill="#1d1d1f"
                    />
                  </g>
                )}
              </g>
            );
          })}
          {/* input window tick strip */}
          {Array.from({ length: 30 }).map((_, k) => (
            <rect
              key={`tick-${k}`}
              x={32 + k * 4.5}
              y={y + 92}
              width={2.5}
              height={10}
              rx="1"
              fill="#0e7490"
              opacity={k === 29 ? 1 : 0.3 + (k / 29) * 0.55}
            />
          ))}
          <text x={32} y={y + 116} className="font-mono" fontSize="9" fill="#6e6e73">
            t−29 ············································ t
          </text>
          <text x={20} y={22} className="font-sans" fontSize="11" fontWeight="600" fill="#6e6e73">
            Sequence regression → threshold classification (post-model, dashed)
          </text>
          <text x={20} y={226} className="font-mono" fontSize="9.5" fill="#6e6e73">
            thresholds in file units — flood 12.0 · severe 15.0 · calibrated against the audited 2018 peak of 17.11
          </text>
        </svg>
      </div>
      {provenance && (
        <figcaption className="border-t border-black/[0.06] px-4 py-2.5 text-[12.5px] leading-5 text-ink-soft">
          <span className="font-medium text-ink-soft/70">Provenance — </span>
          {provenance}
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------- Code block ------------------------------- */

export function CodeBlock({
  file,
  lang,
  code,
}: {
  file: string;
  lang?: string;
  code: string;
}) {
  return (
    <div className="apple-shadow-lg overflow-hidden rounded-xl bg-night">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2.5">
        <span className="font-mono text-[12px] font-medium text-water-bright">
          {file}
        </span>
        {lang && (
          <span className="text-[12px] font-medium text-paper-dim">
            {lang}
          </span>
        )}
      </div>
      <pre className="slim-scroll-dark overflow-x-auto p-4 font-mono text-[11.5px] leading-[1.75] text-paper">
        <code>{code}</code>
      </pre>
    </div>
  );
}
