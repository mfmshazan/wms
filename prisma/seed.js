// Seeds the database with the app's original demo data.
// Run with:  npm run db:seed   (or automatically via `prisma migrate reset`)
const bcrypt = require("bcryptjs");
const prisma = require("../server/db");

async function main() {
  console.log("Seeding database…");

  // ── Wipe (child → parent order) so re-seeding is idempotent ──────────────
  await prisma.cAPA.deleteMany();
  await prisma.nCR.deleteMany();
  await prisma.defect.deleteMany();
  await prisma.criterion.deleteMany();
  await prisma.inspection.deleteMany();
  await prisma.movement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // ── Organization (the demo tenant that owns all seed data) ───────────────
  const org = await prisma.organization.create({ data: { name: "Demo Warehouse" } });
  const organizationId = org.id;

  // ── Users (all members of the demo org) ──────────────────────────────────
  const password = await bcrypt.hash("password123", 10);
  await prisma.user.createMany({
    data: [
      { email: "admin@wms.dev", name: "Admin User", role: "ADMIN", passwordHash: password, organizationId },
      { email: "operator@wms.dev", name: "Alice Tan", role: "OPERATOR", passwordHash: password, organizationId },
      { email: "quality@wms.dev", name: "Bob Lim", role: "QUALITY", passwordHash: password, organizationId },
    ],
  });

  // ── Products ─────────────────────────────────────────────────────────────
  await prisma.product.createMany({
    data: [
      { sku: "SKU-0001", name: "Arduino Nano Rev3", category: "Electronics", qty: 14, unit: "pcs", price: 12.49, minStock: 20, status: "active", organizationId },
      { sku: "SKU-0002", name: "Corrugated Box 30×20cm", category: "Packaging", qty: 340, unit: "pcs", price: 0.85, minStock: 100, status: "active", organizationId },
      { sku: "SKU-0003", name: "Organic Oat Flour 1kg", category: "Food & Beverage", qty: 58, unit: "kg", price: 3.2, minStock: 50, status: "inactive", organizationId },
    ],
  });

  // ── Movements ────────────────────────────────────────────────────────────
  await prisma.movement.createMany({
    data: [
      { movementId: "MOV-0001", type: "Inbound", sku: "SKU-0001", productName: "Arduino Nano Rev3", qty: 50, unit: "pcs", reason: "Purchase Order", reference: "PO-20250601", notes: "Initial stock received from supplier.", performedBy: "Alice Tan", timestamp: new Date("2025-06-01T09:15:00.000Z"), organizationId },
      { movementId: "MOV-0002", type: "Outbound", sku: "SKU-0001", productName: "Arduino Nano Rev3", qty: 36, unit: "pcs", reason: "Sales Order", reference: "SO-20250603", notes: "", performedBy: "Bob Lim", timestamp: new Date("2025-06-03T14:40:00.000Z"), organizationId },
      { movementId: "MOV-0003", type: "Inbound", sku: "SKU-0002", productName: "Corrugated Box 30×20cm", qty: 200, unit: "pcs", reason: "Purchase Order", reference: "PO-20250605", notes: "Re-stock before Q3 season.", performedBy: "Alice Tan", timestamp: new Date("2025-06-05T11:00:00.000Z"), organizationId },
    ],
  });

  // ── Inspections (+ nested criteria) ──────────────────────────────────────
  await prisma.inspection.create({
    data: {
      inspectionId: "INS-0001", type: "Incoming", sku: "SKU-0001", productName: "Arduino Nano Rev3",
      movementRef: "MOV-0001", quantity: 50, inspector: "Alice Tan", overallResult: "Pass",
      notes: "All items in excellent condition. Supplier packaging improved vs last PO.",
      timestamp: new Date("2025-06-01T10:05:00.000Z"), organizationId,
      criteria: {
        create: [
          { code: "C1", label: "Packaging intact", result: "Pass" },
          { code: "C2", label: "Quantity matches PO", result: "Pass" },
          { code: "C3", label: "No visible damage", result: "Pass" },
          { code: "C4", label: "Labels correct", result: "Pass" },
          { code: "C5", label: "Documentation complete", result: "Pass" },
        ],
      },
    },
  });
  await prisma.inspection.create({
    data: {
      inspectionId: "INS-0002", type: "Incoming", sku: "SKU-0002", productName: "Corrugated Box 30×20cm",
      movementRef: "MOV-0003", quantity: 200, inspector: "Bob Lim", overallResult: "Fail",
      notes: "12 boxes in outer layer had water damage. Documentation awaited from supplier.",
      timestamp: new Date("2025-06-05T13:30:00.000Z"), organizationId,
      criteria: {
        create: [
          { code: "C1", label: "Packaging intact", result: "Pass" },
          { code: "C2", label: "Quantity matches PO", result: "Pass" },
          { code: "C3", label: "No visible damage", result: "Fail" },
          { code: "C4", label: "Labels correct", result: "Pass" },
          { code: "C5", label: "Documentation complete", result: "Pending" },
        ],
      },
    },
  });

  // ── Defects ──────────────────────────────────────────────────────────────
  await prisma.defect.createMany({
    data: [
      { defectId: "DEF-0001", sku: "SKU-0002", productName: "Corrugated Box 30×20cm", inspectionRef: "INS-0002", criterionLabel: "No visible damage", type: "Packaging", severity: "Major", status: "Open", disposition: "Pending Decision", quantity: 12, description: "12 boxes in outer layer had water damage.", rootCause: null, reportedBy: "Bob Lim", assignedTo: "Alice Tan", timestamp: new Date("2025-06-05T14:00:00.000Z"), resolvedAt: null, organizationId },
      { defectId: "DEF-0002", sku: "SKU-0001", productName: "Arduino Nano Rev3", inspectionRef: null, criterionLabel: null, type: "Functional", severity: "Critical", status: "Under Review", disposition: "Return to Supplier", quantity: 5, description: "Microcontroller fails to power on when connected via USB.", rootCause: "Possible short circuit in the USB port soldering.", reportedBy: "Alice Tan", assignedTo: "John Doe", timestamp: new Date("2025-06-10T09:30:00.000Z"), resolvedAt: null, organizationId },
      { defectId: "DEF-0003", sku: "SKU-0003", productName: "Organic Oat Flour 1kg", inspectionRef: null, criterionLabel: null, type: "Labeling", severity: "Minor", status: "Resolved", disposition: "Accept as-is", quantity: 58, description: "Best before date printed slightly smudged but still legible.", rootCause: "Printer alignment issue during packaging.", reportedBy: "Carol White", assignedTo: "Bob Lim", timestamp: new Date("2025-05-20T11:15:00.000Z"), resolvedAt: new Date("2025-05-21T15:45:00.000Z"), organizationId },
    ],
  });

  // ── NCRs (+ nested CAPAs) ────────────────────────────────────────────────
  await prisma.nCR.create({
    data: {
      ncrId: "NCR-0001", defectRef: "DEF-0002", defectSku: "SKU-0001", productName: "Arduino Nano Rev3",
      type: "Supplier Non-Conformance", priority: "Critical", status: "In Review",
      title: "USB Port Short Circuit", description: "Multiple units failed power-on due to soldering shorts on the USB port.",
      immediateAction: "Quarantined remaining stock from this supplier batch.", raisedBy: "Alice Tan",
      assignedTo: "John Doe", targetDate: "2025-06-20", closedAt: null, timestamp: new Date("2025-06-11T10:00:00.000Z"), organizationId,
      capas: {
        create: [
          { capaId: "CAPA-0001", type: "Corrective Action", status: "In Progress", description: "Require supplier to provide 100% functional test report for next batch.", assignedTo: "John Doe", targetDate: "2025-06-18", completedAt: null, verificationNotes: "", effectiveness: "Pending" },
        ],
      },
    },
  });
  await prisma.nCR.create({
    data: {
      ncrId: "NCR-0002", defectRef: "DEF-0001", defectSku: "SKU-0002", productName: "Corrugated Box 30×20cm",
      type: "Internal Process", priority: "Medium", status: "Open",
      title: "Water Damage During Storage", description: "Pallet left near open bay door during rain storm.",
      immediateAction: "Moved unaffected boxes to dry racks. Scrapped 12 damaged units.", raisedBy: "Bob Lim",
      assignedTo: "Alice Tan", targetDate: "2025-06-15", closedAt: null, timestamp: new Date("2025-06-06T09:00:00.000Z"), organizationId,
    },
  });
  await prisma.nCR.create({
    data: {
      ncrId: "NCR-0003", defectRef: null, defectSku: "SKU-0003", productName: "Organic Oat Flour 1kg",
      type: "Documentation Error", priority: "Low", status: "Closed",
      title: "Incorrect Pallet Label", description: "Pallet label showed wrong batch number compared to individual bags.",
      immediateAction: "Reprinted and applied correct pallet label.", raisedBy: "Carol White",
      assignedTo: "Bob Lim", targetDate: "2025-05-25", closedAt: new Date("2025-05-22T14:30:00.000Z"), timestamp: new Date("2025-05-21T08:00:00.000Z"), organizationId,
      capas: {
        create: [
          { capaId: "CAPA-0002", type: "Preventive Action", status: "Verified", description: "Update WMS printing script to pull batch directly from PO instead of manual entry.", assignedTo: "Bob Lim", targetDate: "2025-05-24", completedAt: new Date("2025-05-22T10:00:00.000Z"), verificationNotes: "Tested 5 sample prints. All correct.", effectiveness: "Effective" },
        ],
      },
    },
  });

  const counts = {
    users: await prisma.user.count(),
    products: await prisma.product.count(),
    movements: await prisma.movement.count(),
    inspections: await prisma.inspection.count(),
    defects: await prisma.defect.count(),
    ncrs: await prisma.nCR.count(),
    capas: await prisma.cAPA.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
