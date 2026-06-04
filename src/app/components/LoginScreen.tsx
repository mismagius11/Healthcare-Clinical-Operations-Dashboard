import { useState } from "react";
import { Activity, Loader2 } from "lucide-react";

type Role = "ops" | "qa";

export function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [loading, setLoading] = useState<Role | null>(null);

  const signIn = (role: Role) => {
    setLoading(role);
    setTimeout(() => onLogin(role), 800);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: "#0a0a0b", fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <div className="w-[400px] p-8 rounded-xl border" style={{ background: "#0f0f10", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded bg-[#4f8ef7] flex items-center justify-center"><Activity size={18} color="#fff" /></div>
          <span className="text-xl font-semibold tracking-tight text-[#ededed]">Wellora</span>
        </div>
        <div className="text-sm text-[#a1a1aa] mb-6">Clinical Operations Platform</div>
        <div className="h-px bg-white/10 mb-6" />

        <div className="space-y-2">
          <RoleButton role="ops" initials="SM" name="Sarah Mitchell" sub="Ops Manager" primary loading={loading === "ops"} onClick={() => signIn("ops")} disabled={!!loading} />
          <RoleButton role="qa" initials="JK" name="Dr. James Kim" sub="QA Lead" loading={loading === "qa"} onClick={() => signIn("qa")} disabled={!!loading} />
        </div>

        <div className="mt-6 text-[11px] text-center text-[#71717a]">Demo environment — no real data</div>
      </div>
    </div>
  );
}

function RoleButton({ role, initials, name, sub, primary, loading, disabled, onClick }: { role: Role; initials: string; name: string; sub: string; primary?: boolean; loading: boolean; disabled: boolean; onClick: () => void }) {
  const color = role === "ops" ? "#4f8ef7" : "#a855f7";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${primary ? "bg-[#4f8ef7] hover:bg-[#4080e5] text-white" : "border border-white/10 hover:bg-white/5 text-[#ededed]"} disabled:opacity-70`}
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold" style={{ background: primary ? "rgba(255,255,255,0.2)" : `${color}33`, color: primary ? "#fff" : color }}>{initials}</div>
      <div className="flex-1 text-left">
        <div className="text-sm font-semibold">Sign in as {name}</div>
        <div className={`text-[11px] ${primary ? "text-white/80" : "text-[#a1a1aa]"}`}>{sub}</div>
      </div>
      {loading && <Loader2 size={14} className="animate-spin" />}
    </button>
  );
}
