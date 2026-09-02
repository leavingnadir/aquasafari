import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// Boat module
import BoatManagement from "./pages/boat/BoatManagement.jsx";
import PublicBoatsPage from "./pages/boat/PublicBoatsPage.jsx";

// Booking module
import SearchTrips from "./pages/booking/SearchTrips.jsx";
import MyBookings from "./pages/booking/MyBookings.jsx";

// Payment module
import ProcessPayment from "./pages/payment/ProcessPayment.jsx";
import PaymentHistory from "./pages/payment/PaymentHistory.jsx";
import PaymentRecords from "./pages/payment/PaymentRecords.jsx";

// User & Admin module
import AdminDashboard from "./pages/usernadmin/AdminDashboard.jsx";
import CustomerManagement from "./pages/usernadmin/CustomerManagement.jsx";
import Login from "./pages/usernadmin/Login.jsx";
import Register from "./pages/usernadmin/Register.jsx";
import StaffManagement from "./pages/usernadmin/StaffManagement.jsx";

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-surface font-body text-content-primary">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Auth - public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin only */}
            <Route 
              path="/admin/staff" 
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <StaffManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/customers" 
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <CustomerManagement />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={["ADMIN", "ADMINISTRATOR"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Boat module (Restricted to Admin / Boat Operator) */}
            <Route 
              path="/boat/manage" 
              element={
                <ProtectedRoute roles={["ADMIN", "BOAT_OPERATOR"]}>
                  <BoatManagement />
                </ProtectedRoute>
              } 
            />

            {/* Booking module */}
            <Route path="/search" element={<SearchTrips />} />
            <Route 
              path="/booking/my-bookings" 
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />

            {/* Payment module */}
            <Route 
              path="/payment/checkout" 
              element={
                <ProtectedRoute>
                  <ProcessPayment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment/history" 
              element={
                <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
                  <PaymentHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment/records" 
              element={
                <ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}>
                  <PaymentRecords />
                </ProtectedRoute>
              } 
            />

            {/* Utility & Info pages */}
            <Route path="/help" element={<ComingSoon title="Help Center" />} />
            <Route path="/terms" element={<ComingSoon title="Terms & Conditions" />} />
            <Route path="/privacy" element={<ComingSoon title="Privacy Policy" />} />
            <Route path="/cancellation" element={<ComingSoon title="Cancellation Policy" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/boats" element={<PublicBoatsPage />} />

            {/* Catch-all 404 */}
            <Route path="*" element={<ComingSoon title="Page" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
