// /api/inspections — quality inspections with a nested criteria checklist.
// overallResult is derived from the criteria, never trusted from the client.
const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireRole, requireWrite } = require("../middleware/auth");
const { inspectionCreate, inspectionUpdate } = require("../validators/schemas");
const { nextInspectionId } = require("../utils/ids");

const router = express.Router();

// Fail if ANY criterion fails; Pending if any pending (and none failed);
// otherwise Pass.
function computeOverallResult(criteria) {
  if (criteria.some((c) => c.result === "Fail")) return "Fail";
  if (criteria.some((c) => c.result === "Pending")) return "Pending";
  return "Pass";
}

// Attach a positional code (C1, C2, …) to each criterion.
function withCodes(criteria) {
  return criteria.map((c, i) => ({
    code: c.code || `C${i + 1}`,
    label: c.label,
    result: c.result,
  }));
}

// GET /api/inspections — includes criteria, newest first.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const inspections = await prisma.inspection.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { timestamp: "desc" },
      include: { criteria: { orderBy: { id: "asc" } } },
    });
    res.json(inspections);
  })
);

// POST /api/inspections
router.post(
  "/",
  requireWrite("quality"),
  validate(inspectionCreate),
  asyncHandler(async (req, res) => {
    const { criteria, ...rest } = req.body;
    const inspectionId = await nextInspectionId();
    const inspection = await prisma.inspection.create({
      data: {
        ...rest,
        inspectionId,
        organizationId: req.user.organizationId,
        overallResult: computeOverallResult(criteria),
        criteria: { create: withCodes(criteria) },
      },
      include: { criteria: { orderBy: { id: "asc" } } },
    });
    res.status(201).json(inspection);
  })
);

// PUT /api/inspections/:id — replaces criteria and recomputes overallResult.
router.put(
  "/:id",
  requireWrite("quality"),
  validate(inspectionUpdate),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { criteria, ...rest } = req.body;

    const existing = await prisma.inspection.findFirst({
      where: { id, organizationId: req.user.organizationId },
    });
    if (!existing) return res.status(404).json({ error: "Inspection not found" });

    const data = { ...rest };
    if (criteria) {
      data.overallResult = computeOverallResult(criteria);
      // Replace the whole checklist.
      data.criteria = { deleteMany: {}, create: withCodes(criteria) };
    }

    const inspection = await prisma.inspection.update({
      where: { id },
      data,
      include: { criteria: { orderBy: { id: "asc" } } },
    });
    res.json(inspection);
  })
);

// DELETE /api/inspections/:id (criteria cascade automatically). ADMIN only.
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { count } = await prisma.inspection.deleteMany({
      where: { id: Number(req.params.id), organizationId: req.user.organizationId },
    });
    if (count === 0) return res.status(404).json({ error: "Inspection not found" });
    res.status(204).end();
  })
);

module.exports = router;
