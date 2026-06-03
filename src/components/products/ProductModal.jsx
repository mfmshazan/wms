import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { CATEGORIES, UNITS, STATUS_OPTIONS } from "../../data/constants";

const EMPTY_FORM = {
  sku: "",
  name: "",
  category: CATEGORIES[0],
  qty: "",
  unit: UNITS[0],
  price: "",
  minStock: "",
  status: "active",
};

/**
 * ProductModal — Add or Edit product.
 * Calls onSave(formData) — does NOT touch CRUD directly.
 */
export function ProductModal({ mode, product, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);

  // Pre-fill when editing
  useEffect(() => {
    if (mode === "edit" && product) {
      setForm({
        sku: product.sku,
        name: product.name,
        category: product.category,
        qty: String(product.qty),
        unit: product.unit,
        price: String(product.price),
        minStock: String(product.minStock),
        status: product.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [mode, product]);

  function set(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleSubmit() {
    // Basic guard — name and qty required
    if (!form.name.trim() || form.qty === "") return;
    onSave(form);
  }

  const isEdit = mode === "edit";

  return (
    <Modal
      title={isEdit ? "Edit Product" : "Add Product"}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        {/* Row 1: SKU (disabled) + Name */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="field-sku"
            label="SKU"
            value={isEdit ? form.sku : "Auto-generated"}
            onChange={() => {}}
            disabled
          />
          <Input
            id="field-name"
            label="Product Name"
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. Arduino Nano"
          />
        </div>

        {/* Row 2: Category + Unit */}
        <div className="grid grid-cols-2 gap-3">
          <Select
            id="field-category"
            label="Category"
            value={form.category}
            onChange={set("category")}
            options={CATEGORIES}
          />
          <Select
            id="field-unit"
            label="Unit"
            value={form.unit}
            onChange={set("unit")}
            options={UNITS}
          />
        </div>

        {/* Row 3: Qty + Min Stock */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="field-qty"
            label="Quantity"
            value={form.qty}
            onChange={set("qty")}
            placeholder="0"
            type="number"
          />
          <Input
            id="field-minstock"
            label="Min Stock"
            value={form.minStock}
            onChange={set("minStock")}
            placeholder="0"
            type="number"
          />
        </div>

        {/* Row 4: Price + Status */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="field-price"
            label="Unit Price ($)"
            value={form.price}
            onChange={set("price")}
            placeholder="0.00"
            type="number"
          />
          <Select
            id="field-status"
            label="Status"
            value={form.status}
            onChange={set("status")}
            options={STATUS_OPTIONS}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-wms-border my-1" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
