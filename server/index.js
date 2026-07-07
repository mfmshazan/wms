// WMS API server. Serves the REST API (backed by PostgreSQL via Prisma) and
// the Gemini AI proxy. Replaces the original root-level server.js.
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { notFound, errorHandler } = require("./middleware/error");
const { requireAuth } = require("./middleware/auth");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "2mb" }));

// Health check (public).
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Auth (public: register/login; /me is self-guarded).
app.use("/api/auth", require("./routes/auth"));

// Everything below requires a valid session.
app.use("/api", requireAuth);

// Feature routes.
app.use("/api/products", require("./routes/products"));
app.use("/api/movements", require("./routes/movements"));
app.use("/api/inspections", require("./routes/inspections"));
app.use("/api/defects", require("./routes/defects"));
app.use("/api/ncrs", require("./routes/ncrs"));
app.use("/api", require("./routes/ai")); // exposes /api/chat

// 404 + error handling (must be last).
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`WMS API server running on port ${PORT}`));
