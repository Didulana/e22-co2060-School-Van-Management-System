import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrackingMap from "./pages/parent/LiveTracking";
import Notifications from "./pages/parent/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TrackingMap />} />
        <Route path="/tracking" element={<TrackingMap />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
}