import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import { 
  Music, 
  Building2, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Phone, 
  Sparkles, 
  ChevronRight, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

// Curated beautiful preset images to choose from
const ARTIST_PRESETS = [
  { id: "art1", name: "Acoustic / Indie", url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80" },
  { id: "art2", name: "Live Band", url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80" },
  { id: "art3", name: "Electronic / DJ", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80" },
  { id: "art4", name: "Jazz / Soloist", url: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&q=80" }
];

const VENUE_PRESETS = [
  { id: "ven1", name: "Industrial Warehouse", url: "https://images.unsplash.com/photo-1514525253361-bee8a4874093?w=800&q=80" },
  { id: "ven2", name: "Acoustic Lounge", url: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&q=80" },
  { id: "ven3", name: "Outdoor Stage", url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80" },
  { id: "ven4", name: "Jazz Club", url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&q=80" }
];

const GENRES = ["Alt-Folk", "Indie Rock", "Electronic", "Jazz", "Hip-Hop", "Acoustic", "Metal", "Pop", "Blues"];

const CANADIAN_REGIONS = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Yukon",
  "Nunavut"
];

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuth();

  const isSignUpPage = location.pathname === "/signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Sign up details
  const [role, setRole] = useState("artist"); // 'artist' | 'venue'
  const [name, setName] = useState("");
  const [loc, setLoc] = useState("");
  const [region, setRegion] = useState("Ontario");
  const [genre, setGenre] = useState(GENRES[0]);
  const [capacity, setCapacity] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [selectedPresetImage, setSelectedPresetImage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Reset errors on toggle
  useEffect(() => {
    setError("");
  }, [isSignUpPage, role]);

  // Set default preset image when role changes
  useEffect(() => {
    if (role === "artist") {
      setSelectedPresetImage(ARTIST_PRESETS[0].url);
    } else {
      setSelectedPresetImage(VENUE_PRESETS[0].url);
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in email and password.");
      setFormLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setFormLoading(false);
      return;
    }

    try {
      if (isSignUpPage) {
        if (!name.trim() || !loc.trim()) {
          setError("Name and Location are required.");
          setFormLoading(false);
          return;
        }

        const profileData = {
          name,
          location: loc,
          region,
          image: selectedPresetImage,
          ...(role === "artist" ? { genre } : { capacity, contactNumber })
        };

        const { error: signUpError } = await signUp(email, password, role, profileData);
        if (signUpError) {
          setError(signUpError.message || "An error occurred during sign up.");
        } else {
          navigate("/dashboard");
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setError(signInError.message || "Invalid login credentials.");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0914] text-white flex flex-col" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Header />

      {/* Main Body */}
      <div className="flex-1 flex items-center justify-center py-20 px-6 relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ff37d7]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#4e148c]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-xl relative z-10">
          <div 
            className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-2xl transition-all duration-500"
            style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#ff37d7] uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                LocalScene Portal
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight">
                {isSignUpPage ? "Join the " : "Welcome "}
                <span className="text-[#ff37d7]">{isSignUpPage ? "Scene" : "Back"}</span>
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                {isSignUpPage 
                  ? "Connect with local fans, venues, and perform live shows." 
                  : "Access your dashboard to schedule and publish upcoming gigs."
                }
              </p>
            </div>

            {/* Toggle link */}
            <div className="flex justify-center gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl mb-8">
              <Link 
                to="/login"
                className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-300 ${!isSignUpPage ? "bg-[#ff37d7] text-white shadow-lg shadow-[#ff37d7]/20" : "text-gray-400 hover:text-white"}`}
              >
                Sign In
              </Link>
              <Link 
                to="/signup"
                className={`flex-1 py-3 text-center text-sm font-bold rounded-xl transition-all duration-300 ${isSignUpPage ? "bg-[#ff37d7] text-white shadow-lg shadow-[#ff37d7]/20" : "text-gray-400 hover:text-white"}`}
              >
                Register
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-start gap-3 text-sm text-red-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUpPage && (
                <div className="space-y-4">
                  {/* Artist / Venue Role selector */}
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Choose account type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole("artist")}
                      className={`py-4 px-6 rounded-2xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        role === "artist" 
                          ? "bg-[#4e148c]/30 border-[#ff37d7] text-white shadow-[0_0_15px_rgba(255,55,215,0.2)]" 
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Music className="w-4 h-4 shrink-0" />
                      Artist / Band
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("venue")}
                      className={`py-4 px-6 rounded-2xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        role === "venue" 
                          ? "bg-[#e21313]/20 border-[#ff37d7] text-white shadow-[0_0_15px_rgba(255,55,215,0.2)]" 
                          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      Music Venue
                    </button>
                  </div>
                </div>
              )}

              {/* Basic Credentials */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      placeholder="e.g. performer@localscene.ca"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Sign Up Fields */}
              {isSignUpPage && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-sm font-bold text-[#ff37d7] uppercase tracking-wider mb-2">
                    {role === "artist" ? "Artist Information" : "Venue Details"}
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      {role === "artist" ? "Artist / Band Name" : "Venue Name"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder={role === "artist" ? "e.g. Savanah" : "e.g. The Phoenix"}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">City / Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder={role === "artist" ? "Montréal, QC" : "Toronto, ON"}
                          required
                          value={loc}
                          onChange={(e) => setLoc(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Region</label>
                      <select 
                        required
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-[#1b1524] border border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 transition-all cursor-pointer text-white"
                      >
                        {CANADIAN_REGIONS.map(r => (
                          <option key={r} value={r} className="bg-[#0e0914]">{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {role === "artist" ? (
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Genre</label>
                      <select 
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full bg-[#1b1524] border border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 transition-all cursor-pointer text-white"
                      >
                        {GENRES.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Capacity</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 500"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Contact Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="+1 416-..."
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preset Profile Images Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Choose Profile Banner Image</label>
                    <div className="grid grid-cols-4 gap-3">
                      {(role === "artist" ? ARTIST_PRESETS : VENUE_PRESETS).map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedPresetImage(preset.url)}
                          className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                            selectedPresetImage === preset.url ? "border-[#ff37d7] scale-95 shadow-[0_0_10px_rgba(255,55,215,0.4)]" : "border-transparent opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 italic">This preset banner will be displayed on the LocalScene board.</p>
                  </div>
                </div>
              )}

              {/* Submit Action */}
              <button
                type="submit"
                disabled={formLoading || authLoading}
                className="w-full py-4 bg-[#ff37d7] hover:bg-[#ff37d7]/90 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(255,55,215,0.4)] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {isSignUpPage ? "Register as Performer" : "Sign In to Dashboard"}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative footer */}
      <footer className="py-8 border-t border-white/5 text-center text-xs text-gray-600">
        © 2026 LocalScene. Secure authentication portal.
      </footer>
    </div>
  );
}
