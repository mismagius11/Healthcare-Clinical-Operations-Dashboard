import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Sidebar, PageKey } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AlertsPanel } from "./components/AlertsPanel";
import { Dashboard, ProjectsPage, IssuesPage, PatientFlowPage, BedOccupancyPage, ReportsPage, StaffPage, AIInsightsPage, SettingsPage } from "./components/pages";

const pageLabels: Record<PageKey, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  issues: "Issues & Incidents",
  patients: "Patient Flow",
  beds: "Bed Occupancy",
  reports: "Reports & Analytics",
  staff: "Staff",
  ai: "AI Insights",
  settings: "Settings",
};

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState<PageKey>("dashboard");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [role, setRole] = useState<"ops" | "qa">("ops");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.style.setProperty("--wl-bg", "#0a0a0b");
      root.style.setProperty("--wl-surface", "#0f0f10");
      root.style.setProperty("--wl-card", "#161618");
      root.style.setProperty("--wl-border", "rgba(255,255,255,0.07)");
      root.style.setProperty("--wl-text", "#ededed");
      root.style.setProperty("--wl-text-2", "#a1a1aa");
    } else {
      root.style.setProperty("--wl-bg", "#fafafa");
      root.style.setProperty("--wl-surface", "#ffffff");
      root.style.setProperty("--wl-card", "#ffffff");
      root.style.setProperty("--wl-border", "rgba(0,0,0,0.08)");
      root.style.setProperty("--wl-text", "#1a1a1a");
      root.style.setProperty("--wl-text-2", "#6b7280");
    }
    root.style.setProperty("--wl-blue", "#4f8ef7");
    root.style.setProperty("--wl-green", "#3ecf8e");
    root.style.setProperty("--wl-red", "#f76b4f");
    root.style.setProperty("--wl-yellow", "#f7c14f");
    document.body.style.background = "var(--wl-bg)";
    document.body.style.fontFamily = "'Nunito', system-ui, sans-serif";
  }, [theme]);

  const initials = role === "ops" ? "SM" : "JK";
  const name = role === "ops" ? "Sarah Mitchell" : "Dr. James Kim";

  const navigate = (p: PageKey) => {
    setPage(p);
    if (p !== "settings") setShowProfile(false);
  };

  return (
    <div className="flex h-screen w-full" style={{ background: "var(--wl-bg)", fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        page={page}
        onNavigate={navigate}
        role={role}
        onRoleChange={setRole}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          pageLabel={pageLabels[page]}
          theme={theme}
          onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
          initials={initials}
          name={name}
          role={role}
          onRoleChange={setRole}
          unreadCount={unread}
          onOpenAlerts={() => setAlertsOpen(true)}
          onNavigateProfile={() => { setPage("settings"); setShowProfile(true); }}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {page === "dashboard" && <Dashboard name={name} />}
          {page === "projects" && <ProjectsPage />}
          {page === "issues" && <IssuesPage />}
          {page === "patients" && <PatientFlowPage />}
          {page === "beds" && <BedOccupancyPage />}
          {page === "reports" && <ReportsPage />}
          {page === "staff" && <StaffPage />}
          {page === "ai" && <AIInsightsPage />}
          {page === "settings" && (
            <SettingsPage
              theme={theme}
              onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
              role={role}
              collapsed={collapsed}
              onToggleCollapsed={() => setCollapsed(!collapsed)}
              showProfile={showProfile}
              onShowProfile={setShowProfile}
            />
          )}
        </main>
      </div>
      <AlertsPanel open={alertsOpen} onClose={() => setAlertsOpen(false)} onUnreadChange={setUnread} />
      <Toaster theme={theme} position="bottom-right" richColors closeButton />
    </div>
  );
}
