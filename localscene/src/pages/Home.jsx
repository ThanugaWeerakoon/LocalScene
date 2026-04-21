
import Carousel from "../components/Carousel";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";


export default function Home() {

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    async function fetchArtists() {
      const { data, error } = await supabase
        .from("allArtists")
        .select("*")
        .limit(7);

      if (!error) setArtists(data);
    }
    fetchArtists();
  }, []);
  
  return (    
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #0a0a0a 40%, #0a0a0a 100%)" }}>
   <Header />
      <section className="flex flex-col items-center justify-center text-center px-6 pt-5 pb-8 gap-4">
        
       
      </section>
      <div className="pb-5 flex items-center justify-center">
        
      </div>

      {/* Carousel */}
      <div className="px-4 pb-16">
        <Carousel />
      </div>
  
<section className="px-6 pb-16">
  
  <h3 className="text-2xl font-bold text-white mb-6 pl-2">
    Discover by Category
  </h3>

  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
    {[
      { label: "All", sub: "Browse everything", accent: true },
      { label: "Venues", sub: "Local stages & clubs", accent: false },
      { label: "Province", sub: "Search by region", accent: false },
      { label: "Artists", sub: "Find performers", accent: false },
    ].map((cat) => (
      <div
        key={cat.label}
        className="p-6 rounded-2xl cursor-pointer transition-all"
        style={{
          border: cat.accent
            ? "2px solid rgba(0,206,113,0.3)"
            : "2px solid rgba(255,255,255,0.12)",
        }}
      >
        <p
          className="font-bold text-lg mb-1"
          style={{ color: cat.accent ? "#00ce7f" : "white" }}
        >
          {cat.label}
        </p>
        <p className="text-xs" style={{ color: "rgba(255,231,215,0.45)" }}>
          {cat.sub}
        </p>
      </div>
    ))}
  </div>
  
</section>
<section className="px-6 pb-16">
  <h3 className="text-2xl font-bold text-white mb-6 pl-2">UPCOMING GIGS NEAR (Toronto)</h3>

  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-7 gap-4">
    {artists.map((artist) => (
      <div
        key={artist.id}
        className="rounded-md p-0 transition-all flex flex-col"
        style={{
          background: "rgba(202, 202, 202, 0.02)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 0 20px rgba(3, 0, 0, 0.35)",
        }}
      >
        <img
          src={artist.image}
          alt={artist.artist_name}
          className="w-full h-32 rounded-t-md object-cover mb-4 "
        />

        <p className="text-xl font-bold mt-1 ml-2" style={{ color: "white" }}>
          {new Date(artist.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
         <p className="text-md font-bold mt-1 ml-2" style={{ color: "white" }}>
          {artist.venue}
        </p>
        <h2 className="text-lg ml-2" style={{ color: "#ffe7d7" }}>
          {artist.artist_name}
        </h2>
        <button
          className="mt-auto pt-3 px-4 py-2 text-white text-sm rounded-b-lg font-semibold hover:underline"
        >
          Tickets
        </button>
      </div>
    ))}
  </div>
</section>
    </div>
    
  );
}