import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await orderApi.getOrder(id);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

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
        <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
        <h4 className="mt-3">Order not found</h4>
        <Link to="/orders" className="btn btn-primary mt-3">
          Back to Orders
        </Link>
      </div>
    );
  }

  const subtotal = Number(order.subtotal || 0);
  const shippingCost = Number(order.shipping_cost || 0);
  const grandTotal = Number(order.total || 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Details</h2>
        <Link to="/orders" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Orders
        </Link>
      </div>

      {/* Order Info */}
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
              <div>
                <span className="text-muted">Payment:</span>
                <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning'} ms-2`}>
                  {order.payment_status || 'unpaid'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="card-title text-muted mb-3">Shipping Information</h6>
              <div className="mb-1"><strong>{order.shipping_name}</strong></div>
              <div className="mb-1">{order.shipping_phone}</div>
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

      {/* Order Items */}
      <div className="card shadow-sm mb-4">
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
                  const product = item.product || {};
                  const price = Number(item.price || 0);
                  const total = Number(price * item.quantity);
                  // const image = product.image_url || 'https://via.placeholder.com/50x50/eee/999?text=No+Image';

                  return (
                    <tr key={index}>
                      <td>
                        <div className="d-flex align-items-center">
                          {/* <img
                            src={image}
                            alt={product.name || item.name}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            className="rounded me-2"
                          /> */}
                          <div>
                            <div className="fw-bold">{item.product_name}</div>
                            {/* <small className="text-muted">SKU: {item.sku || 'N/A'}</small> */}
                          </div>
                        </div>
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
                    {Number(order.shipping || 0) === 0 ? 'Free' : `$${Number(order.shipping || 0).toFixed(2)}`}
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

      <div className="text-center">
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;