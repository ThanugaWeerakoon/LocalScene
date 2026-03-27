import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-center py-4">
      <div className="
        relative
        bg-white/10
        backdrop-blur-2xl
        border border-white/20
        rounded-full
        px-10 py-3
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
        before:absolute before:inset-0 before:rounded-full
        before:bg-gradient-to-b before:from-white/25 before:to-transparent
        before:opacity-40 before:pointer-events-none
      ">
        <ul className="flex gap-10 text-lg font-medium list-none text-[#eaeaea]">
          {["Home", "Venues", "Artists", "About"].map((item) => (
            <li key={item}>
              <Link
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="
                  relative
                  after:block after:h-[2px] after:w-full
                  after:scale-x-0 after:origin-center
                  after:bg-[#ffe7d7]
                  after:transition-transform after:duration-300
                  hover:after:scale-x-100
                  hover:text-white
                "
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