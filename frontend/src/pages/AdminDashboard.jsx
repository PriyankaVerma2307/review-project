import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get('/admin/dashboard');

        setDashboard(response.data.dashboard);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Unable to load dashboard'
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-page">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <div className="topbar-brand">StoreRate</div>

          <div className="topbar-subtitle">
            Administration
          </div>
        </div>

        <div className="topbar-right">
          <span className="welcome-text">
            {user.name || 'Administrator'}
          </span>

          <button
            className="secondary-button"
            onClick={() => navigate('/change-password')}
          >
            Change Password
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="page-heading">
          <div>
            <h1>Admin Dashboard</h1>

            <p>
              Overview of the StoreRate platform
            </p>
          </div>
        </div>

        {error && (
          <div className="error-message dashboard-error">
            {error}
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">
              Total Users
            </div>

            <div className="stat-value">
              {dashboard.totalUsers}
            </div>

            <button
              className="card-link"
              onClick={() => navigate('/admin/users')}
            >
              View users →
            </button>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Total Stores
            </div>

            <div className="stat-value">
              {dashboard.totalStores}
            </div>

            <button
              className="card-link"
              onClick={() => navigate('/admin/stores')}
            >
              View stores →
            </button>
          </div>

          <div className="stat-card">
            <div className="stat-label">
              Submitted Ratings
            </div>

            <div className="stat-value">
              {dashboard.totalRatings}
            </div>

            <span className="stat-description">
              Ratings submitted by users
            </span>
          </div>
        </div>

        <section className="quick-actions">
          <h2>Quick Actions</h2>

          <div className="action-grid">
            <button
              className="action-card"
              onClick={() => navigate('/admin/users')}
            >
              <strong>Manage Users</strong>

              <span>
                View, search and manage users
              </span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate('/admin/stores')}
            >
              <strong>Manage Stores</strong>

              <span>
                View and manage registered stores
              </span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate('/admin/add-user')}
            >
              <strong>Add User</strong>

              <span>
                Create a user, admin or store owner
              </span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate('/admin/add-store')}
            >
              <strong>Add Store</strong>

              <span>
                Register a new store
              </span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;