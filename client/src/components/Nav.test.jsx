import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import Nav from './Nav'

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(<Router>{ui}</Router>)
}

describe('Nav Component', () => {
  test('renders brand name', () => {
    renderWithRouter(<Nav />)
    expect(screen.getByText('Lab Orders Lite')).toBeInTheDocument()
  })

  test('renders all navigation links', () => {
    renderWithRouter(<Nav />)
    
    expect(screen.getByRole('link', { name: 'Lab Orders Lite' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Patients' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lab Test Catalog' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument()
  })

  test('highlights active navigation link for patients', () => {
    renderWithRouter(<Nav />, { route: '/patients' })
    const patientsLink = screen.getByRole('link', { name: 'Patients' })
    expect(patientsLink).toHaveClass('active')
  })

  test('highlights active navigation link for catalog', () => {
    renderWithRouter(<Nav />, { route: '/catalog' })
    const catalogLink = screen.getByRole('link', { name: 'Lab Test Catalog' })
    expect(catalogLink).toHaveClass('active')
  })

  test('highlights active navigation link for orders', () => {
    renderWithRouter(<Nav />, { route: '/orders' })
    const ordersLink = screen.getByRole('link', { name: 'Orders' })
    expect(ordersLink).toHaveClass('active')
  })

  test('brand link points to patients page', () => {
    renderWithRouter(<Nav />)
    const brandLink = screen.getByRole('link', { name: 'Lab Orders Lite' })
    expect(brandLink).toHaveAttribute('href', '/patients')
  })
})