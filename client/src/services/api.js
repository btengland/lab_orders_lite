const API_BASE_URL = "http://localhost:3001/api";

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Patient API functions
export const patientApi = {
  // Patients
  getAll: () => apiRequest("/patients"),
  getById: (id) => apiRequest(`/patients/${id}`),
  create: (patientData) =>
    apiRequest("/patients", {
      method: "POST",
      body: JSON.stringify(patientData),
    }),
  update: (id, patientData) =>
    apiRequest(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(patientData),
    }),
  delete: (id) =>
    apiRequest(`/patients/${id}`, {
      method: "DELETE",
    }),
};

// Lab Test API functions
export const labTestApi = {
  getAll: () => apiRequest("/lab-tests"),
  getById: (id) => apiRequest(`/lab-tests/${id}`),
  create: (labTestData) =>
    apiRequest("/lab-tests", {
      method: "POST",
      body: JSON.stringify(labTestData),
    }),
  update: (id, labTestData) =>
    apiRequest(`/lab-tests/${id}`, {
      method: "PUT",
      body: JSON.stringify(labTestData),
    }),
  delete: (id) =>
    apiRequest(`/lab-tests/${id}`, {
      method: "DELETE",
    }),
};

// Order API functions
export const orderApi = {
  getAll: () => apiRequest("/orders"),
  getById: (id) => apiRequest(`/orders/${id}`),
  create: (orderData) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),
  update: (id, orderData) =>
    apiRequest(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    }),
  delete: (id) =>
    apiRequest(`/orders/${id}`, {
      method: "DELETE",
    }),
};
export default { patientApi, labTestApi };
