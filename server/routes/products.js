// /api/products — inventory CRUD.
const express = require("express");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireRole } = require("../middleware/auth");
const { productCreate, productUpdate } = require("../validators/schemas");
const { nextProductSku } = require("../utils/ids");

const router = express.Router();

// GET /api/products — all products, newest first.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    res.json(products);
  })
);

// GET /api/products/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  })
);

// POST /api/products — SKU is generated server-side.
router.post(
  "/",
  validate(productCreate),
  asyncHandler(async (req, res) => {
    const sku = await nextProductSku();
    const product = await prisma.product.create({
      data: { ...req.body, sku },
    });
    res.status(201).json(product);
  })
);

// PUT /api/products/:id
router.put(
  "/:id",
  validate(productUpdate),
  asyncHandler(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(product);
  })
);

// DELETE /api/products/:id — ADMIN only.
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    await prisma.product.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  })
);

module.exports = router;
