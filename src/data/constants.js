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

// ── NCR & CAPA constants ───────────────────────────────────────────────────

export const NCR_STATUSES = [
  "Open",
  "In Review",
  "Action Assigned",
  "Resolved",
  "Closed"
];

export const NCR_TYPES = [
  "Supplier Non-Conformance",
  "Internal Process",
  "Customer Complaint",
  "Equipment Failure",
  "Documentation Error",
  "Other"
];

export const NCR_PRIORITIES = ["Critical", "High", "Medium", "Low"];

export const CAPA_TYPES = [
  "Corrective Action",
  "Preventive Action"
];

export const CAPA_STATUSES = [
  "Planned",
  "In Progress",
  "Completed",
  "Verified",
  "Cancelled"
];

export const INITIAL_NCRS = [
  {
    id: 1,
    ncrId: "NCR-0001",
    defectId: "DEF-0002",
    defectSku: "SKU-0001",
    productName: "Arduino Nano Rev3",
    type: "Supplier Non-Conformance",
    priority: "Critical",
    status: "In Review",
    title: "USB Port Short Circuit",
    description: "Multiple units failed power-on due to soldering shorts on the USB port.",
    immediateAction: "Quarantined remaining stock from this supplier batch.",
    raisedBy: "Alice Tan",
    assignedTo: "John Doe",
    targetDate: "2025-06-20",
    closedAt: null,
    timestamp: "2025-06-11T10:00:00.000Z",
    capas: [
      {
        id: 1,
        capaId: "CAPA-0001",
        type: "Corrective Action",
        status: "In Progress",
        description: "Require supplier to provide 100% functional test report for next batch.",
        assignedTo: "John Doe",
        targetDate: "2025-06-18",
        completedAt: null,
        verificationNotes: "",
        effectiveness: "Pending"
      }
    ]
  },
  {
    id: 2,
    ncrId: "NCR-0002",
    defectId: "DEF-0001",
    defectSku: "SKU-0002",
    productName: "Corrugated Box 30×20cm",
    type: "Internal Process",
    priority: "Medium",
    status: "Open",
    title: "Water Damage During Storage",
    description: "Pallet left near open bay door during rain storm.",
    immediateAction: "Moved unaffected boxes to dry racks. Scrapped 12 damaged units.",
    raisedBy: "Bob Lim",
    assignedTo: "Alice Tan",
    targetDate: "2025-06-15",
    closedAt: null,
    timestamp: "2025-06-06T09:00:00.000Z",
    capas: []
  },
  {
    id: 3,
    ncrId: "NCR-0003",
    defectId: null,
    defectSku: "SKU-0003",
    productName: "Organic Oat Flour 1kg",
    type: "Documentation Error",
    priority: "Low",
    status: "Closed",
    title: "Incorrect Pallet Label",
    description: "Pallet label showed wrong batch number compared to individual bags.",
    immediateAction: "Reprinted and applied correct pallet label.",
    raisedBy: "Carol White",
    assignedTo: "Bob Lim",
    targetDate: "2025-05-25",
    closedAt: "2025-05-22T14:30:00.000Z",
    timestamp: "2025-05-21T08:00:00.000Z",
    capas: [
      {
        id: 2,
        capaId: "CAPA-0002",
        type: "Preventive Action",
        status: "Verified",
        description: "Update WMS printing script to pull batch directly from PO instead of manual entry.",
        assignedTo: "Bob Lim",
        targetDate: "2025-05-24",
        completedAt: "2025-05-22T10:00:00.000Z",
        verificationNotes: "Tested 5 sample prints. All correct.",
        effectiveness: "Effective"
      }
    ]
  }
];
