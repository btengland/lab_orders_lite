import React from 'react'
import { Table, Button, Card, CardBody } from 'reactstrap'

function LabTestTable({ labTests, onLabTestClick }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatTurnaroundTime = (hours) => {
    if (hours < 24) {
      return `${hours} hours`
    } else {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24
      if (remainingHours === 0) {
        return `${days} day${days > 1 ? 's' : ''}`
      } else {
        return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`
      }
    }
  }

  return (
    <Card>
      <CardBody className="p-0">
        <Table striped hover responsive className="mb-0 table-rounded">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Price</th>
              <th>Turnaround Time</th>
            </tr>
          </thead>
          <tbody>
            {labTests.map(labTest => (
              <tr key={labTest.id}>
                <td>
                  <Button 
                    color="link" 
                    className="p-0 text-decoration-none"
                    onClick={() => onLabTestClick(labTest)}
                  >
                    {labTest.code}
                  </Button>
                </td>
                <td>{labTest.name}</td>
                <td>{formatPrice(labTest.price)}</td>
                <td>{formatTurnaroundTime(labTest.turnaroundTime)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default LabTestTable