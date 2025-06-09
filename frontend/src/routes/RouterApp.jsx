import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import { useAuthContext } from "../auth/AuthProvider";
import HomePage from "../pages/HomePage.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import ProfilePage from "../pages/ProfilePage.jsx";
import OrderPage from "../pages/OrderPage.jsx";
import UnauthorizedPage from "../pages/UnauthorizedPage.jsx";

// Admin imports
import DashboardPesananPage from "../pages/admin/DashboardPesananPage.jsx";
import DashboardMenuPage from "../pages/admin/DashboardMenuPage.jsx";
import InputMenuPage from "../pages/admin/InputMenuPage.jsx";
import EditMenuPage from "../pages/admin/EditMenuPage.jsx";

const RouterApp = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <Router>
      <Routes>
        {/* Public routes - accessible by anyone */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Admin routes - only accessible by admin role */}
        <Route path="/admin">
          <Route
            path="dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardPesananPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="menu"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="input-menu"
            element={
              <ProtectedRoute requiredRole="admin">
                <InputMenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-menu/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditMenuPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Protected user routes - accessible by any authenticated user */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default RouterApp;