import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'reactstrap'
import Nav from './components/Nav'
import Patients from './view/patients/Patients'
import LabTestCatalog from './view/lab-test-catalog/LabTestCatalog'
import Orders from './view/orders/Orders'
import './App.css'
import { orderApi, patientApi, labTestApi } from './services/api'

function App() {
  const [orders, setOrders] = useState([])
  const [patients, setPatients] = useState([])
  const [labTests, setLabTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all data once because data is all connected
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [ordersData, patientsData, labTestsData] = await Promise.all([
          orderApi.getAll(),
          patientApi.getAll(),
          labTestApi.getAll()
        ])
        setOrders(ordersData)
        setPatients(patientsData)
        setLabTests(labTestsData)
      } catch (err) {
        setError('Failed to fetch initial data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Refetch if needed
  const refetchOrders = async () => {
    const data = await orderApi.getAll()
    setOrders(data)
  }
  const refetchPatients = async () => {
    const data = await patientApi.getAll()
    setPatients(data)
  }
  const refetchLabTests = async () => {
    const data = await labTestApi.getAll()
    setLabTests(data)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <Router>
      <Nav />
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/patients" replace />} />
          <Route path="/patients" element={<Patients
          patients={patients}
          refetchPatients={refetchPatients}
          loading={loading}
          />} />
          <Route path="/catalog" element={<LabTestCatalog
          labTests={labTests}
          refetchLabTests={refetchLabTests}
          loading={loading}
          />} />
          <Route path="/orders" element={<Orders
          labTests={labTests}
          orders={orders}
          patients={patients}
          refetchOrders={refetchOrders}
          loading={loading}
          />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App