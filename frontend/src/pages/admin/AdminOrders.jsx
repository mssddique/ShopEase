import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getOrders();
        setOrders(response.data.data.data || []);
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

  return (
    <div>
      <h2 className="mb-4">Orders</h2>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.order_number || order.id}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>${(Number(order.total) || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${order.payment_status === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                          {order.payment_status || 'unpaid'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadge(order.status)}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/admin/orders/${order.id}`} className="btn btn-sm btn-primary">
                          <i className="bi bi-eye"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-cart fs-2"></i>
              <p className="mb-0">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;