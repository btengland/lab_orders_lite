const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Helper function for error handling
const handleError = (res, error, operation) => {
  if (error.code === "P2002") {
    return res
      .status(409)
      .json({ error: "A patient with this email already exists" });
  }
  console.error(`Error ${operation}:`, error);
  res.status(500).json({ error: `Failed to ${operation}` });
};

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await prisma.patients.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(patients);
  } catch (error) {
    handleError(res, error, "fetch patients");
  }
});

// Create patient
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, phone, email, address } =
      req.body;

    if (!firstName || !lastName || !dateOfBirth || !email) {
      return res.status(400).json({
        error:
          "Missing required fields: firstName, lastName, dateOfBirth, email",
      });
    }

    const patient = await prisma.patients.create({
      data: { firstName, lastName, dateOfBirth, phone, email, address },
    });

    res.status(201).json(patient);
  } catch (error) {
    handleError(res, error, "create patient");
  }
});

// Get patient by ID
router.get("/:id", async (req, res) => {
  try {
    const patient = await prisma.patients.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    handleError(res, error, "fetch patient");
  }
});

// Update patient
router.put("/:id", async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, phone, email, address } =
      req.body;

    if (!firstName || !lastName || !dateOfBirth || !email) {
      return res.status(400).json({
        error:
          "Missing required fields: firstName, lastName, dateOfBirth, email",
      });
    }

    const patient = await prisma.patients.update({
      where: { id: parseInt(req.params.id) },
      data: { firstName, lastName, dateOfBirth, phone, email, address },
    });

    res.json(patient);
  } catch (error) {
    handleError(res, error, "update patient");
  }
});

module.exports = router;
