import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Orders from './Orders'
import { orderApi, patientApi } from '../../services/api'

// Mock child components
jest.mock('./OrderTable', () => {
  return function MockOrderTable({ orders, onOrderClick }) {
    return (
      <div data-testid="order-table">
        {orders.map(order => (
          <div key={order.id} onClick={() => onOrderClick(order)}>
            Order #{order.id} - {order.status}
          </div>
        ))}
      </div>
    )
  }
})

jest.mock('./OrderModal', () => {
  return function MockOrderModal({ isOpen, mode, onSubmit }) {
    if (!isOpen) return null
    return (
      <div data-testid="order-modal">
        <span>{mode} Order Modal</span>
        <button onClick={() => onSubmit()}>Submit</button>
      </div>
    )
  }
})

const mockOrders = [
  { 
    id: 1, 
    patientId: 1,
    testIds: [1, 2],
    totalCost: 60.50,
    estimatedDate: '2026-02-05T00:00:00.000Z',
    status: 'pending'
  },
  { 
    id: 2, 
    patientId: 2,
    testIds: [1],
    totalCost: 25.50,
    estimatedDate: '2026-02-06T00:00:00.000Z',
    status: 'completed'
  }
]

describe('Orders Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders orders heading and add button', () => {
    orderApi.getAll.mockResolvedValue([])
    patientApi.getAll.mockResolvedValue([])
    render(<Orders />)
    
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Create New Order')).toBeInTheDocument()
  })

  test('renders filter inputs', () => {
    orderApi.getAll.mockResolvedValue([])
    patientApi.getAll.mockResolvedValue([])
    render(<Orders />)
    
    expect(screen.getByLabelText('Filter by Patient Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Filter by Status')).toBeInTheDocument()
  })

  test('fetches and displays orders on load', async () => {
    orderApi.getAll.mockResolvedValue(mockOrders)
    patientApi.getAll.mockResolvedValue([])
    render(<Orders />)
    await waitFor(() => {
      expect(screen.getByText('Order #1 - pending')).toBeInTheDocument()
      expect(screen.getByText('Order #2 - completed')).toBeInTheDocument()
    })
  })

  test('shows loading state', () => {
    orderApi.getAll.mockImplementation(() => new Promise(() => {}))
    patientApi.getAll.mockResolvedValue([])
    render(<Orders />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('shows error message when fetch fails', async () => {
    orderApi.getAll.mockRejectedValue(new Error('API Error'))
    patientApi.getAll.mockResolvedValue([])
    render(<Orders />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch orders. Please try again later.')).toBeInTheDocument()
    })
  })

  test('opens create modal when Add New Order is clicked', async () => {
    orderApi.getAll.mockResolvedValue([])
    patientApi.getAll.mockResolvedValue([])
    const user = userEvent.setup()
    render(<Orders />)
    
    await user.click(screen.getByText('Create New Order'))
    
    expect(screen.getByTestId('order-modal')).toBeInTheDocument()
    expect(screen.getByText('create Order Modal')).toBeInTheDocument()
  })

  test('opens edit modal when order is clicked', async () => {
    orderApi.getAll.mockResolvedValue(mockOrders)
    patientApi.getAll.mockResolvedValue([])
    const user = userEvent.setup()
    render(<Orders />)
    
    await waitFor(() => {
      expect(screen.getByText('Order #1 - pending')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('Order #1 - pending'))
    
    expect(screen.getByTestId('order-modal')).toBeInTheDocument()
    expect(screen.getByText('edit Order Modal')).toBeInTheDocument()
  })

  test('filters orders by patient name', async () => {
    orderApi.getAll.mockResolvedValue(mockOrders)
    patientApi.getAll.mockResolvedValue([])
    const user = userEvent.setup()
    render(<Orders />)
    
    const patientNameInput = screen.getByLabelText('Filter by Patient Name')
    await user.type(patientNameInput, 'John')
    await waitFor(() => {
      expect(orderApi.getAll).toHaveBeenLastCalledWith({ patientName: 'John', status: '' })
    })
  })

  test('filters orders by status', async () => {
    orderApi.getAll.mockResolvedValue(mockOrders)
    patientApi.getAll.mockResolvedValue([])
    const user = userEvent.setup()
    render(<Orders />)
    
    const statusSelect = screen.getByLabelText('Filter by Status')
    await user.selectOptions(statusSelect, 'completed')
    await waitFor(() => {
      expect(orderApi.getAll).toHaveBeenLastCalledWith({ patientName: '', status: 'completed' })
    })
  })

  test('creates new order successfully', async () => {
    orderApi.getAll.mockResolvedValue([])
    patientApi.getAll.mockResolvedValue([])
    
    const user = userEvent.setup()
    render(<Orders />)
    
    await user.click(screen.getByText('Create New Order'))
    
    expect(screen.getByTestId('order-modal')).toBeInTheDocument()
    expect(screen.getByText('create Order Modal')).toBeInTheDocument()
  })

  test('clears filters when clear button is clicked', async () => {
    orderApi.getAll.mockResolvedValue(mockOrders)
    patientApi.getAll.mockResolvedValue([])
    const user = userEvent.setup()
    render(<Orders />)
    
    // Add some filter values
    const patientNameInput = screen.getByLabelText('Filter by Patient Name')
    await user.type(patientNameInput, 'John')
    
    const statusSelect = screen.getByLabelText('Filter by Status')
    await user.selectOptions(statusSelect, 'completed')
    
    // Clear filters
    await user.click(screen.getByText('Clear'))
    
    expect(patientNameInput.value).toBe('')
    expect(statusSelect.value).toBe('')
  })
})