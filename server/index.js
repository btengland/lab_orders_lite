require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Basic server setup
async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Successfully connected to PostgreSQL database");

    // Example query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database query test successful:", result);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Basic Express server setup (optional)
if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { prisma };
