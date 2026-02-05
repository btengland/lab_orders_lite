import React, { useState, useEffect } from 'react'
import { Button, Alert, Row, Col, Input, FormGroup, Label } from 'reactstrap'
import OrderTable from './OrderTable'
import OrderModal from './OrderModal'
import { orderApi, patientApi } from '../../services/api'

function Orders() {
  const [allOrders, setAllOrders] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [filters, setFilters] = useState({
    patientName: '',
    status: ''
  })
  
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

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
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


  // Fetch orders with filters
  const handleGetData = async (activeFilters = filters) => {
    setLoading(true)
    setError(null)
    try {
      const ordersData = await orderApi.getAll(activeFilters)
      // Convert testIds string to array if needed
      const normalizedOrders = Array.isArray(ordersData)
        ? ordersData.map(order => ({
            ...order,
            testIds: typeof order.testIds === 'string' ? JSON.parse(order.testIds) : order.testIds
          }))
        : [];
      setAllOrders(normalizedOrders)
      setOrders(normalizedOrders)
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetData()
  }, [])

  useEffect(() => {
    handleGetData(filters)
  }, [filters])

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
    setLoading(true)
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
        const updatedOrder = await orderApi.update(id, submitData)
        await handleGetData()
      } else {
        const newOrder = await orderApi.create(submitData)
        await handleGetData()
      }
      setSelectedOrder(null)
      toggleModal()
    } catch (err) {
      setError('Failed to save order. Please try again.')
      console.error(err)
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
            Showing {orders.length} orders
          </small>
        </Col>
      </Row>

      {error && (
        <Alert color="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {loading && <div>Loading...</div>}

      <OrderTable 
        orders={orders}
        onOrderClick={handleOrderClick}
      />

      {/* Order Modal - switches between edit/create based on selectedOrder */}
      <OrderModal
        isOpen={modal}
        toggle={toggleModal}
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