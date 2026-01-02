RocketBackground.tsx"use client";
import { useEffect, useState } from "react";

interface Rocket {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export default function RocketBackground() {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRocket: Rocket = {
        id: nextId,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 2,
      };
      setRockets((prev) => [...prev, newRocket]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setRockets((prev) => prev.filter((r) => r.id !== newRocket.id));
      }, (newRocket.duration + newRocket.delay) * 1000);
    }, 2000);

    return () => clearInterval(interval);
  }, [nextId]);

  return (
    <>
      <style>{`
        @keyframes rocketFly {
          0% {
            opacity: 1;
            transform: translateY(100vh) rotate(45deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-100vh) rotate(45deg);
          }
        }
        
        @keyframes rocketGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(255, 100, 0, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(255, 100, 0, 0.8));
          }
        }
        
        .rocket {
          position: fixed;
          pointer-events: none;
          font-size: 28px;
          z-index: 5;
          animation: rocketGlow 0.3s ease-in-out infinite;
        }
      `}</style>
      {rockets.map((rocket) => (
        <div
          key={rocket.id}
          className="rocket"
          style={{
            left: `${rocket.left}%`,
            bottom: 0,
            animation: `rocketFly ${rocket.duration}s linear ${rocket.delay}s forwards`,
          }}
        >
          🚀
        </div>
      ))}
    </>
  );
}
