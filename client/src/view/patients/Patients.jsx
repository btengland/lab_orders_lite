import React, { useState, useEffect } from 'react'
import { Button, Alert } from 'reactstrap'
import PatientTable from './PatientTable'
import PatientModal from './PatientModal'
import { patientApi } from '../../services/api'

function Patients({patients, refetchPatients, loading}) {
  
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

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient)
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      phone: patient.phone || '',
      address: patient.address || ''
    })
    toggleModal()
  }

  const handleSubmit = async (id) => {
    try {
      if (id) {
        // Update existing patient
        await patientApi.update(id, formData)
        refetchPatients()
      } else {
        // Create new patient
        await patientApi.create(formData)
        refetchPatients()
      }
      setSelectedPatient(null)
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
    setSelectedPatient(null)
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

      <PatientTable 
        patients={patients} 
        onPatientClick={handlePatientClick}
      />

      {/* Patient Modal - switches between edit/create based on selectedPatient */}
      <PatientModal
        isOpen={modal}
        toggle={toggleModal}
        mode={selectedPatient ? "edit" : "create"}
        patient={selectedPatient}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Patients