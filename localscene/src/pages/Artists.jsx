import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeGenre, setActiveGenre] = useState(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const fetchArtists = async () => {
      const { data, error } = await supabase
        .from("allArtists")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) {
     
        const normalized = data.map((row) => ({
          id: row.id,
          name: row.artist_name,
          genre: row.genre,
          location: row.location,
          new_release: row.new_release,
          image_url: row.image,
          spotify_url: row.spotify_url,
          soundcloud_url: row.soundcloud_url,
          verified: row.verified,
          rates_locked: row.rates_locked,
          upcoming_shows: row.upcoming_shows || [],
          region: row.region,
          venue: row.venue,
          date: row.date,
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
      setPlaying(false);
      setProgress(30);
    }, 300);
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  };

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
        .chip .close { opacity: 0.5; font-size: 10px; }

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

        .player-bar {
          background: rgba(20,20,20,0.9);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .play-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          flex-shrink: 0;
          transition: background 0.18s;
        }
        .play-btn:hover { background: rgba(255,255,255,0.25); }

        .progress-bar {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.12);
          border-radius: 2px;
          cursor: pointer;
          position: relative;
        }
        .progress-fill {
          height: 100%;
          background: rgba(255,255,255,0.6);
          border-radius: 2px;
          pointer-events: none;
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
        .show-card img { width: 100%; height: 110px; object-fit: cover; display: block; }
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

        {/* Right sort */}
        <button className="sort-btn">
          Sort <span style={{ opacity: 0.4 }}>Sort, Region</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "0", minHeight: "calc(100vh - 120px)" }}>

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
            {/* Overlays */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)" }} />

            {/* Arrow nav */}
            <button className="arrow-btn" style={{ left: "12px" }} onClick={() => navigate("prev")}>‹</button>
            <button className="arrow-btn" style={{ right: "12px" }} onClick={() => navigate("next")}>›</button>

            {/* Artist info overlay */}
            <div className={`info-block${transitioning ? " fade" : ""}`}
              style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>

              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "12px" }}>
                {/* Name block */}
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
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "10px", padding: "2px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        🎵 '{artist.new_release}'
                      </span>
                    </div>
                  )}
                </div>

                {/* Rates panel */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ marginBottom: "8px" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: "4px" }}>Rates (Locked)</p>
                    <div className="lock-badge">🔒 Lock</div>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", marginBottom: "6px" }}>Updated CTA</p>
                    <button style={{
                      padding: "8px 16px",
                      background: "#fff",
                      color: "#000",
                      border: "none",
                      borderRadius: "8px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "opacity 0.18s",
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
          </div>

          {/* ── Music Player ── */}
          <div style={{ padding: "14px 20px 10px" }}>
            <div className="player-bar">
              {/* Thumbnail */}
              <img src={artist?.image_url} alt=""
                style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />

              {/* Labels */}
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Spotify</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>SoundCloud</p>
              </div>

              {/* Play */}
              <button className="play-btn" onClick={() => setPlaying(!playing)}>
                {playing ? "⏸" : "▶"}
              </button>

              {/* Progress */}
              <div ref={progressRef} className="progress-bar" onClick={handleProgressClick} style={{ flex: 1 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>

              {/* Time */}
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>4:60</span>

              {/* Spotify icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)" style={{ flexShrink: 0 }}>
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </div>

          {/* ── Upcoming Shows ── */}
          <div style={{ padding: "4px 20px 20px" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", marginBottom: "14px" }}>
              Upcoming Shows
            </h2>

            <div style={{ display: "flex", gap: "12px" }}>
              {(artist?.upcoming_shows || []).map((show, i) => (
                <div key={i} className="show-card">
                  <img src={show.image_url} alt={show.venue} />
                  <div className="show-card-overlay" />
                  <div className="show-card-info">
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "1px" }}>{show.date}</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "1px" }}>{show.city}</p>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>{show.venue}</p>
                    <a href={show.ticket_url} style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.65)",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                      letterSpacing: "0.04em",
                    }}>Buy Tickets</a>
                  </div>
                </div>
              ))}
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

          {/* Rates card */}
          <div className="glass-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>Rates</span>
              <div className="lock-badge">🔒 Lock</div>
            </div>
            <button className="contact-btn">Contact Now to Book</button>
          </div>

          {/* Gig Stats Sidebar */}
          <div className="glass-card" style={{ padding: "16px", flex: 1 }}>
            <p style={{
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "14px",
            }}>
              Gig Stats Sidebar
            </p>

            {/* Artist mini card */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <img src={artist?.image_url} alt={artist?.name}
                style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.12)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {artist?.name}
                  </p>
                  {artist?.verified && <div className="verified-badge">✓</div>}
                </div>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>{artist?.genre}</p>
              </div>
            </div>

            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginBottom: "12px", lineHeight: 1.5 }}>
              Glass card with Verified Badge
            </p>

            {/* Stats rows */}
            {[
              { label: "Followers", value: "12.4K" },
              { label: "Shows / yr", value: "38" },
              { label: "Response rate", value: "97%" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{s.value}</span>
              </div>
            ))}

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className="contact-btn">Contact</button>
              <button className="contact-btn-outline">Message</button>
            </div>
          </div>

          {/* Second gig stats note */}
          <div style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "4px" }}>
              Gig Stats Sidebar
            </p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", lineHeight: 1.4 }}>
              Glass card with Verified Badge, Contact
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}