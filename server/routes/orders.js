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
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { patient: true },
    });
    res.json(orders);
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

module.exports = router;
