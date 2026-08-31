import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import ComingSoon from "./pages/ComingSoon.jsx";


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

          <Route path="/payment/checkout" element={<ProcessPayment />} />
          <Route path="/payment/history" element={<PaymentHistory />} />
          <Route path="/payment/records" element={<PaymentRecords />} />

          {/* Placeholder routes — replace each with the owning member's page.
              e.g. teammates working on boat/booking/feedback/payment/trip/usernadmin
              modules can swap these for their real page components. */}
          <Route path="/search" element={<ComingSoon title="Boat search" />} />
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
