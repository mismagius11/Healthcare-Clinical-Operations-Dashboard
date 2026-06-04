Fix bugs and implement major UX improvements across the dashboard.
Use enterprise B2B SaaS best practices throughout. 15+ years UX expertise level.

## 1. INFO ICON — TOOLTIP FIX
Currently clicking info icon does nothing. Fix:
- Remove click behavior entirely
- Show tooltip ON HOVER only, positioned RIGHT NEXT TO the icon (not center screen)
- Tooltip: max-width 220px, dark bg #1c1c1f, border 1px solid rgba(255,255,255,0.1), 
  border-radius 6px, padding 8px 12px, font-size 12px, z-index 9999
- Position: appear to the RIGHT of icon, or BELOW if near right edge (auto-flip)
- Add small arrow pointer toward the icon
- Disappears on mouse-leave with 100ms delay

Tooltip content per KPI:
- Active Projects: "Clinical improvement projects currently in progress across all clinics"
- On-time Delivery: "% of projects completed on schedule. Industry benchmark: >85%"
- Open Issues: "Unresolved QA incidents requiring attention. 3 are high priority"
- Avg Cycle Time: "Average days from project start to completion. Target: <4.5d"
- Bed Occupancy: "% of total beds occupied. Safe operational threshold: ≤85%"
- Readmission Rate: "30-day readmission rate. National benchmark: <7%"

## 2. ROLE SWITCHER — FULL LOGIC (most important fix)

Implement completely different views per role:

### OPS MANAGER VIEW (Sarah Mitchell, SM avatar)
Full access to everything. Current view is correct.
Dashboard shows all 6 KPI cards.
All nav items visible.
Page title: "Good morning, Sarah Mitchell"

### QA LEAD VIEW (Dr. James Kim, JK avatar)
When QA Lead is selected, the ENTIRE dashboard changes:

**Header:** 
- Avatar shows "JK", name shows "Dr. James Kim"
- Role badge shows "QA Lead" in purple instead of blue

**Dashboard page title:** "Good morning, Dr. James Kim"
**Dashboard subtitle:** "QA Operations · 3 critical issues require your attention"

**KPI cards — different set for QA Lead (6 cards):**
- Open Issues: 12 (red) — "3 high priority"
- Critical Incidents: 2 (red) — "Require immediate action"  
- Avg Resolution Time: 28h (yellow) — "Target <24h"
- Issues Resolved (week): 3 (green) — "+1 vs last week"
- QA Pass Rate: 94% (green) — "+2% this month"
- Compliance Score: 87% (yellow) — "Target >90%"

**Dashboard charts for QA Lead:**
- Replace "Patient Admissions & Discharges" with "Issue Volume Over Time" 
  (line chart, same style, data: weekly issues opened vs resolved)
- Keep "Bed Occupancy by Clinic" (relevant for QA too)
- Keep donut chart but title changes to "Issues by Severity" 
  (Critical 2, High 3, Medium 4, Low 3)

**Projects table for QA Lead:**
- Shows only projects with risk High or Medium
- Extra column: "QA Status" (Passed/In Review/Failed)
- Default filter: High risk

**Activity Feed for QA Lead:**
- Shows only QA-relevant events (incidents, protocol deviations, audit items)

**Navigation for QA Lead:**
- Hide "Bed Occupancy" from nav (not QA's primary concern)
- Highlight "Issues" in nav with red indicator
- Add visual indicator on nav: "2 Critical" badge on Issues

**Issues page for QA Lead:**
- Show "My Assigned Issues" tab as default (instead of All)
- Show only issues assigned to Dr. James Kim by default
- Add "Escalate" action button on critical issues

**Staff page for QA Lead:**
- Read-only (no edit buttons)
- Can only view, not modify

**Reports page for QA Lead:**
- Default tab changes to "QA Reports" showing:
  - Issue trend chart
  - Resolution time chart  
  - Compliance score over time
  - QA Pass Rate by clinic

**Settings page for QA Lead:**
- Shows "QA Lead" role badge
- Notification preferences default to: Critical alerts ON, All issues ON

**Visual indicator in sidebar:**
- Show current role pill at bottom with color: blue for Ops Manager, purple for QA Lead
- Small role icon next to name

## 3. DROPDOWN POSITIONING — FIX ALL

All dropdowns are appearing in wrong positions. Fix globally:

Use Radix UI Popover/DropdownMenu with these settings:
- side="bottom" align="start" for left-aligned triggers
- side="bottom" align="end" for right-aligned triggers (avatar, bell)
- sideOffset={4}
- Prevent viewport overflow: add avoidCollisions={true}
- All dropdowns: z-index 9999, appear BELOW their trigger button
- Role switcher dropdown: appears above the trigger (side="top") since it's at bottom of sidebar

Fix specifically:
- Avatar dropdown: align="end", appears below avatar in top-right
- Role switcher: side="top", align="start", appears above the switcher
- Risk filter dropdown in projects table: side="bottom", align="start"
- Any select/filter dropdowns in tables: appear directly below the select trigger

## 4. PATIENT FLOW PAGE — DATE PERIOD FILTER

Add period filter for both charts on Patient Flow page:

**Filter control (top right of each chart card):**
Toggle group: Today | 7D | 1M | 3M
Default: 1M

**Chart data by period:**

Today (hourly, 8 data points):
- Admissions: [2, 3, 4, 3, 2, 2, 1, 1]
- Labels: [8am, 9am, 10am, 11am, 12pm, 1pm, 2pm, 3pm]

7D (daily):
- Admissions: [14, 18, 16, 22, 19, 17, 18]
- Labels: [Mon, Tue, Wed, Thu, Fri, Sat, Sun]

1M (current, weekly):
- Admissions: [68, 74, 71, 80, 76, 72, 78, 82, 75, 79, 81, 77, 18]
- Labels: Mar 1–24 daily

3M (monthly aggregates):
- Admissions: [312, 298, 341]
- Labels: [Jan, Feb, Mar]

ALOS chart also updates by period with appropriate data.
Animate chart update with 300ms ease transition.

## 5. BED OCCUPANCY PAGE — MAJOR EXPANSION

This page needs significant UX work for Operations Manager workflow:

### Add to top of page — Quick Actions bar:
Row of action buttons below KPI cards:
- "Add Bed Block" (orange) — opens modal to mark beds unavailable
- "Request Transfer" (blue) — opens modal to request inter-clinic transfer  
- "Generate Report" (outline) — downloads occupancy report as CSV
- "Set Threshold Alert" (outline) — opens modal to configure alert thresholds

### Expand the table with more columns:
Current: Clinic | Total | Occupied | Available | Occupancy | Status | Trend
Add these columns:
- ICU Beds: show ICU-specific count and occupancy (e.g. "12/14 — 86%")
- Avg LOS: average length of stay for that clinic
- Pending Admissions: patients waiting for beds
- Last Updated: timestamp

### Add "Bed Block" modal (opens from Add Bed Block button):
Fields:
- Clinic (select)
- Ward/Department (select: ICU, General, Surgery, Cardiology, Oncology, Emergency)
- Number of beds to block (number input, min 1)
- Reason (select: Maintenance, Deep Cleaning, Renovation, Equipment Failure, Infection Control)
- Start Date (date picker)
- End Date (date picker)
- Notes (textarea)
CTA: "Block Beds" (orange) | Cancel

### Add "Transfer Request" modal:
Fields:
- Patient ID (input with search)
- From Clinic (select)
- To Clinic (select — shows available beds count next to each option)
- Department (select)
- Priority (select: Routine, Urgent, Emergency)
- Reason (textarea)
- Requested by (auto-filled with current user)
CTA: "Submit Transfer Request" | Cancel

### Add "Alert Threshold" modal:
- Per-clinic threshold sliders (60%–100%, default 85%)
- Global threshold toggle
- Email notification toggle per level (Warning at X%, Critical at Y%)
- Save Configuration button

### Add below table — Bed Availability Heatmap:
Simple visual grid showing bed status by ward and clinic:
- Rows: clinics
- Columns: departments (ICU, Surgery, Cardiology, General, Emergency, Oncology)
- Each cell: colored square showing occupancy % with number
  - Green: <75%, Yellow: 75-85%, Red: >85%
- Cell click opens detail popover with: Total/Occupied/Available for that ward

## 6. REPORTS PAGE — FILTER, SEARCH, EXPORT

### Add to Clinic Performance Scorecard table:
**Search input** above table: "Search clinics or metrics..."
- Real-time filter across Clinic name column
- Shows "No results found" empty state

**Column filters:**
- Score filter: dropdown (All / A / B / C)
- OTD filter: dropdown (All / >90% / 80-90% / <80%)
- Risk filter: dropdown (All / High Risk / Normal)

**Sortable columns:**
Click any column header to sort ascending/descending
Show ↑↓ indicator on active sort column
Default sort: Score descending (A first)

### Export functionality:
Add export bar above table:
- "Download CSV" button (outline) — exports table data as .csv file
  Filename: wellora-report-[date].csv
  Include all columns
- "Download PDF" button (outline) — generates printable PDF with:
  - Wellora logo/name
  - Report title and date range
  - All chart images (use html2canvas or similar)
  - Scorecard table
- "Share" button — opens share modal with:
  - "Copy link" (copies current URL with filters as params)
  - "Email report" (opens mailto: with pre-filled subject "Wellora Q1 2025 Report")
  - "Export to Slack" (shows message: "Connect Slack in Settings to enable")

### Chart period filters (already requested, implement here too):
Global period selector: 7D | 1M | 3M | 6M | 1Y | YTD
Default: 3M
Updates all charts simultaneously with animation.

## 7. GENERAL UX FIXES

**Toast notifications:** Ensure sonner toasts appear in bottom-right, not overlapping content.

**Empty states:** All tables when filtered to 0 results show:
- Icon (search or folder)
- "No results found"
- "Try adjusting your filters" 
- "Clear filters" button

**Responsive behavior:** Ensure nothing overflows horizontally at 1440px width.

**Table row hover:** Ensure consistent hover bg across all tables in both dark and light themes.

Keep all existing functionality. Do not break anything that currently works.
Apply all changes carefully, component by component.