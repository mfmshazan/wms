import { useState, useMemo } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Badge } from "../ui/Badge";
import {
  INSPECTION_TYPES,
  INSPECTION_CRITERIA_TEMPLATES,
} from "../../data/constants";
import { computeOverallResult } from "../../hooks/useInspections";

/**
 * Build a fresh criteria array from a template type.
 * All items default to "Pending".
 */
function buildCriteria(type) {
  const labels = INSPECTION_CRITERIA_TEMPLATES[type] ?? [];
  return labels.map((label, i) => ({
    id: `C${i + 1}`,
    label,
    result: "Pending",
  }));
}

/**
 * InspectionForm — modal form to create a new inspection checklist.
 * Props:
 *   products  - full products array
 *   movements - full movements array
 *   onSave(inspectionData) - called with the completed inspection object
 *   onClose   - closes the modal
 *
 * DOES NOT touch useInspections, useProducts, or useMovements directly.
 */
export function InspectionForm({ products, movements, onSave, onClose }) {
  const [type, setType] = useState(INSPECTION_TYPES[0]);
  const [sku, setSku] = useState("");
  const [movementId, setMovementId] = useState("None");
  const [quantity, setQuantity] = useState("");
  const [inspector, setInspector] = useState("");
  const [notes, setNotes] = useState("");
  const [criteria, setCriteria] = useState(() => buildCriteria(INSPECTION_TYPES[0]));
  const [errors, setErrors] = useState({});

  const selectedProduct = products.find((p) => p.sku === sku) ?? null;

  // Movements for the selected product
  const productMovements = useMemo(
    () => (sku ? movements.filter((m) => m.sku === sku) : []),
    [sku, movements]
  );

  // Live overall result preview
  const overallResult = computeOverallResult(criteria);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleTypeChange(e) {
    const newType = e.target.value;
    setType(newType);
    setCriteria(buildCriteria(newType));
  }

  function handleProductChange(e) {
    const val = e.target.value;
    const match = val === "Select a product…"
      ? null
      : products.find((p) => `${p.sku} — ${p.name}` === val);
    setSku(match ? match.sku : "");
    setMovementId("None");
    setErrors((prev) => ({ ...prev, sku: undefined }));
  }

  function handleCriterionResult(id, result) {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, result } : c))
    );
  }

  function validate() {
    const errs = {};
    if (!sku) errs.sku = "Please select a product.";
    if (!quantity || Number(quantity) < 1)
      errs.quantity = "Quantity must be at least 1.";
    if (!inspector.trim()) errs.inspector = "Inspector name is required.";
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
      sku,
      productName: selectedProduct.name,
      movementId: movementId === "None" ? null : movementId,
      quantity: Number(quantity),
      inspector: inspector.trim(),
      criteria,
      notes: notes.trim(),
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function formatMovementOption(m) {
    const date = new Date(m.timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${m.movementId} — ${m.type} — ${date}`;
  }

  function resultBadge() {
    const pendingCount = criteria.filter((c) => c.result === "Pending").length;
    if (overallResult === "Pass")
      return <Badge variant="active">Overall: PASS</Badge>;
    if (overallResult === "Fail")
      return <Badge variant="low">Overall: FAIL</Badge>;
    return (
      <Badge variant="inactive">
        Overall: PENDING ({pendingCount} of {criteria.length} pending)
      </Badge>
    );
  }

  const placeholderProduct = "Select a product…";

  return (
    <Modal title="New Inspection Checklist" onClose={onClose} size="2xl">
      <div className="flex flex-col gap-5">
          {/* Row 1: Type + Product */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              id="ins-type"
              label="Inspection Type"
              value={type}
              onChange={handleTypeChange}
              options={INSPECTION_TYPES}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-wms-muted">
                Product
              </label>
              <select
                id="ins-product"
                value={sku ? `${sku} — ${selectedProduct?.name ?? ""}` : placeholderProduct}
                onChange={handleProductChange}
                className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-colors appearance-none cursor-pointer"
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
          </div>

          {/* Row 2: Linked movement + Quantity + Inspector */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-wms-muted">
                Linked Movement
              </label>
              <select
                id="ins-movement"
                value={movementId}
                onChange={(e) => setMovementId(e.target.value)}
                disabled={!sku}
                className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-colors appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="None" className="bg-wms-surface">
                  None
                </option>
                {productMovements.map((m) => (
                  <option key={m.movementId} value={m.movementId} className="bg-wms-surface">
                    {formatMovementOption(m)}
                  </option>
                ))}
              </select>
              {!sku && (
                <p className="text-[10px] text-wms-muted/70">Select a product first</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                id="ins-quantity"
                label="Quantity Inspected"
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setErrors((prev) => ({ ...prev, quantity: undefined }));
                }}
                placeholder="e.g. 50"
              />
              {errors.quantity && (
                <p className="text-xs text-wms-red">{errors.quantity}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                id="ins-inspector"
                label="Inspector Name"
                value={inspector}
                onChange={(e) => {
                  setInspector(e.target.value);
                  setErrors((prev) => ({ ...prev, inspector: undefined }));
                }}
                placeholder="Staff name"
              />
              {errors.inspector && (
                <p className="text-xs text-wms-red">{errors.inspector}</p>
              )}
            </div>
          </div>

          {/* Criteria checklist */}
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-wms-muted">
              Inspection Criteria
            </p>
            <div className="max-h-64 overflow-y-auto flex flex-col gap-1 pr-1">
              {criteria.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between bg-wms-bg border border-wms-border rounded-lg px-4 py-2.5 gap-3"
                >
                  <span className="text-sm text-wms-text flex-1">{c.label}</span>
                  <div className="flex gap-1.5 shrink-0">
                    {/* Pass */}
                    <button
                      id={`crit-${c.id}-pass`}
                      onClick={() => handleCriterionResult(c.id, "Pass")}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
                        c.result === "Pass"
                          ? "bg-green-900/60 border-green-700 text-wms-green"
                          : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                      }`}
                    >
                      Pass
                    </button>
                    {/* Fail */}
                    <button
                      id={`crit-${c.id}-fail`}
                      onClick={() => handleCriterionResult(c.id, "Fail")}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
                        c.result === "Fail"
                          ? "bg-red-900/50 border-red-700 text-wms-red"
                          : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                      }`}
                    >
                      Fail
                    </button>
                    {/* Pending */}
                    <button
                      id={`crit-${c.id}-pending`}
                      onClick={() => handleCriterionResult(c.id, "Pending")}
                      className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${
                        c.result === "Pending"
                          ? "bg-wms-border/60 border-wms-border text-wms-text"
                          : "bg-transparent border-wms-border text-wms-muted hover:bg-white/5"
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="ins-notes"
              className="text-xs uppercase tracking-widest text-wms-muted"
            >
              Notes (optional)
            </label>
            <textarea
              id="ins-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional observations…"
              rows={2}
              className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
            />
          </div>

          {/* Live result summary + actions */}
          <div className="flex items-center justify-between pt-1 border-t border-wms-border">
            <div className="flex items-center gap-2">
              <span className="text-xs text-wms-muted uppercase tracking-widest">
                Result Preview:
              </span>
              {resultBadge()}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave} id="confirm-inspection-btn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Save Inspection
              </Button>
            </div>
          </div>
      </div>
    </Modal>
  );
}
