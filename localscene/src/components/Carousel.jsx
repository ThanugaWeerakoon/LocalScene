import { useState, useRef } from "react";

const ARTISTS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop&crop=face",
    name: "The Strumbellas",
    venue: "@ Phoenix Concert Theatre, Tor, Oct 26",
    genre: "Indie Folk, ON",
    emoji: "🎸",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=800&fit=crop&crop=face",
    name: "Savanah",
    venue: "@ Metropolis, MTL, Oct 29",
    genre: "Singer-Songwriter, QC",
    emoji: "🔥",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face",
    name: "NEW: 'Polaris'",
    venue: "Alt-Folk, QC",
    genre: "Alt-Folk, QC",
    emoji: "🎵",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=600&h=800&fit=crop&crop=face",
    name: "Lunar Echo",
    venue: "@ Danforth Music Hall, Tor, Nov 3",
    genre: "Dream Pop, BC",
    emoji: "🌙",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=800&fit=crop&crop=face",
    name: "Crestfall",
    venue: "@ Le National, MTL, Nov 8",
    genre: "Post-Rock, AB",
    emoji: "🎤",
  },
];

const CARD_SIZES = {
  0: { w: 380, h: 560 }, 
  1: { w: 320, h: 500 }, 
  2: { w: 260, h: 440 }, 
};

const CARD_SPACING = 290;

export default function MusicCarousel({ items = ARTISTS }) {
  const [current, setCurrent] = useState(2);
  const touchStart = useRef(null);
  const total = items.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div
      style={{       
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        padding: "20px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 500,
          background: "radial-gradient(ellipse, rgba(80,60,160,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: 1600 }}>
        <div
          style={{
            position: "relative",
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
          onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const diff = e.changedTouches[0].clientX - touchStart.current;
            if (diff > 50) prev();
            else if (diff < -50) next();
          }}
        >
          {items.map((item, i) => {
            const offset = ((i - current + total) % total + total) % total;
            const pos = offset <= total / 2 ? offset : offset - total;
            const abs = Math.abs(pos);
            if (abs > 2) return null;

            const isActive = abs === 0;
            const size = CARD_SIZES[abs] || CARD_SIZES[2];
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.72 : 0.45;

            return (
              <div
                key={item.id}
                onClick={() => !isActive && setCurrent(i)}
                style={{
                  position: "absolute",
                  width: size.w,
                  height: size.h,
                  borderRadius: 20,
                  overflow: "hidden",
                  cursor: isActive ? "default" : "pointer",
                  transform: `translateX(${pos * CARD_SPACING}px)`,
                  zIndex: 10 - abs,
                  opacity,
                  transition: "all 0.45s cubic-bezier(0.25,0.46,0.45,0.94)",
                  boxShadow: isActive
                    ? "0 24px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07)"
                    : "0 8px 30px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: isActive
                      ? "none"
                      : `brightness(${abs === 1 ? 0.55 : 0.38}) saturate(0.65)`,
                    transition: "filter 0.45s ease",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isActive
                      ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)"
                      : "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
                    transition: "all 0.45s ease",
                  }}
                />

                {isActive && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 16px 16px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{item.emoji}</span>
                      <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
                        {item.name}
                      </p>
                    </div>
                    <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.7)", fontSize: 11, lineHeight: 1.35 }}>
                      {item.venue}
                    </p>
                    <button
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        borderRadius: 20,
                        border: "1.5px solid rgba(255,255,255,0.5)",
                        background: "rgba(0,0,0,0.35)",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: "0.02em",
                        backdropFilter: "blur(6px)",
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.18)"; e.target.style.borderColor = "rgba(255,255,255,0.9)"; }}
                      onMouseLeave={(e) => { e.target.style.background = "rgba(0,0,0,0.35)"; e.target.style.borderColor = "rgba(255,255,255,0.5)"; }}
                    >
                      Explore Now
                    </button>
                  </div>
                )}

                {!isActive && (
                  <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, padding: "0 10px" }}>
                    <p style={{
                      margin: 0,
                      color: "rgba(255,255,255,0.75)",
                      fontWeight: 600,
                      fontSize: abs === 1 ? 12 : 10,
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {item.name}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Genre tag */}
        <div style={{ textAlign: "center", marginTop: 58 }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.55)",
            fontSize: 11,
            letterSpacing: "0.04em",
          }}>
            {items[current].genre}
          </span>
        </div>

        {/* Arrows */}
        {[
          { onClick: prev, icon: "‹", pos: { left: 8 } },
          { onClick: next, icon: "›", pos: { right: 8 } },
        ].map(({ onClick, icon, pos }) => (
          <button
            key={icon}
            onClick={onClick}
            style={{
              position: "absolute",
              top: "42%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.85)",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              ...pos,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
          >
            {icon}
          </button>
        ))}

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 18 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                padding: 0,
                border: "none",
                borderRadius: 99,
                background: i === current ? "#fff" : "rgba(255,255,255,0.25)",
                width: i === current ? 22 : 6,
                height: 6,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}