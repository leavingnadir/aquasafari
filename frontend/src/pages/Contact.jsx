import React, { useState } from "react";
import usePageTitle from "../hooks/usePageTitle";

export default function Contact() {
  usePageTitle("Contact Us");

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending message
    setSubmitted(true);
  };

  return (
    <div className="bg-surface min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-4xl mx-auto bg-surface-900 border border-surface-800 rounded-xl shadow-card overflow-hidden p-8 sm:p-12">
        
        <h1 className="text-3xl font-extrabold text-content-primary mb-4 font-display tracking-wide">
          Contact <span className="text-brand-500">Us</span>
        </h1>
        <p className="text-content-secondary mb-8 leading-relaxed">
          Have questions about our boat tours, bookings, or private charters? Drop us a message below or reach out directly!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="text-brand-500 text-xl font-bold">📍</div>
              <div>
                <h4 className="font-semibold text-content-primary">Location</h4>
                <p className="text-content-secondary text-sm">123 Marina Bay, Coastal Drive, Sri Lanka</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-brand-500 text-xl font-bold">📞</div>
              <div>
                <h4 className="font-semibold text-content-primary">Phone</h4>
                <p className="text-content-secondary text-sm">+94 11 234 5678</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-brand-500 text-xl font-bold">✉️</div>
              <div>
                <h4 className="font-semibold text-content-primary">Email</h4>
                <p className="text-content-secondary text-sm">support@aquasafari.lk</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div className="bg-surface-800 border border-brand-500/30 text-content-primary p-6 rounded-lg text-center backdrop-blur-sm">
                <h3 className="font-bold text-lg mb-2 text-brand-400 font-display">Message Sent!</h3>
                <p className="text-content-secondary text-sm">Thank you for reaching out. Our support team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-content-primary placeholder-content-muted focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-content-primary placeholder-content-muted focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-secondary mb-1">Message</label>
                  <textarea
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-content-primary placeholder-content-muted focus:ring-2 focus:ring-brand-500 focus:outline-none text-sm"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-600 transition shadow-md font-display tracking-wide"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
