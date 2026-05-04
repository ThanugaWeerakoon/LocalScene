import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import { Search, MapPin, Calendar, Ticket, Filter, Music, Loader2 } from "lucide-react";

export default function Gigs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*, artists(*), venues(*)")
          .order("date_time", { ascending: true });

        if (error) throw error;

        if (data) {
          const normalized = data.map((event) => ({
            id: event.id,
            event_name: event.event_name,
            date_time: event.date_time,
            available_tickets: event.available_tickets,
            ticket_price: event.ticket_price,
            booking_email: event.booking_email,
            region: event.region,
            more_info: event.more_info,
            artist_name: event.artists?.artist_name || "Unknown Artist",
            artist_image: event.artists?.image || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60",
            artist_genre: event.artists?.genre || "Music",
            venue_name: event.venues?.venue_name || "Secret Location",
            venue_location: event.venues?.location || event.region,
          }));
          setEvents(normalized);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.artist_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === "All" || event.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  const regions = ["All", ...new Set(events.map((e) => e.region))].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Header />

      {/* Hero / Filter Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ce7f]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                Live <span className="text-[#00ce7f]">Gigs</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl">
                Discover the best local music performances, underground sessions, and world-class concerts in your city.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search artists, venues..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#00ce7f]/50 transition-all placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="appearance-none bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 focus:outline-none focus:border-[#00ce7f]/50 transition-all cursor-pointer"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regions.map(r => (
                    <option key={r} value={r} className="bg-[#0a0a0a]">{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 text-[#00ce7f] animate-spin" />
              <p className="text-gray-400 animate-pulse">Scanning the scene for gigs...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-[#00ce7f]/30 transition-all duration-500 flex flex-col"
                  style={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={event.artist_image}
                      alt={event.artist_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-semibold text-[#00ce7f]">
                      {event.artist_genre}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-1 group-hover:text-[#00ce7f] transition-colors">
                          {event.event_name}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium">
                          {event.artist_name}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-[#00ce7f]" />
                        </div>
                        {new Date(event.date_time).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-[#00ce7f]" />
                        </div>
                        <span className="truncate">{event.venue_name}, {event.region}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                          <Ticket className="w-4 h-4 text-[#00ce7f]" />
                        </div>
                        <span>LKR {event.ticket_price} • {event.available_tickets > 0 ? `${event.available_tickets} left` : "Sold Out"}</span>
                      </div>
                    </div>

                    <button
                      disabled={event.available_tickets === 0}
                      className={`mt-auto w-full py-3 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        event.available_tickets > 0
                          ? "bg-[#00ce7f] text-black hover:shadow-[0_0_20px_rgba(0,206,127,0.4)] active:scale-95"
                          : "bg-white/10 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {event.available_tickets > 0 ? (
                        <>
                          Get Tickets
                        </>
                      ) : (
                        "Sold Out"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No gigs found</h3>
              <p className="text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer / Decorative */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm">© 2024 LocalScene. All beats reserved.</p>
      </footer>
    </div>
  );
}

