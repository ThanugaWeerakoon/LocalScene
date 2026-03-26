import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white py-3">
      
      {/* Center container */}
      <ul className="flex justify-center items-center gap-4 text-xl font-medium">
        
        <li>
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
        </li>

        <li>
          <Link to="/venues" className="hover:text-blue-600 transition">
            Venues
          </Link>
        </li>

        <li>
          <Link to="/artists" className="hover:text-blue-600 transition">
            Artists
          </Link>
        </li>

        <li>
          <Link to="/about" className="hover:text-blue-600 transition">
            About
          </Link>
        </li>

      </ul>
    </nav>
  );
}