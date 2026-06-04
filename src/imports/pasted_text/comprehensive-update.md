This is the FINAL comprehensive update. Every button, action, and 
interaction must work end-to-end. Fix everything and add missing flows.
Use Claude Opus level reasoning. Do not skip anything.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — GLOBAL: EVERY BUTTON MUST WORK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit EVERY button/link/icon across all pages and components.
Each must have a real action. No dead clicks anywhere.

HEADER buttons:
- Search (⌘K): opens Command palette modal with fuzzy search across 
  pages, projects, staff, issues. Results grouped by category.
  Navigate to result on Enter or click.
- Theme toggle (sun/moon): switches dark/light theme globally. 
  Persists in localStorage.
- Bell icon: opens AlertsPanel slide-over (already exists — ensure it works)
- Help (?) icon: opens HelpPanel slide-over (already exists — ensure it works)
- Avatar (SM/JK): opens ProfileDropdown (already exists — ensure it works)

ProfileDropdown items — each must work:
- "My Profile" → navigates to Settings page, opens Profile tab
- "Account Settings" → navigates to Settings page, opens Account tab
- "Notification Preferences" → navigates to Settings page, opens Notifications tab
- "Keyboard Shortcuts" → opens KeyboardShortcuts modal (list of shortcuts)
- "Switch Role" → toggles between Ops Manager and QA Lead inline, 
  shows toast "Switched to [role]", closes dropdown
- "Sign Out" → shows AlertDialog "Are you sure you want to sign out?" 
  Cancel | Sign Out. On confirm: shows toast "Signed out", 
  resets to login screen (simple login page — see below)

AlertsPanel — "Mark all as read":
- Removes unread dots from all alerts
- Sets bell badge count to 0
- Shows toast "All notifications marked as read"

AlertsPanel — each alert item click:
- If linked to a page (bed capacity → Bed Occupancy, 
  issue → Issues page): navigate to that page and close panel
- Highlight relevant row if applicable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — LOGIN SCREEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a login screen shown before the dashboard.
Store auth state in React useState (no real backend needed).

Login page design:
- Full screen, dark background #0a0a0b
- Center card (400px wide, dark surface bg, border, border-radius 12px, padding 32px)
- Wellora logo + name at top (same as sidebar)
- Subtitle: "Clinical Operations Platform"
- Divider

Two login options (role-based):

Option 1 button (full width, blue):
  Avatar circle "SM" + "Sign in as Sarah Mitchell" + "Ops Manager" muted below
  
Option 2 button (full width, outline):
  Avatar circle "JK" + "Sign in as Dr. James Kim" + "QA Lead" muted below

Below buttons: muted text "Demo environment — no real data"

On clicking either button:
- Show loading spinner for 800ms (simulates auth)
- Navigate to dashboard with correct role pre-selected
- Show toast "Welcome back, [name]!"

Sign Out (from ProfileDropdown) returns to this login screen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — DASHBOARD PAGE — ALL INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KPI cards — hover tooltip (already requested, ensure works):
Each card has info (i) icon, hover shows tooltip next to icon.

Activity Feed items — each item clickable:
- ICU capacity → navigate to Bed Occupancy page
- Lab result delay → navigate to Issues page, filter by Westside
- Protocol update → navigate to Projects page
- Record sync → navigate to Issues page
- Audit report → navigate to Reports page

"View all" links on charts → navigate to relevant page:
- Admissions chart "View all" → Patients page
- Bed Occupancy "View all" → Bed Occupancy page

Projects table row click → opens ProjectDetailModal (already exists — ensure works)
Projects filter dropdown → filters table in real time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 4 — ISSUES PAGE — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"+ Report Issue" button → opens NewIssueModal:

NewIssueModal form fields:
- Issue Title* (text input)
- Type* (Select: Capacity | Safety | Quality | Process | Equipment | Compliance)
- Severity* (Select: Critical | High | Medium | Low)
- Clinic* (Select: all 5 clinics)
- Department* (Select: ICU | Emergency | Cardiology | Surgery | Oncology | General Ward | Radiology | Lab | Admin)
- Assigned To* (Select: all 6 staff with initials avatar)
- Patient Impact (Select: None | Low | Medium | High | Critical)
- Description* (Textarea, 4 rows)
- Beds Affected (number, only visible if Type = Capacity)
- Estimated Resolution (date input)

Validation: required fields show red border + helper text on submit if empty.

On successful submit:
→ Close modal
→ Add new issue to TOP of table with new ID (#ISS-00X)
→ Increment "Open" KPI card by 1
→ Toast (green): "Issue #ISS-00X reported successfully"
→ Add bell notification with new issue

Issue row click → opens IssueDetailPanel (right slide-over 520px):

IssueDetailPanel — all interactive elements:

Status badge (pill) → click opens inline dropdown:
Options: Open | In Review | Resolved | Closed
On change: update badge color, update table row, 
toast "Status updated to [status]"
If changed to Resolved: decrement Open count, increment Resolved count

Severity badge → click opens dropdown (Critical/High/Medium/Low)
On change: update badge, update table row

"Reassign" button → opens dropdown of all staff
On select: update assignee, toast "[Name] assigned to this issue"

"Add Comment" button → focuses textarea at bottom of panel
Textarea submit (Enter or button): 
→ Adds comment to activity feed with current user + "just now"
→ Clears textarea
→ Scrolls to bottom of feed

"Attach File" button → shows toast "File upload coming soon"
(acceptable for demo — don't show broken file picker)

"Link to Project" button → opens dropdown of 6 projects
On select: adds "Linked to [Project Name]" entry to activity feed
toast "Issue linked to [project]"

"Escalate" button → opens EscalationModal:
Fields:
- Escalate to (Select: Clinical Director | Chief Medical Officer | Senior Management | Regulatory Body)
- Reason* (Textarea)
- Urgency (Select: Standard | Urgent | Emergency)
- Notify via (Checkboxes: Email | SMS | Dashboard alert)
On submit:
→ Close modal
→ Add "Escalated to [person]" in activity feed
→ If severity not Critical: change to Critical
→ Toast (red): "Issue escalated to [person]"

"Mark as Resolved" footer button:
→ Change status to Resolved
→ Decrement Open KPI, increment Resolved KPI
→ Toast "Issue marked as resolved"
→ Close panel after 500ms

Bulk actions (checkboxes):
When rows selected → show bulk bar:
"Assign to" dropdown → assigns all selected to chosen staff member
  → Toast "[X] issues assigned to [name]"
"Change Status" dropdown → updates all selected
  → Toast "[X] issues updated to [status]"
"Close Selected" → sets all to Closed, removes from Open count
  → Confirm dialog first: "Close [X] issues? This cannot be undone."
  → Toast "[X] issues closed"

Filter dropdowns (Severity/Status/Type/Clinic/Assigned):
→ Each filters table in real time
→ Show row count: "Showing X of Y issues"
→ "Clear filters" button resets all

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 5 — STAFF PAGE — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"+ Add Staff Member" button → opens AddStaffModal (Dialog):
Same fields as EditStaffDrawer.
On submit:
→ Add to table
→ Update "Total Staff" KPI
→ Toast "Staff member added successfully"

Three-dot menu per row — each item works:

"Edit" → opens StaffDrawer (already exists):
All fields editable. On save:
→ Update table row optimistically
→ Toast "Changes saved"

"View Profile" → opens StaffProfileModal (new):
Read-only view showing all staff info in a clean profile card layout:
- Large avatar circle (initials)
- Name, role, clinic, department
- Contact: email, phone (placeholder values)
- Stats: Projects, Patients, Status
- Current projects list (from data)
- Recent activity (3 placeholder items)
Close button only.

"Change Clinic" → opens small Dialog:
Title: "Change Clinic for [Name]"
Single select of 5 clinics (current pre-selected)
Confirm button: "Update Clinic"
→ Update table cell
→ Toast "[Name] moved to [Clinic]"

"Deactivate" → opens AlertDialog:
"Deactivate [Name]? They will lose access to Wellora."
Cancel | Deactivate (red)
→ Change Status badge to "Inactive" (gray)
→ Toast "[Name] has been deactivated"

Search input → filters by name, role, clinic, dept in real time
Status filter dropdown → filters by status
Sort on all column headers → ↑↓ indicators

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 6 — BED OCCUPANCY — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick action buttons (add if not present):

"Add Bed Block" (orange) → opens BedBlockModal:
Fields: Clinic* | Ward* | Number of beds* | Reason* | Start Date* | End Date* | Notes
On submit:
→ Decrement Available count for that clinic in table
→ Toast "Bed block added for [Clinic] — [Ward]"
→ Add entry to a "Recent Actions" feed below table

"Request Transfer" (blue) → opens TransferRequestModal:
Fields: Patient ID* | From Clinic* | To Clinic* (shows available beds) 
| Department* | Priority* | Reason*
On submit:
→ Toast "Transfer request submitted for [Patient ID]"
→ Add entry to Recent Actions feed

"Generate Report" (outline) → triggers CSV download:
Filename: wellora-bed-report-[date].csv
Content: table data (all columns)
Toast "Report downloaded"

"Set Threshold Alert" (outline) → opens ThresholdModal:
Per-clinic sliders (range 70-100%, default 85%)
Email toggle per clinic
On save: toast "Alert thresholds updated"

Clinic table rows → clickable, opens ClinicDetailPanel (right 480px):
Shows: clinic name, all bed stats, current ward breakdown,
list of pending admissions (3 placeholder patients),
Recent actions for that clinic
Close button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 7 — PATIENTS PAGE — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Period filter (Today/7D/1M/3M) → updates both charts with animation.

Current Inpatients table:
- Search → real time filter
- Sort all columns → ↑↓ indicators, default LOS desc
- Row count: "Showing X of Y patients"
- Row click → opens PatientDetailPanel (right 480px):
  Shows: Patient ID, Dept, Clinic, Admitted date, LOS,
  Status badge, Risk badge, Attending physician,
  Diagnosis (placeholder: "Post-operative monitoring"),
  Medications (2-3 placeholder items),
  Notes textarea (editable),
  "Discharge Patient" button (green outline):
    → AlertDialog "Discharge #PT-XXXX?" Confirm | Cancel
    → On confirm: remove from table, decrement patient count, 
      toast "Patient #PT-XXXX discharged"
  "Flag for Review" button (yellow outline):
    → Changes Risk to High
    → Toast "Patient flagged for review"
    Close button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 8 — REPORTS PAGE — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Period toggle (7D/1M/3M/6M/1Y/YTD) at TOP RIGHT of page:
→ Updates BOTH charts simultaneously
→ 300ms animation on data change
→ Move CSV/PDF/Share buttons to same row as title (left=title, right=buttons+period)

CSV button → downloads scorecard table as .csv
PDF button → window.print() with print-friendly CSS
Share button → opens ShareModal:
  - "Copy link" button → copies window.location.href → toast "Link copied!"
  - "Email report" → opens mailto: with subject "Wellora Q1 2025 Performance Report"
  - "Slack" → toast "Connect Slack in Settings to enable"

Scorecard table:
- Search → filters by clinic name
- Score filter, OTD filter, All filters → real time
- Sort all columns
- Row click → opens ClinicReportPanel (right 480px):
  Shows full clinic breakdown: all metrics, trend sparkline,
  Issues list for that clinic, top performing staff,
  "Download Clinic Report" button → CSV for that clinic only

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 9 — SETTINGS PAGE — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Settings page must have TABS:
[Profile] [Account] [Notifications] [Security] [Appearance]

TAB: Profile
- Avatar with "Change photo" button → toast "Photo upload coming soon"
- Full Name input → editable, Save button
- Job Title input
- Department select
- Email with "Verified" green badge (read-only)
- Phone input
- Timezone select
- "Save Changes" button → toast "Profile updated"
- "Cancel" button → reverts changes

TAB: Account
- Current Role: badge (read-only)
- Clinic Access: checkboxes for all 5 clinics (all checked by default)
- "Save Access Settings" → toast "Access settings saved"
- Danger Zone section:
  - "Delete Account" button (red outline) → AlertDialog warning

TAB: Notifications
- Toggle switches (shadcn Switch):
  - Critical alerts (in-app): ON by default
  - Critical alerts (email): ON
  - Daily digest: OFF
  - Weekly report: ON
  - Bed occupancy warnings: ON
  - Issue assignments: ON
- Each toggle change → toast "Notification preference updated"
- "Save All" button → toast "Notification preferences saved"

TAB: Security
- "Change Password" button → opens ChangePasswordModal:
  Fields: Current Password | New Password | Confirm Password
  Validate: passwords match, min 8 chars
  Submit → toast "Password updated successfully"
- Two-Factor Authentication: Switch toggle
  When turned ON → shows QR code placeholder + toast "2FA enabled"
- Active Sessions section:
  Table: Device | Location | Last Active | Action
  3 rows of realistic data:
  - MacBook Pro · Kyiv, Ukraine · Just now · (current — no action)
  - iPhone 14 · Kyiv, Ukraine · 2h ago · [Revoke] button
  - Chrome on Windows · Lviv, Ukraine · 1d ago · [Revoke] button
  Revoke → removes row + toast "Session revoked"

TAB: Appearance
- Theme: Dark / Light / System toggle group
  → Changes theme immediately
- Sidebar: Expanded / Collapsed toggle
  → Changes sidebar state immediately
- Language: Select (English only, others show "Coming soon" toast)
- Density: Comfortable / Compact toggle
  (Compact reduces table row padding by 4px)
- "Save Appearance" → toast "Appearance settings saved"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 10 — AI INSIGHTS PAGE — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This page should feel like a real AI assistant for clinical ops.

Layout (like the NeuroBank reference):
- Left panel (280px): Chat history list
  - "New Chat" button (blue) → clears current chat, starts fresh
  - Search chats input
  - Grouped: Today | Yesterday | Last 7 days
  - Chat items clickable → loads that conversation
  - Each item: icon + title + delete (X on hover)

- Main area: chat interface
  - Messages from AI and user
  - Input bar at bottom

Pre-populate 4 saved chats with realistic titles:
Today: "ICU Capacity Analysis", "Readmission Risk Report"
Yesterday: "Q1 Performance Summary", "Staff Workload Review"

Input bar:
- Textarea (Enter sends, Shift+Enter newline)
- Send button → adds user message + triggers AI response after 800ms
- Attach button → toast "File analysis coming soon"
- Clear button (X) → clears input

AI responses — rotating realistic answers based on keywords:
If message contains "bed" or "capacity":
→ "St. Mary's ICU is at 91% capacity — the highest across the network. 
   I recommend reviewing the 6 patients with LOS >5 days for discharge eligibility. 
   East Bay is also approaching the 85% warning threshold at 84%."

If message contains "issue" or "incident":
→ "There are currently 5 open issues, 3 of which are High severity. 
   Dr. James Kim has the highest assignment load with 3 active issues. 
   The average resolution time of 28h exceeds your 24h target."

If message contains "readmission" or "patient":
→ "St. Mary's has the highest 30-day readmission rate at 11.2%, 
   significantly above the 7% national benchmark. 
   The Readmission Reduction project (currently delayed) is the primary 
   initiative to address this — I'd recommend escalating its priority."

If message contains "staff" or "team":
→ "Maria Torres is currently on training leave, creating a QA coverage gap 
   at Central Medical. Dr. James Kim is covering 3 clinics simultaneously. 
   Consider redistributing 1-2 of his assignments."

If message contains "report" or "performance":
→ "Q1 2025 performance summary: On-time delivery improved to 87% (+8pp YoY). 
   Central Medical is the top performer (Score: A). 
   St. Mary's needs attention — readmission rate and cycle time both above target."

Default/fallback response:
→ "I've analyzed the latest data across all 5 clinics. 
   Key insight: 2 critical issues require immediate attention at St. Mary's. 
   Bed occupancy is at 82% network-wide. What specific area would you like to explore?"

Suggested prompts (chips below input, disappear after first message):
- "Summarize today's critical alerts"
- "Which clinic needs the most attention?"
- "Show me readmission risk factors"
- "Compare this week vs last week"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 11 — PROJECTS PAGE — COMPLETE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add to page header:
- Search input: "Search projects..."
- Status filter: All | On Track | At Risk | Delayed
- Risk filter: All | High | Medium | Low
- "+ New Project" button (blue)

"+ New Project" → opens NewProjectModal:
Fields: Project Name* | Clinic* | Owner* | Department* 
| Target Date* | Risk Level* | Description*
On submit: add to table, toast "Project created successfully"

Row click → ProjectDetailModal (already exists — ensure all tabs work):

ProjectDetailModal — all buttons:
- "Edit Project" footer button → switches modal to edit mode:
  All fields become editable inputs
  Footer changes to: "Save Changes" | "Cancel"
  On save: update modal data + table row + toast "Project updated"
- Tab 3 "Team & Issues" — "Link Issue" button:
  → Opens dropdown of current issues
  → On select: adds to Related Issues list
- Tab 2 "Timeline" — milestone checkboxes:
  → Clickable: marks milestone complete/incomplete
  → Updates progress bar percentage
  → Toast "Milestone marked as [complete/incomplete]"

Three-dot filter in table header:
→ Already exists, ensure it filters correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 12 — GLOBAL UX POLISH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KEYBOARD SHORTCUTS (implement all):
- ⌘K: open Command palette
- ⌘B: toggle sidebar collapse
- Escape: close any open modal, panel, or dropdown
- ⌘1–8: navigate to pages (Dashboard, Projects, Issues, Patients, Beds, Reports, Staff, AI)
- ⌘R: go to Reports

COMMAND PALETTE (⌘K):
Modal overlay, centered, 560px wide
Search input at top (auto-focused)
Results grouped:
- Pages: Dashboard, Projects, Issues...
- Recent: last 3 visited pages
- Actions: "Report new issue", "Add staff member", "Generate report"
- Staff: matching staff members
Arrow keys to navigate, Enter to select, Escape to close

TOAST NOTIFICATIONS (sonner):
- Position: bottom-right
- Duration: 3000ms (errors: 5000ms)
- Success: green left border
- Error: red left border
- Info: blue left border
- Warning: yellow left border

LOADING STATES:
- Page navigation: show skeleton loaders for 600ms
- KPI cards: shimmer animation on initial load
- Tables: 3 skeleton rows while loading

EMPTY STATES — all tables:
When search/filter returns 0 results:
Icon + "No [items] found" + "Try adjusting your filters" + "Clear filters" CTA

CONFIRMATION DIALOGS — all destructive actions use AlertDialog:
- Delete / Deactivate / Sign out / Close issues / Revoke session
- Always: Cancel (outline) | Confirm (red/destructive)

RESPONSIVE:
- Sidebar collapses to icon-only at <1280px automatically
- Tables get horizontal scroll at <1024px
- No content overflow at any width

Do everything. Every interaction matters. 
This is a portfolio demo — make it feel production-ready.
Do not break existing features. Apply changes component by component.
Use existing shadcn/ui components throughout.