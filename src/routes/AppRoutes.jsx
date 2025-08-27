import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@pages/Auth/Login";
import RegisterPage from "@pages/Auth/Register";
import ForgotPasswordPage from "@pages/Auth/ForgotPassword";
import Adminlayout from "./layout/Admin.layout";
import { DashbaordNavLinks } from "@/constant/dashboardNavigation";
import TicketDetails from "@pages/Dashboard/TicketDetails";
import { useSelector } from "react-redux";

// --------------------- ProtectedRoute ---------------------
const ProtectedRoute = ({ user, children }) => {
  if (!user && window.location.pathname === "/login") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --------------------- PublicRoute ------------------------
const PublicRoute = ({ user, children }) => {
  if (user ) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --------------------- AppRoutes --------------------------
const AppRoutes = () => {
  const user = useSelector((state) => state.Auth.user);

  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute user={user}>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute user={user}>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* ---------- Protected Routes ---------- */}
        <Route
          element={
            <ProtectedRoute user={user}>
              <Adminlayout />
            </ProtectedRoute>
          }
        >
          {DashbaordNavLinks.map((item) => (
            <Route key={item.value} path={item.value} element={item.component} />
          ))}
          <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        </Route>

        {/* ---------- Catch All ---------- */}
        <Route
          path="*"
          element={
            user ? (
              <h1 className="text-center mt-10 text-xl font-semibold">
                404 - Page Not Found
              </h1>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
