import { useState } from "react";
import { SearchIcon } from "lucide-react";
import Navbar from "../components/Navigation";
import Carousel from "../components/Carousel"; 
import bg from "../assets/bg-home.jpg";


export default function Home() {
  const [query, setQuery] = useState("");


  const handleSearch = () => {
    console.log("Searching:", query);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-[#121212]"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header: Logo + Search + Login */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left - Title */}
          <h1 className="text-2xl font-bold whitespace-nowrap text-white/70">
            [LS] LocalScene.ca
          </h1>

          {/* Center - Search */}
          <div className="relative flex-1 max-w-5xl">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Venues, Artists"
              className="bg-white/15 border border-white/20 w-full pl-10 pr-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Right - Login Button */}
          <div className="flex-shrink-0">
            <button className="bg-white/15 border border-white/20 px-6 py-2 backdrop-blur-md text-white rounded-lg hover:bg-blue-600 transition">
              Login / Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <Navbar />

  <Carousel/>

    </div>
  );
}