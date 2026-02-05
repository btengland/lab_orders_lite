const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Helper function for error handling
const handleError = (res, error, operation) => {
  if (error.code === "P2003") {
    return res
      .status(400)
      .json({ error: "Invalid patient ID or test ID provided" });
  }
  console.error(`Error ${operation}:`, error);
  res.status(500).json({ error: `Failed to ${operation}` });
};

// Get all orders
router.get("/", async (req, res) => {
  try {
    const { patientName, status } = req.query;

    // Build where clause based on filters
    let whereClause = {};

    // Filter by status if provided (SQLite doesn't support mode: insensitive)
    if (status) {
      whereClause.status = status;
    }

    // Filter by patient name if provided
    if (patientName) {
      const searchTerm = patientName.toLowerCase();
      whereClause.patient = {
        OR: [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
        ],
      };
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        patient: true, // Include patient data for filtering and display
      },
      orderBy: { createdAt: "desc" },
    });

    // Parse testIds from JSON string
    const ordersWithParsedTestIds = orders.map((order) => ({
      ...order,
      testIds: JSON.parse(order.testIds || "[]"),
    }));

    res.json(ordersWithParsedTestIds);
  } catch (error) {
    handleError(res, error, "fetch orders");
  }
});

// Create order
router.post("/", async (req, res) => {
  try {
    const { patientId, testIds, totalCost, estimatedDate, status } = req.body;

    if (
      !patientId ||
      !testIds ||
      !Array.isArray(testIds) ||
      testIds.length === 0 ||
      !totalCost ||
      !estimatedDate
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: patientId, testIds (array), totalCost, estimatedDate",
      });
    }

    // Verify patient exists
    const patient = await prisma.patients.findUnique({
      where: { id: parseInt(patientId) },
    });
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    // Verify all test IDs exist
    const tests = await prisma.labTests.findMany({
      where: { id: { in: testIds.map((id) => parseInt(id)) } },
    });
    if (tests.length !== testIds.length) {
      return res
        .status(400)
        .json({ error: "One or more test IDs are invalid" });
    }

    const order = await prisma.order.create({
      data: {
        patientId: parseInt(patientId),
        testIds: JSON.stringify(testIds),
        totalCost: parseFloat(totalCost),
        estimatedDate: new Date(estimatedDate),
        status: status || "pending",
      },
    });

    res.status(201).json(order);
  } catch (error) {
    handleError(res, error, "create order");
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Parse testIds from JSON string
    const orderWithParsedTestIds = {
      ...order,
      testIds: JSON.parse(order.testIds || "[]"),
    };

    res.json(orderWithParsedTestIds);
  } catch (error) {
    handleError(res, error, "fetch order");
  }
});

// Update order
router.put("/:id", async (req, res) => {
  try {
    const { patientId, testIds, totalCost, estimatedDate, status } = req.body;

    if (
      !patientId ||
      !testIds ||
      !Array.isArray(testIds) ||
      testIds.length === 0 ||
      !totalCost ||
      !estimatedDate
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: patientId, testIds (array), totalCost, estimatedDate",
      });
    }

    // Verify patient exists
    const patient = await prisma.patients.findUnique({
      where: { id: parseInt(patientId) },
    });
    if (!patient) {
      return res.status(400).json({ error: "Patient not found" });
    }

    // Verify all test IDs exist
    const tests = await prisma.labTests.findMany({
      where: { id: { in: testIds.map((id) => parseInt(id)) } },
    });
    if (tests.length !== testIds.length) {
      return res
        .status(400)
        .json({ error: "One or more test IDs are invalid" });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: {
        patientId: parseInt(patientId),
        testIds: JSON.stringify(testIds),
        totalCost: parseFloat(totalCost),
        estimatedDate: new Date(estimatedDate),
        status: status || "pending",
      },
    });

    res.json(order);
  } catch (error) {
    handleError(res, error, "update order");
  }
});

// Delete order
router.delete("/:id", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await prisma.order.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    handleError(res, error, "delete order");
  }
});

module.exports = router;
