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
import { HomeScl } from "./Components/Schools/Schools";
import LearnDepartment from "./Components/Hospital/Home/AboutDepartment"
import  Meet from "./Components/Hospital/Home/Meet"
import OurServicePage from "./Components/Hospital/Home/OurService"
import Technology from "./Components/Hospital/Home/ExploreTechnologyPage"
import LearnMore from "./Components/Hospital/Home/LearnMore"
import  FAQS  from "./Components/Fotter/AboutSection/FAQS";
import HospitalForm from "./Pages/Register/Hospital";
import  Support  from "./Components/Fotter/AboutSection/Support";
import MainServicePage from "./Components/Hospital/ShowCaseSection/Service/ServicePage"
import {RestaurantHomePage} from "./Components/Dining/Restaurant"

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


//hospital dashboard 
import {DashHomeHospital}from "./Dashboard/Hospital/Home";
import { DashboardHospital } from "./Dashboard/Hospital/DashboardHospital";
import DoctorsSection from "./Dashboard/Hospital/DoctorSection"
import BookingPage from "./Pages/BookingPage"
import OffersPage from "./Pages/OffersPage"
import NotificationPage from "./Pages/NotificationPage"
import ServicePage from "./Pages/ServicePage"

//fashion dashboard
import {FashionDashboard} from "./Dashboard/Fashion/Home"
import {DashboardHome} from "./Dashboard/Fashion/DashboardHome"
import {ProductsPage} from "./Dashboard/Fashion/Product"
import {OrdersPage}from "./Dashboard/Fashion/OrdersPage"


//restaurantdashboard
import {RestaurantDashboard} from "./Dashboard/RestaurantDa/Home"
import RestaurantMenu from "./Dashboard/RestaurantDa/MenuRestaurantDashboard"
import {RestaurantOrdersPage} from "./Dashboard/RestaurantDa/OrderPage"
//about Page
import {Login} from "./user/Login";
import { About } from "./Components/Fotter/AboutSection/About";
import DashboardLogin from "./user/DashboardLogin";
import { Type } from "./Dashboard/DashboardType/Type";
import { SectionType } from "./Components/Hospital/HospitalSection/SectionType";
import Overview from "./Components/Hospital/ShowCaseSection/Overview/Overview";
import CheckoutPage from "./Components/Mails/CheckoutPage";
import ResOverview from "./Dashboard/RestaurantDa/OverviewPage"
import RestaurantOffersDashboard from "./Dashboard/RestaurantDa/Offers"
import OutletInfoPage from "./Dashboard/RestaurantDa/Outlet"
import TaxesAndCharges from "./Dashboard/RestaurantDa/TaxesAndCarges"
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
        <Route path="/login" element={<Login/>}/>
        <Route element={<MainLayout />}>

          <Route path="/" element={<Heading />} />
          <Route path="/hospitals" element={<Home />} />
          <Route path="/malls" element={<MailHome />} />
          <Route path="/schools" element={<HomeScl />} />
          <Route path="/restaurants" element={<RestaurantHomePage/>}/>
          <Route path="/Support" element={<Support/>}></Route>
          <Route path="/showcase/page/" element={<SectionType/>}/>
          <Route path="/Faq" element={<FAQS/>}/>
          <Route path="/learn-more" element={<LearnMore/>}/>
          <Route path="/explore-service" element={<OurServicePage/>}/>
          <Route path="/explore-technology" element={<Technology/>}/>
          <Route path="/learn-department" element={<LearnDepartment/>}/>
          <Route path="/join-team" element={<Meet/>}/>
          <Route path="/services" element={<MainServicePage/>}/>
          
        </Route>
        <Route path="/checkout" element={<CheckoutPage/>}/>
        <Route path="/Register" element={<HospitalForm/>}/>
        <Route path="/join/dashboard" element={<DashboardLogin/>}/>
        <Route path="/dashboard/type" element={<Type/>}/>
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

        <Route path="/hospital-dashboard" element={<DashHomeHospital/>}>
          <Route index element={<DashboardHospital/>}/>
          <Route path="dashboard" element={<DashboardHospital/>}/>
          <Route path="doctors" element={<DoctorsSection/>}/>
          <Route path="bookings" element={<BookingPage/>}/>
          <Route path="offers" element={<OffersPage/>}/>
          <Route path="notifications" element={<NotificationPage/>}/>
          <Route path="services" element={<ServicePage/>}/>
        </Route>
        <Route path="/fashion-dashboard" element={<FashionDashboard/>}>
          <Route index element={<DashboardHome/>}/>
          <Route path='products' element={<ProductsPage/>}/>
          <Route path='orders'element={<OrdersPage/>}/>
        </Route>
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard/>}>
          <Route index element={<ResOverview/>}/>
          <Route path='/restaurant-dashboard/offers' element={<RestaurantOffersDashboard/>}/>
          <Route path="/restaurant-dashboard/menu" element={<RestaurantMenu/>}/>
          <Route path="/restaurant-dashboard/orders" element={<RestaurantOrdersPage/>}/>
          <Route path="/restaurant-dashboard/outlet" element={<OutletInfoPage/>}/>
          <Route path="/restaurant-dashboard/taxes" element={<TaxesAndCharges/>}/>
        </Route>
        <Route element={<AboutLayout/>}>
            <Route path="/About-us" element={<About/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
