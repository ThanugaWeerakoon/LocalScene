import { useState, useRef } from "react";

// Simulated Firebase data shape — replace with your real Firebase fetch
const ITEMS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=900&fit=crop",
    title: "Swiss Alps",
    description: "Snow-capped peaks and crystal-clear lakes in the heart of Europe.",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=900&fit=crop",
    title: "Patagonia",
    description: "Wild winds and dramatic landscapes at the southern edge of the world.",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=900&fit=crop",
    title: "Golden Hour",
    description: "Where light meets land in a fleeting moment of pure magic.",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=900&fit=crop",
    title: "Redwood Forest",
    description: "Ancient giants stretching toward the sky in Northern California.",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=600&h=900&fit=crop",
    title: "Nordic Pines",
    description: "Silent forests blanketed in mist along the Scandinavian coast.",
  },
];

export default function Carousel({ items = ITEMS }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(null);
  const total = items.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div className="relative w-full h-[560px] flex items-center justify-center overflow-hidden">
      <div
        className="relative w-[420px] h-[520px]"
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

          return (
            <div
              key={item.id}
              onClick={() => !isActive && setCurrent(i)}
              className="absolute top-0 left-0 w-full h-full cursor-pointer transition-all duration-500"
              style={{
                borderRadius: "42px",
                transform: `translateX(${pos * 280}px) scale(${
                  abs === 0 ? 1 : abs === 1 ? 0.8 : 0.65
                })`,
                zIndex: abs === 0 ? 3 : abs === 1 ? 2 : 1,
                opacity: abs === 0 ? 1 : abs === 1 ? 0.6 : 0.3,
                overflow: "hidden",
              }}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: abs === 0 ? "none" : `brightness(${abs === 1 ? 0.7 : 0.5})`,
                }}
              />

              {/* Title + description overlay — only on active card */}
              {isActive && (
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                    borderRadius: "0 0 42px 42px",
                  }}
                >
                  <p
                    className="text-white font-semibold mb-1 leading-tight"
                    style={{ fontSize: 20 }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-white/80 leading-snug"
                    style={{ fontSize: 13 }}
                  >
                    {item.description}
                  </p>
                </div>
              )}
            </div>
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
        {items.map((_, i) => (
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