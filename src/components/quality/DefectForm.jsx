import { useState, useMemo, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { DEFECT_TYPES, DEFECT_DISPOSITIONS } from "../../data/constants";

/**
 * DefectForm — modal form to log a new defect.
 * Props:
 *   products    - full products array
 *   inspections - full inspections array
 *   onSave(defectData) - called with completed defect object
 *   onClose     - closes modal
 *   prefill     - optional { sku, productName, inspectionId, criterionLabel }
 */
export function DefectForm({ products, inspections, onSave, onClose, prefill }) {
  const isPrefilled = !!prefill;

  const [sku, setSku] = useState(prefill?.sku || "");
  const [inspectionId, setInspectionId] = useState(prefill?.inspectionId || "None");
  const [criterionLabel, setCriterionLabel] = useState(prefill?.criterionLabel || "");
  const [type, setType] = useState(DEFECT_TYPES[0]);
  const [severity, setSeverity] = useState("");
  const [quantity, setQuantity] = useState("");
  const [disposition, setDisposition] = useState(DEFECT_DISPOSITIONS[4]); // Pending Decision
  const [description, setDescription] = useState("");
  const [rootCause, setRootCause] = useState("");
  const [reportedBy, setReportedBy] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [errors, setErrors] = useState({});

  const selectedProduct = products.find((p) => p.sku === sku) ?? null;

  // Inspections for the selected product
  const productInspections = useMemo(
    () => (sku ? inspections.filter((i) => i.sku === sku) : []),
    [sku, inspections]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleProductChange(e) {
    if (isPrefilled) return;
    const val = e.target.value;
    const match = val === "Select a product…"
      ? null
      : products.find((p) => `${p.sku} — ${p.name}` === val);
    setSku(match ? match.sku : "");
    setInspectionId("None");
    setErrors((prev) => ({ ...prev, sku: undefined }));
  }

  function validate() {
    const errs = {};
    if (!sku) errs.sku = "Please select a product.";
    if (!type) errs.type = "Please select a defect type.";
    if (!severity) errs.severity = "Please select a severity level.";
    if (!quantity || Number(quantity) < 1)
      errs.quantity = "Quantity must be at least 1.";
    if (!description.trim()) errs.description = "Description is required.";
    if (!reportedBy.trim()) errs.reportedBy = "Reporter name is required.";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    
    // Default status for new defects
    const initialStatus = "Open";

    onSave({
      sku,
      productName: selectedProduct?.name || prefill?.productName || "",
      inspectionId: inspectionId === "None" ? null : inspectionId,
      criterionLabel: criterionLabel.trim(),
      type,
      severity,
      status: initialStatus,
      disposition,
      quantity: Number(quantity),
      description: description.trim(),
      rootCause: rootCause.trim(),
      reportedBy: reportedBy.trim(),
      assignedTo: assignedTo.trim(),
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const placeholderProduct = "Select a product…";

  return (
    <Modal title="Log New Defect" onClose={onClose} size="2xl">
      <div className="flex flex-col gap-5">
        {isPrefilled && (
          <div className="bg-orange-900/30 border border-wms-orange text-wms-orange text-xs rounded p-2 mb-4">
            Converting failed criterion from {prefill.inspectionId}
          </div>
        )}

        {/* Row 1: Product + Linked Inspection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-wms-muted">
              Product
            </label>
            <select
              id="def-product"
              value={sku ? `${sku} — ${selectedProduct?.name ?? prefill?.productName ?? ""}` : placeholderProduct}
              onChange={handleProductChange}
              disabled={isPrefilled}
              className={`bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm w-full transition-colors appearance-none ${
                isPrefilled 
                  ? "text-wms-muted cursor-not-allowed opacity-70" 
                  : "text-wms-text focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 cursor-pointer"
              }`}
            >
              <option value={placeholderProduct} className="bg-wms-surface text-wms-muted">
                {placeholderProduct}
              </option>
              {products.map((p) => (
                <option key={p.sku} value={`${p.sku} — ${p.name}`} className="bg-wms-surface">
                  {p.sku} — {p.name}
                </option>
              ))}
            </select>
            {errors.sku && <p className="text-xs text-wms-red">{errors.sku}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-wms-muted">
              Linked Inspection
            </label>
            <select
              id="def-inspection"
              value={inspectionId}
              onChange={(e) => setInspectionId(e.target.value)}
              disabled={isPrefilled || !sku}
              className={`bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm w-full transition-colors appearance-none ${
                (isPrefilled || !sku)
                  ? "text-wms-muted cursor-not-allowed opacity-70"
                  : "text-wms-text focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 cursor-pointer"
              }`}
            >
              <option value="None" className="bg-wms-surface">
                None
              </option>
              {isPrefilled && prefill.inspectionId ? (
                 <option value={prefill.inspectionId} className="bg-wms-surface">
                   {prefill.inspectionId}
                 </option>
              ) : (
                productInspections.map((i) => (
                  <option key={i.inspectionId} value={i.inspectionId} className="bg-wms-surface">
                    {i.inspectionId}
                  </option>
                ))
              )}
            </select>
            {!sku && !isPrefilled && (
              <p className="text-[10px] text-wms-muted/70">Select a product first</p>
            )}
          </div>
        </div>

        {/* Row 2: Failed Criterion + Defect Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Input
              id="def-criterion"
              label="Failed Criterion (optional)"
              value={criterionLabel}
              onChange={(e) => setCriterionLabel(e.target.value)}
              disabled={isPrefilled}
              placeholder="e.g. No visible damage"
            />
          </div>
          <Select
            id="def-type"
            label="Defect Type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setErrors((prev) => ({ ...prev, type: undefined }));
            }}
            options={DEFECT_TYPES}
          />
        </div>

        {/* Severity */}
        <div className="flex flex-col gap-2">
          <label className="text-xs uppercase tracking-widest text-wms-muted">
            Severity
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSeverity("Critical");
                setErrors((prev) => ({ ...prev, severity: undefined }));
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                severity === "Critical"
                  ? "bg-red-900/40 border-wms-red text-wms-red ring-2 ring-wms-red ring-offset-1 ring-offset-wms-bg"
                  : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
              }`}
            >
              🔴 Critical
            </button>
            <button
              onClick={() => {
                setSeverity("Major");
                setErrors((prev) => ({ ...prev, severity: undefined }));
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                severity === "Major"
                  ? "bg-orange-900/40 border-wms-orange text-wms-orange ring-2 ring-wms-orange ring-offset-1 ring-offset-wms-bg"
                  : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
              }`}
            >
              🟠 Major
            </button>
            <button
              onClick={() => {
                setSeverity("Minor");
                setErrors((prev) => ({ ...prev, severity: undefined }));
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                severity === "Minor"
                  ? "bg-yellow-900/40 border-yellow-600 text-yellow-400 ring-2 ring-yellow-600 ring-offset-1 ring-offset-wms-bg"
                  : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
              }`}
            >
              🟡 Minor
            </button>
          </div>
          {errors.severity && (
            <p className="text-xs text-wms-red">{errors.severity}</p>
          )}
          {/* Severity Helper */}
          <div className="text-xs text-wms-muted mt-1 space-y-0.5">
            {severity === "Critical" && <p>🔴 Safety risk or product unusable</p>}
            {severity === "Major" && <p>🟠 Significant functional impact</p>}
            {severity === "Minor" && <p>🟡 Cosmetic or low impact</p>}
            {!severity && <p>Select a severity level above.</p>}
          </div>
        </div>

        {/* Row 3: Qty + Disposition */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Input
              id="def-quantity"
              label="Quantity Affected"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors((prev) => ({ ...prev, quantity: undefined }));
              }}
              placeholder="e.g. 5"
            />
            {errors.quantity && (
              <p className="text-xs text-wms-red">{errors.quantity}</p>
            )}
          </div>
          <Select
            id="def-disposition"
            label="Initial Disposition"
            value={disposition}
            onChange={(e) => setDisposition(e.target.value)}
            options={DEFECT_DISPOSITIONS}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="def-description"
            className="text-xs uppercase tracking-widest text-wms-muted"
          >
            Description <span className="text-wms-red">*</span>
          </label>
          <textarea
            id="def-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            placeholder="Detailed description of the defect..."
            rows={3}
            className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
          />
          {errors.description && (
            <p className="text-xs text-wms-red">{errors.description}</p>
          )}
        </div>

        {/* Root Cause */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="def-rootcause"
            className="text-xs uppercase tracking-widest text-wms-muted"
          >
            Root Cause Analysis (optional)
          </label>
          <textarea
            id="def-rootcause"
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="Leave blank if unknown — can be updated later"
            rows={2}
            className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
          />
        </div>

        {/* Row 4: Reporter + Assignee */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Input
              id="def-reportedBy"
              label="Reported By *"
              value={reportedBy}
              onChange={(e) => {
                setReportedBy(e.target.value);
                setErrors((prev) => ({ ...prev, reportedBy: undefined }));
              }}
              placeholder="Staff name"
            />
            {errors.reportedBy && (
              <p className="text-xs text-wms-red">{errors.reportedBy}</p>
            )}
          </div>
          <Input
            id="def-assignedTo"
            label="Assigned To (optional)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="Staff name"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-wms-border">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} id="confirm-defect-btn">
            Save Defect
          </Button>
        </div>
      </div>
    </Modal>
  );
}
