import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { ParentLayout } from "./layouts/ParentLayout";
// import { AdminLayout } from "./layouts/AdminLayout";
// import { DriverLayout } from "./layouts/DriverLayout";

// Parent pages
import ParentDashboard from "./pages/parent/ParentDashboard";
import LiveTracking from "./pages/parent/LiveTracking";
import Notifications from "./pages/parent/Notifications";
import { TripHistory } from "./pages/parent/TripHistory";

// Public/Auth
import RoleSelect from "./pages/RoleSelect";

// Admin pages (uncomment when you add them)
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminStudents from "./pages/admin/AdminStudents";
// import AdminVehicles from "./pages/admin/AdminVehicles";
// import AdminRoutes from "./pages/admin/AdminRoutes";
// import AdminTracking from "./pages/admin/AdminTracking";
// import AdminSettings from "./pages/admin/AdminSettings";

// Driver pages (uncomment when you add them)
// import DriverDashboard from "./pages/driver/DriverDashboard";
// import RouteOverview from "./pages/driver/RouteOverview";
// import TripControls from "./pages/driver/TripControls";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Entry */}
        <Route path="/" element={<Navigate to="/role" replace />} />
        <Route path="/role" element={<RoleSelect />} />

        {/* Parent routes */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="tracking" element={<LiveTracking />} />
          <Route path="history" element={<TripHistory />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Admin routes (enable when Admin pages/layout exist) */}
        {/*
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="vehicles" element={<AdminVehicles />} />
          <Route path="routes" element={<AdminRoutes />} />
          <Route path="tracking" element={<AdminTracking />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        */}

        {/* Driver routes (enable when Driver pages/layout exist) */}
        {/*
        <Route path="/driver" element={<DriverLayout />}>
          <Route index element={<DriverDashboard />} />
          <Route path="route" element={<RouteOverview />} />
          <Route path="trip" element={<TripControls />} />
        </Route>
        */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/role" replace />} />
      </Routes>
    </BrowserRouter>
  );
}