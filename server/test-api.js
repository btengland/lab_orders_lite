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

  // --- PATIENTS CRUD ---
  let createdPatient;
  try {
    // Get all patients
    const patientsData = await makeRequest("GET", "/api/patients");
    console.log("Get All Patients:", `Found ${patientsData.length} patients`);

    // Create patient
    const newPatient = {
      firstName: "Test",
      lastName: "User",
      dateOfBirth: "1990-05-15",
      email: `test${Date.now()}@example.com`,
      phone: "555-0123",
      address: "123 Test St",
    };
    createdPatient = await makeRequest("POST", "/api/patients", newPatient);
    console.log(
      "Create Patient:",
      `Created patient with ID: ${createdPatient.id}`,
    );

    // Get patient by ID
    const fetchedPatient = await makeRequest(
      "GET",
      `/api/patients/${createdPatient.id}`,
    );
    console.log(
      "Get Patient by ID:",
      `Fetched ${fetchedPatient.firstName} ${fetchedPatient.lastName}`,
    );

    // Update patient
    const updateData = {
      firstName: "Updated",
      lastName: "Name",
      dateOfBirth: "1990-05-15",
      email: createdPatient.email,
      phone: createdPatient.phone,
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

    // Delete patient
    const delRes = await makeRequest(
      "DELETE",
      `/api/patients/${createdPatient.id}`,
    );
    console.log("Delete Patient:", delRes.message);
  } catch (error) {
    console.log("Patients CRUD failed:", error.message);
  }

  // --- LAB TESTS CRUD ---
  let createdLabTest;
  try {
    // Get all lab tests
    const labTests = await makeRequest("GET", "/api/lab-tests");
    console.log("Get All Lab Tests:", `Found ${labTests.length} lab tests`);

    // Create lab test
    const newLabTest = {
      code: `TST${Date.now()}`,
      name: "Test Lab",
      price: 99.99,
      turnaroundTime: 24,
    };
    createdLabTest = await makeRequest("POST", "/api/lab-tests", newLabTest);
    console.log(
      "Create Lab Test:",
      `Created lab test with ID: ${createdLabTest.id}`,
    );

    // Get lab test by ID
    const fetchedLabTest = await makeRequest(
      "GET",
      `/api/lab-tests/${createdLabTest.id}`,
    );
    console.log("Get Lab Test by ID:", `Fetched ${fetchedLabTest.name}`);

    // Update lab test
    const updateLabTest = {
      code: createdLabTest.code,
      name: "Updated Lab Test",
      price: 120.5,
      turnaroundTime: 48,
    };
    const updatedLabTest = await makeRequest(
      "PUT",
      `/api/lab-tests/${createdLabTest.id}`,
      updateLabTest,
    );
    console.log("Update Lab Test:", `Updated to ${updatedLabTest.name}`);

    // Delete lab test
    const delLabRes = await makeRequest(
      "DELETE",
      `/api/lab-tests/${createdLabTest.id}`,
    );
    console.log("Delete Lab Test:", delLabRes.message);
  } catch (error) {
    console.log("Lab Tests CRUD failed:", error.message);
  }

  // --- ORDERS CRUD ---
  let createdOrder;
  try {
    // For order creation, need a patient and a lab test
    const patient = await makeRequest("POST", "/api/patients", {
      firstName: "Order",
      lastName: "Patient",
      dateOfBirth: "1980-01-01",
      email: `order${Date.now()}@example.com`,
      phone: "555-9999",
      address: "789 Order St",
    });
    const labTest = await makeRequest("POST", "/api/lab-tests", {
      code: `ORD${Date.now()}`,
      name: "Order Lab",
      price: 55.5,
      turnaroundTime: 12,
    });

    // Get all orders
    const orders = await makeRequest("GET", "/api/orders");
    console.log("Get All Orders:", `Found ${orders.length} orders`);

    // Create order
    const newOrder = {
      patientId: patient.id,
      testIds: [labTest.id],
      totalCost: 55.5,
      estimatedDate: new Date(Date.now() + 86400000).toISOString(),
      status: "pending",
    };
    createdOrder = await makeRequest("POST", "/api/orders", newOrder);
    console.log("Create Order:", `Created order with ID: ${createdOrder.id}`);

    // Get order by ID
    const fetchedOrder = await makeRequest(
      "GET",
      `/api/orders/${createdOrder.id}`,
    );
    console.log(
      "Get Order by ID:",
      `Fetched order for patientId ${fetchedOrder.patientId}`,
    );

    // Update order
    const updateOrder = {
      patientId: patient.id,
      testIds: [labTest.id],
      totalCost: 100.0,
      estimatedDate: new Date(Date.now() + 172800000).toISOString(),
      status: "completed",
    };
    const updatedOrder = await makeRequest(
      "PUT",
      `/api/orders/${createdOrder.id}`,
      updateOrder,
    );
    console.log(
      "Update Order:",
      `Updated order status to ${updatedOrder.status}`,
    );

    // Delete order
    const delOrderRes = await makeRequest(
      "DELETE",
      `/api/orders/${createdOrder.id}`,
    );
    console.log("Delete Order:", delOrderRes.message);

    // Cleanup: delete patient and lab test
    await makeRequest("DELETE", `/api/patients/${patient.id}`);
    await makeRequest("DELETE", `/api/lab-tests/${labTest.id}`);
  } catch (error) {
    console.log("Orders CRUD failed:", error.message);
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
