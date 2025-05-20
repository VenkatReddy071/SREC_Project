import React from 'react'
import { Outlet } from "react-router-dom";
import { AboutNavbar } from '../../Components/Fotter/AboutSection/AboutNavbar';
export const AboutLayout = () => {
  return (
    
        <div className="md:flex md:flex-col md:min-h-screen">
            <AboutNavbar />
            
            <main className="md:flex-1 md:p-4">
              <Outlet />
            </main>
            
    </div>
  )
}
