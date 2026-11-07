import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/common/AuthShell';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    address: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(formData);

    if (result.success) {
      // Redirect to login page after successful registration
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        setErrors({ general: result.error });
      }
    }
    setLoading(false);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute. Phone, address and city are optional."
      footer={<>Already have an account? <Link to="/login" className="fw-semibold">Log in</Link></>}
    >
        {errors.general && (
          <div className="alert alert-danger" role="alert">{errors.general}</div>
        )}
        <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                  id="password_confirmation"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
                {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating account
                  </>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
    </AuthShell>
  );
};

export default Register;
