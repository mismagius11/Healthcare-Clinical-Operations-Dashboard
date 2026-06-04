Fix these specific bugs. Be precise, don't break existing features.

## 1. REPORTS PAGE — Move CSV/PDF/Share buttons to page header

REMOVE the CSV/PDF/Share buttons from inside the "Clinic Performance Scorecard" card.

ADD them to the page header row — same row as "Reports & Analytics" title and 
the 7D/1M/3M/6M/1Y/YTD period toggle.

Layout of header row:
[Reports & Analytics title + subtitle on LEFT] [CSV | PDF | Share buttons + period toggle on RIGHT]

These buttons now export the FULL report (both charts + scorecard table), not just the table.

When clicking CSV: export all scorecard data as .csv
When clicking PDF: export full page (charts + table) — use window.print() with print styles
When clicking Share: show small popover with "Copy link" and "Email report" options

## 2. DROPDOWNS — Replace all native <select> with Radix UI DropdownMenu

The system-native dropdowns look wrong and appear in wrong positions.

Replace EVERY <select> element across the entire app with Radix UI DropdownMenu components.

Install if not present: @radix-ui/react-dropdown-menu (already in shadcn/ui)

Correct dropdown styling:
- Background: #1c1c1f (dark) / #ffffff (light)
- Border: 1px solid rgba(255,255,255,0.1) dark / 1px solid rgba(0,0,0,0.1) light  
- Border-radius: 8px
- Box-shadow: 0 8px 24px rgba(0,0,0,0.4)
- Item padding: 8px 12px
- Item hover: background rgba(255,255,255,0.06) dark / rgba(0,0,0,0.04) light
- Font-size: 13px
- z-index: 9999
- Animation: fade in + slide down 150ms ease

Positioning rules (use Radix align + side props):
- Dropdowns triggered from LEFT side of screen: align="start" side="bottom"
- Dropdowns triggered from RIGHT side (avatar, bell, share): align="end" side="bottom"
- Role switcher at BOTTOM of sidebar: side="top" align="start"
- sideOffset={4} on all dropdowns
- avoidCollisions={true} on all dropdowns — prevents going off screen

Dropdowns to fix:
1. Risk filter in Projects table
2. All filter dropdowns in Clinic Performance Scorecard (All/OTD/Score filters)  
3. Role switcher in sidebar bottom
4. Avatar/profile dropdown in header
5. Any other select elements across the app

## 3. HELP ICON (?) in header — Add contextual info panel

Currently clicking the ? icon does nothing. Fix:

When ? icon is clicked, open a slide-over panel from the RIGHT side (width 360px).
Panel title: "Help & Quick Reference"
Close button (X) in top right.

Panel content sections:

**Getting Started**
- "This dashboard provides real-time clinical operations data across 5 clinics"
- "Use the sidebar to navigate between sections"
- "Switch between Ops Manager and QA Lead views using the role selector"

**Keyboard Shortcuts** (table format, 2 columns: Action | Shortcut)
- Open search: ⌘K
- Toggle sidebar: ⌘B  
- Go to Dashboard: ⌘1
- Go to Projects: ⌘2
- Go to Issues: ⌘3
- Go to Reports: ⌘R
- Close any panel: Esc

**Dashboard Sections** (expandable accordion items)
- Dashboard: "Overview of all KPIs, patient flow, and recent activity"
- Projects: "Track clinical improvement projects with risk levels and cycle times"
- Issues: "Monitor and manage QA incidents and operational flags"
- Patients: "Real-time patient flow, admissions, discharges, and ALOS"
- Bed Occupancy: "Capacity monitoring with per-clinic breakdown and alerts"
- Reports: "Performance analytics with export and sharing capabilities"
- Staff: "Team management and clinical staff directory"
- AI Insights: "AI-powered analysis and recommendations"

**Status Legend** (colored badges with explanations)
- 🔴 Critical: "Requires immediate action"
- 🟡 Watch / Warning: "Monitor closely, approaching threshold"  
- 🟢 OK / Normal: "Within acceptable range"
- 🔵 Info: "Informational, no action required"

**Support**
- "For technical issues contact: support@wellora.health"
- "Documentation: docs.wellora.health"

Panel opens/closes with 200ms slide animation.
Closes on Escape key or clicking outside.

## 4. STAFF PAGE — Add search and sortable columns

**Add search input above the Team table:**
- Placeholder: "Search by name, role, clinic..."
- Real-time filter as user types (debounce 150ms)
- Searches across: Name, Role, Clinic, Dept columns
- Show "No staff members found" empty state with clear search button
- Position: top-left above table, width 280px

**Add filter dropdown next to search:**
- "All Status" dropdown: All | On Duty | Off Duty | Training | On Leave
- Filters Status column in real-time

**Make ALL columns sortable (click header to sort):**
- Name: alphabetical A-Z / Z-A
- Role: alphabetical
- Clinic: alphabetical  
- Dept: alphabetical
- Projects: numeric low-high / high-low
- Patients: numeric low-high / high-low
- Status: alphabetical

Sort indicator: show ↑ when ascending, ↓ when descending next to column name.
Default sort: Name ascending.
Only one column sorted at a time.

**Add row count:** Below table show "Showing X of 6 staff members"

Keep existing Actions column (three-dot menu) and Add Staff Member button.
Keep existing edit/view functionality.

## 5. GENERAL — Dark theme dropdown text color fix

In dark theme, ALL dropdown menus must have:
- Item text color: #ededed (not black, not system default)
- Muted/secondary text: #a1a1aa
- Selected item: color var(--accent) with checkmark icon
- Disabled items: #52525b

This fixes the white-background system dropdown appearing over dark UI.

Apply to every dropdown, select, popover, and context menu in the app.