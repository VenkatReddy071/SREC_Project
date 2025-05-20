import React from "react";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => (
  <div className="min-h-screen bg-gray-100 ">
    {/* Admin-specific navigation can go here */}
    
    <Outlet />
  </div>
);
