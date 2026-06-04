import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { Sidebar, PageKey } from "./components/Sidebar";
import { Header } from "./components/Header";
import { AlertsPanel } from "./components/AlertsPanel";
import { HelpPanel } from "./components/HelpPanel";
import { LoginScreen } from "./components/LoginScreen";
import { CommandPalette } from "./components/CommandPalette";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { ConfirmDialog } from "./components/ConfirmDialog";
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

type Role = "ops" | "qa";

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState<PageKey>("dashboard");
  const [recent, setRecent] = useState<PageKey[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">(() => (typeof window !== "undefined" && localStorage.getItem("wl-theme") === "light" ? "light" : "dark"));
  const [role, setRole] = useState<Role>("ops");
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "account" | "notifications" | "security" | "appearance">("profile");
  const [issueFilter, setIssueFilter] = useState<{ clinic?: string } | null>(null);
  const [openNewIssue, setOpenNewIssue] = useState(false);
  const [openNewProject, setOpenNewProject] = useState(false);
  const [openAddStaff, setOpenAddStaff] = useState(false);

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
    root.style.setProperty("--wl-purple", "#a855f7");
    document.body.style.background = "var(--wl-bg)";
    document.body.style.fontFamily = "'Nunito', system-ui, sans-serif";
    localStorage.setItem("wl-theme", theme);
  }, [theme]);

  const initials = role === "ops" ? "SM" : "JK";
  const name = role === "ops" ? "Sarah Mitchell" : "Dr. James Kim";

  const navigate = (p: PageKey) => {
    setPage(p);
    setRecent(prev => [p, ...prev.filter(x => x !== p)].slice(0, 3));
  };

  const handleLogin = (r: Role) => {
    setRole(r);
    setAuthed(true);
    setTimeout(() => toast.success(`Welcome back, ${r === "ops" ? "Sarah Mitchell" : "Dr. James Kim"}!`), 100);
  };

  const handleSignOut = () => {
    setSignOutOpen(false);
    setAuthed(false);
    toast.success("Signed out");
  };

  useEffect(() => {
    if (!authed) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); return; }
      if (mod && e.key.toLowerCase() === "b") { e.preventDefault(); setCollapsed(c => !c); return; }
      if (mod && e.key.toLowerCase() === "r") { e.preventDefault(); navigate("reports"); return; }
      if (mod && ["1","2","3","4","5","6","7","8"].includes(e.key)) {
        e.preventDefault();
        const map: PageKey[] = ["dashboard","projects","issues","patients","beds","reports","staff","ai"];
        navigate(map[Number(e.key) - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authed]);

  // expose actions for sub-pages via window
  useEffect(() => {
    (window as any).wellora = {
      navigate: (p: PageKey, opts?: { issueClinic?: string }) => {
        navigate(p);
        if (opts?.issueClinic) setIssueFilter({ clinic: opts.issueClinic });
      },
      openNewIssue: () => setOpenNewIssue(true),
      openNewProject: () => setOpenNewProject(true),
      openAddStaff: () => setOpenAddStaff(true),
      openSettingsTab: (t: typeof settingsTab) => { setSettingsTab(t); navigate("settings"); },
    };
  });

  if (!authed) return (
    <>
      <LoginScreen onLogin={handleLogin} />
      <Toaster theme={theme} position="bottom-right" richColors closeButton />
    </>
  );

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
          onRoleChange={(r) => { setRole(r); toast.success(`Switched to ${r === "ops" ? "Ops Manager" : "QA Lead"}`); }}
          unreadCount={unread}
          onOpenAlerts={() => setAlertsOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
          onOpenSearch={() => setPaletteOpen(true)}
          onOpenShortcuts={() => setShortcutsOpen(true)}
          onSignOut={() => setSignOutOpen(true)}
          onNavigateProfile={() => { setSettingsTab("profile"); navigate("settings"); }}
          onNavigateAccount={() => { setSettingsTab("account"); navigate("settings"); }}
          onNavigateNotifications={() => { setSettingsTab("notifications"); navigate("settings"); }}
        />
        <main className="flex-1 overflow-y-auto p-4">
          {page === "dashboard" && <Dashboard name={name} role={role} onNavigate={navigate} />}
          {page === "projects" && <ProjectsPage role={role} openNew={openNewProject} onOpenNewChange={setOpenNewProject} />}
          {page === "issues" && <IssuesPage role={role} initialClinic={issueFilter?.clinic} onClearInitial={() => setIssueFilter(null)} openNew={openNewIssue} onOpenNewChange={setOpenNewIssue} />}
          {page === "patients" && <PatientFlowPage />}
          {page === "beds" && <BedOccupancyPage />}
          {page === "reports" && <ReportsPage role={role} />}
          {page === "staff" && <StaffPage role={role} openAdd={openAddStaff} onOpenAddChange={setOpenAddStaff} />}
          {page === "ai" && <AIInsightsPage />}
          {page === "settings" && (
            <SettingsPage
              theme={theme}
              onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
              setTheme={setTheme}
              role={role}
              collapsed={collapsed}
              onToggleCollapsed={() => setCollapsed(!collapsed)}
              tab={settingsTab}
              onTabChange={setSettingsTab}
            />
          )}
        </main>
      </div>
      <AlertsPanel open={alertsOpen} onClose={() => setAlertsOpen(false)} onUnreadChange={setUnread} onNavigate={(p) => { setAlertsOpen(false); navigate(p); }} />
      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigate}
        onAction={(a) => {
          if (a === "new-issue") { navigate("issues"); setOpenNewIssue(true); }
          else if (a === "add-staff") { navigate("staff"); setOpenAddStaff(true); }
          else if (a === "new-project") { navigate("projects"); setOpenNewProject(true); }
          else if (a === "generate-report") { navigate("reports"); toast("Open the CSV button in the header"); }
        }}
        recent={recent}
      />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ConfirmDialog
        open={signOutOpen}
        title="Sign out?"
        description="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        destructive
        onConfirm={handleSignOut}
        onCancel={() => setSignOutOpen(false)}
      />
      <Toaster theme={theme} position="bottom-right" richColors closeButton />
    </div>
  );
}
