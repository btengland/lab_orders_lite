const express = require("express");
const patientRoutes = require("./patients");
const labTestRoutes = require("./lab-tests");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Mount patient routes
router.use("/patients", patientRoutes);

// Mount lab test routes
router.use("/lab-tests", labTestRoutes);

module.exports = router;
