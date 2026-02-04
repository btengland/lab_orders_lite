import { useState } from 'react'
import { Button } from 'reactstrap'
import PatientTable from './PatientTable'
import PatientModal from './PatientModal'

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

  const handleCreatePatient = () => {
    // Here you would typically make an API call to create the patient
    const newPatient = {
      id: patients.length + 1,
      ...formData
    }
    setPatients([...patients, newPatient])
    
    // Reset form and close modal
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      address: ''
    })
    toggleCreateModal()
  }

  const handleUpdatePatient = () => {
    // Here you would typically make an API call to update the patient
    const updatedPatients = patients.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, ...formData }
        : patient
    )
    setPatients(updatedPatients)
    
    // Close modal
    toggleEditModal()
  }

  const handleCreateModalOpen = () => {
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      address: ''
    })
    toggleCreateModal()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Patients</h2>
        <Button color="primary" onClick={handleCreateModalOpen}>
          Add New Patient
        </Button>
      </div>

      <PatientTable 
        patients={patients} 
        onPatientClick={handlePatientClick}
      />

      {/* Edit Patient Modal */}
      <PatientModal
        isOpen={editModal}
        toggle={toggleEditModal}
        mode="edit"
        patient={selectedPatient}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleUpdatePatient}
      />

      {/* Create Patient Modal */}
      <PatientModal
        isOpen={createModal}
        toggle={toggleCreateModal}
        mode="create"
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleCreatePatient}
      />
    </div>
  )
}

export default Patients