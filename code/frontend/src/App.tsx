import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoutesPage from "./pages/Routes";
import TrackingPage from "./pages/parent/TrackingPage";
import DriverDashboard from "./pages/driver/DriverDashboard";
import AttendancePage from "./pages/driver/AttendancePage";
import AnnouncementPage from "./pages/driver/AnnouncementPage";
import SidebarLayout from "./components/SidebarLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth login page (no sidebar) */}
        <Route path="/login" element={<LoginPage />} />

        {/* pages wrapped in sidebar layout */}
        <Route element={<SidebarLayout />}>
          {/* default redirect to admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          {/* admin dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* route management page */}
          <Route path="/routes" element={<RoutesPage />} />
          {/* parental tracking page */}
          <Route path="/tracking" element={<TrackingPage />} />
          {/* driver pages */}
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/attendance" element={<AttendancePage />} />
          <Route path="/driver/announce" element={<AnnouncementPage />} />
        </Route>

        {/* catch-all fallback to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

