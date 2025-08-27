import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@pages/Auth/Login";
import RegisterPage from "@pages/Auth/Register";
import ForgotPasswordPage from "@pages/Auth/ForgotPassword";
import Adminlayout from "./layout/Admin.layout";
import { DashbaordNavLinks } from "@/constant/dashboardNavigation";
import TicketDetails from "@pages/Dashboard/TicketDetails";
import { useSelector } from "react-redux";

const AppRoutes = () => {

  const user = useSelector((state) => state.Auth.user)
  return (
    <Router>
      <Routes>
        {!user && <> <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} /> </>}
        {user ? <Route element={<Adminlayout />}>
          {DashbaordNavLinks.map((item) => <Route key={item.value} path={item.value} element={item.component} />)}
          <Route path="/tickets/:ticketId" element={<TicketDetails />} />
        </Route> : <Route path="*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </Router>
  );
};

export default AppRoutes;