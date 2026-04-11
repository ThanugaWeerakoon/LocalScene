import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    const { data, error } = await supabase.from("artists").select("*");
    if (!error) setArtists(data);
  };

  const currentArtist = artists[currentIndex];

  const navigate = (dir) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        dir === "next"
          ? (prev + 1) % artists.length
          : prev === 0
          ? artists.length - 1
          : prev - 1
      );
      setTransitioning(false);
    }, 350);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
   
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@200;300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .artist-image {
          transition: opacity 0.35s ease, transform 0.6s ease;
          opacity: 1;
          transform: scale(1.03);
        }

        .artist-image.fade {
          opacity: 0;
          transform: scale(1.06);
        }

        .nav-btn {
          background: transparent;
          border: 0.5px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.7);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 10px 22px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .nav-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }

        .nav-btn.primary {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.4);
          color: #fff;
        }

        .ticket-btn {
          background: transparent;
          border: 0.5px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.6);
          font-family: 'Outfit', sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 8px 18px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ticket-btn:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }

        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transition: background 0.3s ease, transform 0.3s ease;
          cursor: pointer;
          border: none;
          padding: 0;
        }

        .dot.active {
          background: rgba(255,255,255,0.85);
          transform: scale(1.3);
        }

        .info-fade {
          transition: opacity 0.3s ease, transform 0.3s ease;
          opacity: 1;
          transform: translateY(0);
        }

        .info-fade.fade {
          opacity: 0;
          transform: translateY(6px);
        }
      `}</style>

      {/* Full-bleed hero image */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
        }}
      >
        <img
          src={currentArtist?.image_url}
          alt={currentArtist?.name}
          className={`artist-image${transitioning ? " fade" : ""}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />

        {/* Cinematic dark overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.45) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.15) 100%)",
          }}
        />
      </div>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Header />
      </div>

      {/* Main layout */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          minHeight: "100vh",
          padding: "0 0 52px 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "end",
            gap: "0",
            padding: "0 60px",
          }}
        >
          {/* LEFT — Artist identity */}
          <div className={`info-fade${transitioning ? " fade" : ""}`}>
            {/* Category tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "0.5px",
                  background: "rgba(255,255,255,0.4)",
                }}
              />
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "10px",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Featured Artist
              </span>
            </div>

            {/* Artist name */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(52px, 7vw, 90px)",
                fontWeight: 300,
                lineHeight: 0.92,
                letterSpacing: "-0.01em",
                color: "#fff",
                marginBottom: "20px",
              }}
            >
              {currentArtist?.name || "—"}
            </h1>

            {/* Location */}
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                fontWeight: 300,
                letterSpacing: "0.12em",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              {currentArtist?.location}
            </p>

            {/* New release */}
            {currentArtist?.new_release && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "40px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.6)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "16px",
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.65)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {currentArtist.new_release}
                </span>
              </div>
            )}

            {/* Navigation */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "28px",
              }}
            >
              <button className="nav-btn" onClick={() => navigate("prev")}>
                ← Prev
              </button>
              <button
                className="nav-btn primary"
                onClick={() => navigate("next")}
              >
                Next →
              </button>

              {/* Dot indicators */}
              <div
                style={{ display: "flex", gap: "6px", marginLeft: "8px" }}
              >
                {artists.map((_, i) => (
                  <button
                    key={i}
                    className={`dot${i === currentIndex ? " active" : ""}`}
                    onClick={() => {
                      if (!transitioning) {
                        setTransitioning(true);
                        setTimeout(() => {
                          setCurrentIndex(i);
                          setTransitioning(false);
                        }, 350);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Index counter */}
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "11px",
                fontWeight: 300,
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(artists.length).padStart(2, "0")}
            </span>
          </div>

          {/* RIGHT — Upcoming event */}
          <div
            className={`info-fade${transitioning ? " fade" : ""}`}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingBottom: "4px",
            }}
          >
            <div
              style={{
                width: "260px",
                borderTop: "0.5px solid rgba(255,255,255,0.15)",
                paddingTop: "24px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "9px",
                  fontWeight: 300,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "16px",
                }}
              >
                Upcoming Event
              </p>

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "22px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.2,
                  marginBottom: "8px",
                }}
              >
                Live in Colombo
              </p>

              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "12px",
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.38)",
                  marginBottom: "24px",
                }}
              >
                April 12 &nbsp;·&nbsp; 7:30 PM
              </p>

              <button className="ticket-btn">Get Tickets</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}