import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import { 
  Search as LucideSearch, 
  MapPin as LucideMapPin, 
  Phone as LucidePhone, 
  Filter as LucideFilter, 
  Building2 as LucideBuilding2, 
  Loader2 as LucideLoader2, 
  ArrowRight as LucideArrowRight
} from "lucide-react";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*, artists(*), venues(*)")
          .order("date_time", { ascending: true });

        if (error) throw error;

        if (data) {
          const venueMap = {};
          data.forEach((event) => {
            if (!event.venues) return;
            const id = event.venues.id;
            if (!venueMap[id]) {
              venueMap[id] = {
                id: event.venues.id,
                name: event.venues.venue_name,
                location: event.venues.location,
                region: event.venues.region,
                contact_number: event.venues.contact_number,
                image_url: event.venues.image || "https://images.unsplash.com/photo-1514525253361-bee8a4874093?w=800&auto=format&fit=crop&q=60",
                capacity: event.venues.capacity,
                upcoming_shows: [],
              };
            }
            venueMap[id].upcoming_shows.push({
              date: new Date(event.date_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              artist: event.artists?.artist_name || "Unknown Artist",
              city: event.venues.location,
            });
          });
          setVenues(Object.values(venueMap));
        }
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.region.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === "All" || venue.region === selectedRegion;
    
    return matchesSearch && matchesRegion;
  });

  const regions = ["All", ...new Set(venues.map((v) => v.region))].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Header />

      {/* Hero / Filter Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00ce7f]/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                Local <span className="text-[#00ce7f]">Venues</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl">
                Explore the most iconic stages, intimate clubs, and legendary halls in the local scene.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:w-80">
                <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#00ce7f]/50 transition-all placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <LucideFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="appearance-none bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 focus:outline-none focus:border-[#00ce7f]/50 transition-all cursor-pointer text-white"
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

          {/* Venues Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <LucideLoader2 className="w-10 h-10 text-[#00ce7f] animate-spin" />
              <p className="text-gray-400 animate-pulse">Mapping out the venues...</p>
            </div>
          ) : filteredVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="group relative bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden hover:border-[#00ce7f]/30 transition-all duration-500 flex flex-col"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  {/* Image Header */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={venue.image_url}
                      alt={venue.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-[#00ce7f] text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
                          {venue.region}
                        </span>
                        {venue.capacity && (
                          <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/10">
                            {venue.capacity.toLocaleString()} Capacity
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold group-hover:text-[#00ce7f] transition-colors">
                        {venue.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 flex flex-col flex-1">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                          <LucideMapPin className="w-5 h-5 text-[#00ce7f]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {venue.location}
                          </p>
                        </div>
                      </div>

                      {venue.contact_number && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <LucidePhone className="w-5 h-5 text-[#00ce7f]" />
                          </div>
                          <p className="text-sm text-gray-300 font-medium">
                            {venue.contact_number}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Upcoming Shows Preview */}
                    {venue.upcoming_shows.length > 0 && (
                      <div className="mb-8">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
                          Next Up
                        </p>
                        <div className="space-y-3">
                          {venue.upcoming_shows.slice(0, 2).map((show, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-[#00ce7f] w-12">
                                  {show.date}
                                </span>
                                <span className="text-sm font-medium truncate max-w-[150px]">
                                  {show.artist}
                                </span>
                              </div>
                              <LucideArrowRight className="w-4 h-4 text-gray-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto flex gap-3">
                      <button 
                        onClick={() => venue.contact_number && window.open(`tel:${venue.contact_number}`)}
                        className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        Contact
                      </button>
                      <button className="flex-1 py-4 bg-[#00ce7f] text-black hover:shadow-[0_0_20px_rgba(0,206,127,0.4)] rounded-2xl font-bold transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <LucideBuilding2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No venues found</h3>
              <p className="text-gray-400">Try searching for a different name or region.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm">© 2024 LocalScene. Venue discovery made simple.</p>
      </footer>
    </div>
  );
}