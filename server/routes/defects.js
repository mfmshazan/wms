// /api/defects — non-conformance defect records.
const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireRole, requireWrite } = require("../middleware/auth");
const { defectCreate, defectUpdate } = require("../validators/schemas");
const { nextDefectId } = require("../utils/ids");

const router = express.Router();

const isResolved = (status) => status === "Resolved" || status === "Closed";

// GET /api/defects — this org's defects, newest first.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const defects = await prisma.defect.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { timestamp: "desc" },
    });
    res.json(defects);
  })
);

// POST /api/defects — resolvedAt is stamped automatically when created resolved.
router.post(
  "/",
  requireWrite("quality"),
  validate(defectCreate),
  asyncHandler(async (req, res) => {
    const defectId = await nextDefectId();
    const defect = await prisma.defect.create({
      data: {
        ...req.body,
        defectId,
        organizationId: req.user.organizationId,
        resolvedAt: isResolved(req.body.status) ? new Date() : null,
      },
    });
    res.status(201).json(defect);
  })
);

// PUT /api/defects/:id — typically status/disposition changes.
// resolvedAt is set when moving into a resolved state and cleared when leaving.
router.put(
  "/:id",
  requireWrite("quality"),
  validate(defectUpdate),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = { ...req.body };

    const current = await prisma.defect.findFirst({
      where: { id, organizationId: req.user.organizationId },
    });
    if (!current) return res.status(404).json({ error: "Defect not found" });

    if (req.body.status !== undefined) {
      if (isResolved(req.body.status) && !current.resolvedAt) {
        data.resolvedAt = new Date();
      } else if (!isResolved(req.body.status)) {
        data.resolvedAt = null;
      }
    }

    const defect = await prisma.defect.update({ where: { id }, data });
    res.json(defect);
  })
);

// DELETE /api/defects/:id — ADMIN only, scoped to the org.
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { count } = await prisma.defect.deleteMany({
      where: { id: Number(req.params.id), organizationId: req.user.organizationId },
    });
    if (count === 0) return res.status(404).json({ error: "Defect not found" });
    res.status(204).end();
  })
);

module.exports = router;
