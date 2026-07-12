import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/app/AppLayout';

import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Wrapper for public auth routes
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-4 w-full">
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Auth Routes */}
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/verify-otp" element={<AuthLayout><VerifyOtp /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

          {/* Protected Private Routes with Sidebar Shell */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><Fleet /></ProtectedRoute>} />
            <Route path="/drivers" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}><Drivers /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'DRIVER']}><Trips /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><Maintenance /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}><Expenses /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER']}><Analytics /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']}><Settings /></ProtectedRoute>} />
          </Route>

          {/* Fallback routing for unknown paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;