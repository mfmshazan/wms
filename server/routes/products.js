// /api/products — inventory CRUD.
const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireRole } = require("../middleware/auth");
const { productCreate, productUpdate } = require("../validators/schemas");
const { nextProductSku } = require("../utils/ids");

const router = express.Router();

// GET /api/products — this org's products.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { id: "asc" },
    });
    res.json(products);
  })
);

// GET /api/products/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findFirst({
      where: { id: Number(req.params.id), organizationId: req.user.organizationId },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  })
);

// POST /api/products — SKU is generated server-side; row is tied to the org.
router.post(
  "/",
  validate(productCreate),
  asyncHandler(async (req, res) => {
    const sku = await nextProductSku();
    const product = await prisma.product.create({
      data: { ...req.body, sku, organizationId: req.user.organizationId },
    });
    res.status(201).json(product);
  })
);

// PUT /api/products/:id
router.put(
  "/:id",
  validate(productUpdate),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    // Ownership check keeps one org from editing another org's rows.
    const existing = await prisma.product.findFirst({
      where: { id, organizationId: req.user.organizationId },
    });
    if (!existing) return res.status(404).json({ error: "Product not found" });

    const product = await prisma.product.update({ where: { id }, data: req.body });
    res.json(product);
  })
);

// DELETE /api/products/:id — ADMIN only, scoped to the org.
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { count } = await prisma.product.deleteMany({
      where: { id: Number(req.params.id), organizationId: req.user.organizationId },
    });
    if (count === 0) return res.status(404).json({ error: "Product not found" });
    res.status(204).end();
  })
);

module.exports = router;
