import { useEffect, useState } from "react";
import { X, AlertTriangle, Info, CheckCircle2, FileText } from "lucide-react";

export type AlertSeverity = "critical" | "warning" | "info";
export type AlertItem = {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  clinic: string;
  time: string;
  unread: boolean;
};

const seed: AlertItem[] = [
  { id: "a1", severity: "critical", title: "ICU Bed Capacity at 91%", description: "Above safe threshold, divert non-critical admissions", clinic: "St. Mary's Hospital", time: "2 min ago", unread: true },
  { id: "a2", severity: "critical", title: "Dosage Protocol Deviation Reported", description: "Variance flagged in ICU medication round", clinic: "St. Mary's · ICU", time: "5 min ago", unread: true },
  { id: "a3", severity: "warning", title: "Lab Result Delay Exceeding 48h", description: "12 pending results awaiting verification", clinic: "Westside Clinic", time: "18 min ago", unread: true },
  { id: "a4", severity: "warning", title: "Readmission Rate Above Target (8.4%)", description: "Cardiology driving most of the variance", clinic: "System-wide", time: "1h ago", unread: false },
  { id: "a5", severity: "info", title: "Q1 Audit Report Submitted", description: "Compliance package sent to corporate", clinic: "Central Medical", time: "3h ago", unread: false },
  { id: "a6", severity: "info", title: "Staff Schedule Updated for Next Week", description: "32 shifts reassigned", clinic: "East Bay", time: "5h ago", unread: false },
  { id: "a7", severity: "info", title: "Discharge Protocol Update Applied", description: "Version 2.4 now active", clinic: "Northside", time: "6h ago", unread: false },
];

type Props = { open: boolean; onClose: () => void; onUnreadChange: (n: number) => void };

export function AlertsPanel({ open, onClose, onUnreadChange }: Props) {
  const [alerts, setAlerts] = useState(seed);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  useEffect(() => {
    onUnreadChange(alerts.filter(a => a.unread).length);
  }, [alerts, onUnreadChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const markAllRead = () => setAlerts(alerts.map(a => ({ ...a, unread: false })));
  const filtered = alerts.filter(a => filter === "all" || a.severity === filter);

  const sevConfig = (s: AlertSeverity) => {
    const map = {
      critical: { color: "var(--wl-red)", Icon: AlertTriangle },
      warning: { color: "var(--wl-yellow)", Icon: AlertTriangle },
      info: { color: "var(--wl-green)", Icon: CheckCircle2 },
    };
    return map[s];
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <aside
        className="fixed top-0 right-0 h-screen w-[380px] bg-[var(--wl-surface)] border-l border-[var(--wl-border)] z-50 transition-transform duration-200 flex flex-col"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="h-12 flex items-center px-4 border-b border-[var(--wl-border)] gap-2">
          <div className="text-sm font-semibold text-[var(--wl-text)]">Notifications</div>
          <button onClick={markAllRead} className="ml-auto text-xs text-[var(--wl-blue)] hover:underline">Mark all as read</button>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"><X size={14} /></button>
        </div>
        <div className="flex border-b border-[var(--wl-border)]">
          {(["all","critical","warning","info"] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-1 h-9 text-xs capitalize border-b-2 transition-colors ${filter === t ? "border-[var(--wl-blue)] text-[var(--wl-text)]" : "border-transparent text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"}`}
            >
              {t === "all" ? "All" : t === "warning" ? "Warnings" : t === "critical" ? "Critical" : "Info"}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--wl-text-2)]">No notifications</div>
          ) : filtered.map(a => {
            const { color, Icon } = sevConfig(a.severity);
            return (
              <div key={a.id} className="p-3 border-b border-[var(--wl-border)] hover:bg-[var(--wl-card)] cursor-pointer flex gap-3">
                <div className="w-7 h-7 shrink-0 rounded flex items-center justify-center" style={{ background: `${color}22`, color }}>
                  <Icon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <div className="text-sm font-semibold text-[var(--wl-text)] truncate">{a.title}</div>
                    {a.unread && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--wl-blue)] shrink-0" />}
                  </div>
                  <div className="text-xs text-[var(--wl-text-2)] truncate">{a.description}</div>
                  <div className="text-[11px] text-[var(--wl-text-2)] mt-1">{a.clinic} · {a.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
