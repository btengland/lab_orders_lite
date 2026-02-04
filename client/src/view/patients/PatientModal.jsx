import { useState } from 'react'
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
} from 'reactstrap'

function PatientModal({
  isOpen,
  toggle,
  mode, 
  patient,
  formData,
  onInputChange,
  onSubmit,
}) {
  const [error, setError] = useState('')
  const isEditMode = mode === 'edit'
  const title = isEditMode 
    ? `Edit Patient: ${patient?.firstName} ${patient?.lastName}` 
    : 'Add New Patient'

  const submitButtonText = isEditMode ? 'Save Changes' : 'Create Patient'

  const validateRequiredFields = () => {
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'email']
    const missingFields = requiredFields.filter(field => !formData[field]?.trim())
    
    if (missingFields.length > 0) {
      setError('Please fill out all required fields marked with *')
      return false
    }
    
    setError('')
    return true
  }

  const handleSubmit = () => {
    if (validateRequiredFields()) {
      const patientId = isEditMode ? patient?.id : null
      onSubmit(patientId)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
      <ModalHeader toggle={toggle}>
        {title}
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for={`${mode}FirstName`}>
                  First Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="firstName"
                  id={`${mode}FirstName`}
                  value={formData.firstName}
                  onChange={onInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for={`${mode}LastName`}>
                  Last Name <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="lastName"
                  id={`${mode}LastName`}
                  value={formData.lastName}
                  onChange={onInputChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for={`${mode}DateOfBirth`}>
                  Date of Birth <span className="text-danger">*</span>
                </Label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  id={`${mode}DateOfBirth`}
                  value={formData.dateOfBirth}
                  onChange={onInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for={`${mode}Phone`}>Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  id={`${mode}Phone`}
                  value={formData.phone}
                  onChange={onInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for={`${mode}Email`}>
              Email <span className="text-danger">*</span>
            </Label>
            <Input
              type="email"
              name="email"
              id={`${mode}Email`}
              value={formData.email}
              onChange={onInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for={`${mode}Address`}>Address</Label>
            <Input
              type="textarea"
              name="address"
              id={`${mode}Address`}
              rows="2"
              value={formData.address}
              onChange={onInputChange}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          {submitButtonText}
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default PatientModal