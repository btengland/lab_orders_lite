// Test utilities for reducing duplication across test files
import { render } from "@testing-library/react";

// Mock data factories
export const createMockPatient = (overrides = {}) => ({
  id: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  dateOfBirth: "1990-01-01",
  phone: "123-456-7890",
  address: "123 Main St",
  ...overrides,
});

export const createMockLabTest = (overrides = {}) => ({
  id: 1,
  code: "CBC",
  name: "Complete Blood Count",
  price: 25.0,
  turnaroundTime: 24,
  ...overrides,
});

export const createMockOrder = (overrides = {}) => ({
  id: 1,
  patientId: 1,
  testIds: [1],
  totalCost: 25.0,
  estimatedDate: "2026-02-05",
  status: "pending",
  ...overrides,
});

// Custom render function with common providers if needed
export const renderWithProviders = (ui, options = {}) => {
  // Could add context providers here if you had them
  return render(ui, options);
};

// Common mock setup
export const setupApiMocks = (patientApi, labTestApi, orderApi) => {
  patientApi.getAll.mockResolvedValue([createMockPatient()]);
  labTestApi.getAll.mockResolvedValue([createMockLabTest()]);
  orderApi.getAll.mockResolvedValue([createMockOrder()]);
};

// Accessibility test helper
export const expectAccessibleForm = (container) => {
  const inputs = container.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    // Check that inputs have labels
    const labelText =
      input.getAttribute("aria-label") ||
      document.querySelector(`label[for="${input.id}"]`)?.textContent;
    expect(labelText).toBeTruthy();
  });
};
