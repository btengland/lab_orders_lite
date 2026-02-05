import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LabTestCatalog from './LabTestCatalog'
import { labTestApi } from '../../services/api'

// Mock child components
jest.mock('./LabTestTable', () => {
  return function MockLabTestTable({ labTests, onLabTestClick }) {
    return (
      <div data-testid="lab-test-table">
        {labTests.map(labTest => (
          <div key={labTest.id} onClick={() => onLabTestClick(labTest)}>
            {labTest.name} - {labTest.code}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('./LabTestModal', () => {
  return function MockLabTestModal({ isOpen, mode, onSubmit }) {
    if (!isOpen) return null
    return (
      <div data-testid="lab-test-modal">
        <span>{mode} Lab Test Modal</span>
        <button onClick={() => onSubmit()}>Submit</button>
      </div>
    )
  }
})

const mockLabTests = [
  { 
    id: 1, 
    code: 'CBC', 
    name: 'Complete Blood Count', 
    price: 25.50,
    turnaroundTime: 24
  },
  { 
    id: 2, 
    code: 'LIPID', 
    name: 'Lipid Panel', 
    price: 35.00,
    turnaroundTime: 48
  }
]

describe('LabTestCatalog Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders lab test catalog heading and add button', () => {
    labTestApi.getAll.mockResolvedValue([])
    render(<LabTestCatalog />)
    
    expect(screen.getByText('Lab Test Catalog')).toBeInTheDocument()
    expect(screen.getByText('Add New Lab Test')).toBeInTheDocument()
  })

  test('fetches and displays lab tests on load', async () => {
    labTestApi.getAll.mockResolvedValue(mockLabTests)
    render(<LabTestCatalog />)
    
    await waitFor(() => {
      expect(labTestApi.getAll).toHaveBeenCalled()
    })
    
    expect(screen.getByText('Complete Blood Count - CBC')).toBeInTheDocument()
    expect(screen.getByText('Lipid Panel - LIPID')).toBeInTheDocument()
  })

  test('shows loading state', () => {
    labTestApi.getAll.mockImplementation(() => new Promise(() => {}))
    render(<LabTestCatalog />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('shows error message when fetch fails', async () => {
    labTestApi.getAll.mockRejectedValue(new Error('API Error'))
    render(<LabTestCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch lab tests. Please try again later.')).toBeInTheDocument()
    })
  })

  test('opens create modal when Add New Lab Test is clicked', async () => {
    labTestApi.getAll.mockResolvedValue([])
    const user = userEvent.setup()
    render(<LabTestCatalog />)
    
    await user.click(screen.getByText('Add New Lab Test'))
    
    expect(screen.getByTestId('lab-test-modal')).toBeInTheDocument()
    expect(screen.getByText('create Lab Test Modal')).toBeInTheDocument()
  })

  test('opens edit modal when lab test is clicked', async () => {
    labTestApi.getAll.mockResolvedValue(mockLabTests)
    const user = userEvent.setup()
    render(<LabTestCatalog />)
    
    await waitFor(() => {
      expect(screen.getByText('Complete Blood Count - CBC')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('Complete Blood Count - CBC'))
    
    expect(screen.getByTestId('lab-test-modal')).toBeInTheDocument()
    expect(screen.getByText('edit Lab Test Modal')).toBeInTheDocument()
  })

  test('creates new lab test successfully', async () => {
    const newLabTest = { id: 3, code: 'BMP', name: 'Basic Metabolic Panel', price: 30.00, turnaroundTime: 24 }
    labTestApi.getAll.mockResolvedValue([])
    labTestApi.create.mockResolvedValue(newLabTest)
    
    const user = userEvent.setup()
    render(<LabTestCatalog />)
    
    await user.click(screen.getByText('Add New Lab Test'))
    await user.click(screen.getByText('Submit'))
    
    await waitFor(() => {
      expect(labTestApi.create).toHaveBeenCalled()
    })
  })
})