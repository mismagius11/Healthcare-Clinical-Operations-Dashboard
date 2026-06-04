import { ReactNode, useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown, Minus, Info, X, ChevronDown, Check } from "lucide-react";
import * as DM from "@radix-ui/react-dropdown-menu";

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

export function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const [flip, setFlip] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const timer = useRef<any>(null);

  const onEnter = () => {
    clearTimeout(timer.current);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setFlip(rect.right + 240 > window.innerWidth);
    }
    setShow(true);
  };
  const onLeave = () => {
    timer.current = setTimeout(() => setShow(false), 100);
  };

  return (
    <span
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative inline-flex items-center"
    >
      <Info size={11} className="text-[var(--wl-text-2)] opacity-60 cursor-help" />
      {show && (
        <span
          role="tooltip"
          className="absolute pointer-events-none"
          style={{
            zIndex: 9999,
            ...(flip
              ? { top: "calc(100% + 8px)", left: 0 }
              : { top: "50%", left: "calc(100% + 8px)", transform: "translateY(-50%)" }),
            maxWidth: 220,
            background: "#1c1c1f",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            padding: "8px 12px",
            color: "#ededed",
            fontSize: 12,
            lineHeight: 1.4,
            width: "max-content",
            whiteSpace: "normal",
          }}
        >
          <span
            style={{
              position: "absolute",
              width: 8,
              height: 8,
              background: "#1c1c1f",
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              transform: flip ? "rotate(135deg)" : "rotate(45deg)",
              ...(flip
                ? { top: -5, left: 12 }
                : { left: -5, top: "50%", marginTop: -4 }),
            }}
          />
          {text}
        </span>
      )}
    </span>
  );
}

export function Kpi({ label, value, delta, tone = "neutral", valueTone, tooltip }: { label: string; value: string; delta?: string; tone?: "green" | "red" | "yellow" | "neutral"; valueTone?: "red" | "yellow"; tooltip?: string }) {
  const toneCls = tone === "green" ? "text-[var(--wl-green)]" : tone === "red" ? "text-[var(--wl-red)]" : tone === "yellow" ? "text-[var(--wl-yellow)]" : "text-[var(--wl-text-2)]";
  const Icon = tone === "green" ? TrendingUp : tone === "red" ? TrendingDown : Minus;
  const vTone = valueTone === "red" ? "text-[var(--wl-red)]" : valueTone === "yellow" ? "text-[var(--wl-yellow)]" : "text-[var(--wl-text)]";
  return (
    <div className="bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md p-3">
      <div className="flex items-center gap-1 text-[11px] text-[var(--wl-text-2)] uppercase tracking-wide">
        <span>{label}</span>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className={`mt-1 text-2xl font-semibold ${vTone}`}>{value}</div>
      {delta && (
        <div className={`mt-1 flex items-center gap-1 text-[11px] ${toneCls}`}>
          <Icon size={11} />{delta}
        </div>
      )}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "green" | "red" | "yellow" | "blue" | "purple" | "neutral" }) {
  const map: Record<string, string> = {
    green: "bg-[var(--wl-green)]/15 text-[var(--wl-green)]",
    red: "bg-[var(--wl-red)]/15 text-[var(--wl-red)]",
    yellow: "bg-[var(--wl-yellow)]/15 text-[var(--wl-yellow)]",
    blue: "bg-[var(--wl-blue)]/15 text-[var(--wl-blue)]",
    purple: "bg-[var(--wl-purple)]/15 text-[var(--wl-purple)]",
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

export function Modal({ open, onClose, title, children, footer, width = 480 }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded-md flex flex-col max-h-[90vh]"
        style={{ width }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-12 flex items-center px-4 border-b border-[var(--wl-border)]">
          <div className="text-sm font-semibold text-[var(--wl-text)]">{title}</div>
          <button onClick={onClose} className="ml-auto w-6 h-6 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"><X size={14} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
        {footer && <div className="border-t border-[var(--wl-border)] p-3 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wide text-[var(--wl-text-2)] mb-1">{label}</div>
      {children}
    </label>
  );
}

export function TextInput({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />;
}

type DropOpt = { v: string; label: string } | string;

const ddContentStyle: React.CSSProperties = {
  background: "var(--wl-card)",
  border: "1px solid var(--wl-border)",
  borderRadius: 8,
  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  padding: 4,
  minWidth: "var(--radix-dropdown-menu-trigger-width)",
  zIndex: 9999,
};

const ddItemBase = "flex items-center gap-2 px-3 py-2 rounded text-[13px] text-[var(--wl-text)] outline-none cursor-pointer data-[highlighted]:bg-white/[0.06] data-[disabled]:text-[#52525b] data-[disabled]:pointer-events-none";

export function Dropdown({
  value, options, onChange, align = "start", side = "bottom", size = "sm", fullWidth = false, placeholder,
}: {
  value: string;
  options: DropOpt[];
  onChange: (v: string) => void;
  align?: "start" | "end" | "center";
  side?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md";
  fullWidth?: boolean;
  placeholder?: string;
}) {
  const opts = options.map(o => typeof o === "string" ? { v: o, label: o } : o);
  const current = opts.find(o => o.v === value)?.label ?? value ?? placeholder ?? "";
  const triggerCls = size === "md"
    ? `${fullWidth ? "w-full" : ""} inline-flex items-center justify-between gap-2 bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)] hover:border-[var(--wl-text-2)]`
    : `${fullWidth ? "w-full" : ""} inline-flex items-center justify-between gap-2 bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded px-2 h-7 text-xs text-[var(--wl-text)] outline-none hover:border-[var(--wl-text-2)]`;

  return (
    <DM.Root>
      <DM.Trigger asChild>
        <button type="button" className={triggerCls}>
          <span className="truncate">{current}</span>
          <ChevronDown size={size === "md" ? 13 : 11} className="text-[var(--wl-text-2)] shrink-0" />
        </button>
      </DM.Trigger>
      <DM.Portal>
        <DM.Content
          align={align}
          side={side}
          sideOffset={4}
          avoidCollisions
          className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 duration-150"
          style={ddContentStyle}
        >
          {opts.map(o => (
            <DM.Item
              key={o.v}
              onSelect={() => onChange(o.v)}
              className={ddItemBase}
            >
              <span className="w-3 inline-flex">{o.v === value && <Check size={12} className="text-[var(--wl-blue)]" />}</span>
              <span className="flex-1 truncate">{o.label}</span>
            </DM.Item>
          ))}
        </DM.Content>
      </DM.Portal>
    </DM.Root>
  );
}

export function SelectInput({ value, options, onChange }: { value: string; options: { v: string; label: string }[] | string[]; onChange: (v: string) => void }) {
  return <Dropdown value={value} options={options as any} onChange={onChange} size="md" fullWidth />;
}
