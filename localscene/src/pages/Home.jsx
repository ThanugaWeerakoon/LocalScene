import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../components/Navigation";
import Carousel from "../components/Carousel";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0e0914" }}>
      
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center gap-4"
        style={{
          borderBottom: "1px solid rgba(255,231,215,0.08)",
          background: "rgba(14,9,20,0.95)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: "#a21313", color: "#ffe7d7" }}
          >
            LS
          </div>
          <span
            className="text-lg font-bold tracking-tight hidden sm:block"
            style={{ color: "#ffe7d7", opacity: 0.9 }}
          >
            LocalScene
            <span style={{ color: "#a21313" }}>.ca</span>
          </span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-2xl mx-auto">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "rgba(255,231,215,0.4)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search venues, artists, events…"
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none transition"
            style={{
              background: "rgba(255,231,215,0.07)",
              border: "1px solid rgba(255,231,215,0.12)",
              color: "#ffe7d7",
              caretColor: "#00ce71",
            }}
          />
        </div>

        {/* Auth */}
        <button
          className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition"
          style={{
            background: "rgba(162,19,19,0.15)",
            border: "1px solid rgba(162,19,19,0.5)",
            color: "#ffe7d7",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#a21313";
            e.currentTarget.style.borderColor = "#a21313";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(162,19,19,0.15)";
            e.currentTarget.style.borderColor = "rgba(162,19,19,0.5)";
          }}
        >
          Login / Sign Up
        </button>
      </header>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-16 pb-8 gap-4">
        <div
          className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
          style={{
            background: "rgba(0,206,113,0.1)",
            border: "1px solid rgba(0,206,113,0.25)",
            color: "#00ce71",
          }}
        >
          Discover Your Local Scene
        </div>

        <h2
          className="text-4xl sm:text-5xl font-black leading-tight tracking-tight max-w-2xl"
          style={{ color: "#ffe7d7" }}
        >
          Live Music.{" "}
          <span style={{ color: "#a21313" }}>Real Venues.</span>
          <br />
          Your City.
        </h2>

        <p
          className="text-sm max-w-md leading-relaxed"
          style={{ color: "rgba(255,231,215,0.5)" }}
        >
          Find artists performing near you, discover hidden gems, and never
          miss a local show again.
        </p>

      </section>

      {/* Section Label */}
      <div className="px-10 pt-4 pb-2 flex items-center justify-between">
        <span
          className="text-xl font-bold tracking-widest uppercase"
          style={{ color: "rgba(255,231,215,0.35)" }}
        >
          Discover
        </span>       
      </div>

      {/* Carousel */}
      <div className="px-4 pb-16">
        <Carousel />
      </div>

  
      
    </div>
  );
}