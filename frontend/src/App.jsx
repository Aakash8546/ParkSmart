import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { BookingPassPage } from './pages/BookingPassPage';
import { AddVehiclePage } from './pages/AddVehiclePage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { GuardScanPage } from './pages/GuardScanPage';
import { DemandPredictionPage } from './pages/DemandPredictionPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/booking/:id/qr" element={<BookingPassPage />} />
        <Route path="/vehicles/add" element={<AddVehiclePage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        
        {/* Admin Restricted Route (RBAC) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Guard & Admin Restricted Route (RBAC) */}
        <Route
          path="/guard/scan"
          element={
            <ProtectedRoute allowedRoles={['GUARD', 'ADMIN']}>
              <GuardScanPage />
            </ProtectedRoute>
          }
        />

        <Route path="/demand-prediction" element={<DemandPredictionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
