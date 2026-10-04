import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingPassPage } from './pages/BookingPassPage';
import AddVehicle from "./pages/AddVehicle";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import DemandPrediction from "./pages/DemandPrediction";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking/:id/qr" element={<BookingPassPage />} />
        <Route path="/vehicles/add" element={<AddVehicle />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/demand" element={<DemandPrediction />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
