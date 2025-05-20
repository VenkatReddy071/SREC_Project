import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../Navbar";
import { Fotter } from "../Components/Fotter/Fotter";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const MainLayout = () => (
  <div className="md:flex md:flex-col md:min-h-screen">
    <Navbar />
    <ToastContainer position="top-right" autoClose={3000} />
    <main className="md:flex-1 md:p-4">
      <Outlet />
    </main>
    <Fotter />
  </div>
);
