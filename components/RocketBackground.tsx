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
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
          3% {
            opacity: 0.8;
          }
          97% {
            opacity: 0.6;
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
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(220,180,100,0.7), rgba(200,100,50,0.3));
          box-shadow: 0 0 8px rgba(220,180,100,0.6), 0 0 15px rgba(200,120,60,0.4);
          animation: rocketPath var(--duration) linear forwards;
          filter: blur(0.5px);
        }
        
        .rocket-trail {
          position: absolute;
          pointer-events: none;
          opacity: 0.15;
        }
        
        .trail-segment {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(220,180,100,0.4), transparent);
          border-radius: 50%;
        }
      `}</style>
      
      <div className="rocket-container">
        {rockets.map((rocket) => {
          const deltaX = rocket.endX - rocket.startX;
          const deltaY = rocket.endY - rocket.startY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          
          return (
            <div key={rocket.id}>
              {/* Trail segments for faint trail effect */}
              {[...Array(8)].map((_, i) => {
                const progress = i / 8;
                const trailX = rocket.startX + deltaX * progress;
                const trailY = rocket.startY + deltaY * progress;
                const segmentOpacity = 0.4 - progress * 0.3;
                
                return (
                  <div
                    key={`trail-${i}`}
                    className="trail-segment"
                    style={{
                      left: `${trailX}%`,
                      top: `${trailY}%`,
                      width: '4px',
                      height: '4px',
                      opacity: segmentOpacity * 0.3,
                      animation: `rocketPath ${rocket.duration}s linear forwards`,
                      animationDelay: `${-rocket.duration * progress}s`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}
              
              {/* Main rocket */}
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
