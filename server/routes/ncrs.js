// /api/ncrs — Non-Conformance Reports and their nested CAPA actions
// (Corrective / Preventive). CAPAs are managed under /api/ncrs/:id/capas.
const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireRole } = require("../middleware/auth");
const {
  ncrCreate,
  ncrUpdate,
  capaCreate,
  capaUpdate,
} = require("../validators/schemas");
const { nextNcrId, nextCapaId } = require("../utils/ids");

const router = express.Router();

const withCapas = { capas: { orderBy: { id: "asc" } } };

// ── NCRs ─────────────────────────────────────────────────────────────────────

// GET /api/ncrs — this org's NCRs (incl. CAPAs), newest first.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const ncrs = await prisma.nCR.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { timestamp: "desc" },
      include: withCapas,
    });
    res.json(ncrs);
  })
);

// POST /api/ncrs
router.post(
  "/",
  validate(ncrCreate),
  asyncHandler(async (req, res) => {
    const ncrId = await nextNcrId();
    const ncr = await prisma.nCR.create({
      data: {
        ...req.body,
        ncrId,
        organizationId: req.user.organizationId,
        closedAt: req.body.status === "Closed" ? new Date() : null,
      },
      include: withCapas,
    });
    res.status(201).json(ncr);
  })
);

// PUT /api/ncrs/:id — closedAt is stamped/cleared as status crosses "Closed".
router.put(
  "/:id",
  validate(ncrUpdate),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const data = { ...req.body };

    const current = await prisma.nCR.findFirst({
      where: { id, organizationId: req.user.organizationId },
    });
    if (!current) return res.status(404).json({ error: "NCR not found" });

    if (req.body.status !== undefined) {
      if (req.body.status === "Closed" && !current.closedAt) {
        data.closedAt = new Date();
      } else if (req.body.status !== "Closed") {
        data.closedAt = null;
      }
    }

    const ncr = await prisma.nCR.update({ where: { id }, data, include: withCapas });
    res.json(ncr);
  })
);

// DELETE /api/ncrs/:id (CAPAs cascade automatically). ADMIN only, org-scoped.
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { count } = await prisma.nCR.deleteMany({
      where: { id: Number(req.params.id), organizationId: req.user.organizationId },
    });
    if (count === 0) return res.status(404).json({ error: "NCR not found" });
    res.status(204).end();
  })
);

// ── CAPAs (nested under an NCR) ──────────────────────────────────────────────
// Addressed by business ids: :ncrId = "NCR-0001", :capaId = "CAPA-0001".

// POST /api/ncrs/:ncrId/capas — the parent NCR must belong to this org.
router.post(
  "/:ncrId/capas",
  validate(capaCreate),
  asyncHandler(async (req, res) => {
    const parent = await prisma.nCR.findFirst({
      where: { ncrId: req.params.ncrId, organizationId: req.user.organizationId },
    });
    if (!parent) return res.status(404).json({ error: "NCR not found" });

    const capaId = await nextCapaId();
    const capa = await prisma.cAPA.create({
      data: {
        ...req.body,
        capaId,
        completedAt: req.body.status === "Completed" ? new Date() : null,
        ncr: { connect: { id: parent.id } },
      },
    });
    res.status(201).json(capa);
  })
);

// PUT /api/ncrs/:ncrId/capas/:capaId — completedAt stamped when Completed/Verified.
router.put(
  "/:ncrId/capas/:capaId",
  validate(capaUpdate),
  asyncHandler(async (req, res) => {
    const { capaId } = req.params;
    const data = { ...req.body };

    // Match the CAPA only if its parent NCR is in this org.
    const current = await prisma.cAPA.findFirst({
      where: { capaId, ncr: { organizationId: req.user.organizationId } },
    });
    if (!current) return res.status(404).json({ error: "CAPA not found" });

    if (req.body.status !== undefined) {
      const done = req.body.status === "Completed" || req.body.status === "Verified";
      if (done && !current.completedAt) data.completedAt = new Date();
      else if (!done) data.completedAt = null;
    }

    const capa = await prisma.cAPA.update({ where: { capaId }, data });
    res.json(capa);
  })
);

// DELETE /api/ncrs/:ncrId/capas/:capaId — org-scoped via the parent NCR.
router.delete(
  "/:ncrId/capas/:capaId",
  asyncHandler(async (req, res) => {
    const { count } = await prisma.cAPA.deleteMany({
      where: {
        capaId: req.params.capaId,
        ncr: { organizationId: req.user.organizationId },
      },
    });
    if (count === 0) return res.status(404).json({ error: "CAPA not found" });
    res.status(204).end();
  })
);

module.exports = router;
