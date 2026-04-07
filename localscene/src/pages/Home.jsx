
import Carousel from "../components/Carousel";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0e0914" }}>
   <Header />
      <section className="flex flex-col items-center justify-center text-center px-6 pt-5 pb-8 gap-4">
        
        <div
          className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
          style={{
            background: "rgba(0,206,113,0.1)",
            border: "1px solid rgba(0,206,113,0.25)",
            color: "#00ce71",
          }}
        >
          Discover Your Local Scene
        </div>
        <h2
          className="text-4xl sm:text-5xl font-black leading-tight tracking-tight max-w-2xl"
          style={{ color: "#ffe7d7" }}
        >
          Live Music.{" "}
          <span style={{ color: "#a21313" }}>Real Venues.</span>
          <br />
          Your City.
        </h2>
        <p
          className="text-sm max-w-md leading-relaxed"
          style={{ color: "rgba(255,231,215,0.5)" }}
        >
          Find artists performing near you, discover hidden gems, and never
          miss a local show again.
        </p>
      </section>
      <div className="pb-5 flex items-center justify-center">
        <span
          className="text-xl font-bold tracking-widest uppercase"
          style={{ color: "rgba(255,231,215,0.35)" }}
        >
          Discover
        </span>
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
      { label: "All", sub: "Browse everything", accent: false },
      { label: "Venues", sub: "Local stages & clubs", accent: true },
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
          style={{ color: cat.accent ? "#00ce71" : "white" }}
        >
          {cat.label}
        </p>
        <p className="text-xs" style={{ color: "rgba(255,231,215,0.45)" }}>
          {cat.sub}
        </p>
      </div>
    ))}
  </div>

  <div
    className="p-6 rounded-2xl cursor-pointer flex justify-between items-center"
    style={{
      border: "2px solid rgba(162,19,19,0.4)",
      background: "rgba(162,19,19,0.07)",
    }}
  >
    <div>
      <p className="font-bold text-lg mb-1" style={{ color: "#ff6b6b" }}>
        Upcoming Events
      </p>
      <p className="text-xs" style={{ color: "rgba(255,231,215,0.45)" }}>
        Shows happening near you this week
      </p>
    </div>
    <div
      className="px-3 py-1 rounded-lg"
      style={{ background: "rgba(162,19,19,0.15)" }}
    >
      <span className="text-xs font-bold" style={{ color: "#ff6b6b" }}>
        LIVE
      </span>
    </div>
  </div>

  <div className="rounded-2xl p-6 mt-6 shadow-2xl transition-all duration-300 hover:scale-105 w-fit h-64"
          style={{
            background:"rgba(202, 202, 202, 0.02)",
            backdropFilter:"blur(18px)",
            WebkitBackdropFilter:"blur(18px)",
            border:"1px solid rgba(255, 255, 255, 0.15)",
            boxShadow:"0 0 20px rgba(138, 138, 138, 0.35)",
          }}
    >
        <h2 className="text-2xl font-bold text-white">Artist Name</h2>
        <p className="text-sm text-gray-300 mt-2">Colombo </p>
        <button className="mt-4 px-4 py-2 text-white rounded-lg bg-[#a21313]">View</button>

      </div>
</section>
    </div>
  );
}