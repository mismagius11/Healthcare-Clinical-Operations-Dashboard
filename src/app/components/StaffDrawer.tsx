import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { clinics } from "./data";

export type StaffRow = {
  name: string;
  role: string;
  clinic: string;
  dept: string;
  projects: number;
  patients: number | string;
  status: string;
  email?: string;
  phone?: string;
  notes?: string;
};

type Props = {
  open: boolean;
  mode: "edit" | "create";
  initial?: StaffRow | null;
  onClose: () => void;
  onSave: (row: StaffRow) => void;
  onDelete?: (row: StaffRow) => void;
};

const roles = ["Ops Manager", "QA Lead", "Physician", "Analyst", "Coordinator", "Nurse"];
const departments = ["Operations", "Quality", "Analytics", "ICU", "Cardiology", "Oncology", "Surgery", "Emergency", "General Ward", "Radiology"];
const statuses = ["On Duty", "Training", "Off Duty", "On Leave", "Inactive"];

const empty: StaffRow = { name: "", role: "Coordinator", clinic: clinics[0], dept: "Operations", projects: 0, patients: 0, status: "On Duty", email: "", phone: "", notes: "" };

export function StaffDrawer({ open, mode, initial, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<StaffRow>(empty);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...empty, ...initial } : empty);
      setConfirming(false);
    }
  }, [open, initial]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const initials = form.name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() || "?";
  const title = mode === "edit" ? "Edit Staff Member" : "Create Staff Member";

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <aside
        className="fixed top-0 right-0 h-screen w-[480px] max-w-full bg-[var(--wl-surface)] border-l border-[var(--wl-border)] z-50 transition-transform duration-200 flex flex-col"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="h-12 flex items-center px-4 border-b border-[var(--wl-border)]">
          <div className="text-sm font-semibold text-[var(--wl-text)]">{title}</div>
          <button onClick={onClose} className="ml-auto w-6 h-6 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"><X size={14} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-lg font-semibold">{initials}</div>
            <button className="text-xs px-2 py-1 border border-[var(--wl-border)] rounded text-[var(--wl-text-2)] hover:text-[var(--wl-text)]">Change avatar</button>
          </div>
          <Field label="Full Name"><Input value={form.name} onChange={v => setForm({ ...form, name: v })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Role"><Select value={form.role} options={roles} onChange={v => setForm({ ...form, role: v })} /></Field>
            <Field label="Department"><Select value={form.dept} options={departments} onChange={v => setForm({ ...form, dept: v })} /></Field>
          </div>
          <Field label="Clinic"><Select value={form.clinic} options={clinics} onChange={v => setForm({ ...form, clinic: v })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email"><Input value={form.email || ""} onChange={v => setForm({ ...form, email: v })} placeholder="name@wellora.health" /></Field>
            <Field label="Phone"><Input value={form.phone || ""} onChange={v => setForm({ ...form, phone: v })} placeholder="+1 (555) 010-0000" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Status"><Select value={form.status} options={statuses} onChange={v => setForm({ ...form, status: v })} /></Field>
            <Field label="Projects"><Input value={String(form.projects)} onChange={v => setForm({ ...form, projects: Number(v) || 0 })} /></Field>
            <Field label="Patients"><Input value={String(form.patients)} onChange={v => setForm({ ...form, patients: v === "—" ? "—" : (Number(v) || 0) })} /></Field>
          </div>
          <Field label="Notes">
            <textarea
              value={form.notes || ""}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]"
            />
          </Field>
        </div>
        <div className="border-t border-[var(--wl-border)] p-3 flex gap-2">
          {mode === "edit" && onDelete && initial && (
            <button
              onClick={() => setConfirming(true)}
              className="text-xs px-3 py-2 border border-[var(--wl-red)]/40 text-[var(--wl-red)] rounded hover:bg-[var(--wl-red)]/10"
            >
              Delete
            </button>
          )}
          <button onClick={onClose} className="ml-auto text-xs px-3 py-2 border border-[var(--wl-border)] text-[var(--wl-text)] rounded">Cancel</button>
          <button
            onClick={() => onSave(form)}
            disabled={!form.name.trim()}
            className="text-xs px-3 py-2 bg-[var(--wl-blue)] text-white rounded disabled:opacity-50"
          >
            {mode === "edit" ? "Save Changes" : "Add Member"}
          </button>
        </div>

        {confirming && initial && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
            <div className="bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md p-4 w-full max-w-sm">
              <div className="text-sm font-semibold text-[var(--wl-text)] mb-1">Delete staff member?</div>
              <div className="text-xs text-[var(--wl-text-2)] mb-4">This action cannot be undone. {initial.name} will be removed from all assigned projects and patient lists.</div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setConfirming(false)} className="text-xs px-3 py-2 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Cancel</button>
                <button onClick={() => onDelete?.(initial)} className="text-xs px-3 py-2 bg-[var(--wl-red)] text-white rounded">Confirm Delete</button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wide text-[var(--wl-text-2)] mb-1">{label}</div>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]"
    />
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
