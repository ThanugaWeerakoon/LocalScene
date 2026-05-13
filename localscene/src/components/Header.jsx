import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [query, setQuery] = useState("");

  return (
    <header
      className="px-6 py-4 flex items-center gap-4"
      style={{
        background: "rgba(14,9,20,0.85)",
        borderBottom: "1px solid rgba(255,55,215,0.10)",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
      </style>

      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
          style={{ background: "linear-gradient(135deg, #ff37d7, #4e148c)", color: "#fff" }}
        >
          LS
        </div>
        <span
          className="text-lg font-bold tracking-tight hidden sm:block"
          style={{ color: "#fff", opacity: 0.92, fontFamily: "'Space Grotesk', serif" }}
        >
          Local<span style={{ color: "#ff37d7" }}>Scene</span>
          <span style={{ color: "#e21313" }}>.ca</span>
        </span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-2xl mx-auto">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "rgba(255,55,215,0.45)" }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search venues, artists, events…"
          className="w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none transition"
          style={{
            background: "rgba(255,55,215,0.06)",
            border: "1px solid rgba(255,55,215,0.14)",
            color: "#f0e8ff",
            caretColor: "#ff37d7",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        />
      </div>

      {/* Nav */}
      <ul
        className="flex pr-60 gap-14 list-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 400, color: "#eaeaea" }}
      >
        {["Home", "Venues", "Artists", "About", "Gigs"].map((item) => (
          <li key={item}>
            <Link
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="
                relative
                after:block after:h-[2px] after:w-full
                after:scale-x-0 after:origin-center
                after:bg-[#ff37d7]
                after:transition-transform after:duration-300
                hover:after:scale-x-100
                hover:text-white
              "
              style={{ fontFamily: "'Space Grotesk', serif" }}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>

      {/* Auth */}
      <button
        className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition"
        style={{
          background: "rgba(226,19,19,0.12)",
          border: "1px solid rgba(226,19,19,0.45)",
          color: "#fff",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#e21313";
          e.currentTarget.style.borderColor = "#e21313";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(226,19,19,0.12)";
          e.currentTarget.style.borderColor = "rgba(226,19,19,0.45)";
        }}
      >
        Login / Sign Up
      </button>
    </header>
  );
}