import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Patients from './Patients'
import { patientApi } from '../../services/api'

// Mock child components
jest.mock('./PatientTable', () => {
  return function MockPatientTable({ patients, onPatientClick }) {
    return (
      <div data-testid="patient-table">
        {patients.map(patient => (
          <div key={patient.id} onClick={() => onPatientClick(patient)}>
            {patient.firstName} {patient.lastName}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('./PatientModal', () => {
  return function MockPatientModal({ isOpen, mode, onSubmit }) {
    if (!isOpen) return null
    return (
      <div data-testid="patient-modal">
        <span>{mode} Patient Modal</span>
        <button onClick={() => onSubmit()}>Submit</button>
      </div>
    )
  }
})

const mockPatients = [
  { 
    id: 1, 
    firstName: 'John', 
    lastName: 'Doe', 
    dateOfBirth: '1990-01-01',
    email: 'john@example.com',
    phone: '123-456-7890',
    address: '123 Main St'
  },
  { 
    id: 2, 
    firstName: 'Jane', 
    lastName: 'Smith', 
    dateOfBirth: '1985-05-15',
    email: 'jane@example.com',
    phone: '098-765-4321',
    address: '456 Oak Ave'
  }
]

describe('Patients Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders patients heading and add button', () => {
    patientApi.getAll.mockResolvedValue([])
    render(<Patients />)
    
    expect(screen.getByText('Patients')).toBeInTheDocument()
    expect(screen.getByText('Add New Patient')).toBeInTheDocument()
  })

  test('fetches and displays patients on load', async () => {
    patientApi.getAll.mockResolvedValue(mockPatients)
    render(<Patients />)
    
    await waitFor(() => {
      expect(patientApi.getAll).toHaveBeenCalled()
    })
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  test('shows loading state', () => {
    patientApi.getAll.mockImplementation(() => new Promise(() => {})) // Never resolves
    render(<Patients />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('shows error message when fetch fails', async () => {
    patientApi.getAll.mockRejectedValue(new Error('API Error'))
    render(<Patients />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch patients. Please try again later.')).toBeInTheDocument()
    })
  })

  test('opens create modal when Add New Patient is clicked', async () => {
    patientApi.getAll.mockResolvedValue([])
    const user = userEvent.setup()
    render(<Patients />)
    
    await user.click(screen.getByText('Add New Patient'))
    
    expect(screen.getByTestId('patient-modal')).toBeInTheDocument()
    expect(screen.getByText('create Patient Modal')).toBeInTheDocument()
  })

  test('opens edit modal when patient is clicked', async () => {
    patientApi.getAll.mockResolvedValue(mockPatients)
    const user = userEvent.setup()
    render(<Patients />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('John Doe'))
    
    expect(screen.getByTestId('patient-modal')).toBeInTheDocument()
    expect(screen.getByText('edit Patient Modal')).toBeInTheDocument()
  })

  test('creates new patient successfully', async () => {
    const newPatient = { id: 3, firstName: 'New', lastName: 'Patient', email: 'new@example.com' }
    patientApi.getAll.mockResolvedValue([])
    patientApi.create.mockResolvedValue(newPatient)
    
    const user = userEvent.setup()
    render(<Patients />)
    
    await user.click(screen.getByText('Add New Patient'))
    await user.click(screen.getByText('Submit'))
    
    await waitFor(() => {
      expect(patientApi.create).toHaveBeenCalled()
    })
  })
})