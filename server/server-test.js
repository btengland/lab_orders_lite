require("dotenv").config();
console.log("Testing server setup...");
console.log("Environment variables loaded");

try {
  console.log("Current directory:", process.cwd());
  console.log("Checking if routes exist...");

  const routes = require("./routes");
  console.log("Routes loaded successfully");

  const { PrismaClient } = require("@prisma/client");
  console.log("Prisma client loaded");

  const express = require("express");
  const app = express();

  app.use(express.json());
  app.use("/api", routes);

  const PORT = 3001;

  const server = app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}`);
    console.log(`Test with: http://localhost:${PORT}/api/health`);
  });

  // Keep the process alive
  process.on("SIGINT", () => {
    console.log("\nShutting down server...");
    server.close();
    process.exit(0);
  });
} catch (error) {
  console.error("Error starting server:", error);
  process.exit(1);
}
