  "use client";
import { useEffect, useRef } from "react";

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

const ROCKET_SIZE = 8;
const TRAIL_LENGTH = 50;
const ROCKETS_PER_CYCLE = 1;
const CYCLE_INTERVAL = 800; // ~20 rockets on screen at once
export default function RocketBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create new rockets at intervals
    const launchInterval = setInterval(() => {
      for (let i = 0; i < ROCKETS_PER_CYCLE; i++) {
const startX = canvas.width * (0 + Math.random() * 0.15); // Start from left edge        const startY = canvas.height * 0.85;
        
        
        // Velocity: upward and slightly diagonal
const angle = Math.PI * (0.25 + Math.random() * 0.5); // 45-90 degrees for full screen traverseconst speed = 5 + Math.random() * 3; // pixels per frame - increased for full screen travel        
        const rocket: Rocket = {
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: -Math.sin(angle) * speed,
          life: 1,
          trail: []
        };
        rocketsRef.current.push(rocket);
      }
    }, CYCLE_INTERVAL);

    // Animation loop
    const animate = () => {
      // Clear canvas with semi-transparent overlay
      ctx.clearRect(0, 0, canvas.width, canvas.height);      // Update and draw rockets
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];

        // Apply gravity
        rocket.vy += 0.02;
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.life -= 0.008;

        // Add to trail
        rocket.trail.push({
          x: rocket.x,
          y: rocket.y,
          alpha: rocket.life * 0.8
        });

        if (rocket.trail.length > TRAIL_LENGTH) {
          rocket.trail.shift();
        }

        // Draw trail
        if (rocket.trail.length > 1) {
          for (let j = 0; j < rocket.trail.length - 1; j++) {
            const p1 = rocket.trail[j];
            const p2 = rocket.trail[j + 1];
            const alpha = (p1.alpha * (j / rocket.trail.length)) * 0.6;

            // Trail glow effect
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(255, 255, 240, ${alpha})`);
            gradient.addColorStop(1, `rgba(200, 220, 255, ${alpha * 0.5})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2 + (j / rocket.trail.length) * 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            // Additional blur/glow
            ctx.strokeStyle = `rgba(220, 230, 255, ${alpha * 0.3})`;
            ctx.lineWidth = 6 + (j / rocket.trail.length) * 4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw rocket
        if (rocket.life > 0) {
          // Rocket glow
          const glowGradient = ctx.createRadialGradient(
            rocket.x,
            rocket.y,
            0,
            rocket.x,
            rocket.y,
            20
          );
          glowGradient.addColorStop(0, `rgba(255, 255, 255, ${rocket.life * 0.6})`);
          glowGradient.addColorStop(0.5, `rgba(200, 220, 255, ${rocket.life * 0.3})`);
          glowGradient.addColorStop(1, "rgba(150, 180, 220, 0)");

          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(rocket.x, rocket.y, 20, 0, Math.PI * 2);
          ctx.fill();

          // Main rocket body
          const gradient = ctx.createRadialGradient(
            rocket.x - 1,
            rocket.y - 1,
            0,
            rocket.x,
            rocket.y,
            ROCKET_SIZE
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${rocket.life})`);
          gradient.addColorStop(0.6, `rgba(240, 240, 255, ${rocket.life * 0.8})`);
          gradient.addColorStop(1, `rgba(180, 200, 230, ${rocket.life * 0.4})`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(rocket.x, rocket.y, ROCKET_SIZE, 0, Math.PI * 2);
          ctx.fill();

          // Rocket highlight
          ctx.fillStyle = `rgba(255, 255, 255, ${rocket.life * 0.9})`;
          ctx.beginPath();
          ctx.arc(rocket.x - 2, rocket.y - 2, ROCKET_SIZE * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Remove dead rockets
        if (rocket.life <= 0 || rocket.y < -50) {
          rockets.splice(i, 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(launchInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none"
      style={{
        backgroundColor: "rgba(30, 35, 50, 0.3)",
        zIndex: 1
      }}
    />
  );
}
