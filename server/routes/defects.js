// /api/defects — non-conformance defect records.
const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { defectCreate, defectUpdate } = require("../validators/schemas");
const { nextDefectId } = require("../utils/ids");

const router = express.Router();

const isResolved = (status) => status === "Resolved" || status === "Closed";

// GET /api/defects — newest first.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const defects = await prisma.defect.findMany({ orderBy: { timestamp: "desc" } });
    res.json(defects);
  })
);

// POST /api/defects — resolvedAt is stamped automatically when created resolved.
router.post(
  "/",
  validate(defectCreate),
  asyncHandler(async (req, res) => {
    const defectId = await nextDefectId();
    const defect = await prisma.defect.create({
      data: {
        ...req.body,
        defectId,
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
  validate(defectUpdate),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = { ...req.body };

    if (req.body.status !== undefined) {
      const current = await prisma.defect.findUnique({ where: { id } });
      if (!current) return res.status(404).json({ error: "Defect not found" });

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

// DELETE /api/defects/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.defect.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  })
);

module.exports = router;
