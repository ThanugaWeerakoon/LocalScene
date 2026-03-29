import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [query, setQuery] = useState("");

  return (
    <header
      className="px-6 py-4 flex items-center gap-4"
      style={{
        borderBottom: "1px solid rgba(255,231,215,0.08)",
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

    
      
        <ul className="flex pr-60 gap-14 text-lg font-medium list-none text-[#eaeaea]">
          {["Home", "Venues", "Artists", "About"].map((item) => (
            <li key={item}>
              <Link
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="
                  relative
                  after:block after:h-[2px] after:w-full
                  after:scale-x-0 after:origin-center
                  after:bg-[#ffe7d7]
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100
                  hover:text-white
                "
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
  );
}