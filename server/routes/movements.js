// /api/movements — stock ledger. Creating a movement also adjusts the
// product's quantity, and both happen inside a single DB transaction so they
// can never drift apart (a movement without its stock change, or vice versa).
const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireRole, requireWrite } = require("../middleware/auth");
const { movementCreate } = require("../validators/schemas");

const router = express.Router();

// GET /api/movements — this org's movements, newest first.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const movements = await prisma.movement.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { timestamp: "desc" },
    });
    res.json(movements);
  })
);

// POST /api/movements — record an Inbound or Outbound movement.
// Inbound increases stock; Outbound decreases it (rejected if insufficient).
router.post(
  "/",
  requireWrite("inventory"),
  validate(movementCreate),
  asyncHandler(async (req, res) => {
    const { type, sku, qty } = req.body;
    const organizationId = req.user.organizationId;

    const result = await prisma.$transaction(async (tx) => {
      // Only match a product that belongs to this org.
      const product = await tx.product.findFirst({ where: { sku, organizationId } });
      if (!product) {
        const err = new Error(`Unknown SKU: ${sku}`);
        err.status = 400;
        throw err;
      }

      if (type === "Outbound" && product.qty < qty) {
        const err = new Error("Insufficient stock");
        err.status = 409;
        throw err;
      }

      await tx.product.update({
        where: { sku },
        data: { qty: type === "Inbound" ? { increment: qty } : { decrement: qty } },
      });

      const movementId = await nextMovementIdTx(tx);
      return tx.movement.create({
        data: { ...req.body, movementId, organizationId },
      });
    });

    res.status(201).json(result);
  })
);

// DELETE /api/movements/:id — remove a ledger record (does NOT reverse stock).
// ADMIN only, scoped to the org.
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { count } = await prisma.movement.deleteMany({
      where: { id: Number(req.params.id), organizationId: req.user.organizationId },
    });
    if (count === 0) return res.status(404).json({ error: "Movement not found" });
    res.status(204).end();
  })
);

// Next movement ID computed within the transaction client for consistency.
async function nextMovementIdTx(tx) {
  const last = await tx.movement.findFirst({ orderBy: { id: "desc" } });
  const n = last ? parseInt(last.movementId.slice(4), 10) + 1 : 1;
  return `MOV-${String(n).padStart(4, "0")}`;
}

module.exports = router;
