import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-header">
          <div className="brand-mark">S</div>
          <h1 className="home-title">StoreRate</h1>
          <p className="home-desc">
            Discover stores around you and share honest ratings with the community.
          </p>
        </div>

        <div className="home-options">
          <button
            className="home-option-card"
            onClick={() => navigate('/admin/login')}
          >
            <span className="home-option-icon">🔒</span>
            <strong>Admin</strong>
            <span className="home-option-sub">Manage users and stores</span>
          </button>

          <button
            className="home-option-card"
            onClick={() => navigate('/user')}
          >
            <span className="home-option-icon">👤</span>
            <strong>Normal User</strong>
            <span className="home-option-sub">Browse and rate stores</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

