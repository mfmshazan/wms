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

// ── Inspection / Quality constants ──────────────────────────────────────────

export const INSPECTION_TYPES = ["Incoming", "Outgoing", "In-Process"];

export const INSPECTION_RESULTS = ["Pass", "Fail", "Pending"];

export const INSPECTION_CRITERIA_TEMPLATES = {
  Incoming: [
    "Packaging intact",
    "Quantity matches PO",
    "No visible damage",
    "Labels correct",
    "Documentation complete",
  ],
  Outgoing: [
    "Order accuracy",
    "Packaging quality",
    "Labels correct",
    "Quantity verified",
    "Documentation complete",
  ],
  "In-Process": [
    "Dimensions within spec",
    "Surface finish acceptable",
    "Color match",
    "Assembly correct",
    "Function test passed",
  ],
};

export const INITIAL_INSPECTIONS = [
  {
    id: 1,
    inspectionId: "INS-0001",
    type: "Incoming",
    sku: "SKU-0001",
    productName: "Arduino Nano Rev3",
    movementId: "MOV-0001",
    quantity: 50,
    inspector: "Alice Tan",
    criteria: [
      { id: "C1", label: "Packaging intact", result: "Pass" },
      { id: "C2", label: "Quantity matches PO", result: "Pass" },
      { id: "C3", label: "No visible damage", result: "Pass" },
      { id: "C4", label: "Labels correct", result: "Pass" },
      { id: "C5", label: "Documentation complete", result: "Pass" },
    ],
    overallResult: "Pass",
    notes: "All items in excellent condition. Supplier packaging improved vs last PO.",
    timestamp: "2025-06-01T10:05:00.000Z",
  },
  {
    id: 2,
    inspectionId: "INS-0002",
    type: "Incoming",
    sku: "SKU-0002",
    productName: "Corrugated Box 30×20cm",
    movementId: "MOV-0003",
    quantity: 200,
    inspector: "Bob Lim",
    criteria: [
      { id: "C1", label: "Packaging intact", result: "Pass" },
      { id: "C2", label: "Quantity matches PO", result: "Pass" },
      { id: "C3", label: "No visible damage", result: "Fail" },
      { id: "C4", label: "Labels correct", result: "Pass" },
      { id: "C5", label: "Documentation complete", result: "Pending" },
    ],
    overallResult: "Fail",
    notes: "12 boxes in outer layer had water damage. Documentation awaited from supplier.",
    timestamp: "2025-06-05T13:30:00.000Z",
  },
];

// ── Defect / NCR constants ──────────────────────────────────────────────────

export const DEFECT_TYPES = [
  "Dimensional",
  "Surface Finish",
  "Functional",
  "Labeling",
  "Packaging",
  "Contamination",
  "Missing Component",
  "Wrong Item",
  "Other",
];

export const DEFECT_SEVERITIES = ["Critical", "Major", "Minor"];

export const DEFECT_STATUSES = ["Open", "Under Review", "Resolved", "Closed"];

export const DEFECT_DISPOSITIONS = [
  "Scrap",
  "Rework",
  "Return to Supplier",
  "Accept as-is",
  "Pending Decision",
];

export const INITIAL_DEFECTS = [
  {
    id: 1,
    defectId: "DEF-0001",
    sku: "SKU-0002",
    productName: "Corrugated Box 30×20cm",
    inspectionId: "INS-0002",
    criterionLabel: "No visible damage",
    type: "Packaging",
    severity: "Major",
    status: "Open",
    disposition: "Pending Decision",
    quantity: 12,
    description: "12 boxes in outer layer had water damage.",
    rootCause: "",
    reportedBy: "Bob Lim",
    assignedTo: "Alice Tan",
    timestamp: "2025-06-05T14:00:00.000Z",
    resolvedAt: null,
  },
  {
    id: 2,
    defectId: "DEF-0002",
    sku: "SKU-0001",
    productName: "Arduino Nano Rev3",
    inspectionId: null,
    criterionLabel: "",
    type: "Functional",
    severity: "Critical",
    status: "Under Review",
    disposition: "Return to Supplier",
    quantity: 5,
    description: "Microcontroller fails to power on when connected via USB.",
    rootCause: "Possible short circuit in the USB port soldering.",
    reportedBy: "Alice Tan",
    assignedTo: "John Doe",
    timestamp: "2025-06-10T09:30:00.000Z",
    resolvedAt: null,
  },
  {
    id: 3,
    defectId: "DEF-0003",
    sku: "SKU-0003",
    productName: "Organic Oat Flour 1kg",
    inspectionId: null,
    criterionLabel: "",
    type: "Labeling",
    severity: "Minor",
    status: "Resolved",
    disposition: "Accept as-is",
    quantity: 58,
    description: "Best before date printed slightly smudged but still legible.",
    rootCause: "Printer alignment issue during packaging.",
    reportedBy: "Carol White",
    assignedTo: "Bob Lim",
    timestamp: "2025-05-20T11:15:00.000Z",
    resolvedAt: "2025-05-21T15:45:00.000Z",
  },
];
