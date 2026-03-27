import { useState, useRef } from "react";

const IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=900&fit=crop",
  "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&h=900&fit=crop",
];

export default function Carousel({ images = IMAGES }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(null);
  const total = images.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="relative w-[420px] h-[520px]"
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
              onClick={() => abs !== 0 && setCurrent(i)}
              className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer transition-all duration-500"
              style={{
                borderRadius: "42px",
                transform: `translateX(${pos * 280}px) scale(${
                  abs === 0 ? 1 : abs === 1 ? 0.8 : 0.65
                })`,
                zIndex: abs === 0 ? 3 : abs === 1 ? 2 : 1,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.6 : 0.3,
                filter: abs === 0 ? "none" : `brightness(${abs === 1 ? 0.7 : 0.5})`,
                boxShadow: abs === 0 ? "0 32px 64px rgba(0,0,0,0.25)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition"
        style={{ fontSize: 20 }}
      >
        &#8249;
      </button>
      <button
        onClick={next}
        className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition"
        style={{ fontSize: 20 }}
      >
        &#8250;
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-200 rounded-full border-none"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}