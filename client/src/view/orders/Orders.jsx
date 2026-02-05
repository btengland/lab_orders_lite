import React, { useEffect, useState } from 'react'
import { Button, Row, Col, Input, FormGroup, Label } from 'reactstrap'
import OrderTable from './OrderTable'
import OrderModal from './OrderModal'
import { orderApi } from '../../services/api'

function Orders({labTests, orders, patients, refetchOrders, loading}) {
  const [filters, setFilters] = useState({
    patientName: '',
    status: ''
  })
  
  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [modal, setModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [formData, setFormData] = useState({
    patientId: '',
    testIds: [],
    totalCost: '',
    estimatedDate: '',
    status: 'pending'
  })

  const toggleModal = () => {
    setModal(!modal)
  }

  useEffect(() => {
    setFilteredOrders(orders.filter(order => {
      const patientName = order.patient ? `${order.patient.firstName} ${order.patient.lastName}`.toLowerCase() : ''
      const matchesPatient = patientName.includes(filters.patientName.toLowerCase())
      const matchesStatus = filters.status ? order.status.toLowerCase() === filters.status.toLowerCase() : true
      return matchesPatient && matchesStatus
    }))
  }, [filters, orders])

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    // I was having some issues with test ids being null, so this is a quick fix
    let testIds = Array.isArray(order.testIds)
      ? order.testIds.map(id => parseInt(id)).filter(id => !isNaN(id))
      : [];

    setFormData({
      patientId: order.patientId,
      testIds: testIds,
      totalCost: order.totalCost,
      estimatedDate: new Date(order.estimatedDate).toISOString().split('T')[0],
      status: order.status
    })
    toggleModal()
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      patientName: '',
      status: ''
    })
  }

  const handleSubmit = async (id, cleanedFormData) => {
    try {
      const dataToSubmit = cleanedFormData || formData

      const submitData = {
        ...dataToSubmit,
        patientId: dataToSubmit.patientId,
        testIds: dataToSubmit.testIds,
        totalCost: dataToSubmit.totalCost,
        estimatedDate: dataToSubmit.estimatedDate
      }
      
      if (id) {
        await orderApi.update(id, submitData)
        await refetchOrders()
      } else {
        await orderApi.create(submitData)
        await refetchOrders()
      }
      setSelectedOrder(null)
      toggleModal()
    } catch (err) {
      console.error(err)
    } 
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleTestIdsChange = (testIds) => {
    setFormData(prevData => ({
      ...prevData,
      testIds: testIds
    }))
  }

  const handleCreateModalOpen = () => {
    setSelectedOrder(null)
    setFormData({
      patientId: '',
      testIds: [],
      totalCost: '',
      estimatedDate: '',
      status: 'pending'
    })
    toggleModal()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="me-2">Orders</h2>
        <Button color="primary" onClick={handleCreateModalOpen} disabled={loading}>
          Create New Order
        </Button>
      </div>

      {/* Filter Section */}
      <Row className="mb-3">
        <Col md={4}>
          <FormGroup>
            <Label for="patientNameFilter">Filter by Patient Name</Label>
            <Input
              type="text"
              name="patientName"
              id="patientNameFilter"
              placeholder="Enter patient name..."
              value={filters.patientName}
              onChange={handleFilterChange}
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup>
            <Label for="statusFilter">Filter by Status</Label>
            <Input
              type="select"
              name="status"
              id="statusFilter"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <FormGroup>
            <Button color="secondary" onClick={clearFilters}>
              Clear
            </Button>
          </FormGroup>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <small className="text-muted">
            Showing {filteredOrders.length} orders
          </small>
        </Col>
      </Row>

      <OrderTable 
        orders={filteredOrders}
        onOrderClick={handleOrderClick}
      />

      {/* Order Modal - switches between edit/create based on selectedOrder */}
      <OrderModal
        isOpen={modal}
        toggle={toggleModal}
        patients={patients}
        labTests={labTests}
        mode={selectedOrder ? "edit" : "create"}
        order={selectedOrder}
        formData={formData}
        onInputChange={handleInputChange}
        onTestIdsChange={handleTestIdsChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default Orders