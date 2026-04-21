import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) {
                  const normalized = data.map((row) => ({
              id: row.id,
              name: row.artist_name,
              genre: row.genre,
              location: row.location,
              new_release: row.new_release,
              contact_email: row.contact_email, // fetched but hidden for now
              image_url: row.image,
              photo_url: row.photo_url,
              verified: row.verified,
              rates_locked: row.rates_locked,
              upcoming_shows: row.upcoming_shows || [],
              region: row.region,
              youtube_id: row.youtube_link, 
            }));
        setArtists(normalized);
      }
      setLoading(false);
    };
    fetchArtists();
  }, []);

  const artist = artists[currentIndex];

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "13px", letterSpacing: "0.1em" }}>Loading artists…</p>
    </div>
  );

  if (!artist) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.3)", fontSize: "13px", letterSpacing: "0.1em" }}>No artists found.</p>
    </div>
  );

  const navigate = (dir) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        dir === "next"
          ? (prev + 1) % artists.length
          : prev === 0 ? artists.length - 1 : prev - 1
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
          bottom: 0;
          left: 0;
          right: 0;
          padding: 10px 12px;
        }

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

        .lock-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 9px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.06em;
        }

        .verified-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          background: #1d9bf0;
          border-radius: 50%;
          font-size: 10px;
          flex-shrink: 0;
        }

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
       
        <button className="sort-btn">
          Sort <span style={{ opacity: 0.4 }}>Sort, Region</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: "grid", minHeight: "calc(100vh - 120px)" }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Hero image */}
          <div style={{ position: "relative", height: "520px", overflow: "hidden", background: "#111" }}>
            <img
              src={artist?.image_url}
              alt={artist?.name}
              className={`hero-img${transitioning ? " fade" : ""}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />

            <button className="arrow-btn" style={{ left: "12px" }} onClick={() => navigate("prev")}>‹</button>
            <button className="arrow-btn" style={{ right: "12px" }} onClick={() => navigate("next")}>›</button>

            <div className={`info-block${transitioning ? " fade" : ""}`}
              style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 400, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: "4px" }}>
                    [Artist]
                  </p>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1, color: "#fff", marginBottom: "5px" }}>
                    {artist?.name}
                  </h1>
                  <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
                    {artist?.genre} &nbsp;·&nbsp; {artist?.location}
                  </p>
                  {artist?.new_release && (
                    <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      🎵 {artist.new_release}
                    </span>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ marginBottom: "8px" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: "4px" }}>Rates (Locked)</p>
                    <div className="lock-badge">🔒 Lock</div>
                  </div>
                  <button style={{
                    padding: "8px 16px", background: "#fff", color: "#000", border: "none",
                    borderRadius: "8px", fontFamily: "'DM Sans', sans-serif", fontSize: "12px",
                    fontWeight: 600, cursor: "pointer",
                  }}
                    onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
                    onMouseOut={e => e.currentTarget.style.opacity = "1"}
                  >
                    Contact Now to Book
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── New Release / YouTube Player ── */}
          <div style={{ padding: "14px 20px 10px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "12px" }}>
              New Release
            </h2>
            <div style={{
              background: "rgba(20,20,20,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 12px",
            }}>
              <div style={{ flexShrink: 0, borderRadius: "6px", overflow: "hidden", width: "120px", height: "68px" }}>
                <iframe
                  key={artist?.id}
                  src={`https://www.youtube.com/embed/${artist?.youtube_id || 'dQw4w9WgXcQ'}?rel=0&modestbranding=1`}
                  title={`${artist?.name} - YouTube`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF0000">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {artist?.name}
                  </span>
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
                  {artist?.new_release || "Latest Track"}
                </p>
              </div>
            </div>
          </div>

          {/* ── Upcoming Shows ── */}
          <div style={{ padding: "4px 20px 20px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "14px" }}>
              Upcoming Shows
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              {(artist?.upcoming_shows || []).map((show, i) => (
                <div key={i} className="show-card" style={{
                  background: "rgba(230, 215, 215, 0.05)",
                  border: "2px solid rgba(224, 212, 212, 0.12)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  borderRadius: "12px",
                }}>
                  <div className="show-card-bg" style={{
                    background: gradients[i % gradients.length],
                    opacity: 0.4,
                  }} />
                  <div className="show-card-overlay" />
                  <div className="show-card-info">
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "1px" }}>{show.date}</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "1px" }}>{show.city}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>{show.venue}</p>
                    <a href={show.ticket_url} style={{
                      fontSize: "11px", color: "rgba(255,255,255,0.65)",
                      textDecoration: "underline", textUnderlineOffset: "2px", letterSpacing: "0.04em",
                    }}>Buy Tickets</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}