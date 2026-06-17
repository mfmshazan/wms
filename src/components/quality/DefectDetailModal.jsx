import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

function formatTimestamp(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function severityVariant(severity) {
  if (severity === "Critical") return "low"; // red
  if (severity === "Major") return "warning"; // orange
  if (severity === "Minor") return "active"; // yellow-ish?
  return "inactive";
}

function statusVariant(status) {
  if (status === "Open") return "low";
  if (status === "Under Review") return "warning";
  if (status === "Resolved") return "active";
  return "inactive"; // Closed
}

/**
 * DefectDetailModal — read-only view of a defect with an Edit Status button.
 * Props:
 *   defect - full defect object
 *   onClose - closes the modal
 *   onEdit(defect) - opens the status edit modal
 */
export function DefectDetailModal({ defect, onClose, onEdit }) {
  if (!defect) return null;

  return (
    <Modal title="Defect Details" onClose={onClose}>
      <div className="flex flex-col gap-5">
        {/* ── Header info ── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-wms-purple text-sm font-bold">
              {defect.defectId}
            </p>
            <p className="text-xs text-wms-muted mt-0.5">
              Reported {formatTimestamp(defect.timestamp)}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant={severityVariant(defect.severity)}>
              {defect.severity.toUpperCase()}
            </Badge>
            <Badge variant={statusVariant(defect.status)}>
              {defect.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* ── Section 1: Product info ── */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-wms-muted">Product & Context</p>
          <div className="bg-wms-bg border border-wms-border rounded-xl px-4 py-3 grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div>
              <p className="text-wms-muted uppercase tracking-widest mb-0.5">SKU</p>
              <p className="font-mono text-wms-green">{defect.sku}</p>
            </div>
            <div>
              <p className="text-wms-muted uppercase tracking-widest mb-0.5">Product</p>
              <p className="text-wms-text">{defect.productName}</p>
            </div>
            <div>
              <p className="text-wms-muted uppercase tracking-widest mb-0.5">Qty Affected</p>
              <p className="font-mono text-wms-text">{defect.quantity}</p>
            </div>
            <div>
              <p className="text-wms-muted uppercase tracking-widest mb-0.5">Linked Inspection</p>
              <p className="font-mono text-wms-purple">{defect.inspectionId || "—"}</p>
            </div>
            {defect.criterionLabel && (
              <div className="col-span-2">
                <p className="text-wms-muted uppercase tracking-widest mb-0.5">Failed Criterion</p>
                <p className="text-wms-text">{defect.criterionLabel}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 2: Defect details ── */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-wms-muted">Issue Details</p>
          <div className="bg-wms-bg border border-wms-border rounded-xl px-4 py-3 flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-wms-muted uppercase tracking-widest mb-0.5">Type</p>
                <p className="text-wms-text">{defect.type}</p>
              </div>
              <div>
                <p className="text-wms-muted uppercase tracking-widest mb-0.5">Disposition</p>
                <p className="text-wms-text">{defect.disposition}</p>
              </div>
            </div>
            <div>
              <p className="text-wms-muted uppercase tracking-widest mb-0.5">Description</p>
              <p className="text-wms-text leading-relaxed">{defect.description}</p>
            </div>
            {defect.rootCause && (
              <div>
                <p className="text-wms-muted uppercase tracking-widest mb-0.5">Root Cause</p>
                <p className="text-wms-text leading-relaxed">{defect.rootCause}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Section 3: Assignment ── */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-wms-muted">Assignment</p>
          <div className="bg-wms-bg border border-wms-border rounded-xl px-4 py-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-wms-muted uppercase tracking-widest mb-0.5">Reported By</p>
              <p className="text-wms-text">{defect.reportedBy}</p>
            </div>
            <div>
              <p className="text-wms-muted uppercase tracking-widest mb-0.5">Assigned To</p>
              <p className="text-wms-text">{defect.assignedTo || "—"}</p>
            </div>
            {defect.resolvedAt && (
              <div className="col-span-2">
                <p className="text-wms-muted uppercase tracking-widest mb-0.5">Resolved At</p>
                <p className="font-mono text-wms-text">{formatTimestamp(defect.resolvedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex items-center justify-between pt-1 border-t border-wms-border">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => onEdit(defect)}>
            Edit Status & Details
          </Button>
        </div>
      </div>
    </Modal>
  );
}
