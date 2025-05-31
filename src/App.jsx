import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Loading from "./Pages/Loading";

// Layouts
import { MainLayout } from "./Layouts/MainLayout";
import {AboutLayout} from "./Layouts/AboutSection/AboutLayout"
// Customer Pages
import { Heading } from "./Components/MainPage/Heading";
import { Home } from "./Components/Hospital/Home/Home";
import { MailHome } from "./Components/Mails/Home";
import { HomeScl } from "./Components/Schools";
import  FAQS  from "./Components/Fotter/AboutSection/FAQS";
import HospitalForm from "./Pages/Register/Hospital";
import  Support  from "./Components/Fotter/AboutSection/Support";

// Admin Layout with sidebar and footer links
import { DashHome } from "./Dashboard/Admin/DashHome/Home";

// Admin Pages
import { Dashboard } from "./Dashboard/Admin/DashHome/Dashboard";
import { Faq } from "./Dashboard/Admin/DashHome/Faq";
import { Hospital } from "./Dashboard/Admin/DashHome/Hospital";
import { Mail } from "./Dashboard/Admin/DashHome/Mail";
import { Orders } from "./Dashboard/Admin/DashHome/Orders";
import { Restaurant } from "./Dashboard/Admin/DashHome/Restaurant";
import { Schools } from "./Dashboard/Admin/DashHome/Schools";
import { Settings } from "./Dashboard/Admin/DashHome/Settings";
import { Users } from "./Dashboard/Admin/DashHome/Users";
import {Logs} from "./Dashboard/Admin/HistoryLogs/Logs"

//about Page

import { About } from "./Components/Fotter/AboutSection/About";
import DashboardLogin from "./user/DashboardLogin";
import { Type } from "./Dashboard/DashboardType/Type";


function App() {
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  // if (loading) return <Loading />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Layout */}
        
        <Route element={<MainLayout />}>
        
          <Route path="/" element={<Heading />} />
          <Route path="/hospitals" element={<Home />} />
          <Route path="/malls" element={<MailHome />} />
          <Route path="/schools" element={<HomeScl />} />
          <Route path="/Support" element={<Support/>}></Route>
          <Route path="/Faq" element={<FAQS/>}/>
        </Route>
        <Route path="/join/dashboard" element={<DashboardLogin/>}/>
        <Route path="/Register" element={<HospitalForm/>}/>
        <Route path="/dashboard/type" element={<Type/>}/>
        {/* Admin Layout -> DashHome acts as layout with footer links */}
        <Route path="/admin-dashboard" element={<DashHome />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hospitals" element={<Hospital />} />
          <Route path="restaurants" element={<Restaurant />} />
          <Route path="schools" element={<Schools />} />
          <Route path="mails" element={<Mail />} />
          <Route path="orders" element={<Orders />} />
          <Route path="offers" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="faqs" element={<Faq />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logs" element={<Logs/>}/>
        </Route>
        <Route element={<AboutLayout/>}>
            <Route path="/About-us" element={<About/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
