import { useEffect, useMemo, useRef, useState } from "react";
import { Card, Kpi, Badge, PageHeading, chartTooltip, EmptyState } from "./ui-bits";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";
import { kpis, admissionsData, bedOccupancyData, issuesStatus, projects, activity, issues, alosByDept, inpatients as seedInpatients, beds, cycleByMonth, otdByMonth, scorecard, staff as seedStaff, clinics } from "./data";
import { StaffDrawer, StaffRow } from "./StaffDrawer";
import { AlertTriangle, CheckCircle2, FileText, TrendingUp, TrendingDown, Send, Sparkles, ArrowRight, Search, MoreVertical, Plus, ArrowUp, ArrowDown, ArrowUpDown, ShieldCheck } from "lucide-react";

const chartAxis = { stroke: "var(--wl-text-2)", fontSize: 11 };
const gridStroke = "var(--wl-border)";

function riskBadge(r: string) {
  return <Badge tone={r === "High" ? "red" : r === "Medium" ? "yellow" : "green"}>{r}</Badge>;
}

function statusBadge(s: string) {
  const tone = s === "On Track" || s === "Resolved" || s === "OK" || s === "On Duty" ? "green"
    : s === "At Risk" || s === "In Review" || s === "Watch" || s === "Training" ? "yellow"
    : s === "Delayed" || s === "Open" || s === "Critical" || s === "Inactive" ? "red"
    : "neutral";
  return <Badge tone={tone as any}>{s}</Badge>;
}

const kpiTooltips: Record<string, string> = {
  "Active Projects": "Clinical improvement projects currently in progress across all clinics",
  "On-time Delivery": "Percentage of projects completed within their scheduled timeline",
  "Open Issues": "Total unresolved QA incidents and operational flags requiring attention",
  "Avg Cycle Time": "Average days from project initiation to completion",
  "Bed Occupancy": "Percentage of total beds currently occupied. Safe threshold: ≤85%",
  "Readmission Rate": "30-day readmission rate. National benchmark: <7%",
};

export function Dashboard({ name }: { name: string }) {
  const [riskFilter, setRiskFilter] = useState("All");
  const filtered = projects.filter(p => riskFilter === "All" || p.risk === riskFilter);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div>
      <PageHeading title={`Good morning, ${name}`} subtitle={`${today} · 5 clinics · 312 patients in care`} />

      <div className="grid grid-cols-6 gap-3 mb-4">
        {kpis.map(k => <Kpi key={k.label} {...(k as any)} tooltip={kpiTooltips[k.label]} />)}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
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

        <Card title="Issues by Status">
          <div style={{ width: "100%", height: 224 }} className="relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={issuesStatus} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">
                  {issuesStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip {...chartTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-semibold text-[var(--wl-text)]">12</div>
              <div className="text-[10px] text-[var(--wl-text-2)] uppercase tracking-wider">total</div>
            </div>
          </div>
          <div className="flex justify-center gap-3 text-[11px] mt-2">
            {issuesStatus.map(s => (
              <span key={s.name} className="flex items-center gap-1 text-[var(--wl-text-2)]">
                <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />{s.name} {s.value}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-2" title="Projects" action={
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="bg-[var(--wl-surface)] text-xs text-[var(--wl-text)] border border-[var(--wl-border)] rounded px-2 py-1 outline-none">
            <option>All</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
        }>
          <ProjectsTable rows={filtered} />
        </Card>

        <Card title="Activity Feed" action={
          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--wl-green)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--wl-green)] animate-pulse" />Live
          </span>
        }>
          <div className="space-y-3">
            {activity.map((a, i) => {
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

function ProjectsTable({ rows, includeAlos = false }: { rows: typeof projects; includeAlos?: boolean }) {
  if (rows.length === 0) return <EmptyState title="No projects found" subtitle="Try adjusting your filters" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[var(--wl-text-2)] text-left">
            <th className="font-medium pb-2 pr-3">Project</th>
            <th className="font-medium pb-2 pr-3">Status</th>
            <th className="font-medium pb-2 pr-3">Owner</th>
            <th className="font-medium pb-2 pr-3">Clinic</th>
            <th className="font-medium pb-2 pr-3">Risk</th>
            <th className="font-medium pb-2 pr-3">Cycle</th>
            {includeAlos && <th className="font-medium pb-2 pr-3">ALOS Impact</th>}
            <th className="font-medium pb-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(p => (
            <tr key={p.name} className={`border-t border-[var(--wl-border)] ${p.risk === "High" ? "bg-[var(--wl-red)]/5" : ""}`}>
              <td className="py-2 pr-3 text-[var(--wl-text)]">{p.name}</td>
              <td className="py-2 pr-3">{statusBadge(p.status)}</td>
              <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.owner}</td>
              <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.clinic}</td>
              <td className="py-2 pr-3">{riskBadge(p.risk)}</td>
              <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.cycle}</td>
              {includeAlos && <td className="py-2 pr-3 text-[var(--wl-text-2)]">{p.alos}</td>}
              <td className="py-2 text-[var(--wl-text-2)]">{p.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProjectsPage() {
  const [risk, setRisk] = useState("All");
  const rows = projects.filter(p => risk === "All" || p.risk === risk);
  return (
    <div>
      <PageHeading title="Projects" subtitle="All clinical operations initiatives across the network" />
      <Card title="All Projects" action={
        <select value={risk} onChange={(e) => setRisk(e.target.value)} className="bg-[var(--wl-surface)] text-xs text-[var(--wl-text)] border border-[var(--wl-border)] rounded px-2 py-1 outline-none">
          <option>All</option><option>High</option><option>Medium</option><option>Low</option>
        </select>
      }>
        <ProjectsTable rows={rows} includeAlos />
      </Card>
    </div>
  );
}

export function IssuesPage() {
  return (
    <div>
      <PageHeading title="Issues & Incidents" subtitle="Active issues across the clinical network" />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Kpi label="Open" value="5" tone="red" valueTone="red" />
        <Kpi label="In Review" value="4" tone="yellow" valueTone="yellow" />
        <Kpi label="Resolved" value="3" tone="green" />
        <Kpi label="Avg Resolution" value="28h" tone="neutral" />
      </div>
      <Card title="Open Issues">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[var(--wl-text-2)] text-left">
              {["Issue","Type","Clinic","Dept","Severity","Assigned","Status","Reported"].map(h => <th key={h} className="font-medium pb-2 pr-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {issues.map((i, idx) => (
              <tr key={idx} className={`border-t border-[var(--wl-border)] ${i.severity === "High" ? "bg-[var(--wl-red)]/5" : ""}`}>
                <td className="py-2 pr-3 text-[var(--wl-text)]">{i.issue}</td>
                <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.type}</td>
                <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.clinic}</td>
                <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.dept}</td>
                <td className="py-2 pr-3">{riskBadge(i.severity)}</td>
                <td className="py-2 pr-3 text-[var(--wl-text-2)]">{i.assigned}</td>
                <td className="py-2 pr-3">{statusBadge(i.status)}</td>
                <td className="py-2 text-[var(--wl-text-2)]">{i.reported}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

type SortKey = "id" | "los" | "admitted" | "status" | null;

export function PatientFlowPage() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("los");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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
        <Card title="Daily Admissions — March 2026">
          <div style={{ width: "100%", height: 224 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionsData} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" {...chartAxis} tickLine={false} axisLine={false} interval={3} />
                <YAxis {...chartAxis} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="admissions" fill="#4f8ef7" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="ALOS by Department (days)">
          <div style={{ width: "100%", height: 224 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alosByDept} layout="vertical" margin={{ left: 10, right: 10, top: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" {...chartAxis} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="dept" {...chartAxis} tickLine={false} axisLine={false} width={80} />
                <Tooltip {...chartTooltip} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="value" fill="#3ecf8e" radius={[0,2,2,0]} />
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
            <table className="w-full text-xs">
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
                  <tr key={p.id} className={`border-t border-[var(--wl-border)] ${p.risk === "High" ? "bg-[var(--wl-red)]/5" : ""}`}>
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

export function BedOccupancyPage() {
  return (
    <div>
      <PageHeading title="Bed Occupancy" subtitle="Real-time capacity across the network" />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Kpi label="Total Beds" value="380" tone="neutral" />
        <Kpi label="Occupied" value="312" tone="neutral" />
        <Kpi label="Available" value="68" tone="green" />
        <Kpi label="Critical Clinics" value="1" tone="red" valueTone="red" />
      </div>
      <Card title="By Clinic">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[var(--wl-text-2)] text-left">
              {["Clinic","Total","Occupied","Available","Occupancy","Status","Trend"].map(h => <th key={h} className="font-medium pb-2 pr-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {beds.map(b => (
              <tr key={b.clinic} className={`border-t border-[var(--wl-border)] ${b.status === "Critical" ? "bg-[var(--wl-red)]/5" : ""}`}>
                <td className="py-2 pr-3 text-[var(--wl-text)]">{b.clinic}</td>
                <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.total}</td>
                <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.occupied}</td>
                <td className="py-2 pr-3 text-[var(--wl-text-2)]">{b.available}</td>
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/5 rounded">
                      <div className="h-full rounded" style={{ width: `${b.occupancy}%`, background: b.occupancy >= 90 ? "#f76b4f" : b.occupancy >= 80 ? "#f7c14f" : "#3ecf8e" }} />
                    </div>
                    <span className="text-[var(--wl-text-2)]">{b.occupancy}%</span>
                  </div>
                </td>
                <td className="py-2 pr-3">{statusBadge(b.status)}</td>
                <td className="py-2 text-[var(--wl-text-2)]">
                  {b.trend === "up" ? <TrendingUp size={13} className="text-[var(--wl-red)]" /> : b.trend === "down" ? <TrendingDown size={13} className="text-[var(--wl-green)]" /> : <ArrowRight size={13} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const cycleByPeriod: Record<string, { x: string; value: number }[]> = {
  "7D": [4.1,4.0,4.3,4.2,4.1,4.0,3.9].map((v,i)=>({ x: `D${i+1}`, value: v })),
  "1M": [4.8,4.5,4.3,4.2].map((v,i)=>({ x: `W${i+1}`, value: v })),
  "3M": cycleByMonth.slice(0,3).flatMap((m,mi)=>[0,1,2,3].map(w=>({ x: `${m.month} W${w+1}`, value: m.value - w*0.05 }))),
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

export function ReportsPage() {
  const [period, setPeriod] = useState<"7D"|"1M"|"3M"|"6M"|"1Y"|"YTD">("3M");
  const [clinicFilter, setClinicFilter] = useState("All Clinics");
  const [teamFilter, setTeamFilter] = useState("All Teams");

  return (
    <div>
      <PageHeading
        title="Reports & Analytics"
        subtitle="Network-wide performance over time"
        action={
          <div className="inline-flex border border-[var(--wl-border)] rounded overflow-hidden">
            {(["7D","1M","3M","6M","1Y","YTD"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 h-7 text-xs ${period === p ? "bg-[var(--wl-blue)] text-white" : "text-[var(--wl-text-2)] hover:text-[var(--wl-text)]"}`}
              >{p}</button>
            ))}
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card title="Avg Cycle Time (days)" action={
          <select value={clinicFilter} onChange={e => setClinicFilter(e.target.value)} className="bg-[var(--wl-surface)] text-xs text-[var(--wl-text)] border border-[var(--wl-border)] rounded px-2 py-1 outline-none">
            <option>All Clinics</option>
            {clinics.map(c => <option key={c}>{c}</option>)}
          </select>
        }>
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
        <Card title="On-time Delivery %" action={
          <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="bg-[var(--wl-surface)] text-xs text-[var(--wl-text)] border border-[var(--wl-border)] rounded px-2 py-1 outline-none">
            <option>All Teams</option><option>Ops</option><option>QA</option>
          </select>
        }>
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
      <Card title="Clinic Performance Scorecard">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[var(--wl-text-2)] text-left">
              {["Clinic","OTD %","Cycle","ALOS","Readmit %","Issues","Score"].map(h => <th key={h} className="font-medium pb-2 pr-3">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {scorecard.map(s => (
              <tr key={s.clinic} className="border-t border-[var(--wl-border)]">
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
      </Card>
    </div>
  );
}

export function StaffPage() {
  const [rows, setRows] = useState<StaffRow[]>(seedStaff as any);
  const [drawer, setDrawer] = useState<{ open: boolean; mode: "edit" | "create"; row: StaffRow | null }>({ open: false, mode: "edit", row: null });
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    const onClick = () => setMenuOpen(null);
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const onSave = (row: StaffRow) => {
    if (drawer.mode === "create") {
      setRows([...rows, row]);
      toast.success("Staff member added");
    } else if (drawer.row) {
      setRows(rows.map(r => r.name === drawer.row!.name ? row : r));
      toast.success("Staff member updated");
    }
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
        subtitle="Clinical and operations team across the network"
        action={
          <button
            onClick={() => setDrawer({ open: true, mode: "create", row: null })}
            className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-[var(--wl-blue)] text-white rounded"
          >
            <Plus size={12} />Add Staff Member
          </button>
        }
      />
      <div className="grid grid-cols-4 gap-3 mb-4">
        <Kpi label="Total Staff" value={String(rows.length)} tone="neutral" />
        <Kpi label="Staff-to-Patient" value="1:3.1" tone="neutral" />
        <Kpi label="On Duty" value={String(rows.filter(r => r.status === "On Duty").length)} tone="green" />
        <Kpi label="Training Compliance" value="94%" tone="green" />
      </div>
      <Card title="Team">
        {rows.length === 0 ? (
          <EmptyState title="No staff members" subtitle="Add your first team member to get started" action={
            <button onClick={() => setDrawer({ open: true, mode: "create", row: null })} className="text-xs px-3 py-1.5 bg-[var(--wl-blue)] text-white rounded inline-flex items-center gap-1"><Plus size={12} />Add Staff Member</button>
          } />
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[var(--wl-text-2)] text-left">
                {["Name","Role","Clinic","Dept","Projects","Patients","Status",""].map((h,i) => <th key={i} className="font-medium pb-2 pr-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map(s => (
                <tr key={s.name} className="border-t border-[var(--wl-border)]">
                  <td className="py-2 pr-3 text-[var(--wl-text)]">{s.name}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.role}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.clinic}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.dept}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.projects}</td>
                  <td className="py-2 pr-3 text-[var(--wl-text-2)]">{s.patients}</td>
                  <td className="py-2 pr-3">{statusBadge(s.status)}</td>
                  <td className="py-2 pr-3 relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === s.name ? null : s.name); }}
                      className="w-6 h-6 flex items-center justify-center text-[var(--wl-text-2)] hover:text-[var(--wl-text)] hover:bg-[var(--wl-surface)] rounded"
                    >
                      <MoreVertical size={13} />
                    </button>
                    {menuOpen === s.name && (
                      <div className="absolute right-0 top-7 z-10 w-40 bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md shadow-xl py-1" onClick={e => e.stopPropagation()}>
                        <MenuItem label="Edit" onClick={() => { setDrawer({ open: true, mode: "edit", row: s }); setMenuOpen(null); }} />
                        <MenuItem label="View Profile" onClick={() => { toast(`Viewing ${s.name}`); setMenuOpen(null); }} />
                        <MenuItem label="Change Clinic" onClick={() => { setDrawer({ open: true, mode: "edit", row: s }); setMenuOpen(null); }} />
                        <MenuItem label="Deactivate" danger onClick={() => {
                          setRows(rows.map(r => r.name === s.name ? { ...r, status: "Inactive" } : r));
                          toast.success(`${s.name} deactivated`);
                          setMenuOpen(null);
                        }} />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <StaffDrawer
        open={drawer.open}
        mode={drawer.mode}
        initial={drawer.row}
        onClose={() => setDrawer({ open: false, mode: "edit", row: null })}
        onSave={onSave}
        onDelete={drawer.mode === "edit" ? onDelete : undefined}
      />
    </div>
  );
}

function MenuItem({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[var(--wl-surface)] ${danger ? "text-[var(--wl-red)]" : "text-[var(--wl-text)]"}`}>{label}</button>
  );
}

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
            {h.items.map(it => (
              <div key={it} className="text-xs text-[var(--wl-text-2)] hover:text-[var(--wl-text)] cursor-pointer py-1">{it}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="bg-[var(--wl-card)] border border-[var(--wl-border)] rounded-md flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-md text-sm ${m.role === "user" ? "bg-[var(--wl-blue)] text-white" : "bg-[var(--wl-surface)] border border-[var(--wl-border)] text-[var(--wl-text)]"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--wl-border)] p-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Wellora AI…"
            className="flex-1 bg-[var(--wl-surface)] border border-[var(--wl-border)] rounded px-3 py-2 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]"
          />
          <button onClick={send} className="px-3 py-2 bg-[var(--wl-blue)] text-white rounded text-sm flex items-center gap-1"><Send size={13} />Send</button>
        </div>
      </div>
    </div>
  );
}

type SettingsProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  role: "ops" | "qa";
  collapsed: boolean;
  onToggleCollapsed: () => void;
  showProfile: boolean;
  onShowProfile: (v: boolean) => void;
};

export function SettingsPage({ theme, onToggleTheme, role, collapsed, onToggleCollapsed, showProfile, onShowProfile }: SettingsProps) {
  const roleName = role === "ops" ? "Sarah Mitchell (Ops Manager)" : "Dr. James Kim (QA Lead)";
  if (showProfile) return <ProfileSection role={role} onBack={() => onShowProfile(false)} />;

  return (
    <div>
      <PageHeading title="Settings" subtitle="Configure your workspace" />
      <div className="grid grid-cols-2 gap-3 max-w-3xl">
        <Card title="Workspace">
          <div className="divide-y divide-[var(--wl-border)]">
            <Row label="Theme">
              <button onClick={onToggleTheme} className="px-2 py-1 border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)]">
                {theme === "dark" ? "Dark" : "Light"}
              </button>
            </Row>
            <Row label="Signed in as"><span className="text-xs text-[var(--wl-text)]">{roleName}</span></Row>
            <Row label="Clinic scope"><span className="text-xs text-[var(--wl-text)]">All 5 clinics</span></Row>
            <Row label="Notifications"><Badge tone="green">Enabled</Badge></Row>
            <Row label="Data refresh interval"><span className="text-xs text-[var(--wl-text)]">30 seconds</span></Row>
            <Row label="Sidebar collapsed by default">
              <button onClick={onToggleCollapsed} className="px-2 py-1 border border-[var(--wl-border)] rounded text-xs text-[var(--wl-text)]">
                {collapsed ? "Collapsed" : "Expanded"}
              </button>
            </Row>
          </div>
        </Card>
        <Card title="Account">
          <div className="text-xs text-[var(--wl-text-2)] mb-3">Manage your personal information, role access, notifications, and security.</div>
          <button onClick={() => onShowProfile(true)} className="text-xs px-3 py-1.5 bg-[var(--wl-blue)] text-white rounded">Open profile settings</button>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-[var(--wl-text-2)]">{label}</span>
      {children}
    </div>
  );
}

function ProfileSection({ role, onBack }: { role: "ops" | "qa"; onBack: () => void }) {
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
    critEmail: true, critInApp: true, daily: false, weekly: true, occupancy: true, issues: true,
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
            <div className="w-14 h-14 rounded-full bg-[var(--wl-blue)]/20 text-[var(--wl-blue)] flex items-center justify-center text-lg font-semibold">
              {form.fullName.split(" ").map(s => s[0]).slice(0,2).join("")}
            </div>
            <button className="text-xs px-2 py-1 border border-[var(--wl-border)] rounded text-[var(--wl-text-2)]">Upload new</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name"><TextInput value={form.fullName} onChange={v => setForm({ ...form, fullName: v })} /></Field>
            <Field label="Job Title"><TextInput value={form.title} onChange={v => setForm({ ...form, title: v })} /></Field>
            <Field label="Department">
              <SelectInput value={form.department} options={["Operations","QA","Analytics","Clinical","Admin"]} onChange={v => setForm({ ...form, department: v })} />
            </Field>
            <Field label="Email">
              <div className="flex gap-2 items-center">
                <TextInput value={form.email} onChange={v => setForm({ ...form, email: v })} />
                <Badge tone="green"><ShieldCheck size={10} />Verified</Badge>
              </div>
            </Field>
            <Field label="Phone"><TextInput value={form.phone} onChange={v => setForm({ ...form, phone: v })} /></Field>
            <Field label="Timezone">
              <SelectInput value={form.timezone} options={["America/Los_Angeles","America/Denver","America/Chicago","America/New_York","UTC"]} onChange={v => setForm({ ...form, timezone: v })} />
            </Field>
          </div>
        </Card>

        <Card title="Role & Access">
          <div className="space-y-3">
            <Row label="Current Role">
              <Badge tone="blue">{isOps ? "Ops Manager" : "QA Lead"}</Badge>
            </Row>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-[var(--wl-text-2)] mb-2">Clinic Access</div>
              <div className="grid grid-cols-2 gap-2">
                {clinics.map(c => (
                  <label key={c} className="flex items-center gap-2 text-xs text-[var(--wl-text)]">
                    <input type="checkbox" checked={access[c]} onChange={e => setAccess({ ...access, [c]: e.target.checked })} />
                    {c}
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
            <Row label="Password">
              <button onClick={() => toast("Password change dialog (mock)")} className="text-xs px-2 py-1 border border-[var(--wl-border)] rounded text-[var(--wl-text)]">Change Password</button>
            </Row>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wide text-[var(--wl-text-2)] mb-1">{label}</div>
      {children}
    </label>
  );
}
function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]" />;
}
function SelectInput({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-[var(--wl-card)] border border-[var(--wl-border)] rounded px-2 py-1.5 text-sm text-[var(--wl-text)] outline-none focus:border-[var(--wl-blue)]">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-[var(--wl-text)]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full relative transition-colors ${value ? "bg-[var(--wl-blue)]" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}
