import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoutesPage from "./pages/Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/routes" replace />} />
        <Route path="/routes" element={<RoutesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;