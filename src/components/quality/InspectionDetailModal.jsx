import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";

/**
 * Format an ISO timestamp → "12 Jun 2025, 14:30"
 */
function formatTimestamp(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/**
 * Returns the Badge variant for a given result string.
 */
function resultVariant(result) {
  if (result === "Pass") return "active";
  if (result === "Fail") return "low";
  return "inactive";
}

/**
 * InspectionDetailModal — read-only view of a single inspection record.
 * Props:
 *   inspection - full inspection object
 *   onClose    - closes the modal
 */
export function InspectionDetailModal({ inspection, onClose, onLogDefect }) {
  if (!inspection) return null;

  const failCount = inspection.criteria.filter((c) => c.result === "Fail").length;
  const passCount = inspection.criteria.filter((c) => c.result === "Pass").length;
  const pendingCount = inspection.criteria.filter(
    (c) => c.result === "Pending"
  ).length;

  return (
    <Modal title="Inspection Report" onClose={onClose}>
      <div className="flex flex-col gap-5">
        {/* ── Header info ── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-wms-purple text-sm font-bold">
              {inspection.inspectionId}
            </p>
            <p className="text-xs text-wms-muted mt-0.5">
              {formatTimestamp(inspection.timestamp)}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="category">{inspection.type}</Badge>
            <Badge variant={resultVariant(inspection.overallResult)}>
              {inspection.overallResult.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* ── Product / movement meta ── */}
        <div className="bg-wms-bg border border-wms-border rounded-xl px-4 py-3 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-wms-muted uppercase tracking-widest mb-0.5">SKU</p>
            <p className="font-mono text-wms-green">{inspection.sku}</p>
          </div>
          <div>
            <p className="text-wms-muted uppercase tracking-widest mb-0.5">Product</p>
            <p className="text-wms-text">{inspection.productName}</p>
          </div>
          <div>
            <p className="text-wms-muted uppercase tracking-widest mb-0.5">
              Qty Inspected
            </p>
            <p className="font-mono text-wms-text">{inspection.quantity}</p>
          </div>
          <div>
            <p className="text-wms-muted uppercase tracking-widest mb-0.5">
              Linked Movement
            </p>
            <p className="font-mono text-wms-purple">
              {inspection.movementId ?? "—"}
            </p>
          </div>
          <div>
            <p className="text-wms-muted uppercase tracking-widest mb-0.5">Inspector</p>
            <p className="text-wms-text">{inspection.inspector}</p>
          </div>
          <div>
            <p className="text-wms-muted uppercase tracking-widest mb-0.5">Summary</p>
            <p className="text-wms-text">
              <span className="text-wms-green">{passCount} Pass</span>
              {" · "}
              <span className="text-wms-red">{failCount} Fail</span>
              {" · "}
              <span className="text-wms-muted">{pendingCount} Pending</span>
            </p>
          </div>
        </div>

        {/* ── Criteria breakdown ── */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-wms-muted">
            Criteria Breakdown
          </p>
          <div className="flex flex-col gap-1">
            {inspection.criteria.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${
                  c.result === "Fail"
                    ? "border border-wms-border border-l-2 border-l-red-500 bg-red-900/10"
                    : "border border-wms-border bg-wms-bg"
                }`}
              >
                <span className="text-sm text-wms-text">{c.label}</span>
                <div className="flex items-center gap-2">
                  {c.result === "Fail" && onLogDefect && (
                    <button
                      onClick={() => onLogDefect(inspection, c)}
                      className="text-wms-orange text-xs px-2 py-0.5 border border-wms-orange rounded hover:bg-orange-900/20 transition-colors"
                    >
                      Log as Defect
                    </button>
                  )}
                  <Badge variant={resultVariant(c.result)}>{c.result}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Notes ── */}
        {inspection.notes && (
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-wms-muted">Notes</p>
            <p className="text-sm text-wms-text bg-wms-bg border border-wms-border rounded-lg px-4 py-3 leading-relaxed">
              {inspection.notes}
            </p>
          </div>
        )}

        {/* ── Close ── */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-mono border border-wms-border text-wms-muted hover:bg-white/5 hover:text-wms-text transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
