import { Modal } from "./ui-bits";

const rows: [string, string][] = [
  ["Open command palette", "⌘K"],
  ["Toggle sidebar", "⌘B"],
  ["Go to Dashboard", "⌘1"],
  ["Go to Projects", "⌘2"],
  ["Go to Issues", "⌘3"],
  ["Go to Patients", "⌘4"],
  ["Go to Bed Occupancy", "⌘5"],
  ["Go to Reports", "⌘6"],
  ["Go to Staff", "⌘7"],
  ["Go to AI Insights", "⌘8"],
  ["Quick Reports", "⌘R"],
  ["Close any panel", "Esc"],
];

export function KeyboardShortcutsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" width={420}>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([a, s]) => (
            <tr key={a} className="border-t border-[var(--wl-border)] first:border-t-0">
              <td className="py-2 text-[var(--wl-text-2)]">{a}</td>
              <td className="py-2 text-right"><span className="text-[11px] text-[var(--wl-text)] border border-[var(--wl-border)] rounded px-1.5 py-0.5">{s}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
