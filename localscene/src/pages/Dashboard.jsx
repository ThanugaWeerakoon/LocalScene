import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Plus, 
  Sparkles, 
  Loader2, 
  Trash2, 
  PlusCircle, 
  Info, 
  Check, 
  ArrowUpRight 
} from "lucide-react";

// Curated live event preset images
const EVENT_IMAGE_PRESETS = [
  { id: "ev1", name: "Heavy Rock Concert", url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80" },
  { id: "ev2", name: "Intimate Acoustic Live", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80" },
  { id: "ev3", name: "Neon EDM Club Rave", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80" },
  { id: "ev4", name: "Sophisticated Jazz Bar", url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80" },
  { id: "ev5", name: "Grand Stadium Arena", url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80" }
];

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

export default function Dashboard() {
  const { user, profile, userRole, signOut, loading: authLoading } = useAuth();
  const [myGigs, setMyGigs] = useState([]);
  const [gigsLoading, setGigsLoading] = useState(true);

  // Form states
  const [eventName, setEventName] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [availableTickets, setAvailableTickets] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [region, setRegion] = useState("Ontario");
  const [moreInfo, setMoreInfo] = useState("");
  const [eventImage, setEventImage] = useState(EVENT_IMAGE_PRESETS[0].url);

  // Relational options state
  const [relationalOptions, setRelationalOptions] = useState([]);
  const [selectedRelationalId, setSelectedRelationalId] = useState("");
  const [relationalLoading, setRelationalLoading] = useState(true);

  const [formStatus, setFormStatus] = useState({ success: false, error: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch my gigs
  const fetchMyGigs = async () => {
    if (!user) return;
    setGigsLoading(true);
    try {
      const column = userRole === "artist" ? "artist_id" : "venue_id";
      const { data, error } = await supabase
        .from("events")
        .select("*, artists(*), venues(*)")
        .eq(column, user.id)
        .order("date_time", { ascending: true });

      if (error) throw error;
      setMyGigs(data || []);
    } catch (err) {
      console.error("Error fetching dashboard gigs:", err);
    } finally {
      setGigsLoading(false);
    }
  };

  // Fetch lists of opposite entities (artists need venues, venues need artists)
  const fetchRelationalOptions = async () => {
    if (!user || !userRole) return;
    setRelationalLoading(true);
    try {
      if (userRole === "artist") {
        // Fetch venues
        const { data, error } = await supabase
          .from("venues")
          .select("id, venue_name, location")
          .order("venue_name", { ascending: true });
        
        if (error) throw error;
        setRelationalOptions(data || []);
        if (data && data.length > 0) setSelectedRelationalId(data[0].id);
      } else {
        // Fetch artists
        const { data, error } = await supabase
          .from("artists")
          .select("id, artist_name, genre")
          .order("artist_name", { ascending: true });

        if (error) throw error;
        setRelationalOptions(data || []);
        if (data && data.length > 0) setSelectedRelationalId(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching relational selections:", err);
    } finally {
      setRelationalLoading(false);
    }
  };

  useEffect(() => {
    if (user && userRole) {
      fetchMyGigs();
      fetchRelationalOptions();

      // Pre-populate fields
      setBookingEmail(profile?.contact_email || profile?.contact_number || "");
      setRegion(profile?.region || "Ontario");
    }
  }, [user, userRole, profile]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormStatus({ success: false, error: "" });
    setIsSubmitting(true);

    if (!eventName.trim() || !dateTime || !ticketPrice || !availableTickets || !selectedRelationalId) {
      setFormStatus({ success: false, error: "Please fill in all mandatory fields." });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        event_name: eventName,
        date_time: new Date(dateTime).toISOString(),
        ticket_price: parseFloat(ticketPrice) || 0,
        available_tickets: parseInt(availableTickets) || 0,
        booking_email: bookingEmail,
        region: region || "Ontario",
        more_info: moreInfo,
        image: eventImage,
        artist_id: userRole === "artist" ? user.id : selectedRelationalId,
        venue_id: userRole === "venue" ? user.id : selectedRelationalId,
      };

      const { data, error } = await supabase.from("events").insert([payload]).select();

      if (error) throw error;

      setFormStatus({ success: true, error: "" });
      // Reset form fields
      setEventName("");
      setDateTime("");
      setTicketPrice("");
      setAvailableTickets("");
      setMoreInfo("");
      
      // Refresh list
      await fetchMyGigs();
    } catch (err) {
      console.error("Gig creation failed:", err);
      setFormStatus({ success: false, error: err.message || "Could not publish your gig." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGig = async (gigId) => {
    const confirmDelete = window.confirm("Are you sure you want to cancel and delete this gig?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("events").delete().eq("id", gigId);
      if (error) throw error;
      setMyGigs(prev => prev.filter(g => g.id !== gigId));
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("Failed to delete event: " + err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0e0914] flex flex-col items-center justify-center gap-4 text-white">
        <Loader2 className="w-10 h-10 text-[#ff37d7] animate-spin" />
        <p className="text-gray-400">Loading your scene console...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0e0914] flex flex-col items-center justify-center gap-4 text-white px-6 text-center">
        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl max-w-md w-full backdrop-blur-md">
          <Info className="w-12 h-12 text-[#ff37d7] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            We couldn't find an Artist or Venue profile linked to your account. This can happen if the signup process didn't complete due to email rate limits.
          </p>
          <button 
            onClick={signOut}
            className="w-full py-3 bg-[#ff37d7] hover:bg-[#ff37d7]/90 text-white font-bold rounded-xl transition-all cursor-pointer"
          >
            Log Out & Register Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0914] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative overflow-hidden">
        {/* Colorful Glow Backgrounds */}
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#ff37d7]/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#4e148c]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Dashboard Profile Header */}
        <section 
          className="relative bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl backdrop-blur-md"
        >
          {/* Banner Image */}
          <div className="h-48 overflow-hidden relative">
            <img 
              src={profile.image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&q=80"} 
              alt="" 
              className="w-full h-full object-cover opacity-35 filter blur-[2px]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0914] to-transparent" />
          </div>

          {/* Profile Core */}
          <div className="px-8 md:px-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#ff37d7]/35 shadow-xl bg-[#0e0914]">
                <img 
                  src={profile.image || "https://via.placeholder.com/150"} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="pb-2">
                <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-[#ff37d7] uppercase">
                  {userRole} Mode
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight mt-3">
                  {profile.artist_name || profile.venue_name}
                </h1>
                <p className="text-gray-400 text-sm mt-1.5 flex items-center gap-1.5 justify-center md:justify-start">
                  <MapPin className="w-4 h-4 text-[#ff37d7]" />
                  {profile.location} • {profile.region}
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3 self-center md:self-end">
              <span className="text-xs text-gray-500 uppercase font-medium mr-2">
                {userRole === "artist" ? `Genre: ${profile.genre}` : `Capacity: ${profile.capacity?.toLocaleString()}`}
              </span>
              <button 
                onClick={signOut}
                className="px-5 py-3 rounded-2xl bg-red-950/20 border border-red-500/25 hover:bg-red-500 hover:border-transparent hover:text-white transition-all text-xs font-bold"
              >
                Log Out
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Gig Publisher Form */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="w-5 h-5 text-[#ff37d7]" />
                <h2 className="text-2xl font-bold tracking-tight">Publish a Gig</h2>
              </div>

              {formStatus.success && (
                <div className="mb-6 p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-sm text-emerald-200 animate-pulse">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Gig published successfully! It is now active on the platform.</span>
                </div>
              )}

              {formStatus.error && (
                <div className="mb-6 p-4 bg-red-950/20 border border-red-500/30 rounded-2xl flex items-start gap-3 text-sm text-red-200">
                  <Info className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>{formStatus.error}</span>
                </div>
              )}

              <form onSubmit={handleCreateEvent} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Show / Event Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Summer Acoustic Sessions"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>

                 <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Ticket Price (CAD) *</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 25"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Available Tickets *</label>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 150"
                      value={availableTickets}
                      onChange={(e) => setAvailableTickets(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Date & Time *</label>
                  <input 
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full bg-[#1b1524] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 transition-all text-white"
                  />
                </div>

                {/* Relational selector dropdown based on role */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                    {userRole === "artist" ? "Select Performing Venue *" : "Select Performing Artist *"}
                  </label>
                  {relationalLoading ? (
                    <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#ff37d7]" />
                      Loading registry...
                    </div>
                  ) : (
                    <select
                      value={selectedRelationalId}
                      onChange={(e) => setSelectedRelationalId(e.target.value)}
                      className="w-full bg-[#1b1524] border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 transition-all cursor-pointer text-white"
                    >
                      {relationalOptions.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {userRole === "artist" ? `${opt.venue_name} (${opt.location})` : `${opt.artist_name} (${opt.genre})`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Booking Email/Phone</label>
                    <input 
                      type="text"
                      placeholder="e.g. tickets@localscene.ca"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Region</label>
                    <select 
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-[#1b1524] border border-white/10 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 transition-all cursor-pointer text-white"
                    >
                      {CANADIAN_REGIONS.map(r => (
                        <option key={r} value={r} className="bg-[#0e0914]">{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Gig Bio / More Info</label>
                  <textarea 
                    rows="3"
                    placeholder="Provide details about the show, lineups, cover charge details, etc..."
                    value={moreInfo}
                    onChange={(e) => setMoreInfo(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#ff37d7]/50 focus:bg-white/[0.08] transition-all resize-none"
                  />
                </div>

                {/* Preset Gig Banner Picker */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Choose Gig Banner Poster</label>
                  <div className="grid grid-cols-5 gap-2">
                    {EVENT_IMAGE_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setEventImage(preset.url)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          eventImage === preset.url ? "border-[#ff37d7] scale-95" : "border-transparent opacity-60"
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#ff37d7] hover:bg-[#ff37d7]/90 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,55,215,0.3)] active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Publish Show
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column (2 spans): Gigs management list */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 shadow-2xl backdrop-blur-md min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff37d7]" />
                  <h2 className="text-2xl font-bold tracking-tight">Our Scheduled Gigs</h2>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-gray-400 font-semibold">
                  {myGigs.length} Total Gigs
                </span>
              </div>

              {gigsLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#ff37d7] animate-spin" />
                  <p className="text-gray-500 text-xs">Scanning the schedule roster...</p>
                </div>
              ) : myGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  {myGigs.map(gig => (
                    <div 
                      key={gig.id}
                      className="group relative bg-white/5 border border-white/5 hover:border-[#ff37d7]/35 rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
                    >
                      {/* Gig banner photo */}
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={gig.image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80"} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        
                        {/* Region tag */}
                        <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[9px] font-bold text-[#ff37d7] border border-white/5">
                          {gig.region}
                        </span>

                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                            {userRole === "artist" ? `Playing at: ${gig.venues?.venue_name}` : `Performer: ${gig.artists?.artist_name}`}
                          </p>
                          <h4 className="text-lg font-bold text-white leading-tight mt-0.5 truncate">
                            {gig.event_name}
                          </h4>
                        </div>
                      </div>

                      {/* Info & stats */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2 mb-6">
                          <p className="text-xs text-gray-300 flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#ff37d7] shrink-0" />
                            {new Date(gig.date_time).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                          <p className="text-xs text-gray-300 flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#ff37d7] shrink-0" />
                            <span className="truncate">{userRole === "artist" ? gig.venues?.location : gig.artists?.location}</span>
                          </p>
                          <p className="text-xs text-gray-300 flex items-center gap-2">
                            <Ticket className="w-3.5 h-3.5 text-[#ff37d7] shrink-0" />
                            <span>CAD ${gig.ticket_price} • {gig.available_tickets} Tickets Left</span>
                          </p>
                          {gig.more_info && (
                            <p className="text-xs text-gray-500 italic line-clamp-2 mt-2 pt-2 border-t border-white/5">
                              "{gig.more_info}"
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <a
                            href="/gigs"
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-center text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            Live Page <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDeleteGig(gig.id)}
                            className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-500 hover:border-transparent hover:text-white text-red-300 hover:shadow-[0_0_10px_rgba(239,68,68,0.2)] transition-all shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
                  <Sparkles className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold mb-1.5">No Shows Published Yet</h3>
                  <p className="text-gray-400 text-xs max-w-sm leading-relaxed mb-6">
                    Use the publisher console on the left to set up details, date, ticket capacity, and secure your upcoming gig!
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>© 2026 LocalScene. Keep the music playing.</p>
      </footer>
    </div>
  );
}
