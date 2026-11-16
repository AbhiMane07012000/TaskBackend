const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const connectionString =process.env.NODE_ENV === "test"? process.env.TEST_DATABASE_URL: process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Database connection string is missing");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
