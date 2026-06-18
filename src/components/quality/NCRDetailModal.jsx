import { Modal } from "../ui/Modal";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { NCR_STATUSES } from "../../data/constants";

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

function priorityBadgeClass(priority) {
  if (priority === "Critical") return "bg-red-900/40 text-wms-red";
  if (priority === "High") return "bg-orange-900/40 text-wms-orange";
  if (priority === "Medium") return "bg-yellow-900/40 text-yellow-400";
  if (priority === "Low") return "bg-blue-900/40 text-wms-blue";
  return "bg-wms-surface text-wms-text";
}

function capaStatusColor(status) {
  if (status === "Planned") return "bg-wms-surface border-wms-border text-wms-muted";
  if (status === "In Progress") return "bg-blue-900/40 border-blue-700 text-wms-blue";
  if (status === "Completed") return "bg-green-900/40 border-green-700 text-wms-green";
  if (status === "Verified") return "bg-purple-900/40 border-purple-700 text-wms-purple";
  if (status === "Cancelled") return "bg-red-900/40 border-red-800 text-wms-red";
  return "bg-wms-surface border-wms-border text-wms-text";
}

export function NCRDetailModal({
  ncr,
  defects,
  onClose,
  onAddCAPA,
  onUpdateCAPA,
  onDeleteCAPA,
  onStatusChange,
  onViewDefect,
}) {
  if (!ncr) return null;

  const linkedDefect = ncr.defectId ? defects.find(d => d.defectId === ncr.defectId) : null;
  const todayStr = new Date().toISOString().split("T")[0];
  const isOverdue = ncr.targetDate < todayStr && ncr.status !== "Closed" && ncr.status !== "Resolved";

  return (
    <Modal title="NCR Details" onClose={onClose} size="3xl">
      <div className="flex flex-col gap-6">
        
        {/* ── Section 1 — NCR overview ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-wms-purple text-lg font-bold">
                {ncr.ncrId}
              </p>
              <p className="text-xs text-wms-muted mt-0.5">
                Raised by {ncr.raisedBy} on {formatTimestamp(ncr.timestamp)}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border border-current ${priorityBadgeClass(ncr.priority)}`}>
                {ncr.priority} Priority
              </span>
              <Badge variant="category">{ncr.type}</Badge>
            </div>
          </div>

          <div className="bg-wms-bg border border-wms-border rounded-xl px-4 py-3 flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-bold text-wms-text">{ncr.title}</h4>
              <p className="text-sm text-wms-text mt-1 leading-relaxed">
                {ncr.description}
              </p>
            </div>
            
            <div className="pt-2 border-t border-wms-border/50">
              <p className="text-xs uppercase tracking-widest text-wms-muted mb-1">Immediate Action Taken</p>
              <p className="text-sm text-wms-text leading-relaxed">
                {ncr.immediateAction}
              </p>
            </div>
            
            <div className="pt-2 border-t border-wms-border/50 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-wms-muted uppercase tracking-widest mb-0.5">Assigned To</p>
                <p className="text-wms-text">{ncr.assignedTo}</p>
              </div>
              <div>
                <p className="text-wms-muted uppercase tracking-widest mb-0.5">Target Date</p>
                <p className={`font-mono ${isOverdue ? "text-wms-red" : "text-wms-text"}`}>
                  {ncr.targetDate} {isOverdue && " (Overdue)"}
                </p>
              </div>
              {ncr.closedAt && (
                <div className="col-span-2">
                  <p className="text-wms-muted uppercase tracking-widest mb-0.5">Closed At</p>
                  <p className="font-mono text-wms-text">{formatTimestamp(ncr.closedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Progress Bar */}
          <div className="flex flex-col gap-1.5 mt-1">
            <p className="text-xs uppercase tracking-widest text-wms-muted">Workflow Status</p>
            <div className="flex bg-wms-bg border border-wms-border rounded-lg p-1.5 overflow-x-auto">
              {NCR_STATUSES.map((status, idx) => {
                const currentIdx = NCR_STATUSES.indexOf(ncr.status);
                const isCurrent = status === ncr.status;
                const isPast = idx < currentIdx;
                
                // Allow moving to any future status, or 1 step back
                const canMoveTo = idx > currentIdx || idx === currentIdx - 1;

                return (
                  <button
                    key={status}
                    disabled={isCurrent || !canMoveTo}
                    onClick={() => onStatusChange(ncr, status)}
                    className={`flex-1 text-center py-2 px-3 text-xs font-mono rounded-md transition-all whitespace-nowrap ${
                      isCurrent
                        ? "bg-wms-surface border border-wms-text text-wms-text font-bold shadow-sm"
                        : isPast
                        ? "text-wms-muted/70 hover:bg-white/5 cursor-not-allowed" // wait, 1 step back is allowed
                        : "text-wms-muted hover:bg-white/5 hover:text-wms-text cursor-pointer"
                    } ${idx === currentIdx - 1 ? "!cursor-pointer !text-wms-muted hover:!text-wms-text" : ""}`}
                    title={isCurrent ? "Current status" : canMoveTo ? `Move to ${status}` : "Cannot skip backwards"}
                  >
                    {status}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Section 2 — Traceability chain ── */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-wms-muted">Traceability Chain</p>
          <div className="bg-wms-bg border border-wms-border rounded-xl p-4 flex items-center gap-3 overflow-x-auto">
            {/* Inspection Node */}
            <div className="flex flex-col gap-1 items-center min-w-[120px]">
              {linkedDefect?.inspectionId ? (
                <div className="border border-wms-border bg-wms-surface px-3 py-2 rounded text-center w-full">
                  <p className="text-[10px] text-wms-muted uppercase">Inspection</p>
                  <p className="font-mono text-xs text-wms-text">{linkedDefect.inspectionId}</p>
                </div>
              ) : (
                <div className="border border-dashed border-wms-border/50 bg-transparent px-3 py-2 rounded text-center w-full opacity-50">
                  <p className="text-[10px] text-wms-muted uppercase">Inspection</p>
                  <p className="font-mono text-xs text-wms-muted">None</p>
                </div>
              )}
            </div>

            <span className="text-wms-muted">→</span>

            {/* Defect Node */}
            <div className="flex flex-col gap-1 items-center min-w-[120px]">
              {ncr.defectId ? (
                <button 
                  onClick={() => onViewDefect && onViewDefect({ id: null, defectId: ncr.defectId })} // App.jsx normally expects full defect, we'll see if it works or just read-only view
                  className="border border-wms-border bg-wms-surface px-3 py-2 rounded text-center w-full hover:border-wms-purple transition-colors cursor-pointer"
                >
                  <p className="text-[10px] text-wms-purple uppercase font-bold">Defect</p>
                  <p className="font-mono text-xs text-wms-text">{ncr.defectId}</p>
                </button>
              ) : (
                <div className="border border-dashed border-wms-border/50 bg-transparent px-3 py-2 rounded text-center w-full opacity-50">
                  <p className="text-[10px] text-wms-muted uppercase">Defect</p>
                  <p className="font-mono text-xs text-wms-muted">None</p>
                </div>
              )}
            </div>

            <span className="text-wms-muted">→</span>

            {/* NCR Node */}
            <div className="flex flex-col gap-1 items-center min-w-[120px]">
              <div className="border-2 border-wms-purple bg-purple-900/20 px-3 py-2 rounded text-center w-full">
                <p className="text-[10px] text-wms-purple uppercase font-bold">NCR</p>
                <p className="font-mono text-xs text-wms-text font-bold">{ncr.ncrId}</p>
              </div>
            </div>

            <span className="text-wms-muted">→</span>

            {/* CAPA Node */}
            <div className="flex flex-col gap-1 items-center min-w-[120px]">
              <div className="border border-wms-border bg-wms-surface px-3 py-2 rounded text-center w-full">
                <p className="text-[10px] text-wms-blue uppercase font-bold">CAPAs</p>
                <p className="font-mono text-xs text-wms-text">{ncr.capas?.length || 0} Actions</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3 — CAPA Actions ── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-wms-muted">
              CAPA Actions ({ncr.capas?.length || 0})
            </p>
            <Button variant="ghost" onClick={() => onAddCAPA(ncr.ncrId)} className="!py-1 !px-2 text-xs">
              + Add CAPA
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {!ncr.capas || ncr.capas.length === 0 ? (
              <div className="bg-wms-bg border border-dashed border-wms-border rounded-xl py-6 text-center">
                <p className="text-sm text-wms-muted">No corrective/preventive actions added yet.</p>
              </div>
            ) : (
              ncr.capas.map((capa) => (
                <div key={capa.capaId} className="bg-wms-surface border border-wms-border rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-wms-purple font-bold">{capa.capaId}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        capa.type === "Corrective Action" 
                          ? "bg-blue-900/30 text-wms-blue border-blue-800"
                          : "bg-green-900/30 text-wms-green border-green-800"
                      }`}>
                        {capa.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${capaStatusColor(capa.status)}`}>
                        {capa.status}
                      </span>
                      {capa.status === "Verified" && (
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                          capa.effectiveness === "Effective" ? "bg-green-900/30 text-wms-green border-green-800"
                          : capa.effectiveness === "Ineffective" ? "bg-red-900/30 text-wms-red border-red-800"
                          : "bg-wms-surface border-wms-border text-wms-muted"
                        }`}>
                          {capa.effectiveness}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onUpdateCAPA(ncr.ncrId, capa)} className="text-xs text-wms-blue hover:underline">Edit</button>
                      <button onClick={() => onDeleteCAPA(ncr.ncrId, capa.capaId)} className="text-xs text-wms-red hover:underline">Delete</button>
                    </div>
                  </div>

                  <p className="text-sm text-wms-text">{capa.description}</p>

                  <div className="flex items-center justify-between text-xs text-wms-muted mt-1">
                    <span>Assigned: <span className="text-wms-text">{capa.assignedTo}</span></span>
                    <span>Target: <span className="font-mono text-wms-text">{capa.targetDate}</span></span>
                  </div>

                  {capa.verificationNotes && (
                    <div className="mt-2 pt-2 border-t border-wms-border/50 text-xs">
                      <p className="uppercase tracking-widest text-wms-muted mb-0.5">Verification Notes</p>
                      <p className="text-wms-text italic">{capa.verificationNotes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
}
