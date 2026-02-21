import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrackingMap from "./pages/TrackingMap";
import Notifications from "./pages/Notifications";

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