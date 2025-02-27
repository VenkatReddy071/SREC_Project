import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./Components/Login";
import DashboardPage from "./Components/Dashboard/DashboardPage";

function MenuPage() {
  return <h1>Menu Page</h1>;
}

function OffersPage() {
  return <h1>Offers Page</h1>;
}

function UploadPage() {
  return <h1>Upload Page</h1>;
}

function OrdersPage() {
  return <h1>Orders Page</h1>;
}

function SettingsPage() {
  return <h1>Settings Page</h1>;
}

function App() {
  return (
    <Router>
      <Dashboard>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Dashboard>
    </Router>
  );
}

export default App;
