import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "../admin/AdminPanel";
import Login from "../admin/Login";

export default function AdminRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <AdminPanel userEmail={userEmail} onLogout={handleLogout} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        }
      />
    </Routes>
  );
}
