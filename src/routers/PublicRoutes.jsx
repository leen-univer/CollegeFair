import {
  ForgotPassword,
  Home,
  Login,
  Register,
  StudentRegistration,
} from "pages";
import { Routes, Route } from "react-router-dom";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/university-register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/:schoolName/:fairName/:schoolId/:fairId"
        element={<StudentRegistration />}
      />
    </Routes>
  );
};

export default PublicRoutes;
