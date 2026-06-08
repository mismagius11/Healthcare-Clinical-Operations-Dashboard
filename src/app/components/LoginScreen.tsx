import { useEffect, useRef, useState } from "react";
import { Activity, Loader2 } from "lucide-react";

type Role = "ops" | "qa";

type Orb = {
  color: string;
  opacity: number;
  r: number;
  speedX: number;
  speedY: number;
  offsetX: number;
  offsetY: number;
  baseX: number;
  baseY: number;
};

export function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [loading, setLoading] = useState<Role | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const colors = ["79,142,247", "41,128,255", "99,102,241", "56,189,248", "79,142,247"];
    const anchors: [number, number][] = [
      [0.25, 0.3], [0.75, 0.25], [0.5, 0.55], [0.2, 0.8], [0.8, 0.75],
    ];

    const orbs: Orb[] = colors.map((color, i) => ({
      color,
      opacity: rand(0.18, 0.28),
      r: rand(350, 600),
      speedX: rand(0.003, 0.007),
      speedY: rand(0.003, 0.007),
      offsetX: Math.random() * Math.PI * 2,
      offsetY: Math.random() * Math.PI * 2,
      baseX: anchors[i][0],
      baseY: anchors[i][1],
    }));

    let t = 0;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const ampX = w * 0.25;
      const ampY = h * 0.25;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#070a12";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "screen";
      for (const o of orbs) {
        const cx = o.baseX * w + Math.sin(t * o.speedX + o.offsetX) * ampX;
        const cy = o.baseY * h + Math.cos(t * o.speedY + o.offsetY) * ampY;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, o.r);
        g.addColorStop(0, `rgba(${o.color},${o.opacity})`);
        g.addColorStop(0.5, `rgba(${o.color},${o.opacity * 0.4})`);
        g.addColorStop(1, `rgba(${o.color},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(cx - o.r, cy - o.r, o.r * 2, o.r * 2);
      }
      ctx.globalCompositeOperation = "source-over";

      const vignette = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      t += 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const signIn = (role: Role) => {
    setLoading(role);
    setTimeout(() => onLogin(role), 800);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: "#0a0a0b", fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="relative z-10 w-[400px] p-8 rounded-xl border" style={{ background: "#0f0f10", borderColor: "rgba(255,255,255,0.08)" }}>
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
