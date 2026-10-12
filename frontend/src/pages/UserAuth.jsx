import { Link } from 'react-router-dom';

function UserAuth() {
  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-header">
          <div className="brand-mark">S</div>
          <h1 className="home-title">Normal User</h1>
          <p className="home-desc">
            Sign in to your account or create a new one to start rating stores.
          </p>
        </div>

        <div className="home-options">
          <Link to="/login" className="home-option-card">
            <span className="home-option-icon">🔑</span>
            <strong>Login</strong>
            <span className="home-option-sub">Sign in to your account</span>
          </Link>

          <Link to="/signup" className="home-option-card">
            <span className="home-option-icon">📝</span>
            <strong>Sign Up</strong>
            <span className="home-option-sub">Create a new account</span>
          </Link>
        </div>

        <div className="auth-footer" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
          <Link to="/">← Back to main page</Link>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;

