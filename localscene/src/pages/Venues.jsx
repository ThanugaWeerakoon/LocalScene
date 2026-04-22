import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [activeRegion, setActiveRegion] = useState("All");

 useEffect(() => {
  const fetchVenues = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*, artists(*), venues(*)")
      .order("date_time", { ascending: true });

    if (!error && data) {
   
      const venueMap = {};
      data.forEach((event) => {
        const id = event.venues.id;
        if (!venueMap[id]) {
          venueMap[id] = {
            id: event.venues.id,
            name: event.venues.venue_name,
            location: event.venues.location,
            region: event.venues.region,
            contact_number: event.venues.contact_number,
            image_url: event.venues.image,
            capacity: event.venues.capacity,
            upcoming_shows: [],
          };
        }
        venueMap[id].upcoming_shows.push({
          date: new Date(event.date_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          artist: event.artists.artist_name,
          city: event.venues.location,
          ticket_url: "#",
        });
      });
      setVenues(Object.values(venueMap));
    }
    setLoading(false);
  };
  fetchVenues();
}, []);

  const venue = venues[currentIndex];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "13px", letterSpacing: "0.1em" }}>Loading venues…</p>
    </div>
  );

  if (!venue) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "13px", letterSpacing: "0.1em" }}>No venues found.</p>
    </div>
  );

  const navigate = (dir) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        dir === "next"
          ? (prev + 1) % venues.length
          : prev === 0 ? venues.length - 1 : prev - 1
      );
      setTransitioning(false);
    }, 300);
  };

  const gradients = [
    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
    "linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.04) 100%)",
    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.3) 100%)",
    "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(255,255,255,0.06) 100%)",
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
        .chip:hover { border-color: rgba(255,255,255,0.35); color: rgba(255,255,255,0.85); }
        .chip.active { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.4); color: #fff; }

        .hero-img {
          transition: opacity 0.3s ease, transform 0.5s ease;
          opacity: 1;
          transform: scale(1);
        }
        .hero-img.fade { opacity: 0; transform: scale(1.03); }

        .info-block {
          transition: opacity 0.25s ease, transform 0.25s ease;
          opacity: 1;
          transform: translateY(0);
        }
        .info-block.fade { opacity: 0; transform: translateY(8px); }

        .arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.18s ease;
          backdrop-filter: blur(4px);
        }
        .arrow-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); color: #fff; }

        .glass-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          backdrop-filter: blur(12px);
        }

        .show-card {
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          flex: 1;
          min-width: 0;
          transition: transform 0.2s ease;
        }
        .show-card:hover { transform: translateY(-2px); }
        .show-card-bg { width: 100%; height: 110px; display: block; }
        .show-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%);
        }
        .show-card-info {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 10px 12px;
        }

        .date-chip {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.04em;
          transition: all 0.18s ease;
          cursor: default;
        }
        .date-chip:hover { background: rgba(255,255,255,0.1); color: #fff; border-color: rgba(255,255,255,0.25); }

        .contact-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          background: #fff;
          color: #000;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.18s;
        }
        .contact-btn:hover { opacity: 0.88; }

        .contact-btn-outline {
          width: 100%;
          padding: 9px;
          border-radius: 8px;
          background: transparent;
          color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.18);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.18s;
        }
        .contact-btn-outline:hover { border-color: rgba(255,255,255,0.4); color: #fff; }

        .sort-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .sort-btn:hover { border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
      `}</style>

      {/* Header */}
      <div style={{ position: "relative", zIndex: 20 }}>
        <Header />
      </div>

      {/* ── Filter bar ── */}
      <div style={{
        position: "relative",
        zIndex: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        gap: "10px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Canada", "USA", "UK", "Australia"].map((r) => (
            <button key={r} className={`chip${activeRegion === r ? " active" : ""}`}
              onClick={() => setActiveRegion(activeRegion === r ? "All" : r)}>
              {r}
            </button>
          ))}
        </div>
        <button className="sort-btn">
          Sort <span style={{ opacity: 0.4 }}>Sort, Region</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", minHeight: "calc(100vh - 120px)" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Hero image */}
          <div style={{ position: "relative", height: "520px", overflow: "hidden", background: "#111" }}>
            <img
              src={venue?.image_url}
              alt={venue?.name}
              className={`hero-img${transitioning ? " fade" : ""}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />

            <button className="arrow-btn" style={{ left: "12px" }} onClick={() => navigate("prev")}>‹</button>
            <button className="arrow-btn" style={{ right: "12px" }} onClick={() => navigate("next")}>›</button>

            {/* Venue info overlay */}
            <div className={`info-block${transitioning ? " fade" : ""}`}
              style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: "4px" }}>
                    [Venue]
                  </p>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1, color: "#fff", marginBottom: "5px" }}>
                    {venue?.name}
                  </h1>
                  <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                    {venue?.location} &nbsp;·&nbsp; {venue?.region}
                  </p>
                  {venue?.capacity && (
                    <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      🏟 Capacity: {venue.capacity.toLocaleString()}
                    </span>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: "6px" }}>
                    📞 {venue?.contact_number}
                  </p>
                  <button
                    style={{
                      padding: "8px 16px", background: "#fff", color: "#000", border: "none",
                      borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                      fontWeight: 600, cursor: "pointer",
                    }}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                    onClick={() => venue?.contact_number && window.open(`tel:${venue.contact_number}`)}
                  >
                    Contact Venue
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Available Dates ── */}
          <div style={{ padding: "14px 20px 10px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "12px" }}>
              Available Dates
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(venue?.available_dates || []).map((date, i) => (
                <span key={i} className="date-chip">📅 {date}</span>
              ))}
              {venue?.available_dates?.length === 0 && (
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>No available dates listed.</p>
              )}
            </div>
          </div>

          {/* ── Upcoming Shows ── */}
          <div style={{ padding: "4px 20px 20px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "14px" }}>
              Upcoming Shows
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              {(venue?.upcoming_shows || []).map((show, i) => (
                <div key={i} className="show-card" style={{
                  background: "rgba(230,215,215,0.05)",
                  border: "2px solid rgba(224,212,212,0.12)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: "12px",
                }}>
                  <div className="show-card-bg" style={{ background: gradients[i % gradients.length], opacity: 0.4 }} />
                  <div className="show-card-overlay" />
                  <div className="show-card-info">
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "1px" }}>{show.date}</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "1px" }}>{show.artist}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>{show.city}</p>
                    <a href={show.ticket_url} style={{
                      fontSize: "11px", color: "rgba(255,255,255,0.65)",
                      textDecoration: "underline", textUnderlineOffset: "2px", letterSpacing: "0.04em",
                    }}>Buy Tickets</a>
                  </div>
                </div>
              ))}
              {venue?.upcoming_shows?.length === 0 && (
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)" }}>No upcoming shows listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          background: "rgba(255,255,255,0.02)",
        }}>

          {/* Contact card */}
          <div className="glass-card" style={{ padding: "16px" }}>
            <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "12px" }}>
              Book This Venue
            </p>
            <button className="contact-btn"
              onClick={() => venue?.contact_number && window.open(`tel:${venue.contact_number}`)}>
              📞 Call Venue
            </button>
          </div>

          {/* Venue Stats card */}
          <div className="glass-card" style={{ padding: "16px", flex: 1 }}>
            <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "14px" }}>
              Venue Info
            </p>

            {/* Venue thumbnail */}
            <div style={{ borderRadius: "10px", overflow: "hidden", marginBottom: "14px", height: "80px" }}>
              <img src={venue?.image_url} alt={venue?.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <p style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "2px", fontFamily: "'Playfair Display', serif" }}>
              {venue?.name}
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>
              {venue?.location}
            </p>

            {[
              { label: "Region", value: venue?.region },
              { label: "Capacity", value: venue?.capacity?.toLocaleString() },
              { label: "Available Dates", value: `${venue?.available_dates?.length || 0} dates` },
              { label: "Upcoming Shows", value: `${venue?.upcoming_shows?.length || 0} shows` },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{s.value}</span>
              </div>
            ))}

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className="contact-btn"
                onClick={() => venue?.contact_number && window.open(`tel:${venue.contact_number}`)}>
                Contact
              </button>
              <button className="contact-btn-outline">Check Availability</button>
            </div>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 0" }}>
            <button onClick={() => navigate("prev")} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", borderRadius: "6px", padding: "5px 10px",
              fontSize: "12px", cursor: "pointer",
            }}>← Prev</button>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
              {String(currentIndex + 1).padStart(2, "0")} / {String(venues.length).padStart(2, "0")}
            </span>
            <button onClick={() => navigate("next")} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", borderRadius: "6px", padding: "5px 10px",
              fontSize: "12px", cursor: "pointer",
            }}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}