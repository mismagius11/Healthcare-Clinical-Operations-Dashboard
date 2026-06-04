export const clinics = ["St. Mary's Hospital", "East Bay Med Center", "Westside Clinic", "Central Medical", "Northside Clinic"];

export const kpis = [
  { label: "Active Projects", value: "24", delta: "+3 this month", tone: "green" },
  { label: "On-time Delivery", value: "87%", delta: "+5% vs last month", tone: "green" },
  { label: "Open Issues", value: "12", delta: "3 high priority", tone: "red", valueTone: "red" },
  { label: "Avg Cycle Time", value: "4.2d", delta: "-0.8d improved", tone: "green" },
  { label: "Bed Occupancy", value: "82%", delta: "target ≤85%", tone: "neutral" },
  { label: "Readmission Rate", value: "8.4%", delta: "+1.2% vs target", tone: "yellow", valueTone: "yellow" },
];

export const admissionsData = Array.from({ length: 24 }, (_, i) => {
  const day = i + 1;
  return {
    day: `Mar ${day}`,
    admissions: 12 + Math.round(Math.sin(i / 3) * 5 + (i % 4)),
    discharges: 10 + Math.round(Math.cos(i / 3) * 4 + (i % 3)),
  };
}).map((d, i, arr) => i === arr.length - 1 ? { ...d, admissions: 18, discharges: 14 } : d);

export const bedOccupancyData = [
  { clinic: "St. Mary's", value: 91, status: "Critical", tone: "red" },
  { clinic: "East Bay", value: 84, status: "Watch", tone: "yellow" },
  { clinic: "Westside", value: 78, status: "Watch", tone: "yellow" },
  { clinic: "Central Medical", value: 72, status: "OK", tone: "green" },
  { clinic: "Northside", value: 65, status: "OK", tone: "green" },
];

export const issuesStatus = [
  { name: "Open", value: 5, color: "#f76b4f" },
  { name: "In Review", value: 4, color: "#f7c14f" },
  { name: "Resolved", value: 3, color: "#3ecf8e" },
];

export const projects = [
  { name: "ICU Protocol Standardization", status: "On Track", owner: "Sarah Mitchell", clinic: "St. Mary's", risk: "High", cycle: "5.4d", alos: "+0.3d", updated: "2h ago" },
  { name: "Discharge Workflow Automation", status: "At Risk", owner: "Maria Torres", clinic: "Central Medical", risk: "Medium", cycle: "4.1d", alos: "-0.2d", updated: "5h ago" },
  { name: "Patient Record Sync v2", status: "On Track", owner: "Amir Chen", clinic: "East Bay", risk: "Low", cycle: "3.2d", alos: "0d", updated: "1d ago" },
  { name: "Readmission Reduction", status: "Delayed", owner: "Dr. James Kim", clinic: "Westside", risk: "High", cycle: "6.8d", alos: "+0.5d", updated: "3h ago" },
  { name: "Lab Result Pipeline", status: "On Track", owner: "Riya Patel", clinic: "Northside", risk: "Low", cycle: "2.9d", alos: "-0.1d", updated: "6h ago" },
  { name: "ER Triage Optimization", status: "On Track", owner: "Dr. Janet Okafor", clinic: "St. Mary's", risk: "Medium", cycle: "4.4d", alos: "-0.4d", updated: "12h ago" },
];

export const activity = [
  { tone: "red", title: "ICU capacity exceeded 90%", meta: "St. Mary's · Critical", time: "2 min ago" },
  { tone: "yellow", title: "Lab result delay", meta: "Westside · Warning", time: "18 min ago" },
  { tone: "green", title: "Discharge protocol updated", meta: "Central · Info", time: "1h ago" },
  { tone: "green", title: "Patient record sync resolved", meta: "Resolved", time: "2h ago" },
  { tone: "blue", title: "Q1 audit submitted", meta: "Info", time: "3h ago" },
];

export const issues = [
  { issue: "ICU bed shortage", type: "Capacity", clinic: "St. Mary's", dept: "ICU", severity: "High", assigned: "Sarah Mitchell", status: "Open", reported: "2h ago" },
  { issue: "Lab result delay >4h", type: "Process", clinic: "Westside", dept: "Radiology", severity: "Medium", assigned: "Amir Chen", status: "In Review", reported: "5h ago" },
  { issue: "Medication reconciliation error", type: "Safety", clinic: "East Bay", dept: "Cardiology", severity: "High", assigned: "Dr. James Kim", status: "Open", reported: "8h ago" },
  { issue: "Discharge paperwork backlog", type: "Process", clinic: "Central Medical", dept: "General Ward", severity: "Low", assigned: "Riya Patel", status: "Resolved", reported: "1d ago" },
  { issue: "Triage protocol drift", type: "Quality", clinic: "Northside", dept: "Emergency", severity: "Medium", assigned: "Dr. Janet Okafor", status: "In Review", reported: "1d ago" },
];

export const alosByDept = [
  { dept: "ICU", value: 7.2 },
  { dept: "Oncology", value: 6.3 },
  { dept: "Cardiology", value: 5.1 },
  { dept: "Surgery", value: 4.6 },
  { dept: "General Ward", value: 2.9 },
  { dept: "Emergency", value: 2.5 },
];

export const inpatients = [
  { id: "#PT-2418", dept: "ICU", clinic: "St. Mary's", admitted: "Mar 22", los: "3d", status: "Stable", risk: "High" },
  { id: "#PT-2401", dept: "Cardiology", clinic: "East Bay", admitted: "Mar 21", los: "4d", status: "Improving", risk: "Medium" },
  { id: "#PT-2389", dept: "Oncology", clinic: "Central Medical", admitted: "Mar 19", los: "6d", status: "Stable", risk: "High" },
  { id: "#PT-2376", dept: "Surgery", clinic: "Westside", admitted: "Mar 23", los: "2d", status: "Recovering", risk: "Low" },
  { id: "#PT-2365", dept: "General Ward", clinic: "Northside", admitted: "Mar 24", los: "1d", status: "Stable", risk: "Low" },
];

export const beds = [
  { clinic: "St. Mary's Hospital", total: 120, occupied: 109, available: 11, occupancy: 91, status: "Critical", trend: "up" },
  { clinic: "East Bay Med Center", total: 80, occupied: 67, available: 13, occupancy: 84, status: "Watch", trend: "up" },
  { clinic: "Westside Clinic", total: 60, occupied: 47, available: 13, occupancy: 78, status: "Watch", trend: "flat" },
  { clinic: "Central Medical", total: 70, occupied: 50, available: 20, occupancy: 72, status: "OK", trend: "down" },
  { clinic: "Northside Clinic", total: 50, occupied: 39, available: 11, occupancy: 65, status: "OK", trend: "down" },
];

export const cycleByMonth = [
  { month: "Jan", value: 5.2 }, { month: "Feb", value: 5.0 }, { month: "Mar", value: 4.7 },
  { month: "Apr", value: 4.5 }, { month: "May", value: 4.3 }, { month: "Jun", value: 4.2 },
];

export const otdByMonth = [
  { month: "Jan", value: 79 }, { month: "Feb", value: 81 }, { month: "Mar", value: 83 },
  { month: "Apr", value: 84 }, { month: "May", value: 86 }, { month: "Jun", value: 87 },
];

export const scorecard = [
  { clinic: "St. Mary's Hospital", otd: 84, cycle: 4.6, alos: 5.1, readmit: 9.2, issues: 5, score: "B" },
  { clinic: "East Bay Med Center", otd: 88, cycle: 4.2, alos: 4.4, readmit: 8.1, issues: 3, score: "A" },
  { clinic: "Westside Clinic", otd: 82, cycle: 4.8, alos: 4.9, readmit: 9.6, issues: 4, score: "B" },
  { clinic: "Central Medical", otd: 90, cycle: 3.9, alos: 4.0, readmit: 7.4, issues: 2, score: "A" },
  { clinic: "Northside Clinic", otd: 78, cycle: 5.1, alos: 5.3, readmit: 10.1, issues: 4, score: "C" },
];

export const staff = [
  { name: "Sarah Mitchell", role: "Ops Manager", clinic: "St. Mary's", dept: "Operations", projects: 6, patients: "—", status: "On Duty" },
  { name: "Dr. James Kim", role: "QA Lead", clinic: "Westside", dept: "Quality", projects: 4, patients: 12, status: "On Duty" },
  { name: "Maria Torres", role: "QA Lead", clinic: "Central Medical", dept: "Quality", projects: 3, patients: 8, status: "Training" },
  { name: "Amir Chen", role: "Analyst", clinic: "East Bay", dept: "Analytics", projects: 5, patients: "—", status: "On Duty" },
  { name: "Riya Patel", role: "Coordinator", clinic: "Northside", dept: "Operations", projects: 2, patients: 14, status: "Off Duty" },
  { name: "Dr. Janet Okafor", role: "Physician", clinic: "St. Mary's", dept: "Emergency", projects: 2, patients: 22, status: "On Duty" },
];
