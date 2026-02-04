import { useState, useEffect } from 'react'
import { Button, Alert } from 'reactstrap'
import PatientTable from './PatientTable'
import PatientModal from './PatientModal'
import { patientApi } from '../../services/api'

function Patients() {
  // State for patients from API
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [modal, setModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: ''
  })

  const toggleModal = () => {
    setModal(!modal)
  }


  const handlePatientClick = () => {
    toggleModal()
  }

  // Fetch patients from API
  const handleGetPatients = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await patientApi.getAll()
      setPatients(data)
    } catch (err) {
      setError('Failed to fetch patients. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetPatients()
  }, [])

  const handleSubmit = async (id) => {
    setLoading(true)
    try {
      if (id) {
        // Update existing patient
        const updatedPatient = await patientApi.update(id, formData)
        setPatients(prevPatients => prevPatients.map(patient => 
          patient.id === id ? updatedPatient : patient
        ))
      } else {
        // Create new patient
        const newPatient = await patientApi.create(formData)
        setPatients(prevPatients => [newPatient, ...prevPatients])
      }
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
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      address: ''
    })
    toggleModal()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Patients</h2>
        <Button color="primary" onClick={handleCreateModalOpen} disabled={loading}>
          Add New Patient
        </Button>
      </div>

      {error && (
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading && <div>Loading...</div>}

      <PatientTable 
        patients={patients} 
        onPatientClick={handlePatientClick}
      />

      {/* Edit Patient Modal */}
      <PatientModal
        isOpen={modal}
        toggle={toggleModal}
        mode="edit"
        patient={selectedPatient}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {/* Create Patient Modal */}
      <PatientModal
        isOpen={modal}
        toggle={toggleModal}
        mode="create"
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Patients