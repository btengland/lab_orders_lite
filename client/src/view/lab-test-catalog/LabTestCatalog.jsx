import React, { useState } from 'react'
import { Button } from 'reactstrap'
import LabTestTable from './LabTestTable'
import LabTestModal from './LabTestModal'
import { labTestApi } from '../../services/api'

function LabTestCatalog({labTests, refetchLabTests, loading}) {
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

  const handleSubmit = async (id) => {
    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        turnaroundTime: parseInt(formData.turnaroundTime)
      }
      
      if (id) {
        // Update existing lab test
        await labTestApi.update(id, submitData)
        refetchLabTests()
      } else {
        // Create new lab test
        await labTestApi.create(submitData)
        refetchLabTests()
      }
      setSelectedLabTest(null)
      toggleModal()
    } catch (err) {
      console.log(err)
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
