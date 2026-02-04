// Quick database test script
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log("🔌 Testing database connection...");

    // Test 1: Create a patient
    console.log("\n📝 Creating a test patient...");
    const timestamp = Date.now();
    const newPatient = await prisma.patients.create({
      data: {
        firstName: "Test",
        lastName: "Patient",
        dateOfBirth: "1990-01-01",
        email: `test${timestamp}@example.com`, // Unique email
        phone: "555-0123",
        address: "123 Test Street",
      },
    });
    console.log("✅ Patient created:", {
      id: newPatient.id,
      name: `${newPatient.firstName} ${newPatient.lastName}`,
      email: newPatient.email,
    });

    // Test 2: Get all patients
    console.log("\n📋 Getting all patients...");
    const allPatients = await prisma.patients.findMany();
    console.log(`✅ Found ${allPatients.length} patients in database`);
    allPatients.forEach((patient) => {
      console.log(
        `  - ${patient.firstName} ${patient.lastName} (${patient.email})`,
      );
    });

    // Test 3: Update the patient
    console.log("\n✏️ Updating patient...");
    const updatedPatient = await prisma.patients.update({
      where: { id: newPatient.id },
      data: { phone: "555-9999" },
    });
    console.log(`✅ Updated patient phone to: ${updatedPatient.phone}`);

    // Test 4: Get patient by ID
    console.log("\n🔍 Getting patient by ID...");
    const foundPatient = await prisma.patients.findUnique({
      where: { id: newPatient.id },
    });
    console.log(
      `✅ Found patient: ${foundPatient.firstName} ${foundPatient.lastName}`,
    );

    console.log("\n🎉 ALL DATABASE TESTS PASSED!");
    console.log("\n📊 Your database is working perfectly!");
    console.log(
      "🌐 You can view your data at: http://localhost:5555 (Prisma Studio)",
    );
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
