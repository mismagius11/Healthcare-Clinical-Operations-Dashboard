Fix bugs and add major features to this dashboard. Apply enterprise B2B SaaS UX best practices throughout.

## BUG FIXES (do first)

1. REMOVE "LIVE" badge from sidebar logo — it's decorative noise with no functional value
2. FIX donut chart hover states in dark theme — tooltip text is invisible because it uses dark color on dark background. Fix: tooltip background #1c1c1f, text #ededed, border 1px solid rgba(255,255,255,0.12)
3. FIX light theme text conversion — ensure ALL text elements use CSS variables, not hardcoded hex colors. Audit every component for hardcoded #000, #111, #1a1a1a, #18181b and replace with var(--foreground) or var(--muted-foreground)

## NEW FEATURES

### 1. ALERTS SYSTEM
Add a global alerts panel accessible from the bell icon in the header.

When bell icon is clicked, open a slide-over panel (right side, 380px wide) with:
- Header: "Notifications" + "Mark all as read" button + close X
- Filter tabs: All | Critical | Warnings | Info
- Alert items with:
  - Icon (colored by severity: red/yellow/green/blue)
  - Title (bold)
  - Description (muted, 1 line)
  - Clinic + time ago
  - Unread dot indicator
  - Hover state with subtle bg change
- Alerts data:
  - 🔴 CRITICAL: "ICU Bed Capacity at 91%" — St. Mary's Hospital · 2 min ago (unread)
  - 🔴 CRITICAL: "Dosage Protocol Deviation Reported" — St. Mary's · ICU · 5 min ago (unread)
  - 🟡 WARNING: "Lab Result Delay Exceeding 48h" — Westside Clinic · 18 min ago (unread)
  - 🟡 WARNING: "Readmission Rate Above Target (8.4%)" — System-wide · 1h ago
  - 🟢 INFO: "Q1 Audit Report Submitted" — Central Medical · 3h ago
  - 🔵 INFO: "Staff Schedule Updated for Next Week" — East Bay · 5h ago
  - 🟢 INFO: "Discharge Protocol Update Applied" — Northside · 6h ago
- Red dot on bell icon shows count of unread (3)
- Clicking "Mark all as read" clears the dot and removes unread indicators

### 2. PROFILE DROPDOWN
When avatar (SM) in header is clicked, show a dropdown menu with:
- User info section at top: avatar circle + name + role badge
- Divider
- Menu items with icons:
  - My Profile
  - Account Settings  
  - Notification Preferences
  - Keyboard Shortcuts (shows ⌘K hint)
  - Divider
  - Switch Role (opens role switcher inline)
  - Divider
  - Sign Out (red text)
- Dropdown closes on outside click or Escape key

### 3. PROFILE SETTINGS PAGE (new sub-page under Settings)
Full profile edit form with sections:

**Personal Information**
- Avatar with upload button (click to change, shows initials fallback)
- Full Name (input)
- Job Title (input)
- Department (select: Operations / QA / Analytics / Clinical / Admin)
- Email (input, with verified badge)
- Phone (input)
- Timezone (select)

**Role & Access**
- Current Role: read-only badge (Ops Manager / QA Lead)
- Clinic Access: multi-select checkboxes for all 5 clinics
- Permissions: read-only list of current permissions

**Notification Preferences**
- Toggle switches (using shadcn Switch component) for:
  - Critical alerts (email)
  - Critical alerts (in-app)
  - Daily digest email
  - Weekly performance report
  - Bed occupancy warnings
  - Issue assignments

**Security**
- Change Password button (opens dialog)
- Two-factor authentication toggle
- Active sessions list (device, location, last active)

Save Changes / Cancel buttons at bottom (sticky footer).

### 4. STAFF PAGE — EDIT FUNCTIONALITY
Add full CRUD for staff members.

**Table improvements:**
- Add "Actions" column with three-dot menu per row
- Three-dot menu options: Edit, View Profile, Change Clinic, Deactivate
- "Add Staff Member" button in page header

**Edit Staff Drawer (right slide-over, 480px):**
Opens when clicking Edit from three-dot menu. Contains:
- Header: "Edit Staff Member" + close X
- Avatar with edit button
- Form fields:
  - Full Name (input)
  - Role (select: Ops Manager / QA Lead / Physician / Analyst / Coordinator / Nurse)
  - Department (select)
  - Clinic assignment (select from 5 clinics)
  - Email (input)
  - Phone (input)
  - Status (select: Active / On Leave / Inactive)
  - Projects assigned (multi-select)
  - Patients assigned (number input)
  - Notes (textarea)
- Footer: Save Changes | Cancel | Delete (red, with confirmation dialog)
- Optimistic update: table row updates immediately on save

**Add Staff Member Dialog (modal):**
Same fields as Edit but with "Create Staff Member" title and "Add Member" CTA.

### 5. CURRENT INPATIENTS TABLE — SEARCH & SORT
In the Patients page, Current Inpatients table:

**Search:**
- Search input above table: "Search patients..." with search icon
- Real-time filtering as user types
- Searches across: Patient ID, Department, Clinic, Status
- Shows "No patients found" empty state with clear search CTA
- Debounce 150ms

**Sortable columns (click header to sort):**
- Patient ID: alphabetical
- LOS: numeric (days)
- Admitted: chronological
- Status: alphabetical
- Show sort direction indicator (↑ ↓) on active column
- Default sort: LOS descending (most critical first — this is the clinically correct default)

**Row count indicator:** "Showing X of Y patients" below table

### 6. REPORTS — CHART PERIOD FILTERS
On the Reports page, add period filter controls:

**Global period filter** (top right of page):
- Toggle group: 7D | 1M | 3M | 6M | 1Y | YTD
- Default: 3M
- Updates all charts simultaneously

**Per-chart filters** where relevant:
- Cycle Time chart: also has clinic filter dropdown (All Clinics / individual clinic)
- On-time Delivery chart: also has role filter (All Teams / Ops / QA)

**Chart data updates:** When period changes, animate chart data update with 300ms transition. Use realistic data that changes meaningfully between periods (e.g., 7D shows daily granularity, 1M shows weekly, 3M+ shows monthly).

**Data for different periods:**
- 7D: [4.1, 4.0, 4.3, 4.2, 4.1, 4.0, 3.9] (cycle time, daily)
- 1M: [4.8, 4.5, 4.3, 4.2] (weekly)
- 3M: [5.2, 4.8, 5.1, 4.6, 4.3, 4.2, 4.0, 3.9, 4.1, 4.0, 3.8, 3.9] (monthly, current)
- 6M: [5.8, 5.5, 5.2, 4.8, 5.1, 4.6] (monthly)
- 1Y: [6.1, 5.9, 5.7, 5.8, 5.5, 5.2, 4.8, 5.1, 4.6, 4.3, 4.2, 4.0] (monthly)

### 7. UX QUALITY IMPROVEMENTS

**Empty states:** Every table must have a proper empty state:
- Illustration (simple SVG icon, not an image)
- Title: "No [items] found"
- Subtitle: contextual help text
- CTA button where applicable

**Loading states:** Add skeleton loaders (using shadcn Skeleton) for:
- KPI cards on initial load (shimmer animation, 1.2s)
- Chart areas (rectangle skeleton)
- Table rows (3 skeleton rows)
- Simulate 800ms loading delay on page navigation

**Tooltip on KPI cards:** On hover, show a tooltip explaining the metric:
- Active Projects: "Clinical improvement projects currently in progress across all clinics"
- On-time Delivery: "Percentage of projects completed within their scheduled timeline"
- Open Issues: "Total unresolved QA incidents and operational flags requiring attention"
- Avg Cycle Time: "Average days from project initiation to completion"
- Bed Occupancy: "Percentage of total beds currently occupied. Safe threshold: ≤85%"
- Readmission Rate: "30-day readmission rate. National benchmark: <7%"

**Confirmation dialogs:** All destructive actions (delete staff, deactivate, etc.) must show:
- shadcn AlertDialog
- Clear warning copy: "This action cannot be undone. [Staff name] will be removed..."
- Cancel + Confirm (red) buttons

**Toast notifications:** Use shadcn Sonner for:
- "Changes saved" (green) after any save
- "Staff member added" (green)
- "Staff member updated" (green)
- Error toasts (red) for failed operations

**Keyboard navigation:**
- Escape closes any open drawer/modal/dropdown
- ⌘K opens search (already exists, ensure it works)
- Arrow keys navigate table rows when focused

Keep all existing functionality. Do not break any existing features. Apply changes incrementally component by component.