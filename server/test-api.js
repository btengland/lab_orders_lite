// Quick API test script
const https = require("http");

async function testAPI() {
  console.log("Testing API endpoints...\n");

  // Test 1: Health check
  try {
    const healthData = await makeRequest("GET", "/api/health");
    console.log("Health Check:", healthData);
  } catch (error) {
    console.log("Health Check failed:", error.message);
    console.log("   Full error:", error);
  }

  // Test 2: Get all patients (might be empty)
  try {
    const patientsData = await makeRequest("GET", "/api/patients");
    console.log("Get All Patients:", `Found ${patientsData.length} patients`);
  } catch (error) {
    console.log("Get All Patients failed:", error.message);
  }

  // Test 3: Create a patient
  try {
    const newPatient = {
      firstName: "Test",
      lastName: "User",
      dateOfBirth: "1990-05-15",
      email: `test${Date.now()}@example.com`,
      phone: "555-0123",
      address: "123 Test St",
    };

    const createdPatient = await makeRequest(
      "POST",
      "/api/patients",
      newPatient,
    );
    console.log(
      "Create Patient:",
      `Created patient with ID: ${createdPatient.id}`,
    );

    // Test 4: Get patient by ID
    try {
      const fetchedPatient = await makeRequest(
        "GET",
        `/api/patients/${createdPatient.id}`,
      );
      console.log(
        "Get Patient by ID:",
        `Fetched ${fetchedPatient.firstName} ${fetchedPatient.lastName}`,
      );
    } catch (error) {
      console.log("Get Patient by ID failed:", error.message);
    }

    // Test 5: Update patient
    try {
      const updateData = {
        firstName: "Updated",
        lastName: "Name",
        dateOfBirth: "1990-05-15",
        email: createdPatient.email, // Keep same email
        address: "456 Updated St",
      };

      const updatedPatient = await makeRequest(
        "PUT",
        `/api/patients/${createdPatient.id}`,
        updateData,
      );
      console.log(
        "Update Patient:",
        `Updated to ${updatedPatient.firstName} ${updatedPatient.lastName}`,
      );
    } catch (error) {
      console.log("Update Patient failed:", error.message);
    }
  } catch (error) {
    console.log("Create Patient failed:", error.message);
  }

  console.log("\nAPI testing complete!");
}

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3001,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsedBody = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedBody);
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: ${parsedBody.error || body}`),
            );
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${body}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

testAPI();

async function testLabTests() {
  console.log("\n--- Lab Tests ---");
  // Create
  const newLabTest = {
    code: `LT${Date.now()}`,
    name: "Test Lab",
    price: 123.45,
    turnaroundTime: 24,
  };
  const created = await testEndpoint("POST", "/api/lab-tests", newLabTest);
  if (!created || !created.id) return;
  // Get all
  await testEndpoint("GET", "/api/lab-tests");
  // Get by ID
  await testEndpoint("GET", `/api/lab-tests/${created.id}`);
  // Update
  await testEndpoint("PUT", `/api/lab-tests/${created.id}`, {
    ...newLabTest,
    name: "Updated Lab",
  });
  // Delete
  await testEndpoint("DELETE", `/api/lab-tests/${created.id}`);
}

async function testOrders() {
  console.log("\n--- Orders ---");
  // Create dependencies
  const patient = await testEndpoint("POST", "/api/patients", {
    firstName: "Order",
    lastName: "Patient",
    dateOfBirth: "1980-01-01",
    email: `order${Date.now()}@example.com`,
    phone: "555-9999",
    address: "456 Order St",
  });
  const labTest = await testEndpoint("POST", "/api/lab-tests", {
    code: `ORD${Date.now()}`,
    name: "Order Lab",
    price: 99.99,
    turnaroundTime: 12,
  });
  if (!patient || !patient.id || !labTest || !labTest.id) return;
  // Create order
  const newOrder = {
    patientId: patient.id,
    testIds: JSON.stringify([labTest.id]),
    totalCost: labTest.price,
    estimatedDate: new Date(Date.now() + 12 * 3600 * 1000)
      .toISOString()
      .split("T")[0],
    status: "pending",
  };
  const created = await testEndpoint("POST", "/api/orders", newOrder);
  if (!created || !created.id) return;
  // Get all
  await testEndpoint("GET", "/api/orders");
  // Get by ID
  await testEndpoint("GET", `/api/orders/${created.id}`);
  // Update
  await testEndpoint("PUT", `/api/orders/${created.id}`, {
    ...newOrder,
    status: "completed",
  });
  // Delete
  await testEndpoint("DELETE", `/api/orders/${created.id}`);
  // Cleanup
  await testEndpoint("DELETE", `/api/patients/${patient.id}`);
  await testEndpoint("DELETE", `/api/lab-tests/${labTest.id}`);
}

// Add these calls to the main testAPI function:
// await testLabTests();
// await testOrders();
