import React, { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap'

function OrderModal({ isOpen, toggle, patients = [], labTests = [], mode, order, formData, onInputChange, onTestIdsChange, onSubmit }) {
  const [error, setError] = useState(null)

  const handleTestSelection = (testId) => {
    const testIdsSet = new Set(formData.testIds || [])
    if (testIdsSet.has(testId)) {
      testIdsSet.delete(testId)
    } else {
      testIdsSet.add(testId)
    }
    let newTestIds = Array.from(testIdsSet)

    onTestIdsChange(newTestIds)

    let totalCost = 0
    let maxTurnaround = 0
    newTestIds.forEach(id => {
      const test = labTests.find(t => t.id === id)
      if (test) {
        totalCost += test.price
        maxTurnaround = Math.max(maxTurnaround, test.turnaroundTime)
      }
    })

    onInputChange({
      target: { name: 'totalCost', value: totalCost.toString() }
    })

    const estimatedDate = new Date()
    estimatedDate.setHours(estimatedDate.getHours() + maxTurnaround)

    onInputChange({
      target: { name: 'estimatedDate', value: estimatedDate.toISOString().split('T')[0] }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
        
    if (!formData.patientId || formData.testIds.length === 0) {
      setError('Please select a patient and at least one test.')
      return
    }
    
    onSubmit(order?.id, formData)
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
                const rawTestIds = Array.isArray(formData.testIds) ? formData.testIds : [];
                const testIds = rawTestIds.map(id => parseInt(id)).filter(id => !isNaN(id));
                const isChecked = testIds.includes(test.id);
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
                );
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