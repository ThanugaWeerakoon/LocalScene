import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center py-3">
    
      <div className="bg-white/15 backdrop-blur-lg border border-white/20 rounded-full px-8 py-3 shadow-lg">
        <ul className="flex gap-10 text-lg font-medium list-none text-[#e0e0e0]">
          {["Home", "Venues", "Artists", "About"].map((item) => (
            <li key={item}>
              <Link
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative after:block after:h-[3px] after:w-full after:scale-x-0 after:origin-center after:bg-[#ffe7d7] after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}