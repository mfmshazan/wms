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

module.exports = { requireAuth, requireRole };
