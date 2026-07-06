// Central error handling.

// Wraps an async route handler so thrown errors reach Express' error pipeline
// without a try/catch in every handler.
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// 404 for unmatched API routes.
function notFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}

// Final error handler. Maps common Prisma errors to sensible HTTP codes.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  // Prisma: record not found (e.g. update/delete of missing row)
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Record not found" });
  }
  // Prisma: unique constraint violation
  if (err.code === "P2002") {
    return res.status(409).json({ error: "A record with that value already exists" });
  }
  // Prisma: foreign key constraint (e.g. SKU that doesn't exist)
  if (err.code === "P2003") {
    return res.status(400).json({ error: "Referenced record does not exist" });
  }

  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
}

module.exports = { asyncHandler, notFound, errorHandler };
