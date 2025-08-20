import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@pages/Auth/Login";
import RegisterPage from "@pages/Auth/Register";
import ForgotPasswordPage from "@pages/Auth/ForgotPassword";
import MainDashboard from "@pages/Dashboard/Home";
import Adminlayout from "./layout/Admin.layout";
import DepartmentTable from "@pages/Dashboard/Department";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<Adminlayout />}>
          <Route path="/home" element={<MainDashboard />} />
          <Route path="/department" element={<DepartmentTable/>}/>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
