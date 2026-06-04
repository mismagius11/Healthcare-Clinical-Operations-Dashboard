import { useEffect, useMemo, useState } from "react";
import { Card, Kpi, Badge, PageHeading, chartTooltip, EmptyState, Modal, Field, TextInput, SelectInput, Dropdown } from "./ui-bits";
import * as DM from "@radix-ui/react-dropdown-menu";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import {
  kpis, qaKpis, admissionsData, issuesOverTime, bedOccupancyData, issuesStatus, issuesSeverity,
  projects, activity, issues, alosByDept, inpatients as seedInpatients, beds, wardMatrix,
  cycleByMonth, otdByMonth, scorecard, staff as seedStaff, clinics, complianceByMonth, qaPassByClinic,
} from "./data";
import { StaffDrawer, StaffRow } from "./StaffDrawer";
import { ProjectDetailModal } from "./ProjectDetailModal";
import {
  AlertTriangle, CheckCircle2, FileText, TrendingUp, TrendingDown, Send, Sparkles, ArrowRight,
  Search, MoreVertical, Plus, ArrowUp, ArrowDown, ArrowUpDown, ShieldCheck, Download, Share2,
  Ban, Shuffle, Bell, FileDown, Eye, Mail,
} from "lucide-react";

type Role = "ops" | "qa";

const chartAxis = { stroke: "var(--wl-text-2)", fontSize: 11 };
const gridStroke = "var(--wl-border)";

function riskBadge(r: string) {
  return <Badge tone={r === "High" ? "red" : r === "Medium" ? "yellow" : "green"}>{r}</Badge>;
}

function statusBadge(s: string) {
  const tone = s === "On Track" || s === "Resolved" || s === "OK" || s === "On Duty" || s === "Passed" ? "green"
    : s === "At Risk" || s === "In Review" || s === "Watch" || s === "Training" ? "yellow"
    : s === "Delayed" || s === "Open" || s === "Critical" || s === "Inactive" || s === "Failed" ? "red"
    : "neutral";
  return <Badge tone={tone as any}>{s}</Badge>;
}

const kpiTooltips: Record<string, string> = {
  "Active Projects": "Clinical improvement projects currently in progress across all clinics",
  "On-time Delivery": "% of projects completed on schedule. Industry benchmark: >85%",
  "Open Issues": "Unresolved QA incidents requiring attention. 3 are high priority",
  "Avg Cycle Time": "Average days from project start to completion. Target: <4.5d",
  "Bed Occupancy": "% of total beds occupied. Safe operational threshold: ≤85%",
  "Readmission Rate": "30-day readmission rate. National benchmark: <7%",
  "Critical Incidents": "Active critical incidents that require immediate intervention",
  "Avg Resolution Time": "Average time from issue report to resolution. Target: <24h",
  "Issues Resolved (week)": "Issues closed in the last 7 days",
  "QA Pass Rate": "Percentage of QA checks passing across all clinics",
  "Compliance Score": "Network-wide compliance with documented protocols. Target: >90%",
};

// ───────── Dashboard ─────────

export function Dashboard({ name, role, onNavigate }: { name: string; role: Role; onNavigate?: (p: any) => void }) {
  const [riskFilter, setRiskFilter] = useState(role === "qa" ? "High" : "All");
  useEffect(() => { setRiskFilter(role === "qa" ? "High" : "All"); }, [role]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const subtitle = role === "qa" ? "QA Operations · 3 critical issues require your attention" : `${today} · 5 clinics · 312 patients in care`;
  const cards = role === "qa" ? qaKpis : kpis;

  const projectRows = projects
    .filter(p => role !== "qa" || p.risk === "High" || p.risk === "Medium")
    .filter(p => riskFilter === "All" || p.risk === riskFilter);

  const activityRows = role === "qa" ? activity.filter(a => a.qa) : activity;

  return (
    <div>
      <PageHeading title={`Good morning, ${name}`} subtitle={subtitle} />

      <div className="grid grid-cols-6 gap-3 mb-4">
        {cards.map(k => <Kpi key={k.label} {...(k as any)} tooltip={kpiTooltips[k.label]} />)}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {role === "qa" ? (
          <Card title="Issue Volume Over Time" action={<span className="text-[11px] text-[var(--wl-text-2)]">Last 6 weeks</span>}>
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={issuesOverTime} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" {...chartAxis} tickLine={false} axisLine={false} />
                  <YAxis {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "var(--wl-text-2)" }} />
                  <Line type="monotone" dataKey="opened" stroke="#f76b4f" strokeWidth={2} dot={false} name="Opened" />
                  <Line type="monotone" dataKey="resolved" stroke="#3ecf8e" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        ) : (
          <Card title="Patient Admissions & Discharges" action={<span className="text-[11px] text-[var(--wl-text-2)]">Today: 18 adm · 14 dis</span>}>
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={admissionsData} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" {...chartAxis} tickLine={false} axisLine={false} interval={3} />
                  <YAxis {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "var(--wl-text-2)" }} />
                  <Line type="monotone" dataKey="admissions" stroke="#4f8ef7" strokeWidth={2} dot={false} name="Admissions" />
                  <Line type="monotone" dataKey="discharges" stroke="#3ecf8e" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Discharges" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        <Card title="Bed Occupancy by Clinic">
          <div className="space-y-3">
            {bedOccupancyData.map(b => (
              <div key={b.clinic}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--wl-text)]">{b.clinic}</span>
                  <span className="flex items-center gap-2"><span className="text-[var(--wl-text-2)]">{b.value}%</span>{statusBadge(b.status)}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded">
                  <div className="h-full rounded" style={{ width: `${b.value}%`, background: b.tone === "red" ? "#f76b4f" : b.tone === "yellow" ? "#f7c14f" : "#3ecf8e" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {(() => {
          const data = role === "qa" ? issuesSeverity : issuesStatus;
          const total = data.reduce((s, d) => s + d.value, 0);
          const title = role === "qa" ? "Issues by Severity" : "Issues by Status";
          return (
            <Card title={title}>
              <div style={{ width: "100%", height: 224 }} className="relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">
                      {data.map((e) => <Cell key={`cell-${e.name}`} fill={e.color} />)}
                    </Pie>
                    <Tooltip {...chartTooltip} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-2xl font-semibold text-[var(--wl-text)]">{total}</div>
                  <div className="text-[10px] text-[var(--wl-text-2)] uppercase tracking-wider">total</div>
                </div>
              </div>
              <div className="flex justify-center gap-3 text-[11px] mt-2 flex-wrap">
                {data.map(s => (
                  <span key={s.name} className="flex items-center gap-1 text-[var(--wl-text-2)]">
                    <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />{s.name} {s.value}
                  </span>
                ))}
              </div>
            </Card>
          );
        })()}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-2" title="Projects" action={
          <Dropdown value={riskFilter} options={["All","High","Medium","Low"]} onChange={setRiskFilter} align="end" />
        }>
          <ProjectsTable rows={projectRows} role={role} />
        </Card>

        <Card title="Activity Feed" action={
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--wl-green)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--wl-green)] animate-pulse" />Live
          </span>
        }>
          <div className="space-y-3">
            {activityRows.map((a, i) => {
              const Icon = a.tone === "red" ? AlertTriangle : a.tone === "yellow" ? AlertTriangle : a.tone === "blue" ? FileText : CheckCircle2;
              const color = a.tone === "red" ? "var(--wl-red)" : a.tone === "yellow" ? "var(--wl-yellow)" : a.tone === "blue" ? "var(--wl-blue)" : "var(--wl-green)";
              return (
                <div key={i} className="flex gap-2">
                  <div className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: `${color}22`, color }}>
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[var(--wl-text)] truncate">{a.title}</div>
                    <div className="text-[11px] text-[var(--wl-text-2)]">{a.meta} · {a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ProjectsTable({ rows, includeAlos = false, role = "ops" }: { rows: typeof projects; includeAlos?: boolean; role?: Role }) {
  const [selected, setSelected] = useState<any | null>(null);
  if (rows.length === 0) return <EmptyState title="No projects found" subtitle="Try adjusting your filters" />;
  return (
    <div className="overflow-x-auto">
      <ProjectDetailModal project={selected} onClose={() => setSelected(null)} />
      <table className="wl-table">
        <thead>
          <tr className="text-[var(--wl-text-2)] text-left">
            <th className="font-medium pb-2 pr-3">Project</th>
            <th className="font-medium pb-2 pr-3">Status</th>
            <th className="font-medium pb-2 pr-3">Owner</th>
            <th className="font-medium pb-2 pr-3">Clinic</th>
            <th className="font-medium pb-2 pr-3">Risk</th>
            <th className="font-medium pb-2 pr-3">Cycle</th>
            {includeAlos && <th className="font-medium pb-2 pr-3">ALOS Impact</th>}
            {role === "qa" && <th className="font-medium pb-2 pr-3">QA Status</th>}
            <th className="font-medium pb-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.name} onClick={() => setSelected(p)} className={`cursor-pointer border-t border-[var(--wl-border)] hover:bg-[var(--wl-surface)] ${p.risk === "High" ? "bg-[var(--wl-red)]/5" : ""}`}>
              <td className="py-2 pr-3 text-[var(--wl-text)]">{p.name}</td>
              <td className="py-2 pr-3">{statusBadge(p.status)}</td>
              <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.owner}</td>
              <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.clinic}</td>
              <td className="py-2 pr-3">{riskBadge(p.risk)}</td>
              <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.cycle}</td>
              {includeAlos && <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.alos}</td>}
              {role === "qa" && <td className="py-2 pr-3">{statusBadge(p.qaStatus)}</td>}
              <td className="py-2 text-[var(--wl-text-2)]">{p.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProjectsPage({ role, openNew, onOpenNewChange }: { role: Role; openNew?: boolean; onOpenNewChange?: (v: boolean) => void }) {
  const [risk, setRisk] = useState(role === "qa" ? "High" : "All");
  useEffect(() => setRisk(role === "qa" ? "High" : "All"), [role]);
  const rows = projects
    .filter(p => role !== "qa" || p.risk === "High" || p.risk === "Medium")
    .filter(p => risk === "All" || p.risk === risk);
  return (
    <div>
      <PageHeading title="Projects" subtitle={role === "qa" ? "QA-relevant projects (High & Medium risk)" : "All clinical operations initiatives across the network"} />
      <Card title="All Projects" action={
        <Dropdown
          value={risk}
          options={role === "qa" ? ["All","High","Medium"] : ["All","High","Medium","Low"]}
          onChange={setRisk}
          align="end"
        />
      }>
        <ProjectsTable rows={rows} includeAlos role={role} />
      </Card>
    </div>
  );
}

// ───────── Issues ─────────

export function IssuesPage({ role, initialClinic, onClearInitial, openNew, onOpenNewChange }: { role: Role; initialClinic?: string; onClearInitial?: () => void; openNew?: boolean; onOpenNewChange?: (v: boolean) => void }) {
  const [tab, setTab] = useState<"mine" | "all">(role === "qa" ? "mine" : "all");
  useEffect(() => setTab(role === "qa" ? "mine" : "all"), [role]);
  const me = "Dr. James Kim";
  const rows = tab === "mine" && role === "qa" ? issues.filter(i => i.assigned === me) : issues;

  return (
    <div>
      <PageHeading title="Issues & Incidents" subtitle={role === "qa" ? `Your queue · ${issues.filter(i => i.assigned === me).length} assigned to you` : "Active issues across the clinical network"} />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Kpi label="Open" value="5" tone="red" valueTone="red" />
        <Kpi label="In Review" value="4" tone="yellow" valueTone="yellow" />
        <Kpi label="Resolved" value="3" tone="green" />
        <Kpi label="Avg Resolution" value="28h" tone="neutral" />
      </div>
      <Card
        title={tab === "mine" ? "My Assigned Issues" : "All Issues"}
        action={role === "qa" ? (
          <div className="inline-flex border border-[var(--wl-border)] rounded overflow-hidden">
            <button onClick={() => setTab("mine")} className={`px-2.5 h-7 text-xs ${tab === "mine" ? "bg-[var(--wl-purple)] text-white" : "text-[var(--wl-text-2)]"}`}>My Issues</button>
            <button onClick={() => setTab("all")} className={`px-2.5 h-7 text-xs ${tab === "all" ? "bg-[var(--wl-purple)] text-white" : "text-[var(--wl-text-2)]"}`}>All</button>
          </div>
        ) : undefined}
      >
        {rows.length === 0 ? <EmptyState title="No issues" subtitle="Nothing in your queue right now" /> : (
          <table className="wl-table">
            <thead>
              <tr className="text-[var(--wl-text-2)] text-left">
                {["Issue","Type","Clinic","Dept","Severity","Assigned","Status","Reported", role === "qa" ? "Actions" : ""].filter(Boolean).map(h => <th key={h} className="font-medium pb-2 pr-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((i, idx) => (
                <tr key={idx} className={`border-t border-[var(--wl-border)] hover:bg-[var(--wl-surface)] ${i.severity === "High" ? "bg-[var(--wl-red)]/5" : ""}`}>
                  <td className="py-2 pr-3 text-[var(--wl-text)]">{i.issue}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.type}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.clinic}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.dept}</td>
                  <td className="py-2 pr-3">{riskBadge(i.severity)}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.assigned}</td>
                  <td className="py-2 pr-3">{statusBadge(i.status)}</td>
                  <td className="py-2 text-[var(--wl-text-2)]">{i.reported}</td>
                  {role === "qa" && (
                    <td className="py-2">
                      {i.severity === "High" && (
                        <button onClick={() => toast.success(`Escalated: ${i.issue}`)} className="text-[11px] px-2 py-0.5 rounded bg-[var(--wl-red)]/15 text-[var(--wl-red)] hover:bg-[var(--wl-red)]/25">Escalate</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ───────── Patient Flow ─────────

type SortKey = "id" | "los" | "admitted" | "status" | null;

const admissionsByPeriod: Record<string, { x: string; admissions: number }[]> = {
  "Today": [2,3,4,3,2,2,1,1].map((v,i) => ({ x: ["8am","9am","10am","11am","12pm","1pm","2pm","3pm"][i], admissions: v })),
  "7D": [14,18,16,22,19,17,18].map((v,i) => ({ x: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i], admissions: v })),
  "1M": admissionsData.map(d => ({ x: d.day, admissions: d.admissions })),
  "3M": [312,298,341].map((v,i) => ({ x: ["Jan","Feb","Mar"][i], admissions: v })),
};

const alosByPeriod: Record<string, { dept: string; value: number }[]> = {
  "Today": alosByDept.map(d => ({ ...d, value: Math.max(0.5, d.value - 1.2) })),
  "7D": alosByDept.map(d => ({ ...d, value: d.value - 0.4 })),
  "1M": alosByDept,
  "3M": alosByDept.map(d => ({ ...d, value: d.value + 0.5 })),
};

export function PatientFlowPage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("los");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [period, setPeriod] = useState<"Today"|"7D"|"1M"|"3M">("1M");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  const filteredSorted = useMemo(() => {
    const q = debounced.toLowerCase();
    let rows = seedInpatients.filter(p =>
      !q || p.id.toLowerCase().includes(q) || p.dept.toLowerCase().includes(q) || p.clinic.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
    );
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      rows = [...rows].sort((a, b) => {
        if (sortKey === "los") return (parseInt(a.los) - parseInt(b.los)) * dir;
        if (sortKey === "admitted") return a.admitted.localeCompare(b.admitted) * dir;
        const av = sortKey === "id" ? a.id : a.status;
        const bv = sortKey === "id" ? b.id : b.status;
        return av.localeCompare(bv) * dir;
      });
    }
    return rows;
  }, [debounced, sortKey, sortDir]);

  const toggleSort = (k: NonNullable<SortKey>) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir(k === "los" ? "desc" : "asc"); }
  };

  const SortHeader = ({ k, label }: { k: NonNullable<SortKey>; label: string }) => {
    const Icon = sortKey !== k ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
    return (
      <th className="font-medium pb-2 pr-3">
        <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-[var(--wl-text)]">
          {label}<Icon size={11} className={sortKey === k ? "text-[var(--wl-blue)]" : "opacity-60"} />
        </button>
      </th>
    );
  };

  const PeriodToggle = (
    <div className="inline-flex border border-[var(--wl-border)] rounded overflow-hidden">
      {(["Today","7D","1M","3M"] as const).map(p => (
        <button key={p} onClick={() => setPeriod(p)} className={`px-2 h-7 text-xs ${period === p ? "bg-[var(--wl-blue)] text-white" : "text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"}`}>{p}</button>
      ))}
    </div>
  );

  return (
    <div>
      <PageHeading title="Patient Flow" subtitle="Admissions, discharges, and length of stay" />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Kpi label="Admitted Today" value="18" tone="neutral" />
        <Kpi label="Discharged" value="14" tone="green" />
        <Kpi label="ALOS" value="3.8d" tone="green" delta="-0.2d" />
        <Kpi label="Readmission" value="8.4%" tone="yellow" valueTone="yellow" />
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card title="Admissions" action={PeriodToggle}>
          <div style={{ width: "100%", height: 224 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionsByPeriod[period]} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="x" {...chartAxis} tickLine={false} axisLine={false} interval={period === "1M" ? 3 : 0} />
                <YAxis {...chartAxis} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="admissions" fill="#4f8ef7" radius={[2,2,0,0]} animationDuration={300} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="ALOS by Department (days)" action={PeriodToggle}>
          <div style={{ width: "100%", height: 224 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alosByPeriod[period]} layout="vertical" margin={{ left: 10, right: 10, top: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" {...chartAxis} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="dept" {...chartAxis} tickLine={false} axisLine={false} width={80} />
                <Tooltip {...chartTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="value" fill="#3ecf8e" radius={[0,2,2,0]} animationDuration={300} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card title="Current Inpatients" action={
        <div className="relative">
          <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--wl-text-2)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search patients..."
            className="h-7 w-56 pl-7 pr-2 bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]"
          />
        </div>
      }>
        {filteredSorted.length === 0 ? (
          <EmptyState title="No patients found" subtitle="Try a different search term" action={
            <button onClick={() => setQuery("")} className="text-xs px-3 py-1.5 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Clear search</button>
          } />
        ) : (
          <>
            <table className="wl-table">
              <thead>
                <tr className="text-[var(--wl-text-2)] text-left">
                  <SortHeader k="id" label="Patient ID" />
                  <th className="font-medium pb-2 pr-3">Dept</th>
                  <th className="font-medium pb-2 pr-3">Clinic</th>
                  <SortHeader k="admitted" label="Admitted" />
                  <SortHeader k="los" label="LOS" />
                  <SortHeader k="status" label="Status" />
                  <th className="font-medium pb-2 pr-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredSorted.map(p => (
                  <tr key={p.id} className={`border-t border-[var(--wl-border)] hover:bg-[var(--wl-surface)] ${p.risk === "High" ? "bg-[var(--wl-red)]/5" : ""}`}>
                    <td className="py-2 pr-3 text-[var(--wl-text)]">{p.id}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.dept}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.clinic}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.admitted}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.los}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.status}</td>
                    <td className="py-2">{riskBadge(p.risk)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[11px] text-[var(--wl-text-2)] mt-3">Showing {filteredSorted.length} of {seedInpatients.length} patients</div>
          </>
        )}
      </Card>
    </div>
  );
}

// ───────── Bed Occupancy ─────────

export function BedOccupancyPage() {
  const [modal, setModal] = useState<null | "block" | "transfer" | "alerts">(null);
  const [bedBlock, setBedBlock] = useState({ clinic: clinics[0], ward: "ICU", count: 1, reason: "Maintenance", start: "", end: "", notes: "" });
  const [transfer, setTransfer] = useState({ patient: "", from: clinics[0], to: clinics[1], dept: "ICU", priority: "Routine", reason: "" });
  const [thresholds, setThresholds] = useState<Record<string, number>>(Object.fromEntries(clinics.map(c => [c, 85])));
  const [globalThresh, setGlobalThresh] = useState(true);
  const [emailWarn, setEmailWarn] = useState(true);
  const [emailCrit, setEmailCrit] = useState(true);
  const [heatCell, setHeatCell] = useState<{ clinic: string; dept: string; value: number } | null>(null);

  const downloadCsv = () => {
    const headers = ["Clinic","Total","Occupied","Available","Occupancy%","ICU","ICU%","ALOS","Pending","Status"];
    const lines = [headers.join(",")].concat(
      beds.map(b => [b.clinic, b.total, b.occupied, b.available, b.occupancy, `${b.icuOccupied}/${b.icuTotal}`, Math.round(b.icuOccupied/b.icuTotal*100), b.alos, b.pending, b.status].join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `wellora-occupancy-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Occupancy report downloaded");
  };

  return (
    <div>
      <PageHeading title="Bed Occupancy" subtitle="Real-time capacity across the network" />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Kpi label="Total Beds" value="380" tone="neutral" />
        <Kpi label="Occupied" value="312" tone="neutral" />
        <Kpi label="Available" value="68" tone="green" />
        <Kpi label="Critical Clinics" value="1" tone="red" valueTone="red" />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setModal("block")} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-[var(--wl-yellow)] text-black font-medium hover:opacity-90"><Ban size={12} />Add Bed Block</button>
        <button onClick={() => setModal("transfer")} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded bg-[var(--wl-blue)] text-white hover:opacity-90"><Shuffle size={12} />Request Transfer</button>
        <button onClick={downloadCsv} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded border border-[var(--wl-border)] text-[var(--wl-text)] hover:bg-[var(--wl-card)]"><FileDown size={12} />Generate Report</button>
        <button onClick={() => setModal("alerts")} className="inline-flex items-center gap-1.5 text-xs px-3 py-2 rounded border border-[var(--wl-border)] text-[var(--wl-text)] hover:bg-[var(--wl-card)]"><Bell size={12} />Set Threshold Alert</button>
      </div>

      <Card title="By Clinic" className="mb-4">
        <div className="overflow-x-auto">
          <table className="wl-table">
            <thead>
              <tr className="text-[var(--wl-text-2)] text-left">
                {["Clinic","Total","Occupied","Available","Occupancy","ICU Beds","Avg LOS","Pending","Status","Trend","Updated"].map(h => <th key={h} className="font-medium pb-2 pr-3 whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {beds.map(b => {
                const icuPct = Math.round(b.icuOccupied / b.icuTotal * 100);
                return (
                  <tr key={b.clinic} className={`border-t border-[var(--wl-border)] hover:bg-[var(--wl-surface)] ${b.status === "Critical" ? "bg-[var(--wl-red)]/5" : ""}`}>
                    <td className="py-2 pr-3 text-[var(--wl-text)] whitespace-nowrap">{b.clinic}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.total}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.occupied}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.available}</td>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/5 rounded">
                          <div className="h-full rounded" style={{ width: `${b.occupancy}%`, background: b.occupancy >= 90 ? "#f76b4f" : b.occupancy >= 80 ? "#f7c14f" : "#3ecf8e" }} />
                        </div>
                        <span className="text-[var(--wl-text-2)]">{b.occupancy}%</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)] whitespace-nowrap">{b.icuOccupied}/{b.icuTotal} — <span style={{ color: icuPct >= 85 ? "var(--wl-red)" : "var(--wl-text)"}}>{icuPct}%</span></td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.alos}d</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.pending}</td>
                    <td className="py-2 pr-3">{statusBadge(b.status)}</td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)]">
                      {b.trend === "up" ? <TrendingUp size={13} className="text-[var(--wl-red)]" /> : b.trend === "down" ? <TrendingDown size={13} className="text-[var(--wl-green)]" /> : <ArrowRight size={13} />}
                    </td>
                    <td className="py-2 pr-3 text-[var(--wl-text-2)] whitespace-nowrap">{b.updated}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Bed Availability Heatmap" action={<span className="text-[11px] text-[var(--wl-text-2)]">Click a cell for details</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-separate border-spacing-1">
            <thead>
              <tr>
                <th></th>
                {["ICU","Surgery","Cardiology","General","Emergency","Oncology"].map(d => <th key={d} className="text-[var(--wl-text-2)] font-medium text-left px-2">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {wardMatrix.map(row => (
                <tr key={row.clinic}>
                  <td className="text-[var(--wl-text)] pr-2 whitespace-nowrap">{row.clinic}</td>
                  {(["ICU","Surgery","Cardiology","General","Emergency","Oncology"] as const).map(dept => {
                    const v = row[dept];
                    const bg = v >= 85 ? "#f76b4f" : v >= 75 ? "#f7c14f" : "#3ecf8e";
                    return (
                      <td key={dept} className="p-0">
                        <button
                          onClick={() => setHeatCell({ clinic: row.clinic, dept, value: v })}
                          className="w-full h-9 rounded text-xs font-medium hover:ring-2 ring-white/30 transition"
                          style={{ background: `${bg}30`, color: bg }}
                        >
                          {v}%
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {heatCell && (
          <div className="mt-3 p-3 rounded border border-[var(--wl-border)] bg-[var(--wl-surface)] text-xs flex items-center gap-4">
            <div>
              <div className="text-[var(--wl-text)] font-semibold">{heatCell.clinic} · {heatCell.dept}</div>
              <div className="text-[var(--wl-text-2)] mt-0.5">Occupancy {heatCell.value}% · Occupied {Math.round(20 * heatCell.value/100)}/20 · Available {20 - Math.round(20 * heatCell.value/100)}</div>
            </div>
            <button onClick={() => setHeatCell(null)} className="ml-auto text-[var(--wl-text-2)] hover:text-[var(--wl-text)]">Close</button>
          </div>
        )}
      </Card>

      {/* Bed Block Modal */}
      <Modal open={modal === "block"} onClose={() => setModal(null)} title="Add Bed Block" width={460}
        footer={
          <>
            <button onClick={() => setModal(null)} className="text-xs px-3 py-2 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Cancel</button>
            <button onClick={() => { toast.success(`${bedBlock.count} bed(s) blocked at ${bedBlock.clinic}`); setModal(null); }} className="text-xs px-3 py-2 rounded bg-[var(--wl-yellow)] text-black font-medium">Block Beds</button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Clinic"><SelectInput value={bedBlock.clinic} options={clinics} onChange={v => setBedBlock({ ...bedBlock, clinic: v })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ward / Department"><SelectInput value={bedBlock.ward} options={["ICU","General","Surgery","Cardiology","Oncology","Emergency"]} onChange={v => setBedBlock({ ...bedBlock, ward: v })} /></Field>
            <Field label="Number of beds"><TextInput type="number" value={String(bedBlock.count)} onChange={v => setBedBlock({ ...bedBlock, count: Math.max(1, Number(v) || 1) })} /></Field>
          </div>
          <Field label="Reason"><SelectInput value={bedBlock.reason} options={["Maintenance","Deep Cleaning","Renovation","Equipment Failure","Infection Control"]} onChange={v => setBedBlock({ ...bedBlock, reason: v })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date"><TextInput type="date" value={bedBlock.start} onChange={v => setBedBlock({ ...bedBlock, start: v })} /></Field>
            <Field label="End date"><TextInput type="date" value={bedBlock.end} onChange={v => setBedBlock({ ...bedBlock, end: v })} /></Field>
          </div>
          <Field label="Notes">
            <textarea value={bedBlock.notes} onChange={e => setBedBlock({ ...bedBlock, notes: e.target.value })} rows={3} className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />
          </Field>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal open={modal === "transfer"} onClose={() => setModal(null)} title="Request Patient Transfer" width={460}
        footer={
          <>
            <button onClick={() => setModal(null)} className="text-xs px-3 py-2 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Cancel</button>
            <button onClick={() => { toast.success(`Transfer request submitted for ${transfer.patient || "patient"}`); setModal(null); }} className="text-xs px-3 py-2 rounded bg-[var(--wl-blue)] text-white">Submit Transfer Request</button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Patient ID">
            <div className="relative">
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--wl-text-2)]" />
              <input value={transfer.patient} onChange={e => setTransfer({ ...transfer, patient: e.target.value })} placeholder="Search patient ID…" className="w-full pl-7 bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From clinic"><SelectInput value={transfer.from} options={clinics} onChange={v => setTransfer({ ...transfer, from: v })} /></Field>
            <Field label="To clinic">
              <SelectInput value={transfer.to} options={beds.map(b => ({ v: b.clinic, label: `${b.clinic} (${b.available} avail)` }))} onChange={v => setTransfer({ ...transfer, to: v })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department"><SelectInput value={transfer.dept} options={["ICU","General","Surgery","Cardiology","Oncology","Emergency"]} onChange={v => setTransfer({ ...transfer, dept: v })} /></Field>
            <Field label="Priority"><SelectInput value={transfer.priority} options={["Routine","Urgent","Emergency"]} onChange={v => setTransfer({ ...transfer, priority: v })} /></Field>
          </div>
          <Field label="Reason">
            <textarea value={transfer.reason} onChange={e => setTransfer({ ...transfer, reason: e.target.value })} rows={3} className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />
          </Field>
          <Field label="Requested by"><TextInput value="Sarah Mitchell" onChange={() => {}} /></Field>
        </div>
      </Modal>

      {/* Threshold Modal */}
      <Modal open={modal === "alerts"} onClose={() => setModal(null)} title="Alert Thresholds" width={460}
        footer={
          <>
            <button onClick={() => setModal(null)} className="text-xs px-3 py-2 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Cancel</button>
            <button onClick={() => { toast.success("Threshold configuration saved"); setModal(null); }} className="text-xs px-3 py-2 rounded bg-[var(--wl-blue)] text-white">Save Configuration</button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="flex items-center justify-between text-sm text-[var(--wl-text)]">
            Use global threshold for all clinics
            <input type="checkbox" checked={globalThresh} onChange={e => setGlobalThresh(e.target.checked)} />
          </label>
          {clinics.map(c => (
            <div key={c}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--wl-text)]">{c}</span>
                <span className="text-[var(--wl-text-2)]">{thresholds[c]}%</span>
              </div>
              <input type="range" min={60} max={100} value={thresholds[c]} onChange={e => setThresholds({ ...thresholds, [c]: Number(e.target.value) })} className="w-full" disabled={globalThresh && c !== clinics[0]} />
            </div>
          ))}
          <div className="border-t border-[var(--wl-border)] pt-3 space-y-2">
            <label className="flex items-center justify-between text-sm text-[var(--wl-text)]">Warning email (at threshold)<input type="checkbox" checked={emailWarn} onChange={e => setEmailWarn(e.target.checked)} /></label>
            <label className="flex items-center justify-between text-sm text-[var(--wl-text)]">Critical email (at 95%)<input type="checkbox" checked={emailCrit} onChange={e => setEmailCrit(e.target.checked)} /></label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ───────── Reports ─────────

const cycleByPeriod: Record<string, { x: string; value: number }[]> = {
  "7D": [4.1,4.0,4.3,4.2,4.1,4.0,3.9].map((v,i)=>({ x: `D${i+1}`, value: v })),
  "1M": [4.8,4.5,4.3,4.2].map((v,i)=>({ x: `W${i+1}`, value: v })),
  "3M": cycleByMonth.slice(0,3).flatMap((m)=>[0,1,2,3].map(w=>({ x: `${m.month} W${w+1}`, value: m.value - w*0.05 }))),
  "6M": [5.8,5.5,5.2,4.8,5.1,4.6].map((v,i)=>({ x: ["Jan","Feb","Mar","Apr","May","Jun"][i], value: v })),
  "1Y": [6.1,5.9,5.7,5.8,5.5,5.2,4.8,5.1,4.6,4.3,4.2,4.0].map((v,i)=>({ x: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], value: v })),
  "YTD": cycleByMonth.map(m=>({ x: m.month, value: m.value })),
};

const otdByPeriod: Record<string, { x: string; value: number }[]> = {
  "7D": [85,86,84,87,88,87,89].map((v,i)=>({ x: `D${i+1}`, value: v })),
  "1M": [82,84,85,87].map((v,i)=>({ x: `W${i+1}`, value: v })),
  "3M": otdByMonth.slice(3).map(m=>({ x: m.month, value: m.value })),
  "6M": otdByMonth.map(m=>({ x: m.month, value: m.value })),
  "1Y": [72,74,76,78,79,81,83,84,86,87,87,88].map((v,i)=>({ x: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i], value: v })),
  "YTD": otdByMonth.map(m=>({ x: m.month, value: m.value })),
};

type ScoreSortKey = "clinic" | "otd" | "cycle" | "alos" | "readmit" | "issues" | "score" | null;

export function ReportsPage({ role }: { role: Role }) {
  const [period, setPeriod] = useState<"7D"|"1M"|"3M"|"6M"|"1Y"|"YTD">("3M");
  const [tab, setTab] = useState<"ops"|"qa">(role === "qa" ? "qa" : "ops");
  useEffect(() => setTab(role === "qa" ? "qa" : "ops"), [role]);

  // scorecard filters
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [otdFilter, setOtdFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [sortKey, setSortKey] = useState<ScoreSortKey>("score");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("desc");

  const filteredScore = useMemo(() => {
    const q = search.toLowerCase();
    let r = scorecard.filter(s =>
      (!q || s.clinic.toLowerCase().includes(q)) &&
      (scoreFilter === "All" || s.score === scoreFilter) &&
      (otdFilter === "All" || (otdFilter === ">90%" ? s.otd > 90 : otdFilter === "80-90%" ? s.otd >= 80 && s.otd <= 90 : s.otd < 80)) &&
      (riskFilter === "All" || s.risk === riskFilter)
    );
    if (sortKey) {
      const dir = sortDir === "asc" ? 1 : -1;
      r = [...r].sort((a, b) => {
        const av = (a as any)[sortKey]; const bv = (b as any)[sortKey];
        if (typeof av === "number") return (av - bv) * dir;
        return String(av).localeCompare(String(bv)) * dir;
      });
    }
    return r;
  }, [search, scoreFilter, otdFilter, riskFilter, sortKey, sortDir]);

  const toggleSort = (k: NonNullable<ScoreSortKey>) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir(k === "clinic" ? "asc" : "desc"); }
  };

  const ScoreHead = ({ k, label }: { k: NonNullable<ScoreSortKey>; label: string }) => {
    const Icon = sortKey !== k ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
    return (
      <th className="font-medium pb-2 pr-3">
        <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-[var(--wl-text)]">{label}<Icon size={11} className={sortKey === k ? "text-[var(--wl-blue)]" : "opacity-60"} /></button>
      </th>
    );
  };

  const downloadCsv = () => {
    const headers = ["Clinic","OTD%","Cycle","ALOS","Readmit%","Issues","Score","Risk"];
    const lines = [headers.join(",")].concat(filteredScore.map(s => [s.clinic, s.otd, s.cycle, s.alos, s.readmit, s.issues, s.score, s.risk].join(",")));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `wellora-report-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded");
  };

  const clearFilters = () => { setSearch(""); setScoreFilter("All"); setOtdFilter("All"); setRiskFilter("All"); };

  const exportPdf = () => { toast("Opening print dialog…"); setTimeout(() => window.print(), 50); };

  return (
    <div>
      <PageHeading
        title="Reports & Analytics"
        subtitle="Network-wide performance over time"
        action={
          <div className="flex items-center gap-2">
            <button onClick={downloadCsv} className="inline-flex items-center gap-1 text-xs px-2 h-7 border border-[var(--wl-border)] rounded text-[var(--wl-text)] hover:bg-[var(--wl-surface)]"><Download size={11} />CSV</button>
            <button onClick={exportPdf} className="inline-flex items-center gap-1 text-xs px-2 h-7 border border-[var(--wl-border)] rounded text-[var(--wl-text)] hover:bg-[var(--wl-surface)]"><FileText size={11} />PDF</button>
            <DM.Root>
              <DM.Trigger asChild>
                <button className="inline-flex items-center gap-1 text-xs px-2 h-7 border border-[var(--wl-border)] rounded text-[var(--wl-text)] hover:bg-[var(--wl-surface)]"><Share2 size={11} />Share</button>
              </DM.Trigger>
              <DM.Portal>
                <DM.Content align="end" side="bottom" sideOffset={4} avoidCollisions style={{ zIndex: 9999, background: "var(--wl-card)", border: "1px solid var(--wl-border)", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.4)", padding: 4, minWidth: 200 }}>
                  <DM.Item onSelect={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }} className="flex items-center gap-2 px-3 py-2 rounded text-[13px] text-[var(--wl-text)] outline-none cursor-pointer data-[highlighted]:bg-white/[0.06]"><Eye size={13} />Copy link</DM.Item>
                  <DM.Item onSelect={() => { window.location.href = `mailto:?subject=${encodeURIComponent("Wellora Report")}`; }} className="flex items-center gap-2 px-3 py-2 rounded text-[13px] text-[var(--wl-text)] outline-none cursor-pointer data-[highlighted]:bg-white/[0.06]"><Mail size={13} />Email report</DM.Item>
                </DM.Content>
              </DM.Portal>
            </DM.Root>
            <div className="inline-flex border border-[var(--wl-border)] rounded overflow-hidden">
              {(["7D","1M","3M","6M","1Y","YTD"] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`px-2.5 h-7 text-xs ${period === p ? "bg-[var(--wl-blue)] text-white" : "text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"}`}>{p}</button>
              ))}
            </div>
          </div>
        }
      />

      {role === "qa" && (
        <div className="inline-flex border border-[var(--wl-border)] rounded overflow-hidden mb-4">
          <button onClick={() => setTab("qa")} className={`px-3 h-7 text-xs ${tab === "qa" ? "bg-[var(--wl-purple)] text-white" : "text-[var(--wl-text-2)]"}`}>QA Reports</button>
          <button onClick={() => setTab("ops")} className={`px-3 h-7 text-xs ${tab === "ops" ? "bg-[var(--wl-purple)] text-white" : "text-[var(--wl-text-2)]"}`}>Operations Reports</button>
        </div>
      )}

      {tab === "qa" ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card title="Issue Volume Over Time">
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={issuesOverTime} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" {...chartAxis} tickLine={false} axisLine={false} />
                  <YAxis {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line dataKey="opened" stroke="#f76b4f" strokeWidth={2} name="Opened" dot={false} />
                  <Line dataKey="resolved" stroke="#3ecf8e" strokeWidth={2} strokeDasharray="4 4" name="Resolved" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Avg Resolution Time (hours)">
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[32,30,29,28,27,28].map((v,i)=>({ x: ["Jan","Feb","Mar","Apr","May","Jun"][i], value: v }))} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="x" {...chartAxis} tickLine={false} axisLine={false} />
                  <YAxis {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="value" fill="#a855f7" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Compliance Score Over Time">
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={complianceByMonth} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" {...chartAxis} tickLine={false} axisLine={false} />
                  <YAxis domain={[70, 100]} {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} />
                  <Line dataKey="value" stroke="#3ecf8e" strokeWidth={2} dot={{ r: 3, fill: "#3ecf8e" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="QA Pass Rate by Clinic">
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qaPassByClinic} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="clinic" {...chartAxis} tickLine={false} axisLine={false} />
                  <YAxis domain={[80, 100]} {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="value" fill="#3ecf8e" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card title="Avg Cycle Time (days)">
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cycleByPeriod[period]} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="x" {...chartAxis} tickLine={false} axisLine={false} />
                  <YAxis {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="value" fill="#4f8ef7" radius={[2,2,0,0]} animationDuration={300} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="On-time Delivery %">
            <div style={{ width: "100%", height: 224 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={otdByPeriod[period]} margin={{ left: -20, right: 8, top: 8 }}>
                  <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="x" {...chartAxis} tickLine={false} axisLine={false} />
                  <YAxis domain={[70, 100]} {...chartAxis} tickLine={false} axisLine={false} />
                  <Tooltip {...chartTooltip} />
                  <Line type="monotone" dataKey="value" stroke="#3ecf8e" strokeWidth={2} dot={{ r: 3, fill: "#3ecf8e" }} animationDuration={300} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      <Card title="Clinic Performance Scorecard">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--wl-text-2)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clinics or metrics..." className="h-7 w-64 pl-7 pr-2 bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />
          </div>
          <Dropdown value={scoreFilter} options={["All","A","B","C"]} onChange={setScoreFilter} />
          <Dropdown value={otdFilter} options={["All",">90%","80-90%","<80%"]} onChange={setOtdFilter} />
          <Dropdown value={riskFilter} options={["All","High Risk","Normal"]} onChange={setRiskFilter} />
        </div>
        {filteredScore.length === 0 ? (
          <EmptyState title="No results found" subtitle="Try adjusting your filters" action={
            <button onClick={clearFilters} className="text-xs px-3 py-1.5 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Clear filters</button>
          } />
        ) : (
          <table className="wl-table">
            <thead>
              <tr className="text-[var(--wl-text-2)] text-left">
                <ScoreHead k="clinic" label="Clinic" />
                <ScoreHead k="otd" label="OTD %" />
                <ScoreHead k="cycle" label="Cycle" />
                <ScoreHead k="alos" label="ALOS" />
                <ScoreHead k="readmit" label="Readmit %" />
                <ScoreHead k="issues" label="Issues" />
                <ScoreHead k="score" label="Score" />
              </tr>
            </thead>
            <tbody>
              {filteredScore.map(s => (
                <tr key={s.clinic} className="border-t border-[var(--wl-border)] hover:bg-[var(--wl-surface)]">
                  <td className="py-2 pr-3 text-[var(--wl-text)]">{s.clinic}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.otd}%</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.cycle}d</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.alos}d</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.readmit}%</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.issues}</td>
                  <td className="py-2"><Badge tone={s.score === "A" ? "green" : s.score === "B" ? "yellow" : "red"}>{s.score}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

    </div>
  );
}

// ───────── Staff ─────────

type StaffSortKey = "name" | "role" | "clinic" | "dept" | "projects" | "patients" | "status";

export function StaffPage({ role, openAdd, onOpenAddChange }: { role: Role; openAdd?: boolean; onOpenAddChange?: (v: boolean) => void }) {
  const [rows, setRows] = useState<StaffRow[]>(seedStaff as any);
  const [drawer, setDrawer] = useState<{ open: boolean; mode: "edit" | "create"; row: StaffRow | null }>({ open: false, mode: "edit", row: null });
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortKey, setSortKey] = useState<StaffSortKey>("name");
  const [sortDir, setSortDir] = useState<"asc"|"desc">("asc");
  const readOnly = role === "qa";

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  const visible = useMemo(() => {
    const q = debounced.toLowerCase();
    let r = rows.filter(s =>
      (!q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.clinic.toLowerCase().includes(q) || s.dept.toLowerCase().includes(q)) &&
      (statusFilter === "All Status" || s.status === statusFilter)
    );
    const dir = sortDir === "asc" ? 1 : -1;
    r = [...r].sort((a, b) => {
      const av = (a as any)[sortKey]; const bv = (b as any)[sortKey];
      if (typeof av === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return r;
  }, [rows, debounced, statusFilter, sortKey, sortDir]);

  const toggleSort = (k: StaffSortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const StaffHead = ({ k, label }: { k: StaffSortKey; label: string }) => {
    const Icon = sortKey !== k ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
    return (
      <th className="font-medium pb-2 pr-3">
        <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-[var(--wl-text)]">
          {label}<Icon size={11} className={sortKey === k ? "text-[var(--wl-blue)]" : "opacity-60"} />
        </button>
      </th>
    );
  };

  useEffect(() => {
    const onClick = () => setMenuOpen(null);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onSave = (row: StaffRow) => {
    if (drawer.mode === "create") { setRows([...rows, row]); toast.success("Staff member added"); }
    else if (drawer.row) { setRows(rows.map(r => r.name === drawer.row!.name ? row : r)); toast.success("Staff member updated"); }
    setDrawer({ open: false, mode: "edit", row: null });
  };
  const onDelete = (row: StaffRow) => {
    setRows(rows.filter(r => r.name !== row.name));
    toast.success(`${row.name} removed`);
    setDrawer({ open: false, mode: "edit", row: null });
  };

  return (
    <div>
      <PageHeading
        title="Staff"
        subtitle={readOnly ? "Read-only view of clinical team" : "Clinical and operations team across the network"}
        action={!readOnly && (
          <button onClick={() => setDrawer({ open: true, mode: "create", row: null })} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-[var(--wl-blue)] text-white rounded">
            <Plus size={12} />Add Staff Member
          </button>
        )}
      />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Kpi label="Total Staff" value={String(rows.length)} tone="neutral" />
        <Kpi label="Staff-to-Patient" value="1:3.1" tone="neutral" />
        <Kpi label="On Duty" value={String(rows.filter(r => r.status === "On Duty").length)} tone="green" />
        <Kpi label="Training Compliance" value="94%" tone="green" />
      </div>
      <Card title="Team" action={
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--wl-text-2)]" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, role, clinic..." className="h-7 w-[280px] pl-7 pr-2 bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />
          </div>
          <Dropdown value={statusFilter} options={["All Status","On Duty","Off Duty","Training","On Leave"]} onChange={setStatusFilter} align="end" />
        </div>
      }>
        {visible.length === 0 ? (
          <EmptyState title="No staff members found" subtitle="Try a different search term" action={
            <button onClick={() => { setQuery(""); setStatusFilter("All Status"); }} className="text-xs px-3 py-1.5 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Clear search</button>
          } />
        ) : (
          <table className="wl-table">
            <thead>
              <tr className="text-[var(--wl-text-2)] text-left">
                <StaffHead k="name" label="Name" />
                <StaffHead k="role" label="Role" />
                <StaffHead k="clinic" label="Clinic" />
                <StaffHead k="dept" label="Dept" />
                <StaffHead k="projects" label="Projects" />
                <StaffHead k="patients" label="Patients" />
                <StaffHead k="status" label="Status" />
                {!readOnly && <th className="font-medium pb-2 pr-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visible.map(s => (
                <tr key={s.name} className="border-t border-[var(--wl-border)] hover:bg-[var(--wl-surface)]">
                  <td className="py-2 pr-3 text-[var(--wl-text)]">{s.name}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.role}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.clinic}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.dept}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.projects}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.patients}</td>
                  <td className="py-2 pr-3">{statusBadge(s.status)}</td>
                  {!readOnly && (
                    <td className="py-2 pr-3 relative">
                      <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === s.name ? null : s.name); }} className="w-6 h-6 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)] hover:bg-[var(--wl-surface)] rounded"><MoreVertical size={13} /></button>
                      {menuOpen === s.name && (
                        <div className="absolute right-0 top-7 z-10 w-40 bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md shadow-xl py-1" onClick={e => e.stopPropagation()}>
                          <MenuItem label="Edit" onClick={() => { setDrawer({ open: true, mode: "edit", row: s }); setMenuOpen(null); }} />
                          <MenuItem label="View Profile" onClick={() => { toast(`Viewing ${s.name}`); setMenuOpen(null); }} />
                          <MenuItem label="Change Clinic" onClick={() => { setDrawer({ open: true, mode: "edit", row: s }); setMenuOpen(null); }} />
                          <MenuItem label="Deactivate" danger onClick={() => { setRows(rows.map(r => r.name === s.name ? { ...r, status: "Inactive" } : r)); toast.success(`${s.name} deactivated`); setMenuOpen(null); }} />
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {visible.length > 0 && (
          <div className="text-[11px] text-[var(--wl-text-2)] mt-3">Showing {visible.length} of {rows.length} staff members</div>
        )}
      </Card>
      {!readOnly && (
        <StaffDrawer
          open={drawer.open}
          mode={drawer.mode}
          initial={drawer.row}
          onClose={() => setDrawer({ open: false, mode: "edit", row: null })}
          onSave={onSave}
          onDelete={drawer.mode === "edit" ? onDelete : undefined}
        />
      )}
    </div>
  );
}

function MenuItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return <button onClick={onClick} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--wl-surface)] ${danger ? "text-[var(--wl-red)]" : "text-[var(--wl-text)]"}`}>{label}</button>;
}

// ───────── AI Insights ─────────

const aiResponses = [
  "Bed occupancy at St. Mary's hit 91% — above the 85% threshold. ICU is the primary driver. Recommend diverting non-critical admissions to Central Medical (72%) for the next 24h.",
  "Readmission rate trended up to 8.4% (+1.2% vs target). The largest delta is Cardiology at Westside. Discharge follow-up calls within 48h have dropped 14% this month.",
  "ALOS is improving network-wide (-0.2d MoM), but ICU ALOS at St. Mary's is 7.2d — 18% above peers. Worth investigating handoff protocols to step-down.",
  "Avg cycle time has trended from 5.2d in January to 4.2d in June, a 19% improvement. Most of the gain came from the Discharge Workflow Automation project at Central Medical.",
];

export function AIInsightsPage() {
  const initial = [
    { role: "user" as const, text: "What's driving the spike in ICU issues at St. Mary's?" },
    { role: "ai" as const, text: aiResponses[0] },
    { role: "user" as const, text: "And what about readmission rates?" },
    { role: "ai" as const, text: aiResponses[1] },
  ];
  const [msgs, setMsgs] = useState(initial);
  const [input, setInput] = useState("");
  const [idx, setIdx] = useState(2);

  const send = () => {
    if (!input.trim()) return;
    const next = aiResponses[idx % aiResponses.length];
    setMsgs([...msgs, { role: "user", text: input }, { role: "ai", text: next }]);
    setInput("");
    setIdx(idx + 1);
  };

  const history = [
    { group: "Today", items: ["ICU capacity analysis", "Readmission drivers"] },
    { group: "Yesterday", items: ["Q1 cycle time review", "Westside lab delays"] },
    { group: "Last week", items: ["Discharge automation ROI", "Staff coverage gaps"] },
  ];

  return (
    <div className="grid grid-cols-[220px_1fr] gap-3 h-[calc(100vh-48px-32px)]">
      <div className="bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md p-3 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-[var(--wl-blue)]" />
          <div className="text-sm text-[var(--wl-text)]">Wellora AI</div>
        </div>
        {history.map(h => (
          <div key={h.group} className="mb-3">
            <div className="text-[10px] uppercase tracking-wider text-[var(--wl-text-2)] mb-1">{h.group}</div>
            {h.items.map(it => <div key={it} className="text-xs text-[var(--wl-text-2)] hover:text-[var(--wl-text)] cursor-pointer py-1">{it}</div>)}
          </div>
        ))}
      </div>
      <div className="bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-md text-sm ${m.role === "user" ? "bg-[var(--wl-blue)] text-white" : "bg-[var(--wl-surface)] border border-[var(--wl-border)] text-[var(--wl-text)]"}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--wl-border)] p-3 flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask Wellora AI…" className="flex-1 bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded px-3 py-2 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />
          <button onClick={send} className="px-3 py-2 bg-[var(--wl-blue)] text-white rounded text-sm flex items-center gap-1"><Send size={13} />Send</button>
        </div>
      </div>
    </div>
  );
}

// ───────── Settings / Profile ─────────

type SettingsProps = {
  theme: "dark" | "light"; onToggleTheme: () => void; role: Role;
  collapsed: boolean; onToggleCollapsed: () => void;
  showProfile?: boolean; onShowProfile?: (v: boolean) => void;
  setTheme?: (t: "dark" | "light") => void;
  tab?: "profile" | "account" | "notifications" | "security" | "appearance";
  onTabChange?: (t: "profile" | "account" | "notifications" | "security" | "appearance") => void;
};

export function SettingsPage({ theme, onToggleTheme, role, collapsed, onToggleCollapsed, showProfile, onShowProfile, tab }: SettingsProps) {
  const roleName = role === "ops" ? "Sarah Mitchell (Ops Manager)" : "Dr. James Kim (QA Lead)";
  if (showProfile || tab === "profile") return <ProfileSection role={role} onBack={() => onShowProfile?.(false)} />;
  return (
    <div>
      <PageHeading title="Settings" subtitle="Configure your workspace" />
      <div className="grid grid-cols-2 gap-3 max-w-3xl">
        <Card title="Workspace">
          <div className="divide-y divide-[var(--wl-border)]">
            <Row label="Theme"><button onClick={onToggleTheme} className="px-2 py-1 border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)]">{theme === "dark" ? "Dark" : "Light"}</button></Row>
            <Row label="Signed in as">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--wl-text)]">{roleName}</span>
                <Badge tone={role === "qa" ? "purple" : "blue"}>{role === "qa" ? "QA Lead" : "Ops Manager"}</Badge>
              </div>
            </Row>
            <Row label="Clinic scope"><span className="text-xs text-[var(--wl-text)]">All 5 clinics</span></Row>
            <Row label="Notifications"><Badge tone="green">Enabled</Badge></Row>
            <Row label="Data refresh interval"><span className="text-xs text-[var(--wl-text)]">30 seconds</span></Row>
            <Row label="Sidebar collapsed by default"><button onClick={onToggleCollapsed} className="px-2 py-1 border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)]">{collapsed ? "Collapsed" : "Expanded"}</button></Row>
          </div>
        </Card>
        <Card title="Account">
          <div className="text-xs text-[var(--wl-text-2)] mb-3">Manage your personal information, role access, notifications, and security.</div>
          <button onClick={() => onShowProfile?.(true)} className="text-xs px-3 py-1.5 bg-[var(--wl-blue)] text-white rounded">Open profile settings</button>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between py-3"><span className="text-sm text-[var(--wl-text-2)]">{label}</span>{children}</div>;
}

function ProfileSection({ role, onBack }: { role: Role; onBack: () => void }) {
  const isOps = role === "ops";
  const [form, setForm] = useState({
    fullName: isOps ? "Sarah Mitchell" : "Dr. James Kim",
    title: isOps ? "Operations Manager" : "Quality Assurance Lead",
    department: isOps ? "Operations" : "Quality",
    email: isOps ? "sarah.mitchell@wellora.health" : "james.kim@wellora.health",
    phone: "+1 (555) 010-0142",
    timezone: "America/Los_Angeles",
  });
  const [access, setAccess] = useState<Record<string, boolean>>(Object.fromEntries(clinics.map(c => [c, true])));
  const [notif, setNotif] = useState({
    critEmail: true,
    critInApp: true,
    daily: false,
    weekly: true,
    occupancy: !isOps ? false : true,
    issues: !isOps ? true : true,
  });
  const [twoFA, setTwoFA] = useState(true);

  return (
    <div>
      <PageHeading title="Profile Settings" subtitle="Manage your personal information and preferences" action={
        <button onClick={onBack} className="text-xs px-3 py-1.5 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Back to Settings</button>
      } />
      <div className="space-y-3 pb-20">
        <Card title="Personal Information">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-lg font-semibold">{form.fullName.split(" ").map(s => s[0]).slice(0,2).join("")}</div>
            <button className="text-xs px-2 py-1 border border-[var(--wl-border)] rounded text-[var(--wl-text-2)]">Upload new</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name"><TextInput value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} /></Field>
            <Field label="Job Title"><TextInput value={form.title} onChange={v => setForm({ ...form, title: v })} /></Field>
            <Field label="Department"><SelectInput value={form.department} options={["Operations","QA","Analytics","Clinical","Admin"]} onChange={v => setForm({ ...form, department: v })} /></Field>
            <Field label="Email">
              <div className="flex gap-2 items-center">
                <TextInput value={form.email} onChange={v => setForm({ ...form, email: v })} />
                <Badge tone="green"><ShieldCheck size={10} />Verified</Badge>
              </div>
            </Field>
            <Field label="Phone"><TextInput value={form.phone} onChange={v => setForm({ ...form, phone: v })} /></Field>
            <Field label="Timezone"><SelectInput value={form.timezone} options={["America/Los_Angeles","America/Denver","America/Chicago","America/New_York","UTC"]} onChange={v => setForm({ ...form, timezone: v })} /></Field>
          </div>
        </Card>

        <Card title="Role & Access">
          <div className="space-y-3">
            <Row label="Current Role"><Badge tone={isOps ? "blue" : "purple"}>{isOps ? "Ops Manager" : "QA Lead"}</Badge></Row>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--wl-text-2)] mb-2">Clinic Access</div>
              <div className="grid grid-cols-2 gap-2">
                {clinics.map(c => (
                  <label key={c} className="flex items-center gap-2 text-xs text-[var(--wl-text)]">
                    <input type="checkbox" checked={access[c]} onChange={e => setAccess({ ...access, [c]: e.target.checked })} />{c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--wl-text-2)] mb-2">Permissions</div>
              <ul className="text-xs text-[var(--wl-text-2)] space-y-1 list-disc pl-4">
                <li>View all operations dashboards</li>
                <li>Manage clinical projects and staff</li>
                <li>Approve QA incident closures</li>
                {isOps && <li>Edit clinic capacity thresholds</li>}
              </ul>
            </div>
          </div>
        </Card>

        <Card title="Notification Preferences">
          <div className="divide-y divide-[var(--wl-border)]">
            <Toggle label="Critical alerts (email)" value={notif.critEmail} onChange={v => setNotif({ ...notif, critEmail: v })} />
            <Toggle label="Critical alerts (in-app)" value={notif.critInApp} onChange={v => setNotif({ ...notif, critInApp: v })} />
            <Toggle label="Daily digest email" value={notif.daily} onChange={v => setNotif({ ...notif, daily: v })} />
            <Toggle label="Weekly performance report" value={notif.weekly} onChange={v => setNotif({ ...notif, weekly: v })} />
            <Toggle label="Bed occupancy warnings" value={notif.occupancy} onChange={v => setNotif({ ...notif, occupancy: v })} />
            <Toggle label="Issue assignments" value={notif.issues} onChange={v => setNotif({ ...notif, issues: v })} />
          </div>
        </Card>

        <Card title="Security">
          <div className="divide-y divide-[var(--wl-border)]">
            <Row label="Password"><button onClick={() => toast("Password change dialog (mock)")} className="text-xs px-2 py-1 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Change Password</button></Row>
            <Toggle label="Two-factor authentication" value={twoFA} onChange={setTwoFA} />
            <div className="py-3">
              <div className="text-sm text-[var(--wl-text-2)] mb-2">Active sessions</div>
              <div className="space-y-2 text-xs">
                <SessionRow device="MacBook Pro · Chrome" location="San Francisco, CA" last="Active now" current />
                <SessionRow device="iPhone 15 · Safari" location="San Francisco, CA" last="2h ago" />
                <SessionRow device="Windows · Edge" location="Seattle, WA" last="3d ago" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-[var(--wl-surface)] border-t border-[var(--wl-border)] flex justify-end gap-2">
        <button onClick={onBack} className="text-xs px-3 py-2 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Cancel</button>
        <button onClick={() => toast.success("Changes saved")} className="text-xs px-3 py-2 bg-[var(--wl-blue)] text-white rounded">Save Changes</button>
      </div>
    </div>
  );
}

function SessionRow({ device, location, last, current }: { device: string; location: string; last: string; current?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded border border-[var(--wl-border)]">
      <div>
        <div className="text-[var(--wl-text)]">{device} {current && <Badge tone="green">Current</Badge>}</div>
        <div className="text-[var(--wl-text-2)]">{location} · {last}</div>
      </div>
      {!current && <button className="text-[var(--wl-red)] hover:underline">Sign out</button>}
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-[var(--wl-text)]">{label}</span>
      <button onClick={() => onChange(!value)} className={`w-9 h-5 rounded-full relative transition-colors ${value ? "bg-[var(--wl-blue)]" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
