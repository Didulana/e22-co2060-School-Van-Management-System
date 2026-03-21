import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoutesPage from "./pages/Routes";
import TrackingPage from "./pages/parent/TrackingPage";
import DriverDashboard from "./pages/driver/DriverDashboard";
import AttendancePage from "./pages/driver/AttendancePage";
import AnnouncementPage from "./pages/driver/AnnouncementPage";
import SidebarLayout from "./components/SidebarLayout";
import { AuthProvider } from "./features/auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* auth login page (no sidebar) */}
          <Route path="/login" element={<LoginPage />} />

          {/* pages wrapped in sidebar layout */}
          <Route element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }>
            {/* default redirect handled by ProtectedRoute, but keep a fallback */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* admin dashboard */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* route management page */}
            <Route path="/routes" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <RoutesPage />
              </ProtectedRoute>
            } />
            
            {/* parental tracking page */}
            <Route path="/tracking" element={
              <ProtectedRoute allowedRoles={["parent"]}>
                <TrackingPage />
              </ProtectedRoute>
            } />
            
            {/* driver pages */}
            <Route path="/driver" element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <DriverDashboard />
              </ProtectedRoute>
            } />
            <Route path="/driver/attendance" element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <AttendancePage />
              </ProtectedRoute>
            } />
            <Route path="/driver/announce" element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <AnnouncementPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* catch-all fallback to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

