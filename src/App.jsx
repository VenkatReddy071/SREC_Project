import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import BookingPage from "./Dashboard/Hospital/Bookings/BookingPagesection"
import OffersPage from "./Pages/OffersPage"
import NotificationPage from "./Pages/NotificationPage"
import ServicePage from "./Pages/ServicePage"
import HospitalOutletInfoSection from "./Dashboard/Hospital/HospitalInfo/HospitalOutlet"
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
import FashionOutlet from "./Dashboard/Fashion/Outlet"
import FashionOverview from "./Dashboard/Fashion/OverviewPage"
import FashionOffers from "./Dashboard/Fashion/Offers"
import FashionTaxes from "./Dashboard/Fashion/Taxes";
import HospitalOverview from "./Dashboard/Hospital/Overview";
import HospitalContact from "./Dashboard/Hospital/Contact/ContactDashboard"

import LoginPage from "./user/LoginPage";
import SignUpPage from "./user/Signup";
import EmailVerificationPage from "./user/EmailVerificationPage";
import ForgotPasswordPage from "./user/ForgetPassword";

//education
import SchoolInfo from "./Dashboard/School/SchoolLayout/SchoolInfo"
import {SchoolCollegeDashboard} from "./Dashboard/School/SchoolLayout/Home"
import SchoolCollegeOverview from "./Dashboard/School/SchoolLayout/Overview"
import SchoolTeacher from "./Dashboard/School/Teacher/TeacherDashboard"
import SchoolContact from "./Dashboard/School/Contact/ContactDashboard"

import HospitalBookings from "./Components/Profile/HospitalBookins/BookingList"
import {UserProfile} from "./Components/Profile/ProfileHome";
import RestaurantOrder from "./Components/Profile/Restaurant/MyOrders"
import HospitalContactProfile from "./Components/Profile/Submission/Hospital"
import SchoolContactProfile from "./Components/Profile/Submission/School"
function App() {

  const [loading, setLoading] = useState(true);


  return (
    <div>
     <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName={() => "relative flex p-1 min-h-16 rounded-md justify-between overflow-hidden cursor-pointer bg-white text-black p-4 shadow-lg"}
        bodyClassName={() => "flex text-sm font-black font-med block p-3 bg-white"}
        style={{ zIndex:99999 }}
      />
    <BrowserRouter>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route element={<MainLayout />}>

          <Route path="/" element={<Heading />} />
          <Route path="/user-profile" element={<UserProfile/>}/>
          <Route path="/user-profile/bookings" element={<HospitalBookings/>}/>
          <Route path="/user-profile/orders" element={<RestaurantOrder/>}/>
          <Route path="/user-profile/hospital" element={<HospitalContactProfile/>}/>
          <Route path="/user-profile/education" element={<SchoolContactProfile/>}/>
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
        <Route path="/education-dashboard" element={<SchoolCollegeDashboard/>}>
        <Route index element={<SchoolCollegeOverview/>}/>
        <Route path='info' element={<SchoolInfo/>}/>
        <Route path="teachers" element={<SchoolTeacher/>}/>
        <Route path="contact" element={<SchoolContact/>}/>
        </Route>
        <Route path="/hospital-dashboard" element={<DashHomeHospital/>}>
          <Route index element={<HospitalOverview/>}/>
          <Route path="dashboard" element={<DashboardHospital/>}/>
          <Route path="doctors" element={<DoctorsSection/>}/>
          <Route path="bookings" element={<BookingPage/>}/>
          <Route path="offers" element={<OffersPage/>}/>
          <Route path="notifications" element={<NotificationPage/>}/>
          <Route path="services" element={<ServicePage/>}/>
          <Route path="contact" element={< HospitalContact/>}/>
          <Route path="outlet" element={<HospitalOutletInfoSection/>}/>
        </Route>
        <Route path="/fashion-dashboard" element={<FashionDashboard/>}>
          <Route index element={<FashionOverview/>}/>
          <Route path='products' element={<ProductsPage/>}/>
          <Route path="offers" element={<FashionOffers/>}/>
          <Route path="taxes" element={<FashionTaxes/>}/>
          <Route path='outlet' element={<FashionOutlet/>}/>
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
    </div>
  );
}

export default App;
