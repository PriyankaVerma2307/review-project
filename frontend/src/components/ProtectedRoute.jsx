import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }

    return <Navigate to="/user/stores" replace />;
  }

  return children;
}

export default ProtectedRoute;