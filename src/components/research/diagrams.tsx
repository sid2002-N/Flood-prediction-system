/**
 * Kuttanad Flood Prediction System — research diagrams.
 * The approach pipeline and the LSTM architecture, drawn as sharp
 * technical blocks — no rounded corners, no gradients.
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
  complete: "bg-water",
  active: "bg-flood animate-pulse",
  next: "bg-transparent border border-ink-soft/60",
};

export function ApproachPipeline({ dark }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-paper-line border border-paper-line">
      {PIPE_STEPS.map((s) => (
        <div
          key={s.no}
          className={cn("relative bg-paper p-5 group", dark && "bg-night")}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-water">
              {s.no}
            </span>
            <span className={cn("size-2", statusDot[s.status])} />
          </div>
          <h3 className="mt-3 font-serif text-[18px] font-semibold text-ink">
            {s.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] leading-6 text-ink-soft">
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
    title: "INPUT SEQUENCE",
    sub: "30 days × 14 features",
    tensor: "(batch, 30, 14)",
    body: ["rainfall (lag 1/3/7)", "rolling sums 3/7/30", "temp · wind · ET₀", "humidity · pressure", "antecedent discharge"],
    tone: "outline",
  },
  {
    x: 210,
    w: 130,
    h: 120,
    title: "LSTM LAYER 1",
    sub: "128 units",
    tensor: "(batch, 30, 128)",
    body: ["returns full sequence", "dropout 0.2"],
    tone: "water",
  },
  {
    x: 380,
    w: 130,
    h: 120,
    title: "LSTM LAYER 2",
    sub: "64 units",
    tensor: "(batch, 128)",
    body: ["last hidden state", "dropout 0.2"],
    tone: "water",
  },
  {
    x: 550,
    w: 130,
    h: 120,
    title: "DENSE HEAD",
    sub: "ReLU 32 → linear",
    tensor: "(batch, H)",
    body: ["per-horizon output", "ŷ t+1 … t+H"],
    tone: "outline",
  },
  {
    x: 720,
    w: 150,
    h: 120,
    title: "THRESHOLD CLASSIFIER",
    sub: "flood stage ≥ 12",
    tensor: "post-model step",
    body: ["severe ≥ 15", "risk: low · elevated", "· flood · severe"],
    tone: "flood",
  },
];

export function ArchDiagram({ provenance }: { provenance?: string }) {
  const y = 46;
  return (
    <figure className="border border-paper-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-line bg-paper-2/60 px-4 py-2.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink">
          <span className="text-water">FIG. 08 — </span>Model architecture — Kuttanad-LSTM v1.0
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] border border-paper-line text-ink-soft px-1.5 py-0.5">
          spec — edit in model-config
        </span>
      </div>
      <div className="overflow-x-auto slim-scroll p-4">
        <svg
          viewBox="0 0 900 240"
          className="h-auto w-full min-w-[720px]"
          style={{ fontFamily: "var(--font-plex-mono), monospace" }}
          role="img"
          aria-label="LSTM architecture: input sequence through two LSTM layers and a dense head to a threshold classifier"
        >
          {ARCH.map((b, i) => {
            const fill =
              b.tone === "water" ? "#0e6b68" : b.tone === "flood" ? "#b4530a" : "none";
            const stroke =
              b.tone === "water" ? "#0e6b68" : b.tone === "flood" ? "#b4530a" : "#1b1915";
            const textFill = b.tone === "outline" ? "#1b1915" : "#f6f3ec";
            const subFill = b.tone === "outline" ? "#0e6b68" : "#f6f3ec";
            const isPost = b.title === "THRESHOLD CLASSIFIER";
            return (
              <g key={b.title}>
                <rect
                  x={b.x}
                  y={y}
                  width={b.w}
                  height={b.h}
                  fill={fill === "none" ? "#f6f3ec" : fill}
                  stroke={stroke}
                  strokeWidth="1.4"
                  strokeDasharray={isPost ? "6 4" : "none"}
                />
                <text x={b.x + 12} y={y + 24} fontSize="11" fontWeight="600" fill={textFill} letterSpacing="0.1em">
                  {b.title}
                </text>
                <text x={b.x + 12} y={y + 40} fontSize="9.5" fill={subFill} opacity="0.85">
                  {b.sub}
                </text>
                {b.body.map((line, j) => (
                  <text key={line} x={b.x + 12} y={y + 62 + j * 13} fontSize="9" fill={textFill} opacity="0.72">
                    {line}
                  </text>
                ))}
                {/* tensor shape under each block */}
                <text x={b.x + 12} y={y + b.h - 10} fontSize="8.5" fill="#5f584a" opacity="0.9">
                  {b.tensor}
                </text>
                {i < ARCH.length - 1 && (
                  <g>
                    <line
                      x1={b.x + b.w}
                      y1={y + b.h / 2}
                      x2={ARCH[i + 1].x - 6}
                      y2={y + b.h / 2}
                      stroke="#1b1915"
                      strokeWidth="1.4"
                      strokeDasharray={i === 3 ? "4 3" : "none"}
                    />
                    <polygon
                      points={`${ARCH[i + 1].x - 6},${y + b.h / 2 - 4} ${ARCH[i + 1].x},${y + b.h / 2} ${ARCH[i + 1].x - 6},${y + b.h / 2 + 4}`}
                      fill="#1b1915"
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
              fill="#0e6b68"
              opacity={k === 29 ? 1 : 0.3 + (k / 29) * 0.55}
            />
          ))}
          <text x={32} y={y + 116} fontSize="8" fill="#5f584a">
            t−29 ············································ t
          </text>
          <text x={20} y={22} fontSize="9" fill="#5f584a" letterSpacing="0.16em">
            SEQUENCE REGRESSION → THRESHOLD CLASSIFICATION (POST-MODEL, DASHED)
          </text>
          <text x={20} y={226} fontSize="9" fill="#5f584a">
            thresholds in file units — flood 12.0 · severe 15.0 · calibrated against the audited 2018 peak of 17.11
          </text>
        </svg>
      </div>
      {provenance && (
        <figcaption className="border-t border-paper-line bg-paper-2/40 px-4 py-2 text-[12px] leading-5 text-ink-soft">
          <span className="font-mono text-[10px] text-ink-soft/80">provenance — </span>
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
    <div className="border border-night-line bg-night">
      <div className="flex items-center justify-between border-b border-night-line px-4 py-2">
        <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-water-bright">
          {file}
        </span>
        {lang && (
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-paper-dim">
            {lang}
          </span>
        )}
      </div>
      <pre className="slim-scroll-dark overflow-x-auto p-4 font-mono text-[11px] leading-[1.75] text-paper">
        <code>{code}</code>
      </pre>
    </div>
  );
}
