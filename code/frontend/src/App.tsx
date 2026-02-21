import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LiveTracking from "./pages/parent/LiveTracking";
import Notifications from "./pages/parent/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/parent/live-tracking" replace />} />
        <Route path="/parent/live-tracking" element={<LiveTracking />} />
        <Route path="/parent/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}