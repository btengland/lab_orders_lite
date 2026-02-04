import { useState } from 'react'
import { Container } from 'reactstrap'
import Nav from './components/Nav'
import Patients from './components/Patients'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('patients')

  return (
    <>
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Container>
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'catalog' && <div><h2>Lab Test Catalog Component</h2></div>}
        {activeTab === 'orders' && <div><h2>Orders Component</h2></div>}
      </Container>
    </>
  )
}

export default App
