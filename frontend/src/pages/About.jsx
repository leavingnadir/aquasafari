import React from "react";
import usePageTitle from "../hooks/usePageTitle";

export default function About() {
  usePageTitle("About Us");

  return (
    // pt-24 pushes the content down so it doesn't hide behind a fixed/sticky navbar
    <div className="bg-surface min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-4xl mx-auto bg-surface-900 border border-surface-800 rounded-xl shadow-card overflow-hidden p-8 sm:p-12">
        
        {/* Main Title */}
        <h1 className="text-3xl font-extrabold text-content-primary mb-6 border-b border-surface-800 pb-4 font-display tracking-wide">
          About <span className="text-brand-500">Aqua Safari</span>
        </h1>
        
        {/* Intro Paragraph */}
        <p className="text-lg text-content-secondary mb-8 leading-relaxed">
          Welcome to <span className="font-semibold text-brand-400">Aqua Safari</span>, your premier destination for breathtaking water tours, marine adventures, and unforgettable island experiences. Founded with a passion for the ocean and a commitment to safe, eco-friendly navigation, we bring modern fleet management and exceptional customer service together.
        </p>

        {/* Info Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          
          <div className="bg-surface-800/50 p-6 rounded-lg border border-surface-800 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-content-primary mb-2 font-display">Our Mission</h3>
            <p className="text-content-secondary text-sm leading-relaxed">
              To provide thrilling, safe, and reliable water-based tours while preserving marine ecosystems and delivering world-class hospitality to every passenger.
            </p>
          </div>

          <div className="bg-surface-800/50 p-6 rounded-lg border border-surface-800 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-content-primary mb-2 font-display">Our Fleet</h3>
            <p className="text-content-secondary text-sm leading-relaxed">
              Our modern fleet consists of top-tier, well-maintained boats operated by certified professionals, ensuring comfort, speed, and absolute safety on every voyage.
            </p>
          </div>

        </div>

        {/* Why Choose Us Section */}
        <h2 className="text-2xl font-bold text-content-primary mt-10 mb-4 font-display">Why Choose Us?</h2>
        <ul className="space-y-3 text-content-secondary">
          <li className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
            <span>Expertly trained tour guides and licensed boat operators.</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
            <span>Seamless online booking, real-time trip tracking, and secure checkout.</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
            <span>Rigorous daily boat condition checks and safety standards.</span>
          </li>
          <li className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
            <span>Dedicated customer support ready to assist with your travel plans.</span>
          </li>
        </ul>

      </div>
    </div>
  );
}
