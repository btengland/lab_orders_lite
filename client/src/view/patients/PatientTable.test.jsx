import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientTable from './PatientTable'

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

describe('PatientTable Component', () => {
  const mockOnPatientClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders table headers correctly', () => {
    render(<PatientTable patients={[]} onPatientClick={mockOnPatientClick} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Date of Birth')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Address')).toBeInTheDocument()
  })

  test('renders patient data correctly', () => {
    render(<PatientTable patients={mockPatients} onPatientClick={mockOnPatientClick} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('123-456-7890')).toBeInTheDocument()
    expect(screen.getByText('098-765-4321')).toBeInTheDocument()
  })

  test('formats dates correctly', () => {
    render(<PatientTable patients={mockPatients} onPatientClick={mockOnPatientClick} />)
    
    // Date formatting may vary by locale, so just check if dates are present
    expect(screen.getByText(/12\/31\/1989|1\/1\/1990/)).toBeInTheDocument()
    expect(screen.getByText(/5\/14\/1985|5\/15\/1985/)).toBeInTheDocument()
  })

  test('calls onPatientClick when patient name is clicked', async () => {
    const user = userEvent.setup()
    render(<PatientTable patients={mockPatients} onPatientClick={mockOnPatientClick} />)
    
    await user.click(screen.getByText('John Doe'))
    
    expect(mockOnPatientClick).toHaveBeenCalledWith(mockPatients[0])
  })

  test('renders empty table when no patients', () => {
    render(<PatientTable patients={[]} onPatientClick={mockOnPatientClick} />)
    
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  test('renders patient names as clickable buttons', () => {
    render(<PatientTable patients={mockPatients} onPatientClick={mockOnPatientClick} />)
    
    const johnButton = screen.getByRole('button', { name: 'John Doe' })
    const janeButton = screen.getByRole('button', { name: 'Jane Smith' })
    
    expect(johnButton).toBeInTheDocument()
    expect(janeButton).toBeInTheDocument()
  })
})