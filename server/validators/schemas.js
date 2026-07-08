// Zod schemas for validating request bodies. `z.coerce` is used for numbers
// so string form values ("14") are accepted and converted.
const { z } = require("zod");

// ── Products ─────────────────────────────────────────────────────────────────
const productCreate = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  qty: z.coerce.number().int().min(0),
  unit: z.string().min(1),
  price: z.coerce.number().min(0),
  minStock: z.coerce.number().int().min(0),
  status: z.enum(["active", "inactive"]).default("active"),
});
// All fields optional on update.
const productUpdate = productCreate.partial();

// ── Movements ────────────────────────────────────────────────────────────────
const movementCreate = z.object({
  type: z.enum(["Inbound", "Outbound"]),
  sku: z.string().min(1),
  productName: z.string().min(1),
  qty: z.coerce.number().int().positive(),
  unit: z.string().min(1),
  reason: z.string().min(1),
  reference: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  performedBy: z.string().min(1),
});

// ── Inspections ──────────────────────────────────────────────────────────────
const criterion = z.object({
  code: z.string().optional(),
  label: z.string().min(1),
  result: z.enum(["Pass", "Fail", "Pending"]),
});
const inspectionCreate = z.object({
  type: z.enum(["Incoming", "Outgoing", "In-Process"]),
  sku: z.string().min(1),
  productName: z.string().min(1),
  movementRef: z.string().nullish(),
  quantity: z.coerce.number().int().min(0),
  inspector: z.string().min(1),
  criteria: z.array(criterion).min(1),
  notes: z.string().optional().default(""),
});
const inspectionUpdate = inspectionCreate.partial();

// ── Defects ──────────────────────────────────────────────────────────────────
const defectCreate = z.object({
  sku: z.string().min(1),
  productName: z.string().min(1),
  inspectionRef: z.string().nullish(),
  criterionLabel: z.string().nullish(),
  type: z.string().min(1),
  severity: z.enum(["Critical", "Major", "Minor"]),
  status: z.enum(["Open", "Under Review", "Resolved", "Closed"]).default("Open"),
  disposition: z.string().min(1),
  quantity: z.coerce.number().int().min(0),
  description: z.string().min(1),
  rootCause: z.string().nullish(),
  reportedBy: z.string().min(1),
  assignedTo: z.string().nullish(),
});
const defectUpdate = defectCreate.partial();

// ── NCR + CAPA ───────────────────────────────────────────────────────────────
const ncrCreate = z.object({
  defectRef: z.string().nullish(),
  defectSku: z.string().nullish(),
  productName: z.string().nullish(),
  type: z.string().min(1),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  status: z.enum(["Open", "In Review", "Action Assigned", "Resolved", "Closed"]).default("Open"),
  title: z.string().min(1),
  description: z.string().min(1),
  immediateAction: z.string().nullish(),
  raisedBy: z.string().min(1),
  assignedTo: z.string().nullish(),
  targetDate: z.string().nullish(),
});
const ncrUpdate = ncrCreate.partial();

const capaCreate = z.object({
  type: z.enum(["Corrective Action", "Preventive Action"]),
  status: z.enum(["Planned", "In Progress", "Completed", "Verified", "Cancelled"]).default("Planned"),
  description: z.string().min(1),
  assignedTo: z.string().nullish(),
  targetDate: z.string().nullish(),
  verificationNotes: z.string().optional().default(""),
  effectiveness: z.string().optional().default("Pending"),
});
const capaUpdate = capaCreate.partial();

// ── Users / Team ─────────────────────────────────────────────────────────────
const ROLES = ["ADMIN", "OPERATOR", "QUALITY"];

const userCreate = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(ROLES).default("OPERATOR"),
});
const userRoleUpdate = z.object({
  role: z.enum(ROLES),
});

module.exports = {
  userCreate,
  userRoleUpdate,
  productCreate,
  productUpdate,
  movementCreate,
  inspectionCreate,
  inspectionUpdate,
  defectCreate,
  defectUpdate,
  ncrCreate,
  ncrUpdate,
  capaCreate,
  capaUpdate,
};
