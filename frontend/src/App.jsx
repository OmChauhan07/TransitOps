import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Fleet from './pages/Fleet';
import Drivers from './pages/Drivers';

// Wrapper for public auth routes
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 w-full">
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Catch-all to send root traffic directly to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Public Auth Routes */}
          <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
          <Route path="/verify-otp" element={<AuthLayout><VerifyOtp /></AuthLayout>} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
          <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
          
          {/* Protected Private Routes with Sidebar Shell */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/fleet" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><Fleet /></ProtectedRoute>} />
            <Route path="/drivers" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'SAFETY_OFFICER']}><Drivers /></ProtectedRoute>} />
            <Route path="/trips" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'DRIVER']}><div className="text-slate-100 p-8">Trip Dispatch Placeholder</div></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER']}><div className="text-slate-100 p-8">Maintenance Logs Placeholder</div></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST']}><div className="text-slate-100 p-8">Fuel & Expenses Placeholder</div></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER']}><div className="text-slate-100 p-8">Analytics Dashboard Placeholder</div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['FLEET_MANAGER', 'DRIVER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST']}><div className="text-slate-100 p-8">Settings Placeholder</div></ProtectedRoute>} />
          </Route>

          {/* Fallback routing for unknown paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;