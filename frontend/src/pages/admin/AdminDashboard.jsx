import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import Loading from '../../components/common/Loading';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await adminApi.getDashboard();
        const data = response.data.data;
        setStats(data || {});
        setRecentOrders(data.recent_orders || []);
        setLowStockProducts(data.low_stock_products || []);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        setStats({});
        // setStats(data.stats || {});
        // Set dummy data for demo
        // setStats({
        //   total_products: 0,
        //   total_categories: 0,
        //   total_brands: 0,
        //   total_customers: 0,
        //   total_orders: 0,
        //   pending_orders: 0,
        //   total_sales: 0,
        // });
        setRecentOrders([]);
        setLowStockProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loading message="Loading dashboard..." />;
  }

  const statCards = [
    { label: 'Total Products', value: stats.total_products || 0, icon: 'bi-box', color: 'primary' },
    { label: 'Total Categories', value: stats.total_categories || 0, icon: 'bi-grid', color: 'success' },
    { label: 'Total Brands', value: stats.total_brands || 0, icon: 'bi-building', color: 'info' },
    { label: 'Total Customers', value: stats.total_customers || 0, icon: 'bi-people', color: 'warning' },
    { label: 'Total Orders', value: stats.total_orders || 0, icon: 'bi-cart', color: 'secondary' },
    { label: 'Pending Orders', value: stats.pending_orders || 0, icon: 'bi-clock', color: 'danger' },
    { label: 'Total Sales', value: `$${Number(stats.total_sales || 0).toFixed(2)}`, icon: 'bi-currency-dollar', color: 'success' },
    // { label: 'Total Sales', value: `$${(stats.total_sales || 0).toFixed(2)}`, icon: 'bi-currency-dollar', color: 'success' },
  ];

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {statCards.map((stat, index) => (
          <div key={index} className="col-6 col-md-4 col-lg-3">
            <div className={`card shadow-sm border-0 border-start border-4 border-${stat.color}`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-1">{stat.label}</h6>
                    <h4 className="mb-0">{stat.value}</h4>
                  </div>
                  <i className={`bi ${stat.icon} fs-1 text-${stat.color} opacity-50`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Recent Orders</h6>
              <Link to="/admin/orders" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              {recentOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.slice(0, 5).map((order) => (
                        <tr key={order.id}>
                          <td>#{order.order_number || order.id}</td>
                          <td>{order.user?.name || 'N/A'}</td>
                          {/* <td>{order.name}</td> */}
                          <td>${Number(order.total || 0).toFixed(2)}</td>
                          {/* <td>${(order.total || 0).toFixed(2)}</td> */}
                          <td>
                            <span className={`badge bg-${order.status === 'pending' ? 'warning' : 
                              order.status === 'delivered' ? 'success' : 'primary'}`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox fs-2"></i>
                  <p className="mb-0">No recent orders</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Low Stock Products</h6>
              <Link to="/admin/products" className="btn btn-sm btn-primary">
                View All
              </Link>
            </div>
            <div className="card-body p-0">
              {lowStockProducts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockProducts.slice(0, 5).map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>
                            <span className="badge bg-danger">{product.stock} left</span>
                          </td>
                          <td>
                            <Link to={`/admin/products/edit/${product.id}`} className="btn btn-sm btn-outline-primary">
                              Update
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-check-circle fs-2 text-success"></i>
                  <p className="mb-0">All products are well stocked</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;