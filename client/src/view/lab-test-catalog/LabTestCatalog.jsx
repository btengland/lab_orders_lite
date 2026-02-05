import React, { useState, useEffect } from 'react'
import { Button, Alert } from 'reactstrap'
import LabTestTable from './LabTestTable'
import LabTestModal from './LabTestModal'
import { labTestApi } from '../../services/api'

function LabTestCatalog() {
  // State for lab tests from API
  const [labTests, setLabTests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [modal, setModal] = useState(false)
  const [selectedLabTest, setSelectedLabTest] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: '',
    turnaroundTime: ''
  })

  const toggleModal = () => {
    setModal(!modal)
  }

  const handleLabTestClick = (labTest) => {
    setSelectedLabTest(labTest)
    setFormData({
      code: labTest.code,
      name: labTest.name,
      price: labTest.price.toString(),
      turnaroundTime: labTest.turnaroundTime.toString()
    })
    toggleModal()
  }

  // Fetch lab tests from API
  const handleGetLabTests = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await labTestApi.getAll()
      setLabTests(data)
    } catch (err) {
      setError('Failed to fetch lab tests. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetLabTests()
  }, [])

  const handleSubmit = async (id) => {
    console.log(id)
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        turnaroundTime: parseInt(formData.turnaroundTime)
      }
      
      if (id) {
        // Update existing lab test
        const updatedLabTest = await labTestApi.update(id, submitData)
        setLabTests(prevLabTests => prevLabTests.map(labTest => 
          labTest.id === id ? updatedLabTest : labTest
        ))
      } else {
        // Create new lab test
        const newLabTest = await labTestApi.create(submitData)
        setLabTests(prevLabTests => [newLabTest, ...prevLabTests])
      }
      setSelectedLabTest(null)
      toggleModal()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleCreateModalOpen = () => {
    setSelectedLabTest(null)
    setFormData({
      code: '',
      name: '',
      price: '',
      turnaroundTime: ''
    })
    toggleModal()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="me-2">Lab Test Catalog</h2>
        <Button color="primary" onClick={handleCreateModalOpen} disabled={loading}>
          Add New Lab Test
        </Button>
      </div>

      {error && (
        <Alert color="danger" className="mb-3" timeout={150}>
          {error}
        </Alert>
      )}

      {loading && <div>Loading...</div>}

      <LabTestTable 
        labTests={labTests} 
        onLabTestClick={handleLabTestClick}
      />

      {/* Lab Test Modal - switches between edit/create based on selectedLabTest */}
      <LabTestModal
        isOpen={modal}
        toggle={toggleModal}
        mode={selectedLabTest ? "edit" : "create"}
        labTest={selectedLabTest}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default LabTestCatalog
