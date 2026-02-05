import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

// Mock all view components
jest.mock('./view/patients/Patients', () => {
  return function MockPatients() {
    return <div data-testid="patients-view">Patients View</div>
  }
})

jest.mock('./view/lab-test-catalog/LabTestCatalog', () => {
  return function MockLabTestCatalog() {
    return <div data-testid="lab-test-catalog-view">Lab Test Catalog View</div>
  }
})

jest.mock('./view/orders/Orders', () => {
  return function MockOrders() {
    return <div data-testid="orders-view">Orders View</div>
  }
})

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui)
}

describe('App Component', () => {
  test('renders navigation', () => {
    renderWithRouter(<App />)
    expect(screen.getByText('Lab Orders Lite')).toBeInTheDocument()
  })

  test('redirects root path to /patients', () => {
    renderWithRouter(<App />, { route: '/' })
    expect(screen.getByTestId('patients-view')).toBeInTheDocument()
  })

  test('renders patients view on /patients route', () => {
    renderWithRouter(<App />, { route: '/patients' })
    expect(screen.getByTestId('patients-view')).toBeInTheDocument()
  })

  test('renders lab test catalog view on /catalog route', () => {
    renderWithRouter(<App />, { route: '/catalog' })
    expect(screen.getByTestId('lab-test-catalog-view')).toBeInTheDocument()
  })

  test('renders orders view on /orders route', () => {
    renderWithRouter(<App />, { route: '/orders' })
    expect(screen.getByTestId('orders-view')).toBeInTheDocument()
  })
})