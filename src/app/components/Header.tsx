import { useState } from "react";
import { Search, Sun, Moon, Bell, HelpCircle, ChevronRight } from "lucide-react";
import { ProfileDropdown } from "./ProfileDropdown";

type Props = {
  pageLabel: string;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  initials: string;
  name: string;
  role: "ops" | "qa";
  onRoleChange: (r: "ops" | "qa") => void;
  unreadCount: number;
  onOpenAlerts: () => void;
  onNavigateProfile: () => void;
};

export function Header({ pageLabel, theme, onToggleTheme, initials, name, role, onRoleChange, unreadCount, onOpenAlerts, onNavigateProfile }: Props) {
  const [profileOpen, setProfileOpen] = useState(false);
  const roleLabel = role === "ops" ? "Ops Manager" : "QA Lead";

  return (
    <header className="h-12 border-b border-[var(--wl-border)] bg-[var(--wl-surface)] flex items-center px-4 gap-3 shrink-0 relative">
      <div className="flex items-center gap-1.5 text-xs text-[var(--wl-text-2)]">
        <span>Wellora</span>
        <ChevronRight size={12} />
        <span className="text-[var(--wl-text)]">{pageLabel}</span>
      </div>

      <div className="ml-auto flex items-center gap-2 relative">
        <div className="relative">
          <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--wl-text-2)]" />
          <input
            placeholder="Search…"
            className="h-7 w-64 pl-7 pr-12 bg-[var(--wl-card)] border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[var(--wl-text-2)] border border-[var(--wl-border)] rounded px-1">⌘K</span>
        </div>
        <button onClick={onToggleTheme} className="w-7 h-7 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)] border border-[var(--wl-border)] rounded">
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
        </button>
        <button onClick={onOpenAlerts} className="relative w-7 h-7 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)] border border-[var(--wl-border)] rounded">
          <Bell size={13} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[var(--wl-red)] text-white text-[9px] flex items-center justify-center font-semibold">
              {unreadCount}
            </span>
          )}
        </button>
        <button className="w-7 h-7 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)] border border-[var(--wl-border)] rounded">
          <HelpCircle size={13} />
        </button>
        <div className="relative">
          <button
            onClick={() => setProfileOpen(o => !o)}
            className="w-7 h-7 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-[11px] font-semibold hover:ring-2 ring-[var(--wl-blue)]/30"
          >
            {initials}
          </button>
          <ProfileDropdown
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            initials={initials}
            name={name}
            roleLabel={roleLabel}
            role={role}
            onRoleChange={onRoleChange}
            onNavigateProfile={onNavigateProfile}
          />
        </div>
      </div>
    </header>
  );
}
