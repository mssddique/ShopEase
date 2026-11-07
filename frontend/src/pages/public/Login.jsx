import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../../components/common/AuthShell';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check if user is admin
      const user = result.user;
      if (user.role === 'admin' || user.is_admin === true) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setErrors({ general: result.error });
    }
    setLoading(false);
  };

  return (
    <AuthShell
      title="Log in"
      subtitle="Welcome back. Enter your details to continue."
      footer={<>New to ShopEase? <Link to="/register" className="fw-semibold">Create an account</Link></>}
    >
        {location.state?.message && (
          <div className="alert alert-info" role="status">{location.state.message}</div>
        )}
        {errors.general && (
          <div className="alert alert-danger" role="alert">{errors.general}</div>
        )}
        <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email or Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
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

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </form>
    </AuthShell>
  );
};

export default Login;
