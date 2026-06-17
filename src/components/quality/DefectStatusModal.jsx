import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { DEFECT_STATUSES, DEFECT_DISPOSITIONS } from "../../data/constants";

/**
 * DefectStatusModal — quick status + disposition update.
 * Props:
 *   defect - full defect object
 *   onSave(id, updates) - called with the id and updated fields
 *   onClose - closes the modal
 */
export function DefectStatusModal({ defect, onSave, onClose }) {
  const [status, setStatus] = useState(defect.status);
  const [disposition, setDisposition] = useState(defect.disposition);
  const [rootCause, setRootCause] = useState(defect.rootCause || "");
  const [assignedTo, setAssignedTo] = useState(defect.assignedTo || "");
  const [resolutionNotes, setResolutionNotes] = useState("");

  if (!defect) return null;

  const isResolvedOrClosed = status === "Resolved" || status === "Closed";

  function handleSave() {
    const updates = {
      status,
      disposition,
      rootCause: rootCause.trim(),
      assignedTo: assignedTo.trim(),
    };

    if (isResolvedOrClosed) {
      updates.resolvedAt = new Date().toISOString();
      // Prepend resolution notes to description if provided
      if (resolutionNotes.trim()) {
        updates.description = defect.description + "\n\nResolution Notes: " + resolutionNotes.trim();
      }
    } else {
      updates.resolvedAt = null;
    }

    onSave(defect.id, updates);
  }

  return (
    <Modal title={`Update Status: ${defect.defectId}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            id="def-status"
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={DEFECT_STATUSES}
          />
          <Select
            id="def-disposition"
            label="Disposition"
            value={disposition}
            onChange={(e) => setDisposition(e.target.value)}
            options={DEFECT_DISPOSITIONS}
          />
        </div>

        <Input
          id="def-assignedTo"
          label="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="Staff name"
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="def-rootcause" className="text-xs uppercase tracking-widest text-wms-muted">
            Root Cause Analysis
          </label>
          <textarea
            id="def-rootcause"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="Update root cause findings..."
            rows={3}
            className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
          />
        </div>

        {isResolvedOrClosed && (
          <div className="flex flex-col gap-1">
            <label htmlFor="def-resolution" className="text-xs uppercase tracking-widest text-wms-muted">
              Resolution Notes (Optional)
            </label>
            <textarea
              id="def-resolution"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="What actions were taken to resolve this defect?"
              rows={2}
              className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-wms-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Updates
          </Button>
        </div>
      </div>
    </Modal>
  );
}
