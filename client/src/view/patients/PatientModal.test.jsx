import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientModal from './PatientModal'

const mockPatient = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  email: 'john@example.com',
  phone: '123-456-7890',
  address: '123 Main St'
}

const mockFormData = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  email: 'john@example.com',
  phone: '123-456-7890',
  address: '123 Main St'
}

describe('PatientModal Component', () => {
  const mockToggle = jest.fn()
  const mockOnInputChange = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders create mode correctly', () => {
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        patient={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByText('Add New Patient')).toBeInTheDocument()
    expect(screen.getByText('Create Patient')).toBeInTheDocument()
  })

  test('renders edit mode correctly', () => {
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="edit"
        patient={mockPatient}
        formData={mockFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByText('Edit Patient: John Doe')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  test('does not render when isOpen is false', () => {
    render(
      <PatientModal
        isOpen={false}
        toggle={mockToggle}
        mode="create"
        patient={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.queryByText('Add New Patient')).not.toBeInTheDocument()
  })

  test('renders all form fields', () => {
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        patient={null}
        formData={mockFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByLabelText(/First Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Date of Birth/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Address/)).toBeInTheDocument()
  })

  test('displays form data in input fields', () => {
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="edit"
        patient={mockPatient}
        formData={mockFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByDisplayValue('John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument()
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument()
  })

  test('calls onInputChange when form fields change', async () => {
    const user = userEvent.setup()
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        patient={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    const firstNameInput = screen.getByLabelText(/First Name/)
    await user.type(firstNameInput, 'John')
    
    expect(mockOnInputChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: 'firstName',
        value: 'John'
      })
    }))
  })

  test('shows validation error for missing required fields', async () => {
    const user = userEvent.setup()
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        patient={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Create Patient'))
    
    expect(screen.getByText('Please fill out all required fields marked with *')).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('calls onSubmit with patient ID in edit mode when form is valid', async () => {
    const user = userEvent.setup()
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="edit"
        patient={mockPatient}
        formData={mockFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Save Changes'))
    
    expect(mockOnSubmit).toHaveBeenCalledWith(1)
  })

  test('calls onSubmit with null ID in create mode when form is valid', async () => {
    const user = userEvent.setup()
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      email: 'john@example.com'
    }
    
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        patient={null}
        formData={validFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Create Patient'))
    
    expect(mockOnSubmit).toHaveBeenCalledWith(null)
  })

  test('calls toggle when close button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <PatientModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        patient={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Cancel'))
    
    expect(mockToggle).toHaveBeenCalled()
  })
})