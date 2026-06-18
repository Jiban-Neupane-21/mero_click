import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPortal from "../admin";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* The base path '/' here corresponds to '/admin' from App.tsx */}
      <Route path="/" element={<AdminPortal />} />
    </Routes>
  );
}
