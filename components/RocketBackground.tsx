"use client";
import { useEffect, useState } from "react";

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
      // Distant wide-angle perspective launch
      const startX = 40 + Math.random() * 20 - 10;
      const startY = 110;
      const endX = 50 + Math.random() * 10;
      const endY = -20;

      const newRocket: Rocket = {
        id: nextId,
        startX,
        startY,
        endX,
        endY,
        duration: 15 + Math.random() * 5,
      };

      setRockets((prev) => [...prev, newRocket]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setRockets((prev) => prev.filter((r) => r.id !== newRocket.id));
      }, newRocket.duration * 1000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rocketAscendRealistic {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6);
          }
          2% {
            opacity: 0.95;
          }
          98% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate(0, -120vh) scale(1.1);
          }
        }

        @keyframes trailGlow {
          0% {
            opacity: 0;
          }
          4% {
            opacity: 0.8;
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
          /* Deep twilight sky - realistic aerospace photography */
          background: linear-gradient(
            180deg,
            rgba(90, 110, 140, 0.4) 0%,
            rgba(110, 130, 160, 0.3) 25%,
            rgba(130, 140, 160, 0.25) 50%,
            rgba(150, 145, 140, 0.2) 75%,
            rgba(160, 150, 145, 0.15) 100%
          );
          backdrop-filter: blur(0.5px);
        }

        /* Ultra-realistic rocket - small, distant perspective */
        .rocket {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 2px;
          background: radial-gradient(
            circle at 35% 35%,
            rgba(255, 255, 255, 1),
            rgba(255, 250, 240, 0.9),
            rgba(220, 230, 255, 0.4)
          );
          box-shadow:
            0 0 6px rgba(255, 255, 255, 0.85),
            0 0 12px rgba(210, 230, 255, 0.5),
            0 0 18px rgba(180, 200, 230, 0.25),
            inset -1px -1px 3px rgba(255, 255, 255, 0.6);
          animation: rocketAscendRealistic var(--duration) ease-out forwards;
          filter: blur(0.15px);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        /* Continuous white exhaust trail - key feature */
        .trail-segment {
          position: absolute;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 250, 0.5) 20%,
            rgba(220, 230, 255, 0.3) 60%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(1.5px);
          animation: trailGlow var(--duration) ease-out forwards;
        }

        /* Subtle atmospheric glow */
        .rocket-atmosphere {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.2),
            rgba(210, 230, 255, 0.08),
            transparent
          );
          animation: rocketAscendRealistic var(--duration) ease-out forwards;
          filter: blur(4px);
        }
      `}</style>

      <div className="rocket-container">
        {rockets.map((rocket) => {
          const deltaX = rocket.endX - rocket.startX;
          const deltaY = rocket.endY - rocket.startY;

          return (
            <div key={rocket.id}>
              {/* Atmospheric glow envelope */}
              <div
                className="rocket-atmosphere"
                style={{
                  left: `${rocket.startX}%`,
                  top: `${rocket.startY}%`,
                  width: '32px',
                  height: '32px',
                  '--duration': `${rocket.duration}s`,
                  transform: `translate(${deltaX}vw, ${deltaY}vh)`,
                } as React.CSSProperties & { '--duration': string }}
              />

              {/* Continuous smooth exhaust trail - 28 segments for realism */}
              {[...Array(28)].map((_, i) => {
                const progress = i / 28;
                const trailX = rocket.startX + deltaX * progress;
                const trailY = rocket.startY + deltaY * progress;
                const opacity = Math.max(0, 1 - progress * 1.1);
                const width = 2.5 + progress * 4;

                return (
                  <div
                    key={`trail-${i}`}
                    className="trail-segment"
                    style={{
                      left: `${trailX}%`,
                      top: `${trailY}%`,
                      width: `${width}px`,
                      height: '1.5px',
                      opacity: opacity * 0.7,
                      '--duration': `${rocket.duration}s`,
                      animationDelay: `${-rocket.duration * progress}s`,
                      transform: `translate(-50%, -50%)`,
                    } as React.CSSProperties & { '--duration': string }}
                  />
                );
              })}

              {/* Main rocket - ultra-realistic with minimal motion blur */}
              <div
                className="rocket"
                style={{
                  left: `${rocket.startX}%`,
                  top: `${rocket.startY}%`,
                  '--duration': `${rocket.duration}s`,
                } as React.CSSProperties & { '--duration': string }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
