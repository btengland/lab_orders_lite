const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Helper function for error handling
const handleError = (res, error, operation) => {
  if (error.code === "P2002") {
    return res
      .status(409)
      .json({ error: "A lab test with this code already exists" });
  }
  console.error(`Error ${operation}:`, error);
  res.status(500).json({ error: `Failed to ${operation}` });
};

// Get all lab tests
router.get("/", async (req, res) => {
  try {
    const labTests = await prisma.labTests.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(labTests);
  } catch (error) {
    handleError(res, error, "fetch lab tests");
  }
});

// Create lab test
router.post("/", async (req, res) => {
  try {
    const { code, name, price, turnaroundTime } = req.body;

    if (!code || !name || price === undefined || !turnaroundTime) {
      return res.status(400).json({
        error: "Missing required fields: code, name, price, turnaroundTime",
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        error: "Price must be a positive number",
      });
    }

    // Validate turnaround time is a positive integer
    if (
      isNaN(turnaroundTime) ||
      turnaroundTime <= 0 ||
      !Number.isInteger(Number(turnaroundTime))
    ) {
      return res.status(400).json({
        error: "Turnaround time must be a positive integer (hours)",
      });
    }

    const labTest = await prisma.labTests.create({
      data: {
        code: code.toUpperCase(),
        name,
        price: parseFloat(price),
        turnaroundTime: parseInt(turnaroundTime),
      },
    });

    res.status(201).json(labTest);
  } catch (error) {
    handleError(res, error, "create lab test");
  }
});

// Get lab test by ID
router.get("/:id", async (req, res) => {
  try {
    const labTest = await prisma.labTests.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!labTest) {
      return res.status(404).json({ error: "Lab test not found" });
    }

    res.json(labTest);
  } catch (error) {
    handleError(res, error, "fetch lab test");
  }
});

// Update lab test
router.put("/:id", async (req, res) => {
  try {
    const { code, name, price, turnaroundTime } = req.body;

    if (!code || !name || price === undefined || !turnaroundTime) {
      return res.status(400).json({
        error: "Missing required fields: code, name, price, turnaroundTime",
      });
    }

    // Validate price is a positive number
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        error: "Price must be a positive number",
      });
    }

    // Validate turnaround time is a positive integer
    if (
      isNaN(turnaroundTime) ||
      turnaroundTime <= 0 ||
      !Number.isInteger(Number(turnaroundTime))
    ) {
      return res.status(400).json({
        error: "Turnaround time must be a positive integer (hours)",
      });
    }

    const labTest = await prisma.labTests.update({
      where: { id: parseInt(req.params.id) },
      data: {
        code: code.toUpperCase(),
        name,
        price: parseFloat(price),
        turnaroundTime: parseInt(turnaroundTime),
      },
    });

    res.json(labTest);
  } catch (error) {
    handleError(res, error, "update lab test");
  }
});

// Delete lab test
router.delete("/:id", async (req, res) => {
  try {
    const labTest = await prisma.labTests.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!labTest) {
      return res.status(404).json({ error: "Lab test not found" });
    }

    await prisma.labTests.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Lab test deleted successfully" });
  } catch (error) {
    handleError(res, error, "delete lab test");
  }
});

module.exports = router;
