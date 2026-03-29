
import Carousel from "../components/Carousel";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#0e0914" }}>

      
   <Header />

      {/* Hero Section */}
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

      {/* Section Label */}
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

    </div>
  );
}