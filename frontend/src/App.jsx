import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import UserAuth from './pages/UserAuth';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ChangePassword from './pages/ChangePassword';

import AdminDashboard from './pages/AdminDashboard';
import UserStores from './pages/UserStores';
import AdminUsers from "./pages/AdminUsers";
import AdminAddUser from "./pages/AdminAddUser";
import AdminUserDetails from './pages/AdminUserDetails';
import AdminStores from './pages/AdminStores';
import AdminAddStore from './pages/AdminAddStore';
import OwnerDashboard from './pages/OwnerDashboard';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/user" element={<UserAuth />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={["admin", "user", "owner"]}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-user"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAddUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/users/:id" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUserDetails /></ProtectedRoute>} />
      <Route path="/admin/stores" element={<ProtectedRoute allowedRoles={["admin"]}><AdminStores /></ProtectedRoute>} />
      <Route path="/admin/add-store" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAddStore /></ProtectedRoute>} />

      <Route
        path="/user/stores"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserStores />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
