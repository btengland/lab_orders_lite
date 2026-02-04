import { useState } from 'react'
import {
  Button,
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
} from 'reactstrap'
import PatientTable from './PatientTable'

function Patients() {
  // Mock patient data - in real app this would come from an API
  const [patients, setPatients] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1985-03-15',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1990-07-22',
      email: 'jane.smith@email.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Somewhere, ST 67890'
    },
    {
      id: 3,
      firstName: 'Robert',
      lastName: 'Johnson',
      dateOfBirth: '1978-11-08',
      email: 'robert.johnson@email.com',
      phone: '(555) 555-0123',
      address: '789 Pine Rd, Elsewhere, ST 54321'
    }
  ])

  const [editModal, setEditModal] = useState(false)
  const [createModal, setCreateModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: ''
  })

  const toggleEditModal = () => setEditModal(!editModal)
  const toggleCreateModal = () => setCreateModal(!createModal)

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address
    })
    toggleEditModal()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Patients</h2>
        <Button color="primary" onClick={toggleCreateModal}>
          Add New Patient
        </Button>
      </div>

      <PatientTable 
        patients={patients} 
        onPatientClick={handlePatientClick}
      />

      {/* Edit Patient Modal */}
      <Modal isOpen={editModal} toggle={toggleEditModal} size="lg">
        <ModalHeader toggle={toggleEditModal}>
          Edit Patient: {selectedPatient?.firstName} {selectedPatient?.lastName}
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="dateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="phone">Phone</Label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="textarea"
                name="address"
                id="address"
                rows="2"
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleEditModal}>
            Save Changes
          </Button>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Patient Modal */}
      <Modal isOpen={createModal} toggle={toggleCreateModal} size="lg">
        <ModalHeader toggle={toggleCreateModal}>
          Add New Patient
        </ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="createFirstName">First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="createFirstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="createLastName">Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="createLastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="createDateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    id="createDateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="createPhone">Phone</Label>
                  <Input
                    type="text"
                    name="phone"
                    id="createPhone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="createEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="createEmail"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="createAddress">Address</Label>
              <Input
                type="textarea"
                name="address"
                id="createAddress"
                rows="2"
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleCreateModal}>
            Create Patient
          </Button>
          <Button color="secondary" onClick={toggleCreateModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Patients