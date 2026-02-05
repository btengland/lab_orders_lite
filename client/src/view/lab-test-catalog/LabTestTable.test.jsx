import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LabTestTable from './LabTestTable'

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
  },
  { 
    id: 3, 
    code: 'GLUCOSE', 
    name: 'Glucose Test', 
    price: 15.75,
    turnaroundTime: 12
  }
]

describe('LabTestTable Component', () => {
  const mockOnLabTestClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders table headers correctly', () => {
    render(<LabTestTable labTests={[]} onLabTestClick={mockOnLabTestClick} />)
    
    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Turnaround Time')).toBeInTheDocument()
  })

  test('renders lab test data correctly', () => {
    render(<LabTestTable labTests={mockLabTests} onLabTestClick={mockOnLabTestClick} />)
    
    expect(screen.getByText('CBC')).toBeInTheDocument()
    expect(screen.getByText('Complete Blood Count')).toBeInTheDocument()
    expect(screen.getByText('LIPID')).toBeInTheDocument()
    expect(screen.getByText('Lipid Panel')).toBeInTheDocument()
    expect(screen.getByText('GLUCOSE')).toBeInTheDocument()
    expect(screen.getByText('Glucose Test')).toBeInTheDocument()
  })

  test('formats prices correctly as currency', () => {
    render(<LabTestTable labTests={mockLabTests} onLabTestClick={mockOnLabTestClick} />)
    
    expect(screen.getByText('$25.50')).toBeInTheDocument()
    expect(screen.getByText('$35.00')).toBeInTheDocument()
    expect(screen.getByText('$15.75')).toBeInTheDocument()
  })

  test('formats turnaround time correctly', () => {
    render(<LabTestTable labTests={mockLabTests} onLabTestClick={mockOnLabTestClick} />)
    
    expect(screen.getByText('1 day')).toBeInTheDocument() // 24 hours
    expect(screen.getByText('2 days')).toBeInTheDocument() // 48 hours
    expect(screen.getByText('12 hours')).toBeInTheDocument() // 12 hours
  })

  test('calls onLabTestClick when lab test code is clicked', async () => {
    const user = userEvent.setup()
    render(<LabTestTable labTests={mockLabTests} onLabTestClick={mockOnLabTestClick} />)
    
    await user.click(screen.getByText('CBC'))
    
    expect(mockOnLabTestClick).toHaveBeenCalledWith(mockLabTests[0])
  })

  test('renders empty table when no lab tests', () => {
    render(<LabTestTable labTests={[]} onLabTestClick={mockOnLabTestClick} />)
    
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.queryByText('CBC')).not.toBeInTheDocument()
  })

  test('renders lab test codes as clickable buttons', () => {
    render(<LabTestTable labTests={mockLabTests} onLabTestClick={mockOnLabTestClick} />)
    
    const cbcButton = screen.getByRole('button', { name: 'CBC' })
    const lipidButton = screen.getByRole('button', { name: 'LIPID' })
    const glucoseButton = screen.getByRole('button', { name: 'GLUCOSE' })
    
    expect(cbcButton).toBeInTheDocument()
    expect(lipidButton).toBeInTheDocument()
    expect(glucoseButton).toBeInTheDocument()
  })

  test('formats complex turnaround times correctly', () => {
    const complexLabTests = [
      { id: 1, code: 'TEST1', name: 'Test 1', price: 25.00, turnaroundTime: 25 }, // 1 day 1 hour
      { id: 2, code: 'TEST2', name: 'Test 2', price: 25.00, turnaroundTime: 50 }, // 2 days 2 hours
      { id: 3, code: 'TEST3', name: 'Test 3', price: 25.00, turnaroundTime: 72 }, // 3 days
    ]
    
    render(<LabTestTable labTests={complexLabTests} onLabTestClick={mockOnLabTestClick} />)
    
    expect(screen.getByText('1 day 1 hour')).toBeInTheDocument()
    expect(screen.getByText('2 days 2 hours')).toBeInTheDocument()
    expect(screen.getByText('3 days')).toBeInTheDocument()
  })
})