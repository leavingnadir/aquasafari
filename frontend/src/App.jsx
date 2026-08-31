import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";

// Boat module
import BoatManagement from "./pages/boat/BoatManagement.jsx";

// Booking module
import SearchTrips from "./pages/booking/SearchTrips.jsx";
import MyBookings from "./pages/booking/MyBookings.jsx";

//payment module
import ProcessPayment from "./pages/payment/ProcessPayment.jsx";
import PaymentHistory from "./pages/payment/PaymentHistory.jsx";
import PaymentRecords from "./pages/payment/PaymentRecords.jsx";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Boat module */}
          <Route path="/boat/manage" element={<BoatManagement />} />

           {/* Booking module */}
          <Route path="/search" element={<SearchTrips />} />
          <Route path="/booking/my-bookings" element={<MyBookings />} />

          {/* Payment module */}
          <Route path="/payment/checkout" element={<ProcessPayment />} />
          <Route path="/payment/history" element={<PaymentHistory />} />
          <Route path="/payment/records" element={<PaymentRecords />} />
          
          <Route path="/destinations" element={<ComingSoon title="Destinations" />} />
          <Route path="/how-it-works" element={<ComingSoon title="How it works" />} />
          <Route path="/login" element={<ComingSoon title="Login" />} />
          <Route path="/help" element={<ComingSoon title="Help Center" />} />
          <Route path="/terms" element={<ComingSoon title="Terms & Conditions" />} />
          <Route path="/privacy" element={<ComingSoon title="Privacy Policy" />} />
          <Route path="/cancellation" element={<ComingSoon title="Cancellation Policy" />} />
          <Route path="/about" element={<ComingSoon title="About Us" />} />
          <Route path="/contact" element={<ComingSoon title="Contact" />} />

          <Route path="*" element={<ComingSoon title="Page" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
