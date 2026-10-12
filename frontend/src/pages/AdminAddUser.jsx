import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminAddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();
    const password = formData.password;

    if (!name || !email || !password || !address) {
      return "All fields are required";
    }

    if (name.length < 20 || name.length > 60) {
      return "Name must be between 20 and 60 characters";
    }

    if (address.length > 400) {
      return "Address cannot exceed 400 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }

    if (password.length < 8 || password.length > 16) {
      return "Password must be 8-16 characters";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Password must contain at least one special character";
    }

    if (!["user", "admin", "owner"].includes(formData.role)) {
      return "Please select a valid role";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admin/users", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        address: formData.address.trim(),
        role: formData.role,
      });

      setSuccess(response.data?.message || "User created successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Unable to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUsers = () => {
    navigate("/admin/users");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div>
          <div className="topbar-brand">StoreRate</div>

          <div className="topbar-subtitle">Add User</div>
        </div>

        <div className="topbar-right">
          <span className="welcome-text">{user.name || "Administrator"}</span>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>

          <button
            type="button"
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
            <h1>Add User</h1>

            <p>Create a new StoreRate account.</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={handleBackToUsers}
          >
            Back to Users
          </button>
        </div>

        <div className="form-card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                maxLength={60}
              />

              <small>20-60 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                maxLength={400}
                rows={4}
              />

              <small>Maximum 400 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
              />

              <small>8-16 characters, 1 uppercase, 1 special character</small>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Normal User</option>

                <option value="admin">System Administrator</option>

                <option value="owner">Store Owner</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}

            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading ? "Creating user..." : "Create User"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleBackToUsers}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AdminAddUser;
