import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BookingPassPage } from "./pages/BookingPassPage";

import AddVehicle from "./pages/AddVehicle";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import DemandPrediction from "./pages/DemandPrediction";

import { AddVehiclePage } from "./pages/AddVehiclePage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { GuardScanPage } from "./pages/GuardScanPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking/:id/qr" element={<BookingPassPage />} />

        {/* Existing features */}
        <Route path="/vehicle/add" element={<AddVehicle />} />
        <Route path="/My-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/demand" element={<DemandPrediction />} />

        {/* New features */}
        <Route path="/vehicle/add-new" element={<AddVehiclePage />} />
        <Route path="/my-bookings-new" element={<MyBookingsPage />} />
        <Route path="/admin-new" element={<AdminDashboardPage />} />
        <Route path="/guard-scan" element={<GuardScanPage />} />

        {/* Main branch route aliases */}
        <Route path="/vehicles/add" element={<AddVehiclePage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/guard/scan" element={<GuardScanPage />} />

        {/* Unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;