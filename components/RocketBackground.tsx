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
      const startX = Math.random() * 20 - 10;
      const startY = 110;
      const endX = 100 + Math.random() * 20;
      const endY = -10;
      
      const newRocket: Rocket = {
        id: nextId,
        startX,
        startY,
        endX,
        endY,
        duration: 14 + Math.random() * 5,
      };
      
      setRockets((prev) => [...prev, newRocket]);
      setNextId((prev) => prev + 1);
      
      setTimeout(() => {
        setRockets((prev) => prev.filter((r) => r.id !== newRocket.id));
      }, newRocket.duration * 1000);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rocketPath {
          0% {
            opacity: 0;
          }
          2% {
            opacity: 1;
          }
          98% {
            opacity: 0.9;
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
        }
        
        .rocket {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(255,255,200,1), rgba(255,220,100,0.8), rgba(220,160,60,0.5));
          box-shadow: 
            0 0 12px rgba(255,220,100,0.9), 
            0 0 24px rgba(220,160,60,0.7),
            0 0 40px rgba(200,120,40,0.4),
            inset -2px -2px 8px rgba(255,255,150,0.6);
          animation: rocketPath var(--duration) linear forwards;
          filter: blur(0.3px);
          will-change: transform, opacity;
        }
        
        .trail-segment {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(220,180,100,0.5), transparent);
          border-radius: 50%;
          filter: blur(0.8px);
        }
      `}</style>
      
      <div className="rocket-container">
        {rockets.map((rocket) => {
          const deltaX = rocket.endX - rocket.startX;
          const deltaY = rocket.endY - rocket.startY;
          
          return (
            <div key={rocket.id}>
              {/* Trail segments for faint trail effect */}
              {[...Array(12)].map((_, i) => {
                const progress = i / 12;
                const trailX = rocket.startX + deltaX * progress;
                const trailY = rocket.startY + deltaY * progress;
                const segmentOpacity = 0.5 - progress * 0.4;
                
                return (
                  <div
                    key={`trail-${i}`}
                    className="trail-segment"
                    style={{
                      left: `${trailX}%`,
                      top: `${trailY}%`,
                      width: '6px',
                      height: '6px',
                      opacity: segmentOpacity * 0.25,
                      animation: `rocketPath ${rocket.duration}s linear forwards`,
                      animationDelay: `${-rocket.duration * progress}s`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
              
              {/* Main rocket - NOW MORE VISIBLE */}
              <div
                className="rocket"
                style={{
                  left: `${rocket.startX}%`,
                  top: `${rocket.startY}%`,
                  animation: `rocketPath ${rocket.duration}s linear forwards`,
                  '--duration': `${rocket.duration}s`,
                  transform: `translate(0, ${-rocket.startY + rocket.endY}vh) translateX(${deltaX}vw)`,
                } as React.CSSProperties & { '--duration': string }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
