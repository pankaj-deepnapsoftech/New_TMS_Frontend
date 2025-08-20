import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@pages/Auth/Login";
import RegisterPage from "@pages/Auth/Register";
import ForgotPasswordPage from "@pages/Auth/ForgotPassword";
import Adminlayout from "./layout/Admin.layout";
import { DashbaordNavLinks } from "@/constant/dashboardNavigation";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<Adminlayout />}>
          {DashbaordNavLinks.map((item) => <Route key={item.value} path={item.value} element={item.component} />)}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
