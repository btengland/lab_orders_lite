import { useState } from 'react'
import './App.css'
import PatientList from './components/PatientList'
import LabTestCatalog from './components/LabTestCatalog'
import OrderList from './components/OrderList'
import CreateOrder from './components/CreateOrder'

function App() {
  const [activeTab, setActiveTab] = useState('patients')

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
        <div className="container">
          <span className="navbar-brand">Lab Orders Lite</span>
          <div className="navbar-nav">
            <button 
              className={`nav-link btn btn-link ${activeTab === 'patients' ? 'active' : ''}`}
              onClick={() => setActiveTab('patients')}
            >
              Patients
            </button>
            <button 
              className={`nav-link btn btn-link ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              Lab Test Catalog
            </button>
            <button 
              className={`nav-link btn btn-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button 
              className={`nav-link btn btn-link ${activeTab === 'create-order' ? 'active' : ''}`}
              onClick={() => setActiveTab('create-order')}
            >
              Create Order
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {activeTab === 'patients' && <PatientList />}
        {activeTab === 'catalog' && <LabTestCatalog />}
        {activeTab === 'orders' && <OrderList />}
        {activeTab === 'create-order' && <CreateOrder />}
      </div>
    </div>
  )
}

export default App
