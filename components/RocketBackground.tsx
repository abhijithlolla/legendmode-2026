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
      // Start from bottom-left area
      const startX = Math.random() * 20 - 10;
      const startY = 110;
      
      // End at top-right area
      const endX = 100 + Math.random() * 20;
      const endY = -10;
      
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
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rocketFly {
          0% {
            opacity: 0;
            transform: translate(0, 0);
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty));
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
        
        .rocket-trail {
          position: absolute;
          will-change: transform;
        }
        
        .trail-line {
          position: absolute;
          background: linear-gradient(90deg, 
            rgba(255, 100, 0, 0) 0%, 
            rgba(255, 150, 0, 0.4) 15%,
            rgba(255, 200, 0, 1) 50%, 
            rgba(255, 150, 0, 0.4) 85%,
            rgba(255, 100, 0, 0) 100%);
          border-radius: 50%;
          box-shadow: 
            0 0 20px rgba(255, 200, 100, 1),
            0 0 40px rgba(255, 150, 0, 0.9),
            0 0 60px rgba(255, 100, 0, 0.7),
            0 0 100px rgba(255, 50, 0, 0.4),
            inset 0 0 20px rgba(255, 255, 200, 0.6);
          filter: drop-shadow(0 0 20px rgba(255, 200, 100, 0.9)) 
                  drop-shadow(0 0 40px rgba(255, 100, 0, 0.7)) 
                  drop-shadow(0 0 60px rgba(255, 50, 0, 0.4));
        }
      `}</style>
      
      <div className="rocket-container">
        {rockets.map((rocket) => {
          const deltaX = rocket.endX - rocket.startX;
          const deltaY = rocket.endY - rocket.startY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          
          return (
            <div
              key={rocket.id}
              className="rocket-trail"
              style={{
                left: `${rocket.startX}%`,
                top: `${rocket.startY}%`,
                animation: `rocketFly ${rocket.duration}s linear forwards`,
                '--tx': `${deltaX}vw`,
                '--ty': `${deltaY}vh`,
              } as React.CSSProperties & { '--tx': string; '--ty': string }}
            >
              <div
                className="trail-line"
                style={{
                  width: `${distance * 1.5}px`,
                  height: "14px",
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: "left center",
                  marginLeft: "0px",
                  marginTop: "-7px",
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
