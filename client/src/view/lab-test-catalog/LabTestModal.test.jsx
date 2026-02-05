import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LabTestModal from './LabTestModal'

const mockLabTest = {
  id: 1,
  code: 'CBC',
  name: 'Complete Blood Count',
  price: 25.50,
  turnaroundTime: 24
}

const mockFormData = {
  code: 'CBC',
  name: 'Complete Blood Count',
  price: '25.50',
  turnaroundTime: '24'
}

describe('LabTestModal Component', () => {
  const mockToggle = jest.fn()
  const mockOnInputChange = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders create mode correctly', () => {
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByText('Add New Lab Test')).toBeInTheDocument()
    expect(screen.getByText('Create Lab Test')).toBeInTheDocument()
  })

  test('renders edit mode correctly', () => {
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="edit"
        labTest={mockLabTest}
        formData={mockFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByText('Edit Lab Test: Complete Blood Count')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  test('does not render when isOpen is false', () => {
    render(
      <LabTestModal
        isOpen={false}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.queryByText('Add New Lab Test')).not.toBeInTheDocument()
  })

  test('renders all form fields', () => {
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={mockFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByLabelText(/Test Code/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Test Name/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Price/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Turnaround Time/)).toBeInTheDocument()
  })

  test('displays form data in input fields', () => {
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="edit"
        labTest={mockLabTest}
        formData={mockFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    expect(screen.getByDisplayValue('CBC')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Complete Blood Count')).toBeInTheDocument()
    expect(screen.getByDisplayValue('25.50')).toBeInTheDocument()
    expect(screen.getByDisplayValue('24')).toBeInTheDocument()
  })

  test('calls onInputChange when form fields change', async () => {
    const user = userEvent.setup()
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    const codeInput = screen.getByLabelText(/Test Code/)
    await user.type(codeInput, 'CBC')
    
    expect(mockOnInputChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: 'code',
        value: 'CBC'
      })
    }))
  })

  test('shows validation error for missing required fields', async () => {
    const user = userEvent.setup()
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Create Lab Test'))
    
    expect(screen.getByText('Please fill out all required fields marked with *')).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  test('calls onSubmit with lab test ID in edit mode when form is valid', async () => {
    const user = userEvent.setup()
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="edit"
        labTest={mockLabTest}
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
      code: 'CBC',
      name: 'Complete Blood Count',
      price: '25.50',
      turnaroundTime: '24'
    }
    
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={validFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Create Lab Test'))
    
    expect(mockOnSubmit).toHaveBeenCalledWith(null)
  })

  test('calls toggle when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={{}}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Cancel'))
    
    expect(mockToggle).toHaveBeenCalled()
  })

  test('validates numeric fields', async () => {
    const user = userEvent.setup()
    const invalidFormData = {
      code: 'CBC',
      name: 'Complete Blood Count',
      price: 'invalid',
      turnaroundTime: 'invalid'
    }
    
    render(
      <LabTestModal
        isOpen={true}
        toggle={mockToggle}
        mode="create"
        labTest={null}
        formData={invalidFormData}
        onInputChange={mockOnInputChange}
        onSubmit={mockOnSubmit}
      />
    )
    
    await user.click(screen.getByText('Create Lab Test'))
    
    expect(screen.getByText('Price must be a positive number')).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
})