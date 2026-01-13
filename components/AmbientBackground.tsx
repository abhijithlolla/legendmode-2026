"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AmbientBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
            {/* Aurora / Mesh Gradient Effect */}
            <div className="absolute inset-0 opacity-60">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/30 blur-[140px] animate-blob" />
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[60%] rounded-full bg-blue-600/30 blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] rounded-full bg-purple-600/20 blur-[160px] animate-blob animation-delay-4000" />
            </div>


            {/* Modern Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                }}
            />

            {/* Noise Texture for that 'Fresh' Grainy Look */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60" />
        </div>
    );
}
