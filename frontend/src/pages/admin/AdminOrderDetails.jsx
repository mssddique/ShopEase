import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getOrder(id);
        setOrder(response.data.data);
        console.log('Order payload:', response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setOrder(null);
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!window.confirm(`Change order status to "${newStatus}"?`)) return;

    setUpdating(true);
    try {
      await adminApi.updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'confirmed': 'info',
      'processing': 'primary',
      'shipped': 'info',
      'delivered': 'success',
      'cancelled': 'danger',
    };
    return statusMap[status] || 'secondary';
  };

  if (loading) {
    return <Loading message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="text-center py-5">
        <h4>Order not found</h4>
        <Link to="/admin/orders" className="btn btn-primary mt-3">
          Back to Orders
        </Link>
      </div>
    );
  }

  // const subtotal = Number(order.subtotal || 0);
  // const shippingCost = Number(order.shipping_cost || 0);
  // const grandTotal = Number(order.total || 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order #{order.order_number || order.id}</h2>
        <Link to="/admin/orders" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Orders
        </Link>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">Order Information</h6>
              <div className="mb-2">
                <span className="text-muted">Order #:</span>
                <span className="fw-bold ms-2">{order.order_number || order.id}</span>
              </div>
              <div className="mb-2">
                <span className="text-muted">Date:</span>
                <span className="ms-2">{new Date(order.created_at).toLocaleString()}</span>
              </div>
              <div className="mb-2">
                <span className="text-muted">Status:</span>
                <span className={`badge bg-${getStatusBadge(order.status)} ms-2`}>
                  {order.status || 'pending'}
                </span>
              </div>
              <div className="mb-2">
                <span className="text-muted">Payment:</span>
                <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning'} ms-2`}>
                  {order.payment_status || 'unpaid'}
                </span>
              </div>
              <div>
                <span className="text-muted">Payment Method:</span>
                <span className="ms-2">{order.payment_method || 'Cash on Delivery'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">Customer  &amp; Shipping Information</h6>
              <div className="mb-1"><strong>{order.user?.name || order.user?.name}</strong></div>
              <div className="mb-1">{order.user?.email}</div>
              <div className="mb-1">{order.user?.phone || order.user?.phone}</div>
              <div className="mb-1">{order.shipping_address}</div>
              <div className="mb-1">{order.shipping_city}</div>
              {order.notes && (
                <div className="mt-2">
                  <span className="text-muted">Notes:</span>
                  <p className="mb-0 small">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Update Status */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="card-title text-muted mb-3">Update Order Status</h6>
          <div className="d-flex align-items-center gap-3">
            <select
              className="form-select w-auto"
              value={order.status || 'pending'}
              onChange={handleStatusChange}
              disabled={updating}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {updating && (
              <span className="spinner-border spinner-border-sm text-primary"></span>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="card-title text-muted mb-3">Order Items</h6>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.map((item, index) => {
                  // const product = item.product_name || {};
                  const price = Number(item.price) || 0;
                  const quantity = Number(item.quantity) || 0;
                  const total = price * quantity;
                  // const image = product.main_image || 'https://via.placeholder.com/50x50/eee/999?text=No+Image';
                  // const subtotal = Number(order.subtotal ?? order.total) || 0;
                  // const shipping = Number(order.shipping_cost) || 0;
                  // const grandTotal = Number(order.total) || 0;

                  return (
                    <tr key={index}>
                      <td>
                        <div className="fw-bold">{item.product_name}</div>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-end">${price.toFixed(2)}</td>
                      <td className="text-end fw-bold">${total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Subtotal</td>
                  <td className="text-end">${Number(order.subtotal || order.total || 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end text-muted">Shipping</td>
                  <td className="text-end">
                    {Number(order.shipping_cost || 0) === 0 ? 'Free' : `$${Number(order.shipping_cost || 0).toFixed(2)}`}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end fw-bold fs-5">Grand Total</td>
                  <td className="text-end fw-bold fs-5 text-primary">
                    ${Number(order.total || 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;