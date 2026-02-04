require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// GET /api/patients - Get all patients
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: patients,
      message: `Found ${patients.length} patients`,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
    });
  }
});

// GET /api/patients/:id - Get patient by ID
app.get("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found`,
      });
    }

    res.json({
      success: true,
      data: patient,
      message: "Patient found",
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
    });
  }
});

// POST /api/patients - Create new patient
app.post("/api/patients", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, address } =
      req.body;

    // Basic validation
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "firstName and lastName are required",
      });
    }

    const newPatient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address: address || null,
      },
    });

    res.status(201).json({
      success: true,
      data: newPatient,
      message: "Patient created successfully",
    });
  } catch (error) {
    console.error("Error creating patient:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create patient",
    });
  }
});

// PUT /api/patients/:id - Update existing patient
app.put("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, dateOfBirth, address } =
      req.body;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id },
    });

    if (!existingPatient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found`,
      });
    }

    // Update patient data
    const updatedPatient = await prisma.patient.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(dateOfBirth !== undefined && {
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        }),
        ...(address !== undefined && { address }),
      },
    });

    res.json({
      success: true,
      data: updatedPatient,
      message: "Patient updated successfully",
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update patient",
    });
  }
});

// Start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Successfully connected to SQLite database");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👥 Get all patients: http://localhost:${PORT}/api/patients`);
      console.log("\n✨ Ready for real database CRUD operations!");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app };
