// JWT helpers. Tokens carry the user's id, email, name and role so most
// requests can be authorized without a database lookup.
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const EXPIRES_IN = "7d";

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET); // throws if invalid/expired
}

// Shape the user object we expose to clients (never include passwordHash).
function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

module.exports = { signToken, verifyToken, publicUser };
