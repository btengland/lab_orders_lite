import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import React, { useState, useEffect } from 'react'
import { patientApi, labTestApi } from '../../services/api'

function OrderModal({ isOpen, toggle, mode, order, formData, onInputChange, onTestIdsChange, onSubmit }) {
  const [patients, setPatients] = useState([])
  const [labTests, setLabTests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load patients and lab tests when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [patientsData, labTestsData] = await Promise.all([
        patientApi.getAll(),
        labTestApi.getAll()
      ])
      setPatients(patientsData)
      setLabTests(labTestsData)
    } catch (err) {
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTestSelection = (testId) => {
    const currentTestIds = (formData.testIds || []).filter(id => id !== null && id !== undefined)
    let newTestIds
    
    if (currentTestIds.includes(testId)) {
      // Remove test if already selected
      newTestIds = currentTestIds.filter(id => id !== testId)
    } else {
      // Add test if not selected
      newTestIds = [...currentTestIds, testId]
    }
    
    // Remove any null/undefined values and duplicates
    newTestIds = [...new Set(newTestIds.filter(id => id !== null && id !== undefined))]
    
    onTestIdsChange(newTestIds)
    
    // Calculate total cost
    const totalCost = newTestIds.reduce((sum, testId) => {
      const test = labTests.find(t => t.id === testId)
      return sum + (test ? test.price : 0)
    }, 0)
    
    onInputChange({
      target: {
        name: 'totalCost',
        value: totalCost.toString()
      }
    })
    
    // Calculate estimated date (max turnaround time)
    const maxTurnaround = newTestIds.reduce((max, testId) => {
      const test = labTests.find(t => t.id === testId)
      return Math.max(max, test ? test.turnaroundTime : 0)
    }, 0)
    
    const estimatedDate = new Date()
    estimatedDate.setHours(estimatedDate.getHours() + maxTurnaround)
    
    onInputChange({
      target: {
        name: 'estimatedDate',
        value: estimatedDate.toISOString().split('T')[0]
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Clean up testIds - remove nulls, undefined, and duplicates
    const cleanTestIds = [...new Set((formData.testIds || []).filter(id => id !== null && id !== undefined))]
    
    if (!formData.patientId || cleanTestIds.length === 0) {
      setError('Please select a patient and at least one test.')
      return
    }
    
    // Update formData with cleaned testIds before submitting
    const cleanedFormData = {
      ...formData,
      testIds: cleanTestIds
    }
    
    onSubmit(order?.id, cleanedFormData)
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        {mode === 'edit' ? 'Edit Order' : 'Create New Order'}
      </ModalHeader>
      
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {error && (
            <Alert color="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          {loading && <div>Loading data...</div>}
          
          <FormGroup>
            <Label for="patientId">Patient</Label>
            <Input
              type="select"
              name="patientId"
              id="patientId"
              value={formData.patientId}
              onChange={onInputChange}
              required
            >
              <option value="">Select a patient...</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} - {patient.email}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label for="testIds">Lab Tests</Label>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ced4da', borderRadius: '0.25rem', padding: '0.5rem' }}>
              {labTests.map(test => {
                const testIds = (formData.testIds || []).map(id => parseInt(id)).filter(id => !isNaN(id))
                const isChecked = testIds.includes(test.id)
                
                return (
                  <FormGroup check key={test.id}>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleTestSelection(test.id)}
                      />
                      <strong>{test.code}</strong> - {test.name} 
                      <span className="text-muted"> (${test.price})</span>
                    </Label>
                  </FormGroup>
                )
              })}
            </div>
            {formData.testIds.length === 0 && (
              <small className="text-danger">Please select at least one test</small>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="totalCost">Total Cost</Label>
            <Input
              type="number"
              name="totalCost"
              id="totalCost"
              value={formData.totalCost}
              onChange={onInputChange}
              step="0.01"
              min="0"
              required
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label for="estimatedDate">Estimated Ready Date</Label>
            <Input
              type="date"
              name="estimatedDate"
              id="estimatedDate"
              value={formData.estimatedDate}
              onChange={onInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              type="select"
              name="status"
              id="status"
              value={formData.status}
              onChange={onInputChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Input>
          </FormGroup>
        </ModalBody>
        
        <ModalFooter>
          <Button color="secondary" onClick={toggle} type="button">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {mode === 'edit' ? 'Update Order' : 'Create Order'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default OrderModal