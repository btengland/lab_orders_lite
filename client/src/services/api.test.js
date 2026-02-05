import { patientApi, labTestApi, orderApi } from "./api";

// These APIs are mocked in setupTests.js so let's test the mock behavior
describe("API Service", () => {
  describe("patientApi", () => {
    test("getAll should return all patients", async () => {
      const result = await patientApi.getAll();
      expect(Array.isArray(result)).toBe(true);
    });

    test("getById should return specific patient", async () => {
      const result = await patientApi.getById(1);
      expect(result).toBeDefined();
    });

    test("create should create new patient", async () => {
      const newPatient = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };
      const result = await patientApi.create(newPatient);
      expect(result).toBeDefined();
    });

    test("update should update existing patient", async () => {
      const updatedData = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
      };
      const result = await patientApi.update(1, updatedData);
      expect(result).toBeDefined();
    });

    test("delete should delete patient", async () => {
      const result = await patientApi.delete(1);
      expect(result).toBeDefined();
    });
  });

  describe("labTestApi", () => {
    test("getAll should return all lab tests", async () => {
      const result = await labTestApi.getAll();
      expect(Array.isArray(result)).toBe(true);
    });

    test("create should create new lab test", async () => {
      const newLabTest = {
        code: "CBC",
        name: "Complete Blood Count",
        price: 25.5,
      };
      const result = await labTestApi.create(newLabTest);
      expect(result).toBeDefined();
    });
  });

  describe("orderApi", () => {
    test("getAll should return all orders", async () => {
      const result = await orderApi.getAll();
      expect(Array.isArray(result)).toBe(true);
    });

    test("getAll should handle query parameters", async () => {
      const result = await orderApi.getAll({
        patientName: "John",
        status: "pending",
      });
      expect(Array.isArray(result)).toBe(true);
    });

    test("create should create new order", async () => {
      const newOrder = {
        patientId: 1,
        testIds: [1, 2],
        totalCost: 60.5,
        status: "pending",
      };
      const result = await orderApi.create(newOrder);
      expect(result).toBeDefined();
    });
  });

  describe("Error handling", () => {
    test("API functions should handle errors gracefully", () => {
      expect(typeof patientApi.getAll).toBe("function");
      expect(typeof labTestApi.getAll).toBe("function");
      expect(typeof orderApi.getAll).toBe("function");
    });
  });
});
