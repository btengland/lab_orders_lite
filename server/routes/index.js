const express = require("express");
const patientRoutes = require("./patients");

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Mount patient routes
router.use("/patients", patientRoutes);

module.exports = router;
