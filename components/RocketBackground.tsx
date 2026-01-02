"use client";
import { useEffect, useState } from "react";

interface Rocket {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  duration: number;
}

export default function RocketBackground() {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const startX = Math.random() * 100;
      const startY = 100;
      const endX = startX + (Math.random() - 0.5) * 40;
      const endY = Math.random() * 40;
      
      const newRocket: Rocket = {
        id: nextId,
        startX,
        startY,
        endX,
        endY,
        delay: Math.random() * 0.5,
        duration: 2.5 + Math.random() * 1.5,
      };
      
      setRockets((prev) => [...prev, newRocket]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setRockets((prev) => prev.filter((r) => r.id !== newRocket.id));
      }, (newRocket.duration + newRocket.delay) * 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [nextId]);

  const styles = `
    @keyframes rocketTrail {
      0% {
        opacity: 0;
      }
      5% {
        opacity: 1;
      }
      95% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    
    .rocket-trail {
      position: fixed;
      pointer-events: none;
      z-index: 5;
    }
    
    .trail-line {
      position: absolute;
      background: linear-gradient(90deg, rgba(255, 200, 80, 0) 0%, rgba(255, 255, 150, 1) 20%, rgba(255, 220, 100, 1) 50%, rgba(255, 150, 50, 1) 80%, rgba(255, 100, 0, 0) 100%);
      box-shadow: 0 0 8px rgba(255, 220, 100, 0.8), 0 0 15px rgba(255, 180, 50, 0.6), 0 0 25px rgba(255, 150, 30, 0.4), 0 0 35px rgba(255, 100, 0, 0.2), inset 0 0 8px rgba(255, 255, 200, 0.4);
      filter: drop-shadow(0 0 5px rgba(255, 200, 100, 0.8)) drop-shadow(0 0 15px rgba(255, 150, 50, 0.6)) drop-shadow(0 0 25px rgba(255, 100, 0, 0.3));
    }
  `;

  return (
    <>
      <style>{styles}</style>
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
              bottom: `${rocket.startY}%`,
              animation: `rocketTrail ${rocket.duration}s linear ${rocket.delay}s forwards`,
            }}
          >
            <div
              className="trail-line"
              style={{
                width: `${distance}px`,
                height: "6px",
                transform: `rotate(${angle}deg)`,
                transformOrigin: "left center",
              }}
            />
          </div>
        );
      })}
    </>
  );
}
