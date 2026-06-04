import { useEffect, useState } from "react";
import { X, ChevronDown } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

const shortcuts: [string, string][] = [
  ["Open search", "⌘K"],
  ["Toggle sidebar", "⌘B"],
  ["Go to Dashboard", "⌘1"],
  ["Go to Projects", "⌘2"],
  ["Go to Issues", "⌘3"],
  ["Go to Reports", "⌘R"],
  ["Close any panel", "Esc"],
];

const sections: { name: string; desc: string }[] = [
  { name: "Dashboard", desc: "Overview of all KPIs, patient flow, and recent activity" },
  { name: "Projects", desc: "Track clinical improvement projects with risk levels and cycle times" },
  { name: "Issues", desc: "Monitor and manage QA incidents and operational flags" },
  { name: "Patients", desc: "Real-time patient flow, admissions, discharges, and ALOS" },
  { name: "Bed Occupancy", desc: "Capacity monitoring with per-clinic breakdown and alerts" },
  { name: "Reports", desc: "Performance analytics with export and sharing capabilities" },
  { name: "Staff", desc: "Team management and clinical staff directory" },
  { name: "AI Insights", desc: "AI-powered analysis and recommendations" },
];

const legend: { color: string; name: string; desc: string }[] = [
  { color: "var(--wl-red)", name: "Critical", desc: "Requires immediate action" },
  { color: "var(--wl-yellow)", name: "Watch / Warning", desc: "Monitor closely, approaching threshold" },
  { color: "var(--wl-green)", name: "OK / Normal", desc: "Within acceptable range" },
  { color: "var(--wl-blue)", name: "Info", desc: "Informational, no action required" },
];

export function HelpPanel({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else {
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9998]" onClick={onClose}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        onClick={e => e.stopPropagation()}
        className={`absolute right-0 top-0 h-full w-[360px] bg-[var(--wl-surface)] border-l border-[var(--wl-border)] flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-12 flex items-center px-4 border-b border-[var(--wl-border)] shrink-0">
          <div className="text-sm font-semibold text-[var(--wl-text)]">Help & Quick Reference</div>
          <button onClick={onClose} className="ml-auto w-6 h-6 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"><X size={14} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
          <Section title="Getting Started">
            <ul className="text-xs text-[var(--wl-text-2)] space-y-1.5 list-disc pl-4">
              <li>This dashboard provides real-time clinical operations data across 5 clinics</li>
              <li>Use the sidebar to navigate between sections</li>
              <li>Switch between Ops Manager and QA Lead views using the role selector</li>
            </ul>
          </Section>

          <Section title="Keyboard Shortcuts">
            <table className="w-full text-xs">
              <tbody>
                {shortcuts.map(([a, s]) => (
                  <tr key={a} className="border-t border-[var(--wl-border)] first:border-t-0">
                    <td className="py-1.5 text-[var(--wl-text-2)]">{a}</td>
                    <td className="py-1.5 text-right"><span className="text-[10px] text-[var(--wl-text)] border border-[var(--wl-border)] rounded px-1.5 py-0.5">{s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Dashboard Sections">
            <div className="space-y-1">
              {sections.map(s => {
                const open = expanded === s.name;
                return (
                  <div key={s.name} className="border border-[var(--wl-border)] rounded">
                    <button onClick={() => setExpanded(open ? null : s.name)} className="w-full flex items-center justify-between px-3 py-2 text-xs text-[var(--wl-text)]">
                      {s.name}
                      <ChevronDown size={12} className={`text-[var(--wl-text-2)] transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <div className="px-3 pb-2 text-xs text-[var(--wl-text-2)]">{s.desc}</div>}
                  </div>
                );
              })}
            </div>
          </Section>

          <Section title="Status Legend">
            <div className="space-y-2">
              {legend.map(l => (
                <div key={l.name} className="flex items-center gap-2 text-xs">
                  <span className="inline-flex w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                  <span className="text-[var(--wl-text)] font-medium">{l.name}:</span>
                  <span className="text-[var(--wl-text-2)]">{l.desc}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Support">
            <div className="text-xs text-[var(--wl-text-2)] space-y-1">
              <div>For technical issues contact: <span className="text-[var(--wl-blue)]">support@wellora.health</span></div>
              <div>Documentation: <span className="text-[var(--wl-blue)]">docs.wellora.health</span></div>
            </div>
          </Section>
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--wl-text-2)] mb-2">{title}</div>
      {children}
    </div>
  );
}
