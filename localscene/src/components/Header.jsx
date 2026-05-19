import { useState, useEffect, useRef } from "react";
import { Search, Music, MapPin, Calendar, Loader2, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, profile, userRole, signOut } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ artists: [], venues: [], events: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        setShowResults(true);
        try {
          const [artistsRes, venuesRes, eventsRes] = await Promise.all([
            supabase
              .from("artists")
              .select("*")
              .ilike("artist_name", `%${query}%`)
              .limit(3),
            supabase
              .from("venues")
              .select("*")
              .ilike("venue_name", `%${query}%`)
              .limit(3),
            supabase
              .from("events")
              .select("*, artists(*), venues(*)")
              .ilike("event_name", `%${query}%`)
              .limit(3)
          ]);

          setResults({
            artists: artistsRes.data || [],
            venues: venuesRes.data || [],
            events: eventsRes.data || []
          });
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults({ artists: [], venues: [], events: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const hasResults = results.artists.length > 0 || results.venues.length > 0 || results.events.length > 0;

  return (
    <header
      className="px-6 py-4 flex items-center justify-between gap-4 border-b border-white/5"
      style={{
        background: "rgba(14, 9, 20, 0.85)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap');
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out forwards;
          }
        `}
      </style>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
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
      </Link>

      {/* Search */}
      <div className="relative flex-1 max-w-2xl mx-auto" ref={searchRef}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "rgba(255,55,215,0.45)" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && setShowResults(true)}
            placeholder="Search venues, artists, events…"
            className="w-full pl-10 pr-10 py-2 rounded-xl text-sm focus:outline-none transition"
            style={{
              background: "rgba(255,55,215,0.06)",
              border: "1px solid rgba(255,55,215,0.14)",
              color: "#f0e8ff",
              caretColor: "#ff37d7",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-500 hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div 
            className="absolute top-full mt-2 w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{
              background: "rgba(14, 9, 20, 0.95)",
              backdropFilter: "blur(20px)",
              maxHeight: "400px",
              overflowY: "auto"
            }}
          >
            {isSearching ? (
              <div className="p-8 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-[#ff37d7] animate-spin" />
                <p className="text-xs text-gray-400">Searching the scene...</p>
              </div>
            ) : hasResults ? (
              <div className="py-2">
                {/* Artists */}
                {results.artists.length > 0 && (
                  <div className="mb-4">
                    <h3 className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Artists</h3>
                    {results.artists.map(artist => (
                      <Link 
                        key={artist.id} 
                        to={`/artists?search=${artist.artist_name}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                          <img src={artist.image || "https://via.placeholder.com/40"} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{artist.artist_name}</p>
                          <p className="text-xs text-gray-400">{artist.genre}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Venues */}
                {results.venues.length > 0 && (
                  <div className="mb-4">
                    <h3 className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Venues</h3>
                    {results.venues.map(venue => (
                      <Link 
                        key={venue.id} 
                        to={`/venues?search=${venue.venue_name}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-[#ff37d7]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{venue.venue_name}</p>
                          <p className="text-xs text-gray-400">{venue.location}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Events */}
                {results.events.length > 0 && (
                  <div className="mb-2">
                    <h3 className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Events</h3>
                    {results.events.map(event => (
                      <Link 
                        key={event.id} 
                        to={`/gigs`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-[#ff37d7]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{event.event_name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(event.date_time).toLocaleDateString()} • {event.venues?.venue_name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-400">No matches found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav */}
      <ul
        className="hidden lg:flex gap-8 list-none items-center"
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 400, color: "#eaeaea" }}
      >
        {["Venues", "Artists", "Gigs", "About"].map((item) => (
          <li key={item}>
            <Link
              to={`/${item.toLowerCase()}`}
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
      <div className="hidden lg:block">
        {user && profile ? (
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-1.5 pl-3 ml-4 shrink-0">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white leading-tight">
                {profile.artist_name || profile.venue_name}
              </span>
              <span className="text-[9px] text-[#ff37d7] font-semibold uppercase tracking-widest leading-none mt-0.5">
                {userRole}
              </span>
            </div>
            <Link to="/dashboard" className="w-9 h-9 rounded-xl overflow-hidden border border-white/15 hover:border-[#ff37d7]/50 transition-all shrink-0">
              <img src={profile.image || "https://via.placeholder.com/36"} alt="" className="w-full h-full object-cover" />
            </Link>
            <button
              onClick={signOut}
              className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-white/5 hover:bg-[#e21313] hover:text-white border border-white/10 hover:border-transparent transition-all ml-1 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex-shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition ml-4 cursor-pointer"
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
        )}
      </div>

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-[73px] z-40 bg-[#0e0914]/98 backdrop-blur-2xl flex flex-col p-6 border-b border-white/5 lg:hidden animate-fade-in"
          style={{ height: "calc(100vh - 73px)" }}
        >
          <ul className="flex flex-col gap-6 text-xl font-bold mb-8">
            {["Venues", "Artists", "Gigs", "About"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-[#ff37d7] transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto border-t border-white/5 pt-6">
            {user && profile ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10">
                    <img src={profile.image || "https://via.placeholder.com/48"} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-bold">{profile.artist_name || profile.venue_name}</p>
                    <p className="text-xs text-[#ff37d7] uppercase tracking-widest font-semibold">{userRole}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 bg-white/5 hover:bg-white/10 rounded-xl text-center font-bold text-sm border border-white/10 transition-all text-white"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="py-3 bg-[#e21313] hover:bg-[#c21010] text-white rounded-xl font-bold text-sm transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full py-4 bg-[#e21313] hover:bg-[#c21010] text-white font-bold rounded-2xl transition shadow-lg text-center"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}