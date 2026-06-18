import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { NCR_TYPES, NCR_PRIORITIES } from "../../data/constants";

/**
 * NCRForm — modal form to raise a new NCR manually or from a defect.
 * Props:
 *   defects - full array of defects to pick from if not prefilled
 *   onSave(ncrData) - called with the constructed NCR object
 *   onClose - closes modal
 *   prefill - optional { defectId, defectSku, productName }
 */
export function NCRForm({ defects, onSave, onClose, prefill }) {
  const isPrefilled = !!prefill;

  const [defectId, setDefectId] = useState(prefill?.defectId || "None");
  const [type, setType] = useState(NCR_TYPES[0]);
  const [priority, setPriority] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [immediateAction, setImmediateAction] = useState("");
  const [raisedBy, setRaisedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [errors, setErrors] = useState({});

  // When a defect is selected manually from the dropdown, find its sku/name
  let defectSku = prefill?.defectSku || "";
  let productName = prefill?.productName || "";
  if (!isPrefilled && defectId !== "None") {
    const selectedDef = defects.find((d) => d.defectId === defectId);
    if (selectedDef) {
      defectSku = selectedDef.sku;
      productName = selectedDef.productName;
    }
  }

  function validate() {
    const errs = {};
    if (!type) errs.type = "Please select an NCR type.";
    if (!priority) errs.priority = "Please select a priority level.";
    if (!title.trim()) errs.title = "Title is required.";
    if (!description.trim()) errs.description = "Description is required.";
    if (!immediateAction.trim()) errs.immediateAction = "Immediate action is required.";
    if (!raisedBy.trim()) errs.raisedBy = "Raised By is required.";
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
      defectId: defectId === "None" ? null : defectId,
      defectSku,
      productName,
      type,
      priority,
      status: "Open",
      title: title.trim(),
      description: description.trim(),
      immediateAction: immediateAction.trim(),
      raisedBy: raisedBy.trim(),
      assignedTo: assignedTo.trim(),
      targetDate,
    });
  }

  // Get min date string for targetDate input
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Modal title="Raise NCR" onClose={onClose} size="2xl">
      <div className="flex flex-col gap-5">
        {isPrefilled && prefill.defectId && (
          <div className="bg-purple-900/30 border border-wms-purple text-wms-purple text-xs rounded p-2 mb-4">
            Raising NCR from defect {prefill.defectId}
          </div>
        )}

        {/* Section 1 — Linkage */}
        <div className="flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-wms-muted border-b border-wms-border pb-1 mb-2">
            Linkage & Categorization
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-wms-muted">
                Linked Defect
              </label>
              <select
                id="ncr-defect"
                value={defectId}
                onChange={(e) => setDefectId(e.target.value)}
                disabled={isPrefilled}
                className={`bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm w-full transition-colors appearance-none ${
                  isPrefilled
                    ? "text-wms-muted cursor-not-allowed opacity-70"
                    : "text-wms-text focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 cursor-pointer"
                }`}
              >
                <option value="None" className="bg-wms-surface">
                  None
                </option>
                {isPrefilled && prefill.defectId ? (
                  <option value={prefill.defectId} className="bg-wms-surface">
                    {prefill.defectId} — {prefill.defectSku}
                  </option>
                ) : (
                  defects
                    .filter(d => d.status !== "Closed" && d.status !== "Resolved")
                    .map((d) => (
                    <option key={d.defectId} value={d.defectId} className="bg-wms-surface">
                      {d.defectId} — {d.sku} — {d.severity}
                    </option>
                  ))
                )}
              </select>
            </div>
            <Select
              id="ncr-type"
              label="NCR Type"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setErrors((prev) => ({ ...prev, type: undefined }));
              }}
              options={NCR_TYPES}
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs uppercase tracking-widest text-wms-muted">
              Priority
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPriority("Critical");
                  setErrors((prev) => ({ ...prev, priority: undefined }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  priority === "Critical"
                    ? "bg-red-900/40 border-wms-red text-wms-red ring-2 ring-wms-red ring-offset-1 ring-offset-wms-bg"
                    : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => {
                  setPriority("High");
                  setErrors((prev) => ({ ...prev, priority: undefined }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  priority === "High"
                    ? "bg-orange-900/40 border-wms-orange text-wms-orange ring-2 ring-wms-orange ring-offset-1 ring-offset-wms-bg"
                    : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                }`}
              >
                High
              </button>
              <button
                onClick={() => {
                  setPriority("Medium");
                  setErrors((prev) => ({ ...prev, priority: undefined }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  priority === "Medium"
                    ? "bg-yellow-900/40 border-yellow-600 text-yellow-400 ring-2 ring-yellow-600 ring-offset-1 ring-offset-wms-bg"
                    : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => {
                  setPriority("Low");
                  setErrors((prev) => ({ ...prev, priority: undefined }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                  priority === "Low"
                    ? "bg-blue-900/40 border-blue-600 text-wms-blue ring-2 ring-blue-600 ring-offset-1 ring-offset-wms-bg"
                    : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                }`}
              >
                Low
              </button>
            </div>
            {errors.priority && (
              <p className="text-xs text-wms-red">{errors.priority}</p>
            )}
          </div>
        </div>

        {/* Section 2 — Details */}
        <div className="flex flex-col gap-1.5 mt-2">
          <p className="text-xs uppercase tracking-widest text-wms-muted border-b border-wms-border pb-1 mb-2">
            Issue Details
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Input
                id="ncr-title"
                label="Title / Short Summary *"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Brief summary of the issue..."
              />
              {errors.title && (
                <p className="text-xs text-wms-red">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-wms-muted">
                Description *
              </label>
              <textarea
                id="ncr-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }}
                placeholder="Detailed description of the non-conformance..."
                rows={3}
                className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
              />
              {errors.description && (
                <p className="text-xs text-wms-red">{errors.description}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-wms-muted">
                Immediate Action Taken *
              </label>
              <textarea
                id="ncr-immediate-action"
                value={immediateAction}
                onChange={(e) => {
                  setImmediateAction(e.target.value);
                  setErrors((prev) => ({ ...prev, immediateAction: undefined }));
                }}
                placeholder="What was done right away to contain the issue?"
                rows={2}
                className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
              />
              {errors.immediateAction && (
                <p className="text-xs text-wms-red">{errors.immediateAction}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3 — Assignment */}
        <div className="flex flex-col gap-1.5 mt-2">
          <p className="text-xs uppercase tracking-widest text-wms-muted border-b border-wms-border pb-1 mb-2">
            Assignment
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Input
                id="ncr-raisedBy"
                label="Raised By *"
                value={raisedBy}
                onChange={(e) => {
                  setRaisedBy(e.target.value);
                  setErrors((prev) => ({ ...prev, raisedBy: undefined }));
                }}
                placeholder="Staff name"
              />
              {errors.raisedBy && (
                <p className="text-xs text-wms-red">{errors.raisedBy}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Input
                id="ncr-assignedTo"
                label="Assigned To *"
                value={assignedTo}
                onChange={(e) => {
                  setAssignedTo(e.target.value);
                  setErrors((prev) => ({ ...prev, assignedTo: undefined }));
                }}
                placeholder="Staff name"
              />
              {errors.assignedTo && (
                <p className="text-xs text-wms-red">{errors.assignedTo}</p>
              )}
            </div>
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
              <label className="text-xs uppercase tracking-widest text-wms-muted">
                Target Resolution Date *
              </label>
              <input
                id="ncr-target-date"
                type="date"
                min={todayStr}
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  setErrors((prev) => ({ ...prev, targetDate: undefined }));
                }}
                className="bg-wms-bg border border-wms-border text-wms-text rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
              />
              {errors.targetDate && (
                <p className="text-xs text-wms-red">{errors.targetDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-wms-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} id="confirm-ncr-btn">
            Raise NCR
          </Button>
        </div>
      </div>
    </Modal>
  );
}
