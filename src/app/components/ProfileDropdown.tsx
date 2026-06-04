import { useEffect, useRef } from "react";
import { User, Settings as SettingsIcon, Bell, Keyboard, UserCog, LogOut } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  initials: string;
  name: string;
  roleLabel: string;
  role: "ops" | "qa";
  onRoleChange: (r: "ops" | "qa") => void;
  onNavigateProfile: () => void;
};

export function ProfileDropdown({ open, onClose, initials, name, roleLabel, role, onRoleChange, onNavigateProfile }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    setTimeout(() => document.addEventListener("mousedown", onClick));
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-9 w-64 bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md shadow-xl z-50 overflow-hidden"
    >
      <div className="p-3 flex items-center gap-3 border-b border-[var(--wl-border)]">
        <div className="w-9 h-9 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-sm font-semibold">{initials}</div>
        <div className="min-w-0">
          <div className="text-sm text-[var(--wl-text)] font-semibold truncate">{name}</div>
          <div className="text-[11px] inline-flex px-1.5 py-0.5 rounded bg-[var(--wl-blue)]/15 text-[var(--wl-blue)] mt-0.5">{roleLabel}</div>
        </div>
      </div>
      <div className="py-1">
        <Item icon={User} label="My Profile" onClick={() => { onClose(); onNavigateProfile(); }} />
        <Item icon={SettingsIcon} label="Account Settings" onClick={() => { onClose(); onNavigateProfile(); }} />
        <Item icon={Bell} label="Notification Preferences" onClick={() => { onClose(); onNavigateProfile(); }} />
        <Item icon={Keyboard} label="Keyboard Shortcuts" hint="⌘K" />
      </div>
      <div className="border-t border-[var(--wl-border)] py-2 px-2">
        <div className="text-[10px] uppercase tracking-wider text-[var(--wl-text-2)] px-2 mb-1 flex items-center gap-1"><UserCog size={11} />Switch role</div>
        <div className="grid grid-cols-2 gap-1">
          {(["ops","qa"] as const).map(r => (
            <button
              key={r}
              onClick={() => onRoleChange(r)}
              className={`px-2 py-1.5 rounded text-xs text-left ${role === r ? "bg-[var(--wl-blue)]/15 text-[var(--wl-blue)]" : "text-[var(--wl-text-2)] hover:bg-[var(--wl-surface)]"}`}
            >
              {r === "ops" ? "Ops Manager" : "QA Lead"}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-[var(--wl-border)] py-1">
        <Item icon={LogOut} label="Sign Out" danger />
      </div>
    </div>
  );
}

function Item({ icon: Icon, label, hint, danger, onClick }: { icon: any; label: string; hint?: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--wl-surface)] ${danger ? "text-[var(--wl-red)]" : "text-[var(--wl-text)]"}`}>
      <Icon size={13} />
      <span className="flex-1 text-left">{label}</span>
      {hint && <span className="text-[10px] text-[var(--wl-text-2)] border border-[var(--wl-border)] rounded px-1">{hint}</span>}
    </button>
  );
}
