import Header from "../components/Header";
import sm from "../assets/a1.jpg";

export default function Artists() {
  return (
    <div className="flex flex-col min-h-screen bg-black">

      <div className="relative h-[90vh] w-full overflow-hidden">

        {/* Image */}
        <img
          src={sm}
          alt="artist"
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

     

      {/* Page content */}
      <div className="flex-1 bg-black" />

       <div className="absolute left-10 top-2/3 -translate-y-1/2 max-w-sm w-[90%] ">
          <div
            className="rounded-2xl p-6 shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <p className="text-2xl text-white">[ARTIST]</p>
          <h2 className="text-3xl font-bold text-white">Artist Name</h2>
            <p className="text-xl text-white">Location</p>
            <p className="text-xl text-white font-bold">New Release</p>

          </div>
          </div>

    </div>
  );
}