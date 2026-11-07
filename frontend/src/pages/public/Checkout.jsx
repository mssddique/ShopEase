import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderApi } from "../../api/orderApi";
import Loading from "../../components/common/Loading";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { paymentApi } from "../../api/paymentApi";
import StripeCardForm from "../../components/checkout/StripeCardForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(false);

  useEffect(() => {
    // Pre-fill form with user data
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        notes: "",
      });
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      navigate("/cart");
    }
  }, [cartItems, navigate, loading, orderPlaced]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodChange = async (method) => {
    setPaymentMethod(method);
    setErrors({});

    if (method === "stripe" && !clientSecret) {
      setLoadingIntent(true);
      try {
        const response = await paymentApi.createStripeIntent();
        setClientSecret(response.data.data.client_secret);
        console.log('Client secret received:', response.data.data.client_secret);
      } catch (error) {
        setErrors({
          general: "Could not initialize payment. Please try again.",
        });
        setPaymentMethod("cod");
      } finally {
        setLoadingIntent(false);
      }
    }
  };

  const finalizeOrder = async (paymentIntentId = null) => {
    setPlacingOrder(true);
    try {
      const orderData = {
        shipping_name: formData.name,
        shipping_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        notes: formData.notes,
        payment_method: paymentMethod,
        ...(paymentIntentId && { payment_intent_id: paymentIntentId }),
      };

      const response = await orderApi.createOrder(orderData);
      const order = response.data.data;

      setOrderPlaced(true);
      navigate(`/order-confirmation/${order.id}`);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      const message =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      setErrors({ general: message });
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleStripeSuccess = (paymentIntentId) => {
    finalizeOrder(paymentIntentId);
  };

  const handleStripeError = (message) => {
    setErrors({ general: message });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (paymentMethod === "cod") {
      finalizeOrder(); // no paymentIntentId needed for COD
    }

    setPlacingOrder(true);
    try {
      const orderData = {
        // ...formData,
        // items: cartItems.map(item => ({
        //   product_id: item.product_id || item.id,
        //   quantity: item.quantity,
        //   price: item.sale_price || item.price,
        // })),
        // total: cartTotal,
        // payment_method: 'cash_on_delivery',
        shipping_name: formData.name,
        shipping_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        notes: formData.notes,
        payment_method: "cod",
      };
      const response = await orderApi.createOrder(orderData);
      const order = response.data.data;

      // Clear cart after successful order
      setOrderPlaced(true);
      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.id}`);
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      const message =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      setErrors({ general: message });
    } finally {
      setPlacingOrder(false);
    }
  };

  // Calculate totals
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const grandTotal = subtotal + shipping;

  if (cartItems.length === 0) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="mb-4">Checkout</h2>

      <div className="row g-4">
        {/* Order Form */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-3">Shipping Information</h5>

              {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
              )}

              <form onSubmit={handlePlaceOrder}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Delivery Address *
                  </label>
                  <textarea
                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    City *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.city ? "is-invalid" : ""}`}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="notes" className="form-label">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="notes"
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn ${paymentMethod === "cod" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => handlePaymentMethodChange("cod")}
                    >
                      <i className="bi bi-cash me-2"></i>
                      Cash on Delivery
                    </button>
                    <button
                      type="button"
                      className={`btn ${paymentMethod === "stripe" ? "btn-primary" : "btn-outline-secondary"}`}
                      onClick={() => handlePaymentMethodChange("stripe")}
                    >
                      <i className="bi bi-credit-card me-2"></i>
                      Card Payment
                    </button>
                  </div>
                </div>

                {paymentMethod === "stripe" && loadingIntent && (
                  <div className="text-center py-3">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Loading payment form...
                  </div>
                )}

                {paymentMethod === "stripe" &&
                  clientSecret &&
                  !loadingIntent && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripeCardForm
                        onSuccess={handleStripeSuccess}
                        onError={handleStripeError}
                      />
                    </Elements>
                  )}

                {paymentMethod === "cod" && (
                  <div className="d-flex gap-2">
                    <Link to="/cart" className="btn btn-outline-secondary">
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Cart
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-success flex-grow-1"
                      disabled={placingOrder}
                    >
                      {placingOrder ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-3">Order Summary</h5>

              {/* Products List */}
              <div
                className="mb-3"
                style={{ maxHeight: "300px", overflowY: "auto" }}
              >
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const price = Number(item.price) || 0;
                  const image =
                    product.image_url ||
                    "/images/no-image.svg";

                  return (
                    <div
                      key={item.id}
                      className="d-flex align-items-center mb-2 pb-2"
                      style={{ borderBottom: "1px solid #eee" }}
                    >
                      <img
                        src={image}
                        alt={product.name || item.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className="rounded me-2"
                      />
                      <div className="flex-grow-1">
                        <div className="small fw-bold">
                          {product.name || item.name}
                        </div>
                        <div className="small text-muted">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="fw-bold">
                        ${Number(price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <hr />

              {/* Totals */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {shipping > 0 && (
                <div className="text-success small mb-2">
                  <i className="bi bi-info-circle me-1"></i>
                  Free shipping on orders over $50
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <h6>Grand Total</h6>
                <h6 className="text-primary">${grandTotal.toFixed(2)}</h6>
              </div>

              <div className="alert alert-info mb-0">
                <i className="bi bi-info-circle me-2"></i>
                <small>Payment: Cash on Delivery</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
