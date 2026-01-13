"use client";
import React, { useEffect, useRef } from "react";

export default function AmbientBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        type Star = {
            x: number;
            y: number;
            size: number;
            opacity: number;
            speed: number;
        };

        type ShootingStar = {
            x: number;
            y: number;
            length: number;
            speed: number;
            opacity: number;
            angle: number;
        };

        const stars: Star[] = [];
        const numStars = 150;
        let shootingStar: ShootingStar | null = null;
        let shootingStarTimer = 0;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                speed: Math.random() * 0.05
            });
        }

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw Stars
            ctx.fillStyle = "white";
            stars.forEach(star => {
                ctx.globalAlpha = star.opacity;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();

                // Twinkle
                star.opacity += (Math.random() - 0.5) * 0.02;
                if (star.opacity < 0.1) star.opacity = 0.1;
                if (star.opacity > 1) star.opacity = 1;

                // Drift
                star.y -= star.speed;
                if (star.y < 0) {
                    star.y = height;
                    star.x = Math.random() * width;
                }
            });

            // Shooting Star Logic
            shootingStarTimer++;
            if (!shootingStar && shootingStarTimer > 300 && Math.random() < 0.01) {
                shootingStarTimer = 0;
                shootingStar = {
                    x: Math.random() * width,
                    y: Math.random() * (height / 2),
                    length: 100 + Math.random() * 50,
                    speed: 15 + Math.random() * 10,
                    opacity: 1,
                    angle: Math.PI / 4 // 45 degrees
                };
            }

            if (shootingStar) {
                const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
                const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

                const gradient = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
                gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

                ctx.lineWidth = 2;
                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(tailX, tailY);
                ctx.stroke();

                shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
                shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
                shootingStar.opacity -= 0.02;

                if (shootingStar.opacity <= 0 || shootingStar.x > width || shootingStar.y > height) {
                    shootingStar = null;
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
            {/* Aurora / Mesh Gradient Effect */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[140px] animate-blob" />
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] rounded-full bg-blue-600/20 blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-purple-600/20 blur-[160px] animate-blob animation-delay-4000" />
            </div>

            {/* Stars Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Modern Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.1]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/80" />
        </div>
    );
}
