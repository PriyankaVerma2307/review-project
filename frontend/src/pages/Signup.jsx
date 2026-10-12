import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PasswordInput from '../components/PasswordInput';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();
    const password = formData.password;

    if (!name || !email || !address || !password) {
      return 'All fields are required';
    }

    if (name.length < 1 || name.length > 60) {
      return 'Name must be between 1 and 60 characters';
    }

    if (address.length > 400) {
      return 'Address cannot exceed 400 characters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }

    if (password.length < 8 || password.length > 16) {
      return 'Password must be 8-16 characters';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special character';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        password: formData.password
      };

      await api.post('/auth/signup', signupData);

      setSuccess(
        'Account created successfully. Redirecting to login...'
      );

      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data?.message ||
            'Unable to create account.'
        );
      } else {
        setError(
          'Cannot connect to the server. Please make sure the backend is running.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="brand-mark">S</div>

          <h1>Create Account</h1>

          <p>Join StoreRate as a normal user</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              maxLength={60}
            />

            <small>Up to 60 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              maxLength={400}
              rows={3}
            />

            <small>Maximum 400 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <PasswordInput
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />

            <small>
              8-16 characters, 1 uppercase, 1 special character
            </small>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? 'Creating account...'
              : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/user">← Back to options</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
