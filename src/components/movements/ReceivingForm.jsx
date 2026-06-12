import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { MOVEMENT_REASONS_IN } from "../../data/constants";

/**
 * ReceivingForm — modal form for logging Inbound stock movements.
 * Props:
 *   products  - full products array for the searchable select
 *   onSave(movementData) - called with the completed movement object
 *   onClose   - closes the modal
 *
 * DOES NOT touch useProducts or useMovements directly.
 */
export function ReceivingForm({ products, onSave, onClose }) {
  const [sku, setSku] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState(MOVEMENT_REASONS_IN[0]);
  const [reference, setReference] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});

  const selectedProduct = products.find((p) => p.sku === sku) ?? null;

  function validate() {
    const errs = {};
    if (!sku) errs.sku = "Please select a product.";
    if (!qty || Number(qty) < 1) errs.qty = "Quantity must be at least 1.";
    if (!performedBy.trim()) errs.performedBy = "Performed by is required.";
    return errs;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      type: "Inbound",
      sku,
      productName: selectedProduct.name,
      qty: Number(qty),
      unit: selectedProduct.unit,
      reason,
      reference: reference.trim(),
      notes: notes.trim(),
      performedBy: performedBy.trim(),
    });
  }

  // Build product options for the select
  const productOptions = products.map((p) => `${p.sku} — ${p.name}`);
  const placeholderOpt = "Select a product…";

  function handleProductChange(e) {
    const val = e.target.value;
    if (val === placeholderOpt) {
      setSku("");
    } else {
      const match = products.find((p) => `${p.sku} — ${p.name}` === val);
      setSku(match ? match.sku : "");
    }
    setErrors((prev) => ({ ...prev, sku: undefined }));
  }

  return (
    <Modal title="Receive Stock" onClose={onClose}>
      <div className="flex flex-col gap-5">
        {/* Product select */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-widest text-wms-muted">
            Product
          </label>
          <select
            id="receive-product"
            value={sku ? `${sku} — ${selectedProduct?.name ?? ""}` : placeholderOpt}
            onChange={handleProductChange}
            className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 transition-colors appearance-none cursor-pointer"
          >
            <option value={placeholderOpt} className="bg-wms-surface text-wms-muted">
              {placeholderOpt}
            </option>
            {productOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-wms-surface">
                {opt}
              </option>
            ))}
          </select>
          {/* Current stock helper */}
          {selectedProduct && (
            <p className="text-xs text-wms-muted font-mono mt-0.5">
              Current stock:{" "}
              <span className="text-wms-green">
                {selectedProduct.qty} {selectedProduct.unit}
              </span>
            </p>
          )}
          {errors.sku && (
            <p className="text-xs text-wms-red">{errors.sku}</p>
          )}
        </div>

        {/* 2-col grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Input
              id="receive-qty"
              label="Quantity Received"
              type="number"
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
                setErrors((prev) => ({ ...prev, qty: undefined }));
              }}
              placeholder="e.g. 50"
            />
            {errors.qty && (
              <p className="text-xs text-wms-red">{errors.qty}</p>
            )}
          </div>

          <Select
            id="receive-reason"
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            options={MOVEMENT_REASONS_IN}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="receive-reference"
            label="Reference No."
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. PO-12345"
          />

          <div className="flex flex-col gap-1">
            <Input
              id="receive-performed-by"
              label="Performed By"
              value={performedBy}
              onChange={(e) => {
                setPerformedBy(e.target.value);
                setErrors((prev) => ({ ...prev, performedBy: undefined }));
              }}
              placeholder="Staff name"
            />
            {errors.performedBy && (
              <p className="text-xs text-wms-red">{errors.performedBy}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="receive-notes"
            className="text-xs uppercase tracking-widest text-wms-muted"
          >
            Notes (optional)
          </label>
          <textarea
            id="receive-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details…"
            rows={3}
            className="bg-wms-bg border border-wms-border rounded-lg px-3 py-2 text-sm text-wms-text w-full placeholder:text-wms-muted/60 focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 resize-none transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} id="confirm-receive-btn">
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Confirm Receiving
          </Button>
        </div>
      </div>
    </Modal>
  );
}
