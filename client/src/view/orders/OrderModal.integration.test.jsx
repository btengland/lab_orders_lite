import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OrderModal from './OrderModal'
import { patientApi, labTestApi } from '../../services/api'

// Integration test - testing the full flow without mocking internal behavior
jest.mock('../../services/api')

describe('OrderModal Integration Tests', () => {
  beforeEach(() => {
    patientApi.getAll.mockResolvedValue([
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
    ])
    labTestApi.getAll.mockResolvedValue([
      { id: 1, code: 'CBC', name: 'Complete Blood Count', price: 25.00, turnaroundTime: 24 }
    ])
  })

  test('complete order creation flow', async () => {
    const user = userEvent.setup()
    const mockToggle = jest.fn()
    const mockOnSubmit = jest.fn()
    
    // Use useState for formData to trigger re-render
    const ReactTestWrapper = () => {
      const [formData, setFormData] = React.useState({ patientId: '', testIds: [], totalCost: 0, estimatedDate: '' })
      const onInputChange = (event) => {
        setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))
      }
      const onTestIdsChange = (testIds) => {
        setFormData(prev => ({
          ...prev,
          testIds: Array.isArray(testIds) ? testIds : [],
          totalCost: (Array.isArray(testIds) ? testIds.length : 0) * 25.00
        }))
      }
      return (
        <OrderModal
          isOpen={true}
          toggle={mockToggle}
          mode="create"
          order={null}
          formData={formData}
          onInputChange={onInputChange}
          onTestIdsChange={onTestIdsChange}
          onSubmit={mockOnSubmit}
        />
      )
    }

    render(<ReactTestWrapper />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe - john@example.com')).toBeInTheDocument()
    })

    // Select patient
    const patientSelect = screen.getByLabelText('Patient')
    await user.selectOptions(patientSelect, '1')

    // Select test
    const testCheckbox = screen.getByLabelText(/CBC/) // Use code label for checkbox
    await user.click(testCheckbox)

    // Verify total cost calculation would happen
    expect(testCheckbox).toBeChecked()

    // Submit form
    const submitButton = screen.getByText('Create Order')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalled()
  })

  test('handles API errors gracefully', async () => {
    patientApi.getAll.mockRejectedValue(new Error('Network error'))
    
    // Always pass formData with testIds as array
    render(
      <OrderModal
        isOpen={true}
        toggle={jest.fn()}
        mode="create"
        order={null}
        formData={{ patientId: '', testIds: [], totalCost: 0, estimatedDate: '' }}
        onInputChange={jest.fn()}
        onTestIdsChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    )

    await waitFor(() => {
      // Should handle error state - you'd need to implement this in the component
      expect(screen.queryByText(/Failed to load data/)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})