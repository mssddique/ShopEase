import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await orderApi.getOrders();
        setOrders(response.data.data?.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
    return <Loading message="Loading orders..." />;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-box fs-1 text-muted"></i>
        <h4 className="mt-3">No orders yet</h4>
        <p className="text-muted">You haven't placed any orders.</p>
        <Link to="/products" className="btn btn-primary mt-3">
          <i className="bi bi-arrow-left me-2"></i>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">My Orders</h2>
      
      <div className="row g-3">
        {orders.map((order) => (
          <div key={order.id} className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <div className="text-muted small">Order #</div>
                    <h6 className="fw-bold">{order.order_number || order.id}</h6>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="text-muted small">Date</div>
                    <div>{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="text-muted small">Total</div>
                    <div className="fw-bold">${Number(order.total || 0).toFixed(2)}</div>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="text-muted small">Status</div>
                    <span className={`badge bg-${getStatusBadge(order.status)}`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                  
                  <div className="col-md-2">
                    <div className="text-muted small">Payment</div>
                    <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                      {order.payment_status || 'unpaid'}
                    </span>
                  </div>
                  
                  <div className="col-md-1 text-end">
                    <Link to={`/orders/${order.id}`} className="btn btn-primary btn-sm">
                      <i className="bi bi-eye"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;