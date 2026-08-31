// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { orderApi } from '../../api/orderApi';
// import Loading from '../../components/common/Loading';

// const OrderConfirmation = () => {
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [orderPlaced, setOrderPlaced] = useState(false);   // ADD THIS LINE

//   useEffect(() => {

//     const fetchOrder = async () => {
//       setLoading(true);
//       if (cartItems.length === 0 && !loading && !orderPlaced) {
//         navigate("/cart");
//       }
//       try {
//         const response = await orderApi.getOrder(id);
//         setOrder(response.data.data);
//       } catch (error) {
//         console.error('Error fetching order:', error);
//         setOrder(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchOrder();
//     }
//   }, [id, cartItems, navigate, loading, orderPlaced]);

//   if (loading) {
//     return <Loading message="Loading order details..." />;
//   }

//   if (!order) {
//     return (
//       <div className="text-center py-5">
//         <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
//         <h4 className="mt-3">Order not found</h4>
//         <Link to="/" className="btn btn-primary mt-3">
//           Go Home
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="text-center py-4">
//       <div className="mb-4">
//         <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
//         <h2 className="mt-3">Order Placed Successfully!</h2>
//         <p className="text-muted">Thank you for your order. We'll send you a confirmation email shortly.</p>
//       </div>

//       <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
//         <div className="card-body">
//           <div className="mb-3">
//             <span className="text-muted">Order Number:</span>
//             <h5 className="fw-bold">#{order.order_number || order.id}</h5>
//           </div>

//           <div className="mb-3">
//             <span className="text-muted">Total Amount:</span>
//             <h5 className="text-primary">${Number(order.total || 0).toFixed(2)}</h5>
//           </div>

//           <div className="mb-3">
//             <span className="text-muted">Payment Method:</span>
//             <p className="mb-0">{order.payment_method || 'Cash on Delivery'}</p>
//           </div>

//           <div className="mb-3">
//             <span className="text-muted">Shipping Address:</span>
//             <p className="mb-0">{order.shipping_address}, {order.city}</p>
//           </div>

//           <div className="d-flex gap-2 mt-4">
//             <Link to={`/orders/${order.id}`} className="btn btn-primary flex-grow-1">
//               <i className="bi bi-eye me-2"></i>
//               View Order
//             </Link>
//             <Link to="/" className="btn btn-outline-secondary flex-grow-1">
//               <i className="bi bi-arrow-left me-2"></i>
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Loading from '../../components/common/Loading';

const OrderConfirmation = () => {
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

  if (loading) {
    return <Loading message="Loading order details..." />;
  }

  if (!order) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
        <h4 className="mt-3">Order not found</h4>
        <Link to="/" className="btn btn-primary mt-3">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className="mb-4">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
        <h2 className="mt-3">Order Placed Successfully!</h2>
        <p className="text-muted">Thank you for your order. We'll send you a confirmation email shortly.</p>
      </div>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body">
          <div className="mb-3">
            <span className="text-muted">Order Number:</span>
            <h5 className="fw-bold">#{order.order_number || order.id}</h5>
          </div>

          <div className="mb-3">
            <span className="text-muted">Total Amount:</span>
            <h5 className="text-primary">${Number(order.total || 0).toFixed(2)}</h5>
          </div>

          <div className="mb-3">
            <span className="text-muted">Payment Method:</span>
            <p className="mb-0">{order.payment_method || 'Cash on Delivery'}</p>
          </div>

          <div className="mb-3">
            <span className="text-muted">Shipping Address:</span>
            <p className="mb-0">{order.shipping_address}, {order.shipping_city}</p>
          </div>

          <div className="d-flex gap-2 mt-4">
            <Link to={`/orders/${order.id}`} className="btn btn-primary flex-grow-1">
              <i className="bi bi-eye me-2"></i>
              View Order
            </Link>
            <Link to="/" className="btn btn-outline-secondary flex-grow-1">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;