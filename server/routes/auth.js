// /api/auth — registration, login, and current-user lookup.
const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../db");
const { asyncHandler } = require("../middleware/error");
const { validate } = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const { signToken, publicUser } = require("../utils/auth");

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  // The company/warehouse this account belongs to. Registration creates a brand
  // new organization, and the first user becomes its ADMIN.
  organizationName: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, name, organizationName } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "That email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create the organization and its first user (an ADMIN) together.
    const org = await prisma.organization.create({
      data: {
        name: organizationName,
        users: {
          create: { email, name, passwordHash, role: "ADMIN" },
        },
      },
      include: { users: true },
    });
    const user = org.users[0];

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  })
);

// POST /api/auth/login
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    // Same message whether the email or the password is wrong (avoids leaking
    // which emails exist).
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  })
);

// GET /api/auth/me — validate the stored token and return the user.
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);

module.exports = router;
