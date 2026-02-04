import { Table, Button, Card, CardBody } from 'reactstrap'

function PatientTable({ patients, onPatientClick }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Card>
      <CardBody className="p-0">
        <Table striped hover responsive className="mb-0 table-rounded">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient.id}>
                <td>
                  <Button 
                    color="link" 
                    className="p-0 text-decoration-none"
                    onClick={() => onPatientClick(patient)}
                  >
                    {patient.firstName} {patient.lastName}
                  </Button>
                </td>
                <td>{formatDate(patient.dateOfBirth)}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.address}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default PatientTable