import { useEffect, useRef, useState, useCallback } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  colorClass: string;
  animationDelay: number;
  animationDuration: number;
}

const STAR_COUNT = 120;
const PARALLAX_INTENSITY = 10;

const STAR_COLORS = [
  "bg-(--star-color-white)",
  "bg-(--star-color-primary)",
  "bg-(--star-color-accent1)",
  "bg-(--star-color-accent2)",
];

function generateStars(): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      colorClass: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      animationDelay: Math.random() * 5,
      animationDuration: 2 + Math.random() * 3,
    });
  }
  return stars;
}

export function StarBackground() {
  const [stars] = useState<Star[]>(() => generateStars());
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate offset from center (normalized -1 to 1)
    const offsetX = (mouseX - centerX) / centerX;
    const offsetY = (mouseY - centerY) / centerY;

    // Apply parallax in opposite direction
    setMouseOffset({
      x: -offsetX * PARALLAX_INTENSITY,
      y: -offsetY * PARALLAX_INTENSITY,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${mouseOffset.x}px, ${mouseOffset.y}px)`,
        }}
      >
        {stars.map((star) => (
          <div
            key={star.id}
            className={`absolute rounded-full animate-twinkle ${star.colorClass}`}
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
