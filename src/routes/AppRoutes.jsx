import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LoginPage from '@pages/Auth/Login';
import RegisterPage from '@pages/Auth/Register';
import ForgotPasswordPage from '@pages/Auth/ForgotPassword';
import Adminlayout from './layout/Admin.layout';
import { DashbaordNavLinks } from '@/constant/dashboardNavigation';
import TicketDetails from '@pages/Dashboard/TicketDetails';

const AppRoutes = () => {
  const user = useSelector((state) => state.Auth.user);

  // Redirect to dashboard if already logged in
  const GuestOnlyRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/" replace />; // You can set default protected page
    }
    return children;
  };

  // Redirect to login if not logged in
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>

        {/* Guest-only routes */}
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <RegisterPage />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestOnlyRoute>
              <ForgotPasswordPage />
            </GuestOnlyRoute>
          }
        />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Adminlayout />
            </ProtectedRoute>
          }
        >
          {DashbaordNavLinks.map((item) => (
            <Route key={item.value} path={item.value} element={item.component} />
          ))}
          <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
