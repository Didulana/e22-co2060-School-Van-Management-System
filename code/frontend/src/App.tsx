import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoutesPage from "./pages/Routes";
import TrackingPage from "./pages/parent/TrackingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default redirect */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        {/* admin dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        {/* route management page from develop branch */}
        <Route path="/routes" element={<RoutesPage />} />
        {/* parental tracking page */}
        <Route path="/tracking" element={<TrackingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
