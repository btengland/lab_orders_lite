import React, { useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  Alert,
  InputGroup,
  InputGroupText
} from 'reactstrap'

function LabTestModal({
  isOpen,
  toggle,
  mode, 
  labTest,
  formData,
  onInputChange,
  onSubmit,
}) {
  const [error, setError] = useState('')
  const isEditMode = mode === 'edit'
  const title = isEditMode 
    ? `Edit Lab Test: ${labTest?.name}` 
    : 'Add New Lab Test'

  const submitButtonText = isEditMode ? 'Save Changes' : 'Create Lab Test'

  const MAX_TURNAROUND_HOURS = 8760;
  const validateRequiredFields = () => {
    const requiredFields = ['code', 'name', 'price', 'turnaroundTime']
    const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim())
    if (missingFields.length > 0) {
      setError('Please fill out all required fields marked with *')
      return false
    }
    // Validate price is a positive number
    const price = parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      setError('Price must be a positive number')
      return false
    }
    // Validate turnaround time is a positive integer and within max
    const turnaroundTime = parseInt(formData.turnaroundTime)
    if (
      isNaN(turnaroundTime) ||
      turnaroundTime <= 0 ||
      turnaroundTime > MAX_TURNAROUND_HOURS
    ) {
      setError(`Turnaround time must be a positive number of hours and no more than ${MAX_TURNAROUND_HOURS}`)
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = () => {
    if (validateRequiredFields()) {
      const labTestId = isEditMode ? labTest?.id : null
      onSubmit(labTestId)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md" centered>
      <ModalHeader toggle={toggle}>
        {title}
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color="danger" className="mb-3" timeout={150}>
            {error}
          </Alert>
        )}
        
        <Form>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="code">Test Code *</Label>
                <Input
                  type="text"
                  name="code"
                  id="code"
                  placeholder="e.g., CBC, BMP"
                  value={formData.code}
                  onChange={onInputChange}
                />
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="name">Test Name *</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="e.g., Complete Blood Count"
                  value={formData.name}
                  onChange={onInputChange}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="price">Price *</Label>
                <InputGroup>
                  <InputGroupText>$</InputGroupText>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={onInputChange}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="turnaroundTime">Turnaround Time *</Label>
                <InputGroup>
                  <Input
                    type="number"
                    name="turnaroundTime"
                    id="turnaroundTime"
                    placeholder="24"
                    min="1"
                    max={MAX_TURNAROUND_HOURS}
                    value={formData.turnaroundTime}
                    onChange={onInputChange}
                  />
                  <InputGroupText>hours</InputGroupText>
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          {submitButtonText}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default LabTestModal