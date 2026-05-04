import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import { 
  Search as LucideSearch, 
  ChevronRight as LucideChevronRight, 
  ChevronLeft as LucideChevronLeft,
  Calendar as LucideCalendar,
  MapPin as LucideMapPin,
  Music as LucideMusic,
  Users as LucideUsers,
  Building2 as LucideBuilding,
  ArrowRight as LucideArrowRight,
  Loader2 as LucideLoader
} from "lucide-react";

export default function Home() {
  const [carouselEvents, setCarouselEvents] = useState([]);
  const [upcomingGigs, setUpcomingGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*, artists(*), venues(*)")
          .order("date_time", { ascending: true });

        if (error) throw error;

        if (data) {
          const normalized = data.map(event => ({
            id: event.id,
            title: event.event_name,
            artist: event.artists?.artist_name || "Unknown Artist",
            venue: event.venues?.venue_name || "Secret Location",
            location: event.venues?.location || event.region,
            date: new Date(event.date_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            image: event.artists?.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=60",
            price: event.ticket_price,
            genre: event.artists?.genre || "Music",
          }));

          setCarouselEvents(normalized.slice(0, 5));
          setUpcomingGigs(normalized.slice(0, 10));
        }
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (carouselEvents.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselEvents.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselEvents]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselEvents.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselEvents.length) % carouselEvents.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <LucideLoader className="w-10 h-10 text-[#00ce7f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <Header />

      {/* Hero Carousel */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {carouselEvents.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto">
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-[#00ce7f] text-black text-xs font-bold rounded-full uppercase tracking-widest">
                    Featured Event
                  </span>
                  <span className="text-gray-400 text-sm font-medium tracking-wide">
                    {event.genre}
                  </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tighter">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-lg text-gray-300">
                  <div className="flex items-center gap-2">
                    <LucideMusic className="w-5 h-5 text-[#00ce7f]" />
                    <span>{event.artist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LucideMapPin className="w-5 h-5 text-[#00ce7f]" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LucideCalendar className="w-5 h-5 text-[#00ce7f]" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button className="px-8 py-4 bg-[#00ce7f] text-black font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(0,206,127,0.4)] transition-all transform hover:scale-105">
                    Get Tickets
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/10 font-bold rounded-2xl hover:bg-white/20 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-10 right-6 md:right-20 z-30 flex items-center gap-4">
          <button 
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-[#00ce7f] hover:text-black transition-all"
          >
            <LucideChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-[#00ce7f] hover:text-black transition-all"
          >
            <LucideChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-6 md:left-20 z-30 flex items-center gap-3">
          {carouselEvents.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? "w-12 bg-[#00ce7f]" : "w-3 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Discovery Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Discover the <span className="text-[#00ce7f]">Scene</span></h2>
            <p className="text-gray-400 text-lg max-w-xl">Explore upcoming performances, legendary venues, and local talent in your city.</p>
          </div>
          <button className="flex items-center gap-2 text-[#00ce7f] font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm">
            View All Events <LucideArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Gigs", sub: "Live music, underground sessions & concerts", icon: LucideMusic, link: "/gigs", color: "bg-purple-500" },
            { label: "Venues", sub: "Iconic stages, intimate clubs & local halls", icon: LucideBuilding, link: "/venues", color: "bg-blue-500" },
            { label: "Artists", sub: "Rising stars, local legends & performers", icon: LucideUsers, link: "/artists", color: "bg-[#00ce7f]" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.link}
              className="group relative p-8 bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-[#00ce7f]/30 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl ${item.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <item.icon className={`w-7 h-7 text-white`} />
              </div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-[#00ce7f] transition-colors">{item.label}</h3>
              <p className="text-gray-400 leading-relaxed mb-6">{item.sub}</p>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                Explore <LucideChevronRight className="w-4 h-4" />
              </div>
              
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </section>

      {/* Upcoming Gigs Section */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold italic tracking-tight">The <span className="text-[#00ce7f]">Roster</span></h2>
            <div className="hidden md:flex gap-4">
               {/* Could add filter tabs here */}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {upcomingGigs.map((gig) => (
              <div
                key={gig.id}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 hover:border-[#00ce7f]/40 transition-all duration-500 cursor-pointer"
              >
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-80" />
                
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-[#00ce7f] uppercase">
                  {gig.date}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    {gig.artist}
                  </p>
                  <h4 className="text-lg font-bold group-hover:text-[#00ce7f] transition-colors leading-tight mb-3">
                    {gig.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <LucideMapPin className="w-3 h-3" />
                    <span className="truncate">{gig.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-3 mx-auto">
                Load More Gigs <LucideArrowRight className="w-5 h-5 text-[#00ce7f]" />
             </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Local<span className="text-[#00ce7f]">Scene</span></h2>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
              Your ultimate guide to the local music landscape. Discover shows, support artists, and experience the scene like never before.
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gray-500">Navigation</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/" className="hover:text-[#00ce7f] transition-colors">Home</a></li>
              <li><a href="/gigs" className="hover:text-[#00ce7f] transition-colors">Find Gigs</a></li>
              <li><a href="/venues" className="hover:text-[#00ce7f] transition-colors">Venues</a></li>
              <li><a href="/artists" className="hover:text-[#00ce7f] transition-colors">Artists</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-gray-500">Legal</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#" className="hover:text-[#00ce7f] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#00ce7f] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#00ce7f] transition-colors">Ticket Info</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-white/5 text-center text-gray-600 text-sm">
          <p>© 2026 LocalScene. Keeping the rhythm alive.</p>
        </div>
      </footer>
    </div>
  );
}
