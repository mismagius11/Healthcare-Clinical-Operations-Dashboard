import { useEffect, useState } from "react";
import { X, CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "./ui-bits";
import { issues } from "./data";

export type ProjectDetail = {
  name: string; status: string; risk: string; owner: string; clinic: string; updated: string;
  dept: string; start: string; target: string; cycle: string; alos: string;
  progress: number; objectives: string;
  milestones: { name: string; due: string; state: "done"|"active"|"pending" }[];
  team: { name: string; role: string; clinic: string; contribution: "Lead"|"Contributor"|"Reviewer" }[];
  activity: { who: string; what: string; when: string }[];
  metrics: { cycleActual: string; cycleTarget: string; issuesFound: number; staff: number; compliance: string };
  riskNote: string; mitigation: string;
};

export function buildProjectDetail(p: any): ProjectDetail {
  const map: Record<string, Partial<ProjectDetail>> = {
    "ICU Protocol Standardization": {
      dept: "ICU / Operations", start: "Feb 15, 2025", target: "Apr 15, 2025", progress: 65, alos: "+0.3d",
      objectives: "Standardize medication dosage protocols across all ICU units to reduce deviation incidents and improve response consistency.",
      milestones: [
        { name: "Initial audit completed", due: "Mar 5", state: "done" },
        { name: "Protocol draft reviewed", due: "Mar 12", state: "done" },
        { name: "Staff training sessions", due: "Mar 28", state: "active" },
        { name: "Final QA sign-off", due: "Apr 10", state: "pending" },
      ],
    },
    "Discharge Workflow Automation": {
      dept: "Operations", start: "Jan 20, 2025", target: "Mar 31, 2025", progress: 78, alos: "-0.2d",
      objectives: "Automate discharge documentation to reduce average processing time from 4.1 to 2.5 hours, freeing bed capacity faster.",
      milestones: [
        { name: "Requirements", due: "Feb 5", state: "done" },
        { name: "Dev complete", due: "Mar 1", state: "done" },
        { name: "UAT testing", due: "Mar 20", state: "active" },
        { name: "Go-live", due: "Mar 31", state: "pending" },
      ],
    },
    "Patient Record Sync v2": {
      dept: "Analytics / IT", start: "Feb 1, 2025", target: "Apr 1, 2025", progress: 85, alos: "0d",
      objectives: "Upgrade patient record synchronization between EHR systems to eliminate data lag and reduce manual entry errors.",
      milestones: [
        { name: "Architecture", due: "Feb 10", state: "done" },
        { name: "Backend", due: "Mar 1", state: "done" },
        { name: "Frontend", due: "Mar 20", state: "done" },
        { name: "Testing", due: "Apr 1", state: "active" },
      ],
    },
    "Readmission Reduction": {
      dept: "QA / Clinical", start: "Jan 10, 2025", target: "Mar 15, 2025", progress: 45, alos: "+0.5d",
      objectives: "Implement post-discharge follow-up protocol to reduce 30-day readmission rate from 8.6% to below 7% target.",
      milestones: [
        { name: "Patient selection", due: "Feb 1", state: "done" },
        { name: "Protocol design", due: "Feb 20", state: "active" },
        { name: "Staff briefing", due: "Mar 5", state: "pending" },
        { name: "Monitoring", due: "Mar 15", state: "pending" },
      ],
    },
    "Lab Result Pipeline": {
      dept: "Operations / Lab", start: "Feb 20, 2025", target: "Mar 30, 2025", progress: 90, alos: "-0.1d",
      objectives: "Optimize lab result delivery pipeline to reduce average turnaround from 52 hours to under 24 hours.",
      milestones: [
        { name: "Audit", due: "Feb 28", state: "done" },
        { name: "Process redesign", due: "Mar 10", state: "done" },
        { name: "System config", due: "Mar 20", state: "done" },
        { name: "Final testing", due: "Mar 30", state: "active" },
      ],
    },
    "ER Triage Optimization": {
      dept: "Emergency", start: "Feb 10, 2025", target: "Apr 20, 2025", progress: 55, alos: "-0.4d",
      objectives: "Redesign ER triage workflow to reduce average wait time from 2.5 hours to under 45 minutes using acuity-based prioritization.",
      milestones: [
        { name: "Current state audit", due: "Feb 25", state: "done" },
        { name: "New protocol design", due: "Mar 10", state: "done" },
        { name: "Staff training", due: "Mar 30", state: "active" },
        { name: "Live monitoring", due: "Apr 20", state: "pending" },
      ],
    },
  };
  const extra = map[p.name] ?? {
    dept: "—", start: "Feb 1, 2025", target: "Apr 30, 2025", progress: 50, alos: p.alos ?? "0d",
    objectives: "Improve clinical outcomes through targeted operational changes.",
    milestones: [
      { name: "Kickoff", due: "Feb 1", state: "done" as const },
      { name: "Design", due: "Mar 1", state: "active" as const },
      { name: "Implementation", due: "Apr 1", state: "pending" as const },
      { name: "Review", due: "Apr 30", state: "pending" as const },
    ],
  };
  return {
    name: p.name, status: p.status, risk: p.risk, owner: p.owner, clinic: p.clinic, updated: p.updated,
    cycle: p.cycle,
    ...(extra as any),
    team: [
      { name: p.owner, role: "Project Lead", clinic: p.clinic, contribution: "Lead" },
      { name: "Maya Patel", role: "Nurse Manager", clinic: p.clinic, contribution: "Contributor" },
      { name: "Dr. James Kim", role: "QA Lead", clinic: p.clinic, contribution: "Reviewer" },
    ],
    activity: [
      { who: "Sarah Mitchell", what: "updated the protocol draft", when: "2h ago" },
      { who: "Dr. James Kim", what: "flagged a QA concern", when: "1d ago" },
      { who: "System", what: "Milestone 2 marked complete", when: "Mar 12" },
      { who: "Maria Torres", what: "added new test cases", when: "Mar 10" },
      { who: "Amir Chen", what: "uploaded audit report", when: "Mar 7" },
    ],
    metrics: { cycleActual: p.cycle, cycleTarget: "4.5d", issuesFound: 3, staff: 8, compliance: "92%" },
    riskNote: p.risk === "High" ? "Tight timeline with cross-team dependencies; deviations could delay sign-off." : p.risk === "Medium" ? "Moderate exposure on UAT phase; mitigated by parallel test tracks." : "Low complexity, well-scoped deliverables.",
    mitigation: "Weekly checkpoint with clinic ops; escalation path defined to QA Lead.",
  };
}

function statusTone(s: string) {
  return s === "On Track" ? "green" : s === "At Risk" ? "yellow" : s === "Delayed" ? "red" : "neutral";
}
function riskTone(r: string) {
  return r === "High" ? "red" : r === "Medium" ? "yellow" : "green";
}

export function ProjectDetailModal({ project, onClose }: { project: any | null; onClose: () => void }) {
  const [tab, setTab] = useState<"overview"|"timeline"|"team">("overview");

  useEffect(() => {
    if (!project) return;
    setTab("overview");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  if (!project) return null;
  const d = buildProjectDetail(project);
  const ownerInitials = d.owner.split(" ").map(s => s[0]).slice(0,2).join("");
  const linkedIssues = issues.filter(i => i.clinic === d.clinic).slice(0, 4);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="flex flex-col max-h-[90vh] w-full"
        style={{ maxWidth: 680, background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
      >
        <div className="px-5 pt-5 pb-3 border-b border-[var(--wl-border)] shrink-0">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-[20px] font-semibold text-[var(--wl-text)] tracking-tight">{d.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge tone={statusTone(d.status) as any}>{d.status}</Badge>
                <Badge tone={riskTone(d.risk) as any}>{d.risk} Risk</Badge>
                <span className="text-[12px] text-[var(--wl-text-2)]">Last updated {d.updated}</span>
              </div>
            </div>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"><X size={14} /></button>
          </div>
          <div className="flex gap-1 mt-4">
            {(["overview","timeline","team"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 h-8 text-xs rounded ${tab === t ? "bg-[var(--wl-blue)] text-white" : "text-[var(--wl-text-2)] hover:text-[var(--wl-text)] hover:bg-white/5"}`}>
                {t === "overview" ? "Overview" : t === "timeline" ? "Timeline" : "Team & Issues"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "overview" && <Overview d={d} ownerInitials={ownerInitials} />}
          {tab === "timeline" && <Timeline />}
          {tab === "team" && <TeamIssues d={d} linkedIssues={linkedIssues} />}
        </div>

        <div className="px-5 py-3 border-t border-[var(--wl-border)] flex items-center justify-between shrink-0">
          <div className="text-[11px] text-[var(--wl-text-2)]">Created {d.start} · Last modified {d.updated}</div>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 border border-[var(--wl-border)] rounded text-[var(--wl-text)] hover:bg-white/5">Edit Project</button>
            <button onClick={onClose} className="text-xs px-3 py-1.5 text-[var(--wl-text-2)] hover:text-[var(--wl-text)] rounded">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div className="flex justify-between py-1.5 text-[13px] border-b border-[var(--wl-border)] last:border-0">
      <span className="text-[var(--wl-text-2)]">{label}</span>
      <span style={{ color: valueColor ?? "var(--wl-text)" }}>{value}</span>
    </div>
  );
}

function Overview({ d, ownerInitials }: { d: ProjectDetail; ownerInitials: string }) {
  const alosColor = d.alos.startsWith("-") ? "var(--wl-green)" : d.alos === "0d" ? "var(--wl-text)" : "var(--wl-red)";
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-5">
        <Section title="Project Details">
          <Row label="Clinic" value={d.clinic} />
          <Row label="Owner" value={
            <span className="inline-flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-[10px] font-semibold">{ownerInitials}</span>
              {d.owner}
            </span>
          } />
          <Row label="Department" value={d.dept} />
          <Row label="Start Date" value={d.start} />
          <Row label="Target Completion" value={d.target} />
          <Row label="Actual Cycle Time" value={d.cycle} />
          <Row label="ALOS Impact" value={d.alos} valueColor={alosColor} />
        </Section>
        <Section title="Objectives">
          <p className="text-[13px] text-[var(--wl-text-2)] leading-relaxed">{d.objectives}</p>
        </Section>
      </div>
      <div className="space-y-5">
        <Section title="Progress">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-white/5 rounded">
              <div className="h-full rounded bg-[var(--wl-blue)]" style={{ width: `${d.progress}%` }} />
            </div>
            <span className="text-[12px] text-[var(--wl-text)] font-medium">{d.progress}%</span>
          </div>
          <div className="space-y-1.5 mt-3">
            {d.milestones.map(m => {
              const Icon = m.state === "done" ? CheckCircle2 : m.state === "active" ? Clock : Circle;
              const color = m.state === "done" ? "var(--wl-green)" : m.state === "active" ? "var(--wl-blue)" : "var(--wl-text-2)";
              const label = m.state === "done" ? "Completed" : m.state === "active" ? "In Progress" : "Pending";
              const tone = m.state === "done" ? "green" : m.state === "active" ? "blue" : "neutral";
              return (
                <div key={m.name} className="flex items-center gap-2 text-[12px]">
                  <Icon size={14} style={{ color }} />
                  <span className="flex-1 text-[var(--wl-text)] truncate">{m.name}</span>
                  <span className="text-[var(--wl-text-2)]">{m.due}</span>
                  <Badge tone={tone as any}>{label}</Badge>
                </div>
              );
            })}
          </div>
        </Section>
        <Section title="Risk Assessment">
          <div className="flex items-center gap-2 mb-2"><Badge tone={riskTone(d.risk) as any}>{d.risk}</Badge></div>
          <p className="text-[12px] text-[var(--wl-text-2)] leading-relaxed">{d.riskNote}</p>
          <p className="text-[12px] text-[var(--wl-text-2)] leading-relaxed mt-1.5"><span className="text-[var(--wl-text)] font-medium">Mitigation: </span>{d.mitigation}</p>
        </Section>
        <Section title="Key Metrics">
          <div className="grid grid-cols-2 gap-2">
            <Stat label="Cycle Time" value={`${d.metrics.cycleActual} / ${d.metrics.cycleTarget}`} />
            <Stat label="Issues Found" value={String(d.metrics.issuesFound)} />
            <Stat label="Staff Involved" value={String(d.metrics.staff)} />
            <Stat label="Compliance" value={d.metrics.compliance} />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--wl-text-2)] mb-2 font-semibold">{title}</div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded p-2">
      <div className="text-[10px] uppercase tracking-wider text-[var(--wl-text-2)]">{label}</div>
      <div className="text-[15px] font-semibold text-[var(--wl-text)] mt-0.5">{value}</div>
    </div>
  );
}

const phases = [
  { name: "Planning & Audit", start: 0, end: 18, state: "done" },
  { name: "Protocol Design", start: 15, end: 38, state: "done" },
  { name: "Stakeholder Review", start: 35, end: 52, state: "done" },
  { name: "Staff Training", start: 48, end: 72, state: "active" },
  { name: "Implementation", start: 65, end: 88, state: "pending" },
  { name: "QA Sign-off", start: 85, end: 100, state: "pending" },
];

function Timeline() {
  const months = ["Jan", "Feb", "Mar", "Apr"];
  const today = 62;
  return (
    <div>
      <Section title="Project Timeline">
        <div className="border border-[var(--wl-border)] rounded p-3">
          <div className="grid grid-cols-[140px_1fr] gap-2 mb-2">
            <div></div>
            <div className="relative grid grid-cols-4 text-[11px] text-[var(--wl-text-2)]">
              {months.map(m => <div key={m} className="border-l border-[var(--wl-border)] pl-2">{m}</div>)}
            </div>
          </div>
          <div className="space-y-2">
            {phases.map(p => {
              const color = p.state === "done" ? "var(--wl-green)" : p.state === "active" ? "var(--wl-blue)" : "var(--wl-text-2)";
              return (
                <div key={p.name} className="grid grid-cols-[140px_1fr] gap-2 items-center">
                  <div className="text-[12px] text-[var(--wl-text)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                    {p.name}
                  </div>
                  <div className="relative h-6 bg-white/[0.03] rounded">
                    <div className="absolute top-1 bottom-1 rounded" style={{ left: `${p.start}%`, width: `${p.end - p.start}%`, background: `${color}55`, border: `1px solid ${color}` }} />
                    <div className="absolute top-0 bottom-0 border-l border-dashed border-[var(--wl-red)]" style={{ left: `${today}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-[var(--wl-text-2)]">
            <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--wl-green)]" />Done</span>
            <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--wl-blue)]" />Active</span>
            <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--wl-text-2)]" />Pending</span>
            <span className="ml-auto inline-flex items-center gap-1"><span className="inline-block w-3 border-t border-dashed border-[var(--wl-red)]" />Today</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function TeamIssues({ d, linkedIssues }: { d: ProjectDetail; linkedIssues: typeof issues }) {
  return (
    <div className="space-y-5">
      <Section title="Team Members">
        <div className="space-y-1.5">
          {d.team.map(t => {
            const initials = t.name.split(" ").map(s => s[0]).slice(0,2).join("");
            const tone = t.contribution === "Lead" ? "blue" : t.contribution === "Reviewer" ? "purple" : "neutral";
            return (
              <div key={t.name} className="flex items-center gap-3 py-2 border-b border-[var(--wl-border)] last:border-0">
                <div className="w-8 h-8 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-[11px] font-semibold">{initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-[var(--wl-text)] font-medium">{t.name}</div>
                  <div className="text-[11px] text-[var(--wl-text-2)]">{t.role} · {t.clinic}</div>
                </div>
                <Badge tone={tone as any}>{t.contribution}</Badge>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Related Issues">
        {linkedIssues.length === 0 ? (
          <div className="text-[12px] text-[var(--wl-text-2)] py-4 text-center border border-dashed border-[var(--wl-border)] rounded">No issues linked to this project</div>
        ) : (
          <table className="wl-table">
            <thead>
              <tr>
                <th>Issue</th><th>Severity</th><th>Status</th><th>Assigned</th><th>Reported</th>
              </tr>
            </thead>
            <tbody>
              {linkedIssues.map((i, idx) => (
                <tr key={idx}>
                  <td>{i.issue}</td>
                  <td><Badge tone={i.severity === "High" ? "red" : i.severity === "Medium" ? "yellow" : "green"}>{i.severity}</Badge></td>
                  <td>{i.status}</td>
                  <td>{i.assigned}</td>
                  <td>{i.reported}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Activity Log">
        <div className="space-y-2">
          {d.activity.map((a, i) => {
            const initials = a.who === "System" ? "S" : a.who.split(" ").map(s => s[0]).slice(0,2).join("");
            return (
              <div key={i} className="flex items-start gap-2 text-[12px]">
                <div className="w-6 h-6 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-[10px] font-semibold shrink-0">{initials}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[var(--wl-text)] font-medium">{a.who}</span>{" "}
                  <span className="text-[var(--wl-text-2)]">{a.what}</span>
                  <span className="text-[var(--wl-text-2)]"> — {a.when}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
