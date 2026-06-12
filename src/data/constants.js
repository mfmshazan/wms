export const CATEGORIES = [
  "Electronics",
  "Apparel",
  "Food & Beverage",
  "Raw Materials",
  "Packaging",
  "Spare Parts",
  "Other",
];

export const UNITS = ["pcs", "kg", "g", "L", "m", "box", "pallet"];

export const STATUS_OPTIONS = ["active", "inactive"];

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    sku: "SKU-0001",
    name: "Arduino Nano Rev3",
    category: "Electronics",
    qty: 14,
    unit: "pcs",
    price: 12.49,
    minStock: 20,
    status: "active",
  },
  {
    id: 2,
    sku: "SKU-0002",
    name: "Corrugated Box 30×20cm",
    category: "Packaging",
    qty: 340,
    unit: "pcs",
    price: 0.85,
    minStock: 100,
    status: "active",
  },
  {
    id: 3,
    sku: "SKU-0003",
    name: "Organic Oat Flour 1kg",
    category: "Food & Beverage",
    qty: 58,
    unit: "kg",
    price: 3.2,
    minStock: 50,
    status: "inactive",
  },
];

// ── Movement constants ──────────────────────────────────────────────────────

export const MOVEMENT_TYPES = ["Inbound", "Outbound"];

export const MOVEMENT_REASONS_IN = [
  "Purchase Order",
  "Return",
  "Transfer In",
  "Adjustment",
];

export const MOVEMENT_REASONS_OUT = [
  "Sales Order",
  "Damaged",
  "Transfer Out",
  "Adjustment",
];

export const INITIAL_MOVEMENTS = [
  {
    id: 1,
    movementId: "MOV-0001",
    type: "Inbound",
    sku: "SKU-0001",
    productName: "Arduino Nano Rev3",
    qty: 50,
    unit: "pcs",
    reason: "Purchase Order",
    reference: "PO-20250601",
    notes: "Initial stock received from supplier.",
    performedBy: "Alice Tan",
    timestamp: "2025-06-01T09:15:00.000Z",
  },
  {
    id: 2,
    movementId: "MOV-0002",
    type: "Outbound",
    sku: "SKU-0001",
    productName: "Arduino Nano Rev3",
    qty: 36,
    unit: "pcs",
    reason: "Sales Order",
    reference: "SO-20250603",
    notes: "",
    performedBy: "Bob Lim",
    timestamp: "2025-06-03T14:40:00.000Z",
  },
  {
    id: 3,
    movementId: "MOV-0003",
    type: "Inbound",
    sku: "SKU-0002",
    productName: "Corrugated Box 30×20cm",
    qty: 200,
    unit: "pcs",
    reason: "Purchase Order",
    reference: "PO-20250605",
    notes: "Re-stock before Q3 season.",
    performedBy: "Alice Tan",
    timestamp: "2025-06-05T11:00:00.000Z",
  },
];
