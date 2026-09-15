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
import DestinationsPage from "./pages/DestinationsPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CancellationPage from "./pages/CancellationPage";

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

// Trip module
import TripList from "./pages/trip/TripList.jsx";
import TripForm from "./pages/trip/TripForm.jsx";
import AssignBoat from "./pages/trip/AssignBoat.jsx";
import PublicTrips from "./pages/trip/PublicTrips.jsx";

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

            {/* Trip module*/}
            <Route
              path="/trips"
              element={
                <ProtectedRoute roles={["ADMIN", "ADMINISTRATOR", "BOAT_OPERATOR", "TOUR_GUIDE"]}>
                  <TripList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/new"
              element={
                <ProtectedRoute roles={["ADMIN", "ADMINISTRATOR"]}>
                  <TripForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/edit"
              element={
                <ProtectedRoute roles={["ADMIN", "ADMINISTRATOR"]}>
                  <TripForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips/:id/assign"
              element={
                <ProtectedRoute roles={["ADMIN", "ADMINISTRATOR"]}>
                  <AssignBoat />
                </ProtectedRoute>
              }
            />
            {/* Public trip listing - customers browse without logging in.
                NOTE: this may overlap with the Booking module's /search page
                (SearchTrips.jsx below). Agree with that teammate on a single
                trip-listing route before shipping both. */}
            <Route path="/safaris" element={<PublicTrips />} />

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
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cancellation" element={<CancellationPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/destinations" element={<DestinationsPage />} />
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