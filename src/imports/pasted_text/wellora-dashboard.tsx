Build a fully functional Healthcare Clinical Operations Dashboard called "Wellora" as a React web application.

## Visual Style
- Font: Nunito (Google Fonts)
- Dark theme by default with light theme toggle
- Color palette:
  - Background: #0a0a0b
  - Surface: #0f0f10
  - Card: #161618
  - Border: rgba(255,255,255,0.07)
  - Text primary: #ededed
  - Text secondary: #a1a1aa
  - Accent blue: #4f8ef7
  - Accent green: #3ecf8e
  - Accent red: #f76b4f
  - Accent yellow: #f7c14f
- Thin borders (0.5–1px), no shadows, flat surfaces
- Supabase-inspired aesthetic: minimal, clean, dark

## Layout
Collapsible sidebar (216px expanded / 48px collapsed) + main content area with fixed header (48px).

### Sidebar contains:
- Logo: Wellora with blue square icon + LIVE badge
- Toggle button on sidebar edge to collapse/expand
- Navigation sections:
  - Overview: Dashboard, Projects, Issues (badge: 3 red)
  - Clinical: Patients (badge: 142 yellow), Bed Occupancy
  - Analytics: Reports, Staff, AI Insights
  - System: Settings
- Bottom: Role switcher (Ops Manager / QA Lead) — hidden when collapsed, show avatar instead

### Header contains:
- Breadcrumb navigation (Wellora > Current Page)
- Search bar with ⌘K shortcut
- Theme toggle button (sun/moon icon)
- Bell notification button with red dot
- Help button
- User avatar (SM initials)

## Pages & Content

### 1. Dashboard (default)
**Page title:** "Good morning, Sarah Mitchell" + subtitle with date

**6 KPI Cards (grid 6 columns):**
- Active Projects: 24, +3 this month (green trend)
- On-time Delivery: 87%, +5% vs last month (green)
- Open Issues: 12 in red, 3 high priority (red trend)
- Avg Cycle Time: 4.2d, -0.8d improved (green)
- Bed Occupancy: 82%, target ≤85% (neutral)
- Readmission Rate: 8.4% in yellow, +1.2% vs target (yellow)

**Row of 3 charts:**
- Line chart "Patient Admissions & Discharges" — 2 lines (blue solid + green dashed), data for March days 1–24, today: 18 adm · 14 dis
- Bar chart "Bed Occupancy by Clinic" with colored progress bars:
  - St. Mary's 91% red Critical
  - East Bay 84% yellow Watch
  - Westside 78% yellow Watch
  - Central Medical 72% green OK
  - Northside 65% green OK
- Donut chart "Issues by Status": 5 open (red), 4 review (yellow), 3 resolved (green), center shows "12 total"

**Bottom row 2 columns:**
- Projects table with filter dropdown (All Risk / High / Medium / Low):
  Columns: Project | Status | Owner | Clinic | Risk | Cycle | Updated
  Rows: 6 projects, High Risk rows have subtle red background highlight
- Activity Feed with icon badges:
  - 🔴 ICU capacity exceeded 90% — St. Mary's (Critical, 2 min ago)
  - 🟡 Lab result delay — Westside (Warning, 18 min ago)
  - 🟢 Discharge protocol updated — Central (Info, 1h ago)
  - 🟢 Patient record sync resolved (Resolved, 2h ago)
  - 🔵 Q1 audit submitted (Info, 3h ago)
  Live badge with pulsing green dot

### 2. Projects
Full projects table:
Columns: Project | Status | Owner | Clinic | Risk | Cycle | ALOS Impact | Updated
Data: 6 projects with realistic healthcare names

### 3. Issues & Incidents
4 KPI cards: Open 5 (red) | In Review 4 (yellow) | Resolved 3 (green) | Avg Resolution 28h
Table: Issue | Type | Clinic | Dept | Severity | Assigned | Status | Reported
5 rows, High risk rows highlighted

### 4. Patient Flow
4 KPI cards: Admitted Today 18 | Discharged 14 | ALOS 3.8d | Readmission 8.4%
Bar chart: Daily Admissions March 2025
Horizontal bar chart: ALOS by Department (ICU 7.2d, Oncology 6.3d, Cardiology 5.1d, Surgery 4.6d, General Ward 2.9d, Emergency 2.5d)
Table: Current Inpatients — Patient ID, Dept, Clinic, Admitted, LOS, Status, Risk

### 5. Bed Occupancy
4 KPI cards: Total 380 | Occupied 312 | Available 68 (green) | Critical 1 (red)
Table: 5 clinics with Total/Occupied/Available/Occupancy%/Status/Trend columns

### 6. Reports & Analytics
2 charts side by side:
- Bar chart: Avg Cycle Time by month (Jan–Jun, trending down from 5.2 to 4.2)
- Line chart: On-time Delivery % (Jan–Jun, trending up 79%→87%, y-axis 70–100%)
Clinic Performance Scorecard table: 5 clinics with OTD/Cycle/ALOS/Readmit/Issues/Score columns, graded A/B/C

### 7. Staff
4 KPI cards: Total 48 | Staff-to-Patient 1:3.1 | On Duty 32 (green) | Training 94%
Table: 6 staff members with Name/Role/Clinic/Dept/Projects/Patients/Status

### 8. AI Insights
Full-screen chat interface:
- Left sidebar with chat history (Today: Year Income, Yesterday: Monthly Budget, etc.)
- Main chat area with message bubbles (user right blue, AI left dark card)
- Pre-populated conversation about ICU issues and readmission rates
- Input bar with send button
- AI name: "Wellora AI"

### 9. Settings
Simple form card:
- Theme toggle (Dark/Light)
- Signed in as (role-dependent)
- Clinic scope
- Notifications status
- Data refresh interval
- Sidebar collapse toggle

## Interactions
- Sidebar collapse/expand with smooth animation (200ms)
- Dark/light theme toggle — all colors update
- Role switcher: Ops Manager (Sarah Mitchell, SM) / QA Lead (Dr. James Kim, JK) — updates greeting, avatar initials
- Projects table filter by risk level
- AI chat: functional input, rotating responses about bed occupancy/ALOS/readmissions/cycle time
- All navigation links work between pages
- Breadcrumb updates with current page name
- High Risk table rows: subtle red background highlight
- Badges in sidebar update on navigation

## Data
Use realistic healthcare data:
- 5 clinics: St. Mary's Hospital, East Bay Med Center, Westside Clinic, Central Medical, Northside Clinic
- Departments: ICU, Cardiology, Oncology, Surgery, Emergency, General Ward, Radiology
- Staff: Sarah Mitchell (Ops Manager), Dr. James Kim (QA Lead), Maria Torres (QA Lead), Amir Chen (Analyst), Riya Patel (Coordinator), Dr. Janet Okafor (Physician)
- Patient IDs: #PT-2418, #PT-2401, #PT-2389, #PT-2376, #PT-2365

## Technical
- React with hooks (useState, useEffect)
- Chart.js or Recharts for all charts
- Tabler Icons for all icons
- CSS variables for theming (easy dark/light switch)
- Responsive: works at 1440px, degrades gracefully to 1024px
- No external API calls — all mock data hardcoded