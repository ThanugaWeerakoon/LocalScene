import '../../src/index.css'
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import Navbar from '../../components/Navbar';

export default function Home() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching:", query);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Top Header: Logo + Search + Login */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left - Title */}
          <h1 className="text-2xl font-bold whitespace-nowrap">
            [LS] LocalScene.ca
          </h1>

          {/* Center - Search */}
          <div className="relative flex-1 max-w-5xl">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Venues, Artists"
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Right - Login Button */}
          <div className="flex-shrink-0">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Login / Sign Up
            </button>
          </div>

        </div>
      </div>

      {/* Navbar*/}
      <Navbar />

      

    </div>
  );
}