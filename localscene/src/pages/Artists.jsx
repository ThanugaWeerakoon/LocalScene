import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import { 
  Search as LucideSearch, 
  MapPin as LucideMapPin, 
  Music as LucideMusic, 
  Filter as LucideFilter, 
  User as LucideUser, 
  Loader2 as LucideLoader2, 
  CheckCircle2 as LucideCheckCircle,
  Video as LucideVideo,
  ArrowUpRight as LucideArrowUpRight
} from "lucide-react";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*, artists(*), venues(*)")
          .order("date_time", { ascending: true });

        if (error) throw error;

        if (data) {
          const artistMap = {};
          data.forEach((event) => {
            if (!event.artists) return;
            const id = event.artists.id;
            if (!artistMap[id]) {
              artistMap[id] = {
                id: event.artists.id,
                name: event.artists.artist_name,
                genre: event.artists.genre || "Unknown Genre",
                location: event.artists.location || "Unknown Location",
                image_url: event.artists.image || "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&auto=format&fit=crop&q=60",
                verified: event.artists.verified,
                new_release: event.artists.new_release,
                youtube_id: event.artists.youtube_link,
                contact_email: event.artists.contact_email,
                upcoming_shows: [],
              };
            }
            artistMap[id].upcoming_shows.push({
              date: new Date(event.date_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              venue: event.venues?.venue_name || "Secret Location",
            });
          });
          setArtists(Object.values(artistMap));
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter((artist) => {
    const matchesSearch = 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = selectedGenre === "All" || artist.genre === selectedGenre;
    
    return matchesSearch && matchesGenre;
  });

  const genres = ["All", ...new Set(artists.map((a) => a.genre))].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Header />

      {/* Hero / Filter Section */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00ce7f]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                Spotlight <span className="text-[#00ce7f]">Artists</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl">
                Discover the most talented performers, rising stars, and established icons of the local music scene.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 sm:w-80">
                <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, genre..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#00ce7f]/50 transition-all placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <LucideFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="appearance-none bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 focus:outline-none focus:border-[#00ce7f]/50 transition-all cursor-pointer text-white"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  {genres.map(g => (
                    <option key={g} value={g} className="bg-[#0a0a0a]">{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Artists Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <LucideLoader2 className="w-10 h-10 text-[#00ce7f] animate-spin" />
              <p className="text-gray-400 animate-pulse">Gathering the artists...</p>
            </div>
          ) : filteredArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="group relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:border-[#00ce7f]/30 transition-all duration-500 flex flex-col"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  {/* Image Header */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={artist.image_url}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-90" />
                    
                    {/* Verified Badge */}
                    {artist.verified && (
                      <div className="absolute top-4 right-4 bg-blue-500 text-white p-1 rounded-full shadow-lg">
                        <LucideCheckCircle className="w-4 h-4 fill-current" />
                      </div>
                    )}

                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[10px] font-bold text-[#00ce7f] uppercase tracking-widest mb-2">
                        {artist.genre}
                      </p>
                      <h3 className="text-2xl font-bold group-hover:text-[#00ce7f] transition-colors leading-tight">
                        {artist.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-400">
                        <LucideMapPin className="w-4 h-4 shrink-0" />
                        <span className="text-sm truncate">{artist.location}</span>
                      </div>
                      
                      {artist.new_release && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <LucideMusic className="w-4 h-4 shrink-0 text-[#00ce7f]" />
                          <span className="text-xs italic truncate">"{artist.new_release}"</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats / Action */}
                    <div className="mt-auto pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex -space-x-2">
                           <div className="w-8 h-8 rounded-full bg-white/5 border border-[#0a0a0a] flex items-center justify-center text-[10px] font-bold">
                             {artist.upcoming_shows.length}
                           </div>
                           <span className="pl-4 text-[10px] text-gray-500 self-center uppercase tracking-tighter">Shows</span>
                        </div>
                        {artist.youtube_id && (
                          <LucideVideo className="w-5 h-5 text-red-500 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
                        )}
                      </div>

                      <button className="w-full py-3 bg-white/5 hover:bg-[#00ce7f] hover:text-black hover:shadow-[0_0_20px_rgba(0,206,127,0.3)] border border-white/10 hover:border-transparent rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group/btn text-sm">
                        View Profile <LucideArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32">
              <LucideUser className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No artists found</h3>
              <p className="text-gray-400">Try searching for a different name or genre.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center">
        <p className="text-gray-600 text-sm">© 2024 LocalScene. Celebrating local talent.</p>
      </footer>
    </div>
  );
}