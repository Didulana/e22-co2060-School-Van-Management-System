import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoutesPage from "./pages/Routes";
import TrackingPage from "./pages/parent/TrackingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth login page from feature/auth-frontend */}
        <Route path="/login" element={<LoginPage />} />

        {/* default redirect to admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* admin dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* route management page */}
        <Route path="/routes" element={<RoutesPage />} />

        {/* parental tracking page */}
        <Route path="/tracking" element={<TrackingPage />} />

        {/* catch-all fallback to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
