"use client";
import { useEffect, useState, useRef } from "react";

interface Rocket {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}

export default function RocketBackground() {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Stagger rocket launches for natural feel
      const startX = Math.random() * 30 - 15;
      const startY = 105;
      const endX = 60 + Math.random() * 30;
      const endY = -15;

      const newRocket: Rocket = {
        id: nextId,
        startX,
        startY,
        endX,
        endY,
        duration: 12 + Math.random() * 4,
      };

      setRockets((prev) => [...prev, newRocket]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setRockets((prev) => prev.filter((r) => r.id !== newRocket.id));
      }, newRocket.duration * 1000);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rocketAscend {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.8);
          }
          3% {
            opacity: 1;
          }
          97% {
            opacity: 0.95;
          }
          100% {
            opacity: 0;
            transform: translate(0, -100vh) scale(1);
          }
        }

        @keyframes trailFade {
          0% {
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .rocket-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(100, 120, 200, 0.15) 0%,
            rgba(150, 100, 200, 0.1) 40%,
            rgba(200, 150, 100, 0.05) 100%
          );
        }

        .rocket {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 40% 40%,
            rgba(255, 255, 255, 1),
            rgba(255, 255, 255, 0.8),
            rgba(200, 220, 255, 0.3)
          );
          box-shadow:
            0 0 8px rgba(255, 255, 255, 0.9),
            0 0 16px rgba(200, 220, 255, 0.6),
            0 0 24px rgba(150, 180, 255, 0.3),
            inset -1px -1px 4px rgba(255, 255, 255, 0.7);
          animation: rocketAscend var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          filter: blur(0.2px);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .trail-segment {
          position: absolute;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.4) 30%,
            rgba(200, 220, 255, 0.2) 70%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(1.2px);
          animation: trailFade var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .rocket-glow {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.3),
            rgba(200, 220, 255, 0.1),
            transparent
          );
          animation: rocketAscend var(--duration) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          filter: blur(3px);
        }
      `}</style>

      <div className="rocket-container">
        {rockets.map((rocket) => {
          const deltaX = rocket.endX - rocket.startX;
          const deltaY = rocket.endY - rocket.startY;

          return (
            <div key={rocket.id}>
              {/* Distant glow/aura */}
              <div
                className="rocket-glow"
                style={{
                  left: `${rocket.startX}%`,
                  top: `${rocket.startY}%`,
                  width: '28px',
                  height: '28px',
                  '--duration': `${rocket.duration}s`,
                  transform: `translate(${deltaX}vw, ${deltaY}vh)`,
                } as React.CSSProperties & { '--duration': string }}
              />

              {/* Exhaust trail segments - thin and elegant */}
              {[...Array(20)].map((_, i) => {
                const progress = i / 20;
                const trailSegmentX = rocket.startX + (deltaX * progress);
                const trailSegmentY = rocket.startY + (deltaY * progress);
                const segmentOpacity = Math.max(0, 1 - progress * 1.2);
                const segmentWidth = 2 + progress * 3;

                return (
                  <div
                    key={`trail-${i}`}
                    className="trail-segment"
                    style={{
                      left: `${trailSegmentX}%`,
                      top: `${trailSegmentY}%`,
                      width: `${segmentWidth}px`,
                      height: '2px',
                      opacity: segmentOpacity * 0.6,
                      '--duration': `${rocket.duration}s`,
                      animationDelay: `${-rocket.duration * progress}s`,
                      transform: `translate(-50%, -50%)`,
                    } as React.CSSProperties & { '--duration': string }}
                  />
                );
              })}

              {/* Main rocket - minimalist and bright */}
              <div
                className="rocket"
                style={{
                  left: `${rocket.startX}%`,
                  top: `${rocket.startY}%`,
                  '--duration': `${rocket.duration}s`,
                  transform: `translate(0, 0)`,
                } as React.CSSProperties & { '--duration': string }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
