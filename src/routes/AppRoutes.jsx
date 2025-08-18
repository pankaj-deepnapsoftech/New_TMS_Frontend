import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@pages/Auth/Login";
import RegisterPage from "@pages/Auth/Register";
import ForgotPasswordPage from "@pages/Auth/ForgotPassword";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
