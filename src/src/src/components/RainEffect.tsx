import { useEffect, useState } from "react";

interface Raindrop {
  id: number;
  x: number;
  delay: number;
  duration: number;
}

export const RainEffect = ({ isActive }: { isActive: boolean }) => {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);

  useEffect(() => {
    if (isActive) {
      const newRaindrops: Raindrop[] = [];

      for (let i = 0; i < 50; i++) {
        newRaindrops.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 1,
          duration: 0.8 + Math.random() * 0.4,
        });
      }

      setRaindrops(newRaindrops);
    } else {
      setRaindrops([]);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute w-0.5 h-8 bg-rain opacity-60 animate-rain-fall"
          style={{
            left: `${drop.x}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
