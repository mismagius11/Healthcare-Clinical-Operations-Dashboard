import { useEffect, useMemo, useRef, useState } from "react";
import { Search, LayoutDashboard, FolderKanban, AlertCircle, Users, BedDouble, BarChart3, UserCog, Sparkles, Settings, Plus, FileDown } from "lucide-react";
import { staff as staffData, projects as projectsData } from "./data";

type PageKey = "dashboard" | "projects" | "issues" | "patients" | "beds" | "reports" | "staff" | "ai" | "settings";

type Item = { id: string; group: string; label: string; sub?: string; icon: any; action: () => void };

type Props = {
  open: boolean;
  onClose: () => void;
  onNavigate: (p: PageKey) => void;
  onAction: (a: "new-issue" | "add-staff" | "new-project" | "generate-report") => void;
  recent: PageKey[];
};

const pages: { key: PageKey; label: string; icon: any }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Projects", icon: FolderKanban },
  { key: "issues", label: "Issues", icon: AlertCircle },
  { key: "patients", label: "Patient Flow", icon: Users },
  { key: "beds", label: "Bed Occupancy", icon: BedDouble },
  { key: "reports", label: "Reports", icon: BarChart3 },
  { key: "staff", label: "Staff", icon: UserCog },
  { key: "ai", label: "AI Insights", icon: Sparkles },
  { key: "settings", label: "Settings", icon: Settings },
];

export function CommandPalette({ open, onClose, onNavigate, onAction, recent }: Props) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 10); }
  }, [open]);

  const items: Item[] = useMemo(() => {
    const list: Item[] = [];
    pages.forEach(p => list.push({ id: `p-${p.key}`, group: "Pages", label: p.label, icon: p.icon, action: () => onNavigate(p.key) }));
    recent.forEach(r => {
      const p = pages.find(x => x.key === r);
      if (p) list.push({ id: `r-${p.key}`, group: "Recent", label: p.label, icon: p.icon, action: () => onNavigate(p.key) });
    });
    list.push(
      { id: "a-issue", group: "Actions", label: "Report new issue", icon: Plus, action: () => onAction("new-issue") },
      { id: "a-staff", group: "Actions", label: "Add staff member", icon: Plus, action: () => onAction("add-staff") },
      { id: "a-project", group: "Actions", label: "New project", icon: Plus, action: () => onAction("new-project") },
      { id: "a-report", group: "Actions", label: "Generate report", icon: FileDown, action: () => onAction("generate-report") },
    );
    staffData.forEach(s => list.push({ id: `s-${s.name}`, group: "Staff", label: s.name, sub: `${s.role} · ${s.clinic}`, icon: UserCog, action: () => onNavigate("staff") }));
    projectsData.forEach(p => list.push({ id: `pr-${p.name}`, group: "Projects", label: p.name, sub: `${p.owner} · ${p.clinic}`, icon: FolderKanban, action: () => onNavigate("projects") }));
    const ql = q.toLowerCase();
    if (!ql) return list;
    return list.filter(i => i.label.toLowerCase().includes(ql) || (i.sub ?? "").toLowerCase().includes(ql));
  }, [q, recent, onNavigate, onAction]);

  useEffect(() => { setIdx(0); }, [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(items.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
      if (e.key === "Enter") {
        const it = items[idx];
        if (it) { it.action(); onClose(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, idx, onClose]);

  if (!open) return null;

  const grouped: Record<string, Item[]> = {};
  items.forEach(i => { (grouped[i.group] ??= []).push(i); });

  let flat = 0;
  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] p-4 bg-black/60" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-[560px] bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: "70vh" }}>
        <div className="flex items-center gap-2 px-3 h-11 border-b border-[var(--wl-border)]">
          <Search size={14} className="text-[var(--wl-text-2)]" />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search pages, projects, staff, actions…" className="flex-1 bg-transparent outline-none text-sm text-[var(--wl-text)]" />
          <span className="text-[10px] text-[var(--wl-text-2)] border border-[var(--wl-border)] rounded px-1">Esc</span>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {items.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[var(--wl-text-2)]">No results</div>
          ) : Object.entries(grouped).map(([group, list]) => (
            <div key={group} className="mb-2">
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[var(--wl-text-2)]">{group}</div>
              {list.map(it => {
                const active = flat === idx;
                const myIdx = flat++;
                return (
                  <button
                    key={it.id}
                    onMouseEnter={() => setIdx(myIdx)}
                    onClick={() => { it.action(); onClose(); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left ${active ? "bg-white/[0.06]" : ""}`}
                  >
                    <it.icon size={13} className="text-[var(--wl-text-2)] shrink-0" />
                    <span className="flex-1 text-sm text-[var(--wl-text)] truncate">{it.label}</span>
                    {it.sub && <span className="text-[11px] text-[var(--wl-text-2)] truncate">{it.sub}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--wl-border)] px-3 py-1.5 flex items-center gap-3 text-[10px] text-[var(--wl-text-2)]">
          <span>↑↓ navigate</span><span>↵ select</span><span className="ml-auto">esc close</span>
        </div>
      </div>
    </div>
  );
}
