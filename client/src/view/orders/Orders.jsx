import React, { useState, useEffect } from 'react'
import { Button, Alert, Row, Col, Input, FormGroup, Label } from 'reactstrap'
import OrderTable from './OrderTable'
import OrderModal from './OrderModal'
import { orderApi, patientApi } from '../../services/api'

function Orders() {
  // State for orders from API
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Filter state
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
    
    // Handle testIds - could be array or JSON string
    let testIds = order.testIds
    if (typeof testIds === 'string') {
      try {
        testIds = JSON.parse(testIds)
      } catch (e) {
        testIds = []
      }
    }
    testIds = Array.isArray(testIds) ? testIds.filter(id => id !== null && id !== undefined) : []
    
    setFormData({
      patientId: order.patientId.toString(),
      testIds: testIds,
      totalCost: order.totalCost.toString(),
      estimatedDate: new Date(order.estimatedDate).toISOString().split('T')[0],
      status: order.status
    })
    toggleModal()
  }

  // Fetch orders from API with current filters
  const handleGetData = async (currentFilters = filters) => {
    setLoading(true)
    setError(null)
    try {
      // Build filter object, only include non-empty values
      const filterParams = {}
      if (currentFilters.patientName.trim()) filterParams.patientName = currentFilters.patientName.trim()
      if (currentFilters.status) filterParams.status = currentFilters.status
      
      const ordersData = await orderApi.getAll(filterParams)
      setOrders(ordersData)
    } catch (err) {
      setError('Failed to fetch orders. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetData()
  }, [])

  // Debounce filter changes to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleGetData(filters)
    }, 300) // Wait 300ms after user stops typing

    return () => clearTimeout(timeoutId)
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
        patientId: parseInt(dataToSubmit.patientId),
        testIds: (dataToSubmit.testIds || []).filter(id => id !== null && id !== undefined).map(id => parseInt(id)),
        totalCost: parseFloat(dataToSubmit.totalCost),
        estimatedDate: new Date(dataToSubmit.estimatedDate).toISOString()
      }
      
      if (id) {
        // Update existing order
        const updatedOrder = await orderApi.update(id, submitData)
        // Refresh the entire orders list to ensure data consistency
        await handleGetData()
      } else {
        // Create new order
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