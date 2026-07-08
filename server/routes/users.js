// /api/users — team management within an organization.
// Any member can view the team; only ADMINs can add, change roles, or remove.
const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireRole } = require("../middleware/auth");
const { userCreate, userRoleUpdate } = require("../validators/schemas");

const router = express.Router();

// Fields safe to return (never the password hash).
const publicSelect = { id: true, name: true, email: true, role: true, createdAt: true };

// GET /api/users — members of the caller's organization.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({
      where: { organizationId: req.user.organizationId },
      orderBy: { id: "asc" },
      select: publicSelect,
    });
    res.json(users);
  })
);

// POST /api/users — ADMIN adds a member to their org with an initial password.
router.post(
  "/",
  requireRole("ADMIN"),
  validate(userCreate),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "That email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role, organizationId: req.user.organizationId },
      select: publicSelect,
    });
    res.status(201).json(user);
  })
);

// PATCH /api/users/:id/role — ADMIN changes a member's role.
router.patch(
  "/:id/role",
  requireRole("ADMIN"),
  validate(userRoleUpdate),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);

    // Guard against locking yourself out of admin.
    if (id === req.user.id) {
      return res.status(400).json({ error: "You can't change your own role" });
    }

    const target = await prisma.user.findFirst({
      where: { id, organizationId: req.user.organizationId },
    });
    if (!target) return res.status(404).json({ error: "User not found" });

    const user = await prisma.user.update({
      where: { id },
      data: { role: req.body.role },
      select: publicSelect,
    });
    res.json(user);
  })
);

// DELETE /api/users/:id — ADMIN removes a member from their org.
router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.user.id) {
      return res.status(400).json({ error: "You can't remove yourself" });
    }

    const { count } = await prisma.user.deleteMany({
      where: { id, organizationId: req.user.organizationId },
    });
    if (count === 0) return res.status(404).json({ error: "User not found" });
    res.status(204).end();
  })
);

module.exports = router;
