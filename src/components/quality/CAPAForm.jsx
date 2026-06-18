import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

/**
 * CAPAForm — modal form to add a new CAPA to an NCR.
 * Props:
 *   onSave(capaData) - called with new CAPA object
 *   onClose - closes modal
 */
export function CAPAForm({ onSave, onClose }) {
  const [type, setType] = useState("Corrective Action");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!description.trim()) errs.description = "Description is required.";
    if (!assignedTo.trim()) errs.assignedTo = "Assigned To is required.";
    if (!targetDate) errs.targetDate = "Target Date is required.";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      type,
      status: "Planned",
      description: description.trim(),
      assignedTo: assignedTo.trim(),
      targetDate,
    });
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Modal title="Add CAPA Action" onClose={onClose} size="lg">
      <div className="flex flex-col gap-5">
        
        {/* Type Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-widest text-wms-muted">
            Action Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setType("Corrective Action")}
              className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                type === "Corrective Action"
                  ? "bg-blue-900/30 border-wms-blue"
                  : "bg-wms-bg border-wms-border hover:border-wms-muted"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  type === "Corrective Action" ? "border-wms-blue" : "border-wms-muted"
                }`}>
                  {type === "Corrective Action" && <div className="w-2 h-2 rounded-full bg-wms-blue" />}
                </div>
                <h4 className="text-sm font-bold text-wms-text">Corrective</h4>
              </div>
              <p className="text-xs text-wms-muted ml-6">Fix the current problem and resolve immediate root cause.</p>
            </div>

            <div
              onClick={() => setType("Preventive Action")}
              className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${
                type === "Preventive Action"
                  ? "bg-green-900/30 border-wms-green"
                  : "bg-wms-bg border-wms-border hover:border-wms-muted"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  type === "Preventive Action" ? "border-wms-green" : "border-wms-muted"
                }`}>
                  {type === "Preventive Action" && <div className="w-2 h-2 rounded-full bg-wms-green" />}
                </div>
                <h4 className="text-sm font-bold text-wms-text">Preventive</h4>
              </div>
              <p className="text-xs text-wms-muted ml-6">Prevent future occurrence and update systemic processes.</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 mt-2">
          <label className="text-xs uppercase tracking-widest text-wms-muted">
            Action Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            placeholder="Detailed description of the corrective/preventive action..."
            rows={3}
            className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
          />
          {errors.description && <p className="text-xs text-wms-red">{errors.description}</p>}
        </div>

        {/* Assignment */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Input
              label="Assigned To *"
              value={assignedTo}
              onChange={(e) => {
                setAssignedTo(e.target.value);
                setErrors((prev) => ({ ...prev, assignedTo: undefined }));
              }}
              placeholder="Staff name"
            />
            {errors.assignedTo && <p className="text-xs text-wms-red">{errors.assignedTo}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-wms-muted">
              Target Date *
            </label>
            <input
              type="date"
              min={todayStr}
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
                setErrors((prev) => ({ ...prev, targetDate: undefined }));
              }}
              className="bg-wms-bg border border-wms-border text-wms-text rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
            />
            {errors.targetDate && <p className="text-xs text-wms-red">{errors.targetDate}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-wms-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save CAPA
          </Button>
        </div>
      </div>
    </Modal>
  );
}
