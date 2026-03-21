import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

export default App;
