import { LayoutDashboard, FolderKanban, AlertCircle, Users, BedDouble, BarChart3, UserCog, Sparkles, Settings, ChevronsLeft, ChevronsRight, Activity } from "lucide-react";

export type PageKey = "dashboard" | "projects" | "issues" | "patients" | "beds" | "reports" | "staff" | "ai" | "settings";

const sections: { title: string; items: { key: PageKey; label: string; icon: any; badge?: { text: string; tone: "red" | "yellow" } }[] }[] = [
  { title: "Overview", items: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "issues", label: "Issues", icon: AlertCircle, badge: { text: "3", tone: "red" } },
  ]},
  { title: "Clinical", items: [
    { key: "patients", label: "Patients", icon: Users, badge: { text: "142", tone: "yellow" } },
    { key: "beds", label: "Bed Occupancy", icon: BedDouble },
  ]},
  { title: "Analytics", items: [
    { key: "reports", label: "Reports", icon: BarChart3 },
    { key: "staff", label: "Staff", icon: UserCog },
    { key: "ai", label: "AI Insights", icon: Sparkles },
  ]},
  { title: "System", items: [
    { key: "settings", label: "Settings", icon: Settings },
  ]},
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  page: PageKey;
  onNavigate: (p: PageKey) => void;
  role: "ops" | "qa";
  onRoleChange: (r: "ops" | "qa") => void;
};

export function Sidebar({ collapsed, onToggle, page, onNavigate, role, onRoleChange }: Props) {
  const initials = role === "ops" ? "SM" : "JK";
  return (
    <aside
      className="relative h-screen border-r border-[var(--wl-border)] bg-[var(--wl-surface)] flex flex-col transition-all duration-200 shrink-0"
      style={{ width: collapsed ? 48 : 216 }}
    >
      <div className="h-12 flex items-center gap-2 px-3 border-b border-[var(--wl-border)]">
        <div className="w-6 h-6 rounded bg-[var(--wl-blue)] flex items-center justify-center shrink-0">
          <Activity size={14} color="#fff" />
        </div>
        {!collapsed && (
          <span className="text-[var(--wl-text)] font-semibold tracking-tight">Wellora</span>
        )}
      </div>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-14 z-10 w-6 h-6 rounded-full border border-[var(--wl-border)] bg-[var(--wl-card)] flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"
      >
        {collapsed ? <ChevronsRight size={12} /> : <ChevronsLeft size={12} />}
      </button>

      <nav className="flex-1 overflow-y-auto py-3">
        {sections.map((s) => (
          <div key={s.title} className="mb-3">
            {!collapsed && (
              <div className="px-3 mb-1 text-[10px] uppercase tracking-wider text-[var(--wl-text-2)]">{s.title}</div>
            )}
            {s.items.map((it) => {
              const Icon = it.icon;
              const active = page === it.key;
              return (
                <button
                  key={it.key}
                  onClick={() => onNavigate(it.key)}
                  className={`w-full flex items-center gap-2 px-3 h-8 text-sm transition-colors ${
                    active ? "bg-[var(--wl-card)] text-[var(--wl-text)] border-l-2 border-[var(--wl-blue)]" : "text-[var(--wl-text-2)] hover:text-[var(--wl-text)] hover:bg-[var(--wl-card)]"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  {!collapsed && <span className="flex-1 text-left truncate">{it.label}</span>}
                  {!collapsed && it.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      it.badge.tone === "red" ? "bg-[var(--wl-red)]/15 text-[var(--wl-red)]" : "bg-[var(--wl-yellow)]/15 text-[var(--wl-yellow)]"
                    }`}>{it.badge.text}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--wl-border)] p-2">
        {collapsed ? (
          <div className="w-7 h-7 mx-auto rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-[11px] font-semibold">{initials}</div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-[11px] font-semibold">{initials}</div>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value as any)}
              className="flex-1 bg-transparent text-xs text-[var(--wl-text)] border border-[var(--wl-border)] rounded px-1.5 py-1 outline-none"
            >
              <option value="ops">Ops Manager</option>
              <option value="qa">QA Lead</option>
            </select>
          </div>
        )}
      </div>
    </aside>
  );
}
