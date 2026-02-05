import React from 'react'
import { Table, Button, Card, CardBody, Badge } from 'reactstrap'

function OrderTable({ orders, onOrderClick }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US')
  }

  const getPatientName = (order) => {
    return order.patient ? `${order.patient.firstName} ${order.patient.lastName}` : `Patient ${order.patientId}`
  }

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success'
      case 'processing':
        return 'warning'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <Card>
      <CardBody className="p-0">
        <Table striped hover responsive className="mb-0 table-rounded">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Patient Name</th>
              <th># Tests</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Estimated Date</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>
                  <Button 
                    color="link" 
                    className="p-0 text-decoration-none"
                    onClick={() => onOrderClick(order)}
                  >
                    #{order.id}
                  </Button>
                </td>
                <td>{getPatientName(order)}</td>
                <td>{order.testIds?.length || 0}</td>
                <td>{formatPrice(order.totalCost)}</td>
                <td>
                  <Badge color={getStatusBadgeColor(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td>{formatDate(order.estimatedDate)}</td>
                <td>{formatDate(order.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {orders.length === 0 && (
          <div className="text-center p-4 text-muted">
            No orders found.
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default OrderTable