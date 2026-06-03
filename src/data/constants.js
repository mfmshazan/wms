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
