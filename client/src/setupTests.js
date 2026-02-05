import "@testing-library/jest-dom";

// Mock API module
jest.mock("./services/api", () => ({
  patientApi: {
    getAll: jest.fn(() => Promise.resolve([])),
    getById: jest.fn(() => Promise.resolve({})),
    create: jest.fn(() => Promise.resolve({})),
    update: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({})),
  },
  labTestApi: {
    getAll: jest.fn(() => Promise.resolve([])),
    getById: jest.fn(() => Promise.resolve({})),
    create: jest.fn(() => Promise.resolve({})),
    update: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({})),
  },
  orderApi: {
    getAll: jest.fn(() => Promise.resolve([])),
    getById: jest.fn(() => Promise.resolve({})),
    create: jest.fn(() => Promise.resolve({})),
    update: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({})),
  },
}));
