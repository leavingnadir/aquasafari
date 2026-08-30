import React, { useState } from "react";
import {
  MapPin,
  Star,
  ArrowUpRight,
  Compass,
  Plus,
  X,
  Anchor,
  ShieldCheck,
  Waves,
  Globe,
  Navigation,
  Radio,
  ArrowRight,
  Shield
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  BOATS,
  DESTINATIONS,
  ACTIVITIES,
  TESTIMONIALS,
  FAQS,
} from "../data/homeContent.js";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedBoats />
      <GlobalSafariFacts/>
      <Destinations />
      <Testimonials />
      <FAQ />
      <OceanHorizonBanner/>
    </>
  );
}

/* ---------------------------------- Hero --------------------------------- */

const HERO_IMAGE = "src/assets/images/hero.jpg"; 
const AVATAR_1 = "https://i.pravatar.cc/100?img=11";
const AVATAR_2 = "https://i.pravatar.cc/100?img=12";
const AVATAR_3 = "https://i.pravatar.cc/100?img=13";

function Hero() {
  return (
    <section className="relative flex h-screen min-h-[800px] w-full flex-col justify-between overflow-hidden bg-surface text-content-primary font-body">
      {/* Background Image & Overlay Gradients */}
      <img
        src={HERO_IMAGE}
        alt="Cargo ship fleet on the ocean"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/40 to-surface" />

      {/* Main Hero Content */}
      <div className="relative z-10 flex flex-1 flex-col justify-center container-page pt-20">
        <div className="max-w-4xl">
          
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-surface-800 bg-surface-900/80 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-content-secondary backdrop-blur-md sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            Powering Next-Gen Boat Management
          </div>

          {/* Headline - Using font-display for massive impact */}
          <h1 className="font-display text-5xl font-normal leading-[1.05] tracking-tight text-content-primary sm:text-7xl lg:text-[6rem]">
            Built for Oceans.<br />
            <span className="text-brand-500">Trusted by fleets.</span>
          </h1>

          {/* Sub-actions & Social Proof */}
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <a 
              href="#demo" 
              className="flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-surface transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              Get Started
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface text-white">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src={AVATAR_1} alt="User 1" className="h-11 w-11 rounded-full border-2 border-surface object-cover" />
                <img src={AVATAR_2} alt="User 2" className="h-11 w-11 rounded-full border-2 border-surface object-cover" />
                <img src={AVATAR_3} alt="User 3" className="h-11 w-11 rounded-full border-2 border-surface object-cover" />
              </div>
              <p className="text-xs font-medium leading-tight text-content-secondary">
                Trusted by <strong className="text-content-primary">15+ industry</strong><br />leaders worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- BOATS --------------------------------- */

function FeaturedBoats() {
  return (
    <section className="container-page py-20">
      <div className="mb-8 flex items-end justify-between">
        <div>
          {/* Updated text colors to match the dark theme */}
          <p className="eyebrow">Curated Fleet</p>
          <h2 className="mt-2 font-display text-3xl text-content-primary sm:text-4xl">
            Book the Best
          </h2>
        </div>
        <p className="hidden max-w-xs text-sm text-content-secondary sm:block">
          A range of vetted boats for every crew size and budget, from speedboats to sailing
          yachts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {BOATS.map((b) => (
          <BoatCard key={b.name} boat={b} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Boat Card ----------------------------- */

function BoatCard({ boat }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-surface-900 shadow-card">
      {/* --- Image Section with Seamless Gradient Fade --- */}
      <div className="relative h-64 w-full shrink-0">
        <img
          src={boat.img}
          alt={boat.name}
          className="h-full w-full object-cover transition-transform duration-700"
        />
        {/* The gradient fades from the image into the exact background color of the card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent" />
      </div>

      {/* --- Content Section --- */}
      <div className="relative z-10 flex grow flex-col px-6 pb-6 pt-2">
        
        {/* Title & Price Row */}
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold tracking-tight text-content-primary">
            {boat.name}
          </h3>
          <div className="whitespace-nowrap rounded-full bg-surface/80 px-3 py-1.5 text-sm font-semibold text-content-primary backdrop-blur-md">
            {boat.price}
          </div>
        </div>

        {/* Description Paragraph (Constructed from data to match the layout) */}
        <p className="mt-3 text-sm leading-relaxed text-content-secondary line-clamp-3">
          Set sail in {boat.place}. This beautiful vessel offers {boat.cabins} cabins and breathtaking views, perfect for up to {boat.people} people.
        </p>

        {/* Pill Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-1 rounded-full bg-surface-800 px-3 py-1.5 text-xs font-medium text-content-secondary">
            <Star size={12} className="text-brand-500" fill="currentColor" />
            Top Rated
          </span>
          <span className="rounded-full bg-surface-800 px-3 py-1.5 text-xs font-medium text-content-secondary">
            {boat.dates} stay
          </span>
          <span className="rounded-full bg-surface-800 px-3 py-1.5 text-xs font-medium text-content-secondary">
            {boat.length}
          </span>
        </div>

        {/* Full-width CTA Button */}
        <button className="mt-6 w-full rounded-2xl bg-white py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-95">
          Reserve
        </button>
      </div>
    </article>
  );
}

/* ------------------------------ FACTS SECTION  ----------------------------- */

function GlobalSafariFacts() {
  return (
    <section className="container-page py-24">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-500">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            Global Industry Insights
          </div>
          <h2 className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-content-primary sm:text-5xl lg:text-6xl">
            The digital wave in<br />
            <span className="text-brand-500">boat safari management.</span>
          </h2>
        </div>
        <p className="mt-6 md:mt-0 max-w-sm text-sm leading-relaxed text-content-secondary">
          Transforming traditional maritime logistics and marine tourism through automated cloud booking platforms.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1 (Stacked Cards) */}
        <div className="flex flex-col gap-6">
          {/* Card A: Small badge / partners */}
          <div className="rounded-[2rem] border border-surface-800 bg-surface-900 p-6 flex items-center justify-between shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-800 text-brand-500">
                <Globe size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-content-primary">Global Reach</p>
                <p className="text-xs text-content-muted">Active across 40+ countries</p>
              </div>
            </div>
            <span className="rounded-full bg-surface-800 px-3 py-1 text-[11px] font-semibold text-brand-500">
              Worldwide
            </span>
          </div>

          {/* Card B: Large Metric Card */}
          <div className="rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 flex flex-col justify-between shadow-card">
            <p className="text-sm leading-relaxed text-content-secondary">
              Operators shifting to centralized digital bookings report massive improvements in schedule management.
            </p>
            <div className="mt-8">
              <p className="font-display text-5xl font-normal tracking-tight text-content-primary">
                99.4<span className="text-brand-500">%</span>
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-content-muted">
                Booking Accuracy Rate
              </p>
            </div>
          </div>
        </div>

        {/* Column 2 (Middle Tall Card) */}
        <div className="rounded-[2.5rem] border border-surface-800 bg-surface-900 p-8 flex flex-col justify-between shadow-card">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-800 text-brand-500 mb-6">
              <Anchor size={24} />
            </div>
            <h3 className="text-xl font-semibold text-content-primary">
              Streamlined Fleet Coordination
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-content-secondary">
              Real-time weather routing, automated passenger manifests, and instant digital check-ins reduce operational downtime by nearly half across major aquatic hubs.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-surface-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-content-secondary">Live System Sync</span>
            </div>
            <span className="text-xs text-brand-500 font-semibold">Cloud Powered</span>
          </div>
        </div>

        {/* Column 3 (Inverted Dark Contrast Card - mirroring the dark card in your reference) */}
        <div className="rounded-[2.5rem] border border-surface-800 bg-surface p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden text-content-primary">
          {/* Background watermark icon */}
          <div className="absolute -right-6 -bottom-6 text-surface-800/40 pointer-events-none">
            <Waves size={180} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-brand-500" size={22} />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Trusted Standard</span>
            </div>
            <p className="text-lg font-medium leading-relaxed text-content-primary">
              Over 15,000+ marine travelers safely boarded and managed through automated cloud workflows globally.
            </p>
          </div>

          <div className="relative z-10 mt-12 pt-6 border-t border-surface-800 flex items-center justify-between">
            <div>
              <p className="font-display text-4xl tracking-tight text-content-primary">4.9<span className="text-brand-500">/5</span></p>
              <p className="text-[11px] font-bold uppercase tracking-widest text-content-muted mt-1">Global Captain Rating</p>
            </div>
            <div className="flex gap-1 text-amber-400">
              {"★★★★★".split("").map((star, idx) => (
                <span key={idx} className="text-sm">{star}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* -------------------------------- Destinations ------------------------------ */

export function Destinations() {
  const names = Object.keys(DESTINATIONS);
  const [active, setActive] = useState(names[1]);
  const data = DESTINATIONS[active];

  return (
    <section className="container-page py-10">
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {names.map((name) => (
          <button
            key={name}
            onClick={() => setActive(name)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              active === name
                ? "bg-surface-800 text-content-primary shadow-sm"
                : "bg-transparent text-content-muted hover:bg-surface-900 hover:text-content-secondary"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Main Destination Card */}
      <div className="overflow-hidden rounded-[2rem] bg-surface-900 shadow-card">
        <div className="grid lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-64 sm:h-80 lg:h-[480px]">
            <img
              src={data.img}
              alt={active}
              className="absolute inset-0 h-full w-full object-cover"
            />
            </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-500">
              <MapPin size={13} /> {active}
            </p>
            <h3 className="mt-2 font-display text-3xl leading-tight text-content-primary sm:text-4xl">
              {data.tagline}
            </h3>
            <p className="mt-4 max-w-md text-sm text-content-secondary leading-relaxed">
              {data.copy}
            </p>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-wide text-content-muted">
              Must-visit spots
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-content-secondary">
              {data.spots.map((spot) => (
                <span key={spot} className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-brand-500" /> {spot}
                </span>
              ))}
            </div>

            <button className="mt-8 flex w-fit items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-brand-400 active:scale-95">
              Plan this route <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Bottom Activity Grid */}
        {/* Using 'bg-surface' on the gap creates a clean separation line between images */}
        <div className="grid grid-cols-3 gap-[2px] bg-surface">
          {ACTIVITIES.map((a) => (
            <div key={a.label} className="group relative h-32 overflow-hidden sm:h-40">
              <img 
                src={a.img} 
                alt={a.label} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-surface-900/90 via-surface-900/20 to-transparent p-3 sm:p-4">
                <p className="text-xs font-semibold text-content-primary sm:text-sm">
                  {a.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Testimonials ------------------------------ */

function Testimonials() {
  return (
    <section className="container-page py-24">
      <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        {/* Left Column: Heading & Stats */}
        <div className="relative z-10">
          <h2 className="font-display text-5xl leading-[0.95] text-content-primary sm:text-6xl">
            WHAT
            <br />
            <span className="text-brand-500">OUR SAILORS</span>
            <br />
            SAY
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-content-secondary">
            Real stories from travelers who booked their safari with us — from smooth bookings to
            unforgettable mornings on the water.
          </p>

          <div className="mt-10 flex gap-8">
            <Stat value="+15,000" label="happy travelers" />
            <Stat value="+2,500" label="successful bookings" />
          </div>
        </div>

        {/* Right Column: Staggered Testimonial Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={i}
              className={`group relative overflow-hidden rounded-[2rem] border border-surface-800 bg-surface-900 p-8 shadow-card transition-all duration-300 hover:border-brand-500/30 hover:bg-surface-800/50 ${
                t.align === "right" ? "sm:translate-y-12" : ""
              }`}
            >
              {/* Giant Decorative Quote Mark */}
              <div className="absolute -left-2 -top-6 select-none font-serif text-[8rem] leading-none text-surface-800 transition-colors group-hover:text-surface-800/70">
                &ldquo;
              </div>

              {/* Card Content */}
              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <p className="text-base leading-relaxed text-content-secondary">
                  "{t.quote}"
                </p>
                
                <footer className="flex items-center gap-4">
                  {/* Auto-generated Initial Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-800 text-sm font-bold text-brand-500 ring-2 ring-surface-900">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-content-primary">{t.name}</span>
                    <span className="text-xs text-content-muted">Verified Sailor</span>
                  </div>
                </footer>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Stats Component ------------------------------ */

function Stat({ value, label }) {
  return (
    <div className="flex flex-col border-l-2 border-surface-800 pl-5">
      <p className="font-display text-3xl tracking-tight text-content-primary">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-brand-500">
        {label}
      </p>
    </div>
  );
}

/* ------------------------------------ FAQ ------------------------------------ */

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="container-page mx-auto max-w-4xl py-24 pb-32">
      
      {/* Header aligned exactly like the reference image */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-content-muted">
          <span>010</span>
          <span className="h-1 w-1 rounded-full bg-content-muted"></span>
          <span>FAQS</span>
        </div>
        <h2 className="mt-6 font-display text-4xl font-medium tracking-tight text-content-primary sm:text-5xl">
          Common Questions
        </h2>
      </div>

      {/* FAQ List */}
      <div className="mt-12 flex flex-col gap-4">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          
          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-[2rem] transition-all duration-300 ${
                isOpen
                  ? "bg-surface-900 shadow-[0_0_20px_rgba(240,92,53,0.08)] ring-1 ring-brand-500/50"
                  : "bg-surface-900 hover:bg-surface-800/50 hover:ring-1 hover:ring-surface-800"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 p-3 sm:p-4"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Square-ish Number Badge */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-800 text-sm font-semibold text-content-muted">
                    {i + 1}
                  </div>
                  <span className="text-left text-base font-medium text-content-primary sm:text-lg">
                    {item.q}
                  </span>
                </div>

                {/* Circular Toggle Button */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isOpen
                      ? "bg-surface-800 text-brand-500 ring-1 ring-brand-500/30"
                      : "bg-surface text-content-primary"
                  }`}
                >
                  {isOpen ? <X size={20} /> : <Plus size={20} />}
                </div>
              </button>

              {/* Expandable Content with smooth grid transition */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-8 pl-[4.5rem] pr-16 text-sm leading-relaxed text-content-secondary sm:pl-[5.5rem] sm:text-base">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* -------------------------------- RADAR PREVIEW ------------------------------ */

function OceanHorizonBanner() {
  return (
    <section className="container-page py-20">
      {/* Outer rounded card container matching the image proportions */}
      <div className="relative h-[420px] w-full overflow-hidden rounded-[3rem] border border-surface-800 bg-black p-8 sm:p-12 flex flex-col justify-between shadow-2xl">
        
        {/* Abstract Dotted Curved Horizon Background (Thematic replacement for the globe graphic) */}
        <div className="absolute inset-x-0 bottom-0 top-1/4 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute inset-0 bg-[radial-gradient(#F05C35_1.5px,transparent_1.5px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] transform perspective-1000 rotate-x-12 scale-125 translate-y-16" />
        </div>

        {/* Ambient background glow in brand orange */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-96 rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />

        {/* Top Floating Location Pill (Matches the "Netherlands" pill in your image) */}
        <div className="relative z-10 self-center">
          <div className="flex items-center gap-2.5 rounded-full border border-surface-800 bg-surface-900/80 px-4 py-2 text-xs font-medium text-content-primary backdrop-blur-md shadow-lg">
            <MapPin size={14} className="text-brand-500 animate-bounce" />
            <span>Global Waters • Sector Alpha</span>
          </div>
        </div>

        {/* Center Content / Optional text overlay */}
        <div className="relative z-10 text-center max-w-lg mx-auto">
          <h3 className="font-display text-2xl font-normal text-content-primary sm:text-3xl tracking-tight">
            Ready to set sail?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-content-secondary">
            Connect to live maritime routes and secure your booking in seconds.
          </p>
        </div>

        {/* Bottom Floating Control Buttons (Matches the bottom-left and bottom-right buttons in your image) */}
        <div className="relative z-10 flex items-center justify-between">
          
          {/* Bottom Left: "Visit site" style pill button */}
          <Link
            to="/search"
            className="group flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900/90 px-6 py-3 text-sm font-semibold text-content-primary backdrop-blur-md transition-all hover:border-brand-500/50 hover:bg-surface-800 active:scale-95 shadow-xl"
          >
            <span>Explore Fleet</span>
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-brand-500" />
          </Link>

          {/* Bottom Right: Action icon button (matches the icon circle in your reference) */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-surface-800 bg-surface-900/90 text-content-primary backdrop-blur-md transition-all hover:border-brand-500/50 hover:bg-surface-800 active:scale-95 shadow-xl"
            aria-label="Scroll to top"
          >
            <Compass size={20} className="text-brand-500 animate-spin-slow" />
          </button>

        </div>

      </div>
    </section>
  );
}