import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ParentLayout } from "./layouts/ParentLayout";

import ParentDashboard from "./pages/parent/ParentDashboard";
import LiveTracking from "./pages/parent/LiveTracking";
import Notifications from "./pages/parent/Notifications";
import { TripHistory } from "./pages/parent/TripHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/parent" replace />} />

        {/* Parent routes under ParentLayout */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="tracking" element={<LiveTracking />} />
          <Route path="history" element={<TripHistory />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/parent" replace />} />
      </Routes>
    </BrowserRouter>
  );
}