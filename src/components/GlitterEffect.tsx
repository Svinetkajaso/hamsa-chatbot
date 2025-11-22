import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  color: string;
}

export const GlitterEffect = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const colors = ["glitter-1", "glitter-2", "glitter-3"];

      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }

      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-2 h-2 rounded-full bg-${particle.color} animate-glitter`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
