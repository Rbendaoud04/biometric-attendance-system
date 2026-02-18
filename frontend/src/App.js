// ============================================================
// App.js - Main Application Component
// Biometric Attendance System
// ============================================================

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import { ToastProvider } from "./components/Toast";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import ScanPage from "./pages/ScanPage";
import SuccessPage from "./pages/SuccessPage";

// Layout wrapper for user pages (with optional navbar)
const UserLayout = ({ children }) => {
  return <div className="user-layout">{children}</div>;
};

// Admin layout (standalone, no navbar)
const AdminLayout = ({ children }) => {
  return <div className="admin-layout">{children}</div>;
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Landing Page - Home */}
            <Route
              path="/"
              element={
                <UserLayout>
                  <LandingPage />
                </UserLayout>
              }
            />

            {/* User Registration Flow */}
            <Route
              path="/register"
              element={
                <UserLayout>
                  <RegistrationPage />
                </UserLayout>
              }
            />

            {/* Attendance Marking */}
            <Route
              path="/scan"
              element={
                <UserLayout>
                  <ScanPage />
                </UserLayout>
              }
            />

            {/* Success Page */}
            <Route
              path="/success"
              element={
                <UserLayout>
                  <SuccessPage />
                </UserLayout>
              }
            />

            {/* Admin Dashboard - Separate Layout */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
