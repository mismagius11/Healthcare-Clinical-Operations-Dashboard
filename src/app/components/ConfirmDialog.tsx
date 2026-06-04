import { Modal } from "./ui-bits";

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, description, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive, onConfirm, onCancel }: Props) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      width={400}
      footer={
        <>
          <button
            onClick={onCancel}
            className="px-3 h-8 text-xs rounded border border-[var(--wl-border)] text-[var(--wl-text)] hover:bg-[var(--wl-card)]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 h-8 text-xs rounded text-white ${destructive ? "bg-[var(--wl-red)] hover:opacity-90" : "bg-[var(--wl-blue)] hover:opacity-90"}`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {description && <div className="text-sm text-[var(--wl-text-2)]">{description}</div>}
    </Modal>
  );
}
