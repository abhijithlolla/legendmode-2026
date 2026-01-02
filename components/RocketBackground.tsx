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
        filter: blur(0px);
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        opacity: 0;
        filter: blur(1px);
      }
    }
    
    .rocket-trail {
      position: fixed;
      pointer-events: none;
      z-index: 5;
    }
    
    .trail-line {
      position: absolute;
      background: linear-gradient(90deg, rgba(255, 200, 100, 0) 0%, rgba(255, 200, 100, 0.8) 50%, rgba(255, 150, 50, 0) 100%);
      box-shadow: 0 0 20px rgba(255, 150, 50, 0.6), 0 0 40px rgba(255, 100, 0, 0.3);
      filter: drop-shadow(0 0 10px rgba(255, 150, 50, 0.5));
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
                height: "3px",
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
