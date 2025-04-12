import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Fotter } from "./Components/Fotter/Fotter";
import { Heading } from "./Components/MainPage/Heading";
import { Home } from "./Components/Hospital/Home/Home";
import { MailHome } from "./Components/Mails/Home";
import { HomeScl } from "./Components/Schools";
import Loading from "./Pages/Loading"; // Import the updated Loading component

function App() {
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Simulate loading time
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1500);

  //   return () => clearTimeout(timer);
  // }, []);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <BrowserRouter>
      <div className="md:flex md:flex-col md:min-h-screen">
        <Navbar />
        <main className="md:flex-1 md:p-4">
          <Routes>
            <Route path="/" element={<Heading />} />
            <Route path="/Hospitals" element={<Home />} />
            <Route path="/malls" element={<MailHome />} />
            <Route path="/schools" element={<HomeScl />} />
          </Routes>
        </main>
        <Fotter />
      </div>
    </BrowserRouter>
  );
}

export default App;