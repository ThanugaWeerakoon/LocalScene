import { useState, useRef } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1490750967868-88df5691cc8e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
];

export default function Carousel({ images = IMAGES }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(null);
  const total = images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div style={s.root}>
      {/* Track */}
      <div
        style={s.track}
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = e.changedTouches[0].clientX - touchStart.current;
          if (diff > 50) prev();
          else if (diff < -50) next();
        }}
      >
        {images.map((src, i) => {
          const offset = ((i - current + total) % total + total) % total;
          const pos = offset <= total / 2 ? offset : offset - total;
          const abs = Math.abs(pos);
          if (abs > 2) return null;

          return (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                ...s.slide,
                transform: `translateX(${pos * 105}%) scale(${abs === 0 ? 1 : abs === 1 ? 0.82 : 0.66})`,
                zIndex: abs === 0 ? 3 : abs === 1 ? 2 : 1,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.6 : 0.3,
                filter: abs === 0 ? "none" : `brightness(${abs === 1 ? 0.6 : 0.4})`,
              }}
              onClick={() => abs !== 0 && setCurrent(i)}
            />
          );
        })}
      </div>

      {/* Arrows */}
      <button style={{ ...s.arrow, left: 16 }} onClick={prev}>&#8249;</button>
      <button style={{ ...s.arrow, right: 16 }} onClick={next}>&#8250;</button>

      {/* Dots */}
      <div style={s.dots}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              ...s.dot,
              background: i === current ? "#fff" : "rgba(255,255,255,0.35)",
              transform: i === current ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const s = {
  root: {
    position: "relative",
    width: "100%",
    height: 360,
    background: "#0a0a0a",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
  },
  track: {
    position: "relative",
    width: "55%",
    height: "72%",
  },
  slide: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
    top: 0,
    left: 0,
  },
  arrow: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    width: 40,
    height: 40,
    borderRadius: "50%",
    fontSize: 22,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    backdropFilter: "blur(4px)",
    transition: "background 0.2s",
  },
  dots: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.2s",
  },
};