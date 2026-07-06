// Server-side generators for the app's human-readable business IDs
// (SKU-0001, MOV-0001, …). Each derives the next number from the highest
// existing value in the database so IDs stay sequential and unique.
const prisma = require("../db");

/** Pull the numeric suffix out of an ID like "MOV-0007" → 7. */
function suffixNumber(id, prefix) {
  if (!id) return 0;
  const n = parseInt(id.slice(prefix.length + 1), 10); // +1 for the dash
  return Number.isNaN(n) ? 0 : n;
}

function pad(n) {
  return String(n).padStart(4, "0");
}

async function nextProductSku() {
  const last = await prisma.product.findFirst({ orderBy: { id: "desc" } });
  return `SKU-${pad(suffixNumber(last?.sku, "SKU") + 1)}`;
}

async function nextMovementId() {
  const last = await prisma.movement.findFirst({ orderBy: { id: "desc" } });
  return `MOV-${pad(suffixNumber(last?.movementId, "MOV") + 1)}`;
}

async function nextInspectionId() {
  const last = await prisma.inspection.findFirst({ orderBy: { id: "desc" } });
  return `INS-${pad(suffixNumber(last?.inspectionId, "INS") + 1)}`;
}

async function nextDefectId() {
  const last = await prisma.defect.findFirst({ orderBy: { id: "desc" } });
  return `DEF-${pad(suffixNumber(last?.defectId, "DEF") + 1)}`;
}

async function nextNcrId() {
  const last = await prisma.nCR.findFirst({ orderBy: { id: "desc" } });
  return `NCR-${pad(suffixNumber(last?.ncrId, "NCR") + 1)}`;
}

async function nextCapaId() {
  const last = await prisma.cAPA.findFirst({ orderBy: { id: "desc" } });
  return `CAPA-${pad(suffixNumber(last?.capaId, "CAPA") + 1)}`;
}

module.exports = {
  nextProductSku,
  nextMovementId,
  nextInspectionId,
  nextDefectId,
  nextNcrId,
  nextCapaId,
};
