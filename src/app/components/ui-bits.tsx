import { ReactNode, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";

export function Card({ children, className = "", title, action }: { children: ReactNode; className?: string; title?: string; action?: ReactNode }) {
  return (
    <div className={`bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 h-10 border-b border-[var(--wl-border)]">
          {title && <div className="text-sm text-[var(--wl-text)]">{title}</div>}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function Kpi({ label, value, delta, tone = "neutral", valueTone, tooltip }: { label: string; value: string; delta?: string; tone?: "green" | "red" | "yellow" | "neutral"; valueTone?: "red" | "yellow"; tooltip?: string }) {
  const [hover, setHover] = useState(false);
  const toneCls = tone === "green" ? "text-[var(--wl-green)]" : tone === "red" ? "text-[var(--wl-red)]" : tone === "yellow" ? "text-[var(--wl-yellow)]" : "text-[var(--wl-text-2)]";
  const Icon = tone === "green" ? TrendingUp : tone === "red" ? TrendingDown : Minus;
  const vTone = valueTone === "red" ? "text-[var(--wl-red)]" : valueTone === "yellow" ? "text-[var(--wl-yellow)]" : "text-[var(--wl-text)]";
  return (
    <div
      className="relative bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md p-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center gap-1 text-[11px] text-[var(--wl-text-2)] uppercase tracking-wide">
        {label}
        {tooltip && <Info size={10} className="opacity-60" />}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${vTone}`}>{value}</div>
      {delta && (
        <div className={`mt-1 flex items-center gap-1 text-[11px] ${toneCls}`}>
          <Icon size={11} />{delta}
        </div>
      )}
      {tooltip && hover && (
        <div className="absolute left-0 right-0 -bottom-1 translate-y-full z-20 mx-2 p-2 rounded text-[11px] leading-snug shadow-lg"
          style={{ background: "#1c1c1f", color: "#ededed", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "green" | "red" | "yellow" | "blue" | "neutral" }) {
  const map: Record<string, string> = {
    green: "bg-[var(--wl-green)]/15 text-[var(--wl-green)]",
    red: "bg-[var(--wl-red)]/15 text-[var(--wl-red)]",
    yellow: "bg-[var(--wl-yellow)]/15 text-[var(--wl-yellow)]",
    blue: "bg-[var(--wl-blue)]/15 text-[var(--wl-blue)]",
    neutral: "bg-white/5 text-[var(--wl-text-2)]",
  };
  return <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${map[tone]}`}>{children}</span>;
}

export function PageHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl text-[var(--wl-text)] font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--wl-text-2)] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export const chartTooltip = {
  contentStyle: {
    background: "#1c1c1f",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    fontSize: 12,
    color: "#ededed",
    padding: "6px 10px",
  },
  labelStyle: { color: "#ededed", fontWeight: 600 },
  itemStyle: { color: "#ededed" },
};

export function EmptyState({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-full border border-[var(--wl-border)] flex items-center justify-center text-[var(--wl-text-2)] mb-3">
        <Info size={18} />
      </div>
      <div className="text-sm text-[var(--wl-text)] font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-[var(--wl-text-2)] mt-1">{subtitle}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
