// Authentication & authorization middleware.
const { verifyToken } = require("../utils/auth");

// requireAuth — rejects requests without a valid Bearer token, otherwise
// attaches the decoded user to req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      organizationId: payload.org,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

// requireRole(...roles) — must run after requireAuth. 403s if the user's role
// isn't in the allowed set.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to do that" });
    }
    next();
  };
}

// Which write domain each non-admin role owns. ADMIN owns everything.
const DOMAIN_BY_ROLE = {
  OPERATOR: "inventory", // products, movements
  QUALITY: "quality", // inspections, defects, NCRs, CAPAs
};

// canWrite — true if the role may modify the given domain's records.
function canWrite(role, domain) {
  return role === "ADMIN" || DOMAIN_BY_ROLE[role] === domain;
}

// requireWrite(domain) — guards create/update routes so each role can only
// modify its own domain ("inventory" | "quality").
function requireWrite(domain) {
  return (req, res, next) => {
    if (!req.user || !canWrite(req.user.role, domain)) {
      return res
        .status(403)
        .json({ error: `Your role (${req.user?.role}) can't modify ${domain} records` });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole, requireWrite, canWrite };
