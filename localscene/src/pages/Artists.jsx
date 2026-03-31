import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";


export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    const { data, error } = await supabase
      .from("artists")
      .select("*");

    if (!error) setArtists(data);
  };

  const currentArtist = artists[currentIndex];

  const nextArtist = () => {
    setCurrentIndex((prev) => (prev + 1) % artists.length);
  };

  const prevArtist = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? artists.length - 1 : prev - 1
    );
  };


  return (
    <div className="flex flex-col min-h-screen bg-black">

      <div className="relative h-[90vh] w-full overflow-hidden">

        {/* Image */}
        <img
           src={currentArtist?.image_url}
  className="w-full h-full object-cover"
          style={{ transform: "scale(1.03)" }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        {/* Main bottom fade */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: "65%",
            background:
              "linear-gradient(to top, #000000 0%, #000000 20%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.5) 65%, transparent 100%)",
          }}
        />

        {/* Frosted blur layer */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: "38%",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            maskImage:
              "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
          }}
        />

        {/* Subtle black tint over blur */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: "38%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)",
          }}
        />

        {/* Hard seal */}
        <div className="absolute bottom-0 left-0 w-full h-[6%] bg-black" />

        {/* Header */}
        <div className="absolute top-0 left-0 w-full">
          <Header />
        </div>

      </div>

     
{/* LEFT SIDE CARDS */}
<div className="absolute left-10 top-2/3 -translate-y-1/2 max-w-sm w-[90%] flex flex-col gap-5">

  {/* Card 1 */}
  <div
    className="rounded-2xl p-6 shadow-2xl"
    style={{
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.12)",
    }}
  >
    <p className="text-2xl text-white">[ARTIST]</p>
          <h2 className="text-3xl font-bold text-white">
          {currentArtist?.name}
        </h2>

        <p className="text-xl text-white">
          {currentArtist?.location}
        </p>

        <p className="text-xl text-white font-bold">
          {currentArtist?.new_release}
        </p>
  </div>

<h2 className="text-lg text-white p-4">Upcoming Events</h2>
  {/* Card 2 */}
  <div
    className="rounded-2xl p-5 shadow-xl"
    style={{
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.1)",
    }}
  >
    <h3 className="text-lg font-semibold text-white">
      Upcoming Event
    </h3>

    <p className="text-sm text-gray-300 mt-2">
      Live in Colombo
    </p>

    <p className="text-xs text-gray-400 mt-1">
      April 12 • 7:30 PM
    </p>

    <button className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-white text-sm">
      Get Tickets
    </button>
  </div>
  

</div>

             {/* NAV BUTTONS */}
        <div className="absolute bottom-10 left-10 flex gap-4">
          <button
            onClick={prevArtist}
            className="px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20"
          >
            ← Prev
          </button>

          <button
            onClick={nextArtist}
            className="px-4 py-2 rounded-lg bg-[#a21313] text-white"
          >
            Next →
          </button>
        </div>

    </div>
    








  );
}