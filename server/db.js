// Single shared PrismaClient instance for the whole server.
// A singleton avoids exhausting the DB connection pool during dev reloads.
const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
