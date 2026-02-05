import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'reactstrap'
import Nav from './components/Nav'
import Patients from './view/patients/Patients'
import LabTestCatalog from './view/lab-test-catalog/LabTestCatalog'
import Orders from './view/orders/Orders'
import './App.css'

function App() {
  return (
    <Router>
      <Nav />
      
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/patients" replace />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/catalog" element={<LabTestCatalog />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
