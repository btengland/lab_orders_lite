
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
jest.mock('./services/api', () => ({
  orderApi: { getAll: jest.fn() },
  patientApi: { getAll: jest.fn() },
  labTestApi: { getAll: jest.fn() },
}));
import { orderApi, patientApi, labTestApi } from './services/api';


describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    orderApi.getAll.mockResolvedValue([]);
    patientApi.getAll.mockResolvedValue([]);
    labTestApi.getAll.mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders navigation and routes after loading', async () => {
    orderApi.getAll.mockResolvedValue([]);
    patientApi.getAll.mockResolvedValue([]);
    labTestApi.getAll.mockResolvedValue([]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Patients/i)).toBeInTheDocument();
    });
  });

  it('shows error if data fetch fails', async () => {
    orderApi.getAll.mockRejectedValue(new Error('fail'));
    patientApi.getAll.mockRejectedValue(new Error('fail'));
    labTestApi.getAll.mockRejectedValue(new Error('fail'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch initial data/i)).toBeInTheDocument();
    });
  });
});
