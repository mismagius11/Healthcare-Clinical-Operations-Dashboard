Fix table header inconsistencies and add project detail modal.

## 1. TABLE HEADERS — Fix font size consistency across ALL tables

Problem: table headers have inconsistent font sizes across different pages.

Apply these exact styles to EVERY table header (th) across the entire app:
- font-size: 11px
- font-weight: 600
- text-transform: uppercase
- letter-spacing: 0.06em
- color: var(--muted-foreground) — muted gray, NOT white
- padding: 0 12px 10px
- border-bottom: 1px solid var(--border)

Apply these exact styles to EVERY table cell (td) across the entire app:
- font-size: 13px
- font-weight: 400
- color: var(--muted-foreground)
- padding: 10px 12px
- border-bottom: 1px solid var(--border)

First column (name/id) in every table:
- font-size: 13px
- font-weight: 500
- color: var(--foreground) — primary white/dark text

Tables to fix (check all of them):
- Projects table (All Projects)
- Issues table
- Current Inpatients table (Patients page)
- Bed Occupancy table
- Clinic Performance Scorecard (Reports)
- Staff/Team table
- Any other tables in the app

## 2. PROJECT DETAIL MODAL

When user clicks on any project row in the Projects table,
open a modal (Dialog) with full project details.

Modal specs:
- Width: 680px, max-height: 90vh, scrollable
- Dark bg: #161618, border: 1px solid rgba(255,255,255,0.1)
- Border-radius: 12px
- Close button (X) top right
- Closes on Escape or clicking backdrop

### Modal header section:
- Project name (h2, 20px, font-weight 600)
- Status badge (On Track / At Risk / Delayed) — colored pill
- Risk badge (High/Medium/Low) next to status
- Last updated timestamp (muted, 12px)

### Tab navigation inside modal (3 tabs):
[Overview] [Timeline] [Team & Issues]

---

### TAB 1: Overview

**Two column grid layout:**

Left column:
- **Project Details** section:
  - Clinic: value
  - Owner: value (with small avatar circle showing initials)
  - Department: value
  - Start Date: value
  - Target Completion: value
  - Actual Cycle Time: value
  - ALOS Impact: value (green if negative = improvement, red if positive = worse)

- **Objectives** section:
  Plain text description of project goal, 2-3 sentences relevant to healthcare.
  Example for "ICU Protocol Standardization":
  "Standardize medication dosage protocols across all ICU units to reduce 
  deviation incidents. Targets a 40% reduction in protocol-related QA flags 
  and improvement in average cycle time by 1.2 days."

Right column:
- **Progress** section:
  - Overall progress bar (0-100%) with percentage label
  - Milestone list (4 items) each with:
    - Checkbox icon (completed = green check, pending = gray circle)
    - Milestone name
    - Due date
    - Status badge
  
  Example milestones for ICU Protocol:
  1. ✅ Initial audit completed — Mar 5 — Completed
  2. ✅ Protocol draft reviewed — Mar 12 — Completed  
  3. 🔄 Staff training sessions — Mar 28 — In Progress
  4. ⏳ Final QA sign-off — Apr 10 — Pending

- **Risk Assessment** section:
  - Risk level badge
  - Risk description (1-2 sentences)
  - Mitigation plan (1 sentence)

- **Key Metrics** section (small stat cards, 2x2 grid):
  - Cycle Time: actual vs target
  - Issues Found: count
  - Staff Involved: count
  - Compliance Score: percentage

---

### TAB 2: Timeline

Visual timeline showing project phases as horizontal bars (Gantt-style).

Phases (each as a row):
1. Planning & Audit
2. Protocol Design
3. Stakeholder Review
4. Staff Training
5. Implementation
6. QA Sign-off

Each row shows:
- Phase name (left, 140px fixed width)
- Progress bar spanning appropriate date range
- Status dot (green=done, blue=active, gray=pending)
- Date range label

Use a simple CSS-based Gantt chart (no external library needed):
- Container: position relative, overflow-x auto
- Month headers: Jan | Feb | Mar | Apr
- Bars: absolute positioned, colored by status
- Today line: vertical red dashed line at current date position

---

### TAB 3: Team & Issues

**Team members on this project** (list):
Each member row:
- Avatar circle with initials
- Name + Role
- Clinic
- Contribution badge (Lead / Contributor / Reviewer)

**Related Issues** (table):
Columns: Issue | Severity | Status | Assigned | Reported
Show issues linked to this clinic/project.
If no issues: show "No issues linked to this project" empty state.

**Activity Log** (feed):
Last 5 activities:
- Avatar + name + action + timestamp
Examples:
- "Sarah Mitchell updated the protocol draft — 2h ago"
- "Dr. James Kim flagged a QA concern — 1d ago"  
- "System: Milestone 2 marked complete — Mar 12"

---

### Modal footer:
Left side: "Created Mar 1, 2025 · Last modified [date]"
Right side: 
- "Edit Project" button (outline)
- "Close" button (ghost)

---

### Project data for each of the 6 projects:

**ICU Protocol Standardization** (High risk, On Track)
- Clinic: St. Mary's Hospital
- Owner: Sarah Mitchell
- Dept: ICU / Operations
- Start: Feb 15, 2025
- Target: Apr 15, 2025
- Progress: 65%
- ALOS Impact: +0.3d
- Objectives: "Standardize medication dosage protocols across all ICU units to reduce deviation incidents and improve response consistency."
- Milestones: Audit ✅, Draft reviewed ✅, Staff training 🔄, QA sign-off ⏳

**Discharge Workflow Automation** (Medium, At Risk)
- Clinic: Central Medical
- Owner: Maria Torres
- Dept: Operations
- Start: Jan 20, 2025
- Target: Mar 31, 2025
- Progress: 78%
- ALOS Impact: -0.2d
- Objectives: "Automate discharge documentation to reduce average processing time from 4.1 to 2.5 hours, freeing bed capacity faster."
- Milestones: Requirements ✅, Dev complete ✅, UAT testing 🔄, Go-live ⏳

**Patient Record Sync v2** (Low, On Track)
- Clinic: East Bay Med Center
- Owner: Amir Chen
- Dept: Analytics / IT
- Start: Feb 1, 2025
- Target: Apr 1, 2025
- Progress: 85%
- ALOS Impact: 0d
- Objectives: "Upgrade patient record synchronization between EHR systems to eliminate data lag and reduce manual entry errors."
- Milestones: Architecture ✅, Backend ✅, Frontend ✅, Testing 🔄

**Readmission Reduction** (High, Delayed)
- Clinic: Westside Clinic
- Owner: Dr. James Kim
- Dept: QA / Clinical
- Start: Jan 10, 2025
- Target: Mar 15, 2025
- Progress: 45%
- ALOS Impact: +0.5d
- Objectives: "Implement post-discharge follow-up protocol to reduce 30-day readmission rate from 8.6% to below 7% target."
- Milestones: Patient selection ✅, Protocol design 🔄, Staff briefing ⏳, Monitoring ⏳

**Lab Result Pipeline** (Low, On Track)
- Clinic: Northside Clinic
- Owner: Riya Patel
- Dept: Operations / Lab
- Start: Feb 20, 2025
- Target: Mar 30, 2025
- Progress: 90%
- ALOS Impact: -0.1d
- Objectives: "Optimize lab result delivery pipeline to reduce average turnaround from 52 hours to under 24 hours."
- Milestones: Audit ✅, Process redesign ✅, System config ✅, Final testing 🔄

**ER Triage Optimization** (Medium, On Track)
- Clinic: St. Mary's Hospital
- Owner: Dr. Janet Okafor
- Dept: Emergency
- Start: Feb 10, 2025
- Target: Apr 20, 2025
- Progress: 55%
- ALOS Impact: -0.4d
- Objectives: "Redesign ER triage workflow to reduce average wait time from 2.5 hours to under 45 minutes using acuity-based prioritization."
- Milestones: Current state audit ✅, New protocol design ✅, Staff training 🔄, Live monitoring ⏳