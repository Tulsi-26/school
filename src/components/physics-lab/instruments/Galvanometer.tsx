"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface GalvanometerProps {
    reading: number; // typically -30 to +30
    scale?: number; // default max sweep
    unit?: string;
    isHovered?: boolean;
}

export const Galvanometer: React.FC<GalvanometerProps> = ({ reading, scale = 30, unit = "µA", isHovered }) => {
    // Calculate percentage based on reading vs scale (-scale to +scale)
    // For a galvanometer, 0 is center.
    // Full sweep is usually around 90-100 degrees.
    const percent = Math.min(100, Math.max(-100, (reading / scale) * 100));
    // Center is 0 degrees. Left is -50, Right is +50 for a 100 degree sweep.
    const angle = (percent / 100) * 50;

    const baseShadow = "drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]";
    const hoverShadow = "drop-shadow-[0_20px_35px_rgba(59,130,246,0.3)]";

    return (
        <div className={`relative w-72 h-[340px] bg-[#1a1a1a] rounded-[16px] flex flex-col items-center border border-[#333] ${isHovered ? hoverShadow : baseShadow} transition-shadow duration-300 p-1.5`}>

            {/* The Main Bezel / Outer Structure (Higher for EDM-80 style) */}
            <div className="relative w-full h-[75%] rounded-[12px] overflow-hidden bg-white shadow-inner flex flex-col z-10 border-[3px] border-[#222]">

                {/* Dial Faceplate Details */}
                <div className="absolute top-0 inset-x-0 h-full flex flex-col items-center">

                    {/* Model Number EDM-80 */}
                    <div className="absolute top-4 left-6">
                        <span className="text-[11px] font-bold text-slate-800 tracking-wider font-sans">EDM-80</span>
                    </div>

                    {/* Scale Arc and Numbers (Center 0) */}
                    <div className="absolute top-10 w-full flex justify-center">
                        <svg width="240" height="140" viewBox="0 0 240 140" className="overflow-visible">
                            {/* Main Arc Line (Radius 110 at center 120, 150) */}
                            <path d="M 35,95 A 110,110 0 0,1 205,95" fill="none" stroke="#222" strokeWidth="2.5" />

                            {/* Tick Marks: 100 deg sweep (-50 to +50) */}
                            {Array.from({ length: 7 }).map((_, step) => {
                                // 0 to 6 steps = 30-20-10-0-10-20-30
                                const val = Math.abs((step - 3) * 10);
                                const deg = -50 + (step / 6) * 100;

                                return (
                                    <g key={step} transform={`translate(120, 150) rotate(${deg})`}>
                                        {/* Major Tick */}
                                        <line x1="0" y1="-110" x2="0" y2="-120" stroke="#222" strokeWidth="2" />

                                        {/* Minor sub-ticks (10 divisions between each major) */}
                                        {step < 6 && [1, 2, 3, 4, 5, 6, 7, 8, 9].map(minor => (
                                            <line
                                                key={minor}
                                                x1="0" y1="-110" x2="0" y2="-115"
                                                stroke="#222" strokeWidth="1"
                                                transform={`rotate(${(minor / 10) * (100 / 6)})`}
                                            />
                                        ))}

                                        {/* Text Label (Upright) */}
                                        <g transform="translate(0, -135)">
                                            <text
                                                x="0"
                                                y="0"
                                                fontSize="12"
                                                fontWeight="bold"
                                                fill="#222"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontFamily="Arial, sans-serif"
                                                transform={`rotate(${-deg})`}
                                            >
                                                {(step - 3) * 10 === 0 ? '0' : Math.abs((step - 3) * 10)}
                                            </text>
                                        </g>
                                    </g>
                                )
                            })}
                        </svg>
                    </div>

                    {/* Central Large "G" Label */}
                    <div className="absolute top-[90px] flex flex-col items-center">
                        <span className="text-5xl font-bold font-serif text-[#111]">G</span>
                        <div className="w-10 h-[2.5px] bg-[#111] mt-1 relative"></div>
                    </div>

                    {/* Left Bottom Symbols */}
                    <div className="absolute bottom-16 left-6 flex items-center gap-1.5 opacity-80">
                        <svg width="40" height="12" viewBox="0 0 40 12">
                            <path d="M 2 10 L 10 10 M 6 0 L 6 10" stroke="#222" strokeWidth="1" fill="none" />
                            <path d="M 15 2 L 15 10 M 13 10 L 17 10" stroke="#222" strokeWidth="1" fill="none" />
                            <polygon points="25,2 22,10 28,10" stroke="#222" strokeWidth="1" fill="none" />
                            <text x="32" y="10" fontSize="8" fontWeight="bold" fill="#222">±2</text>
                        </svg>
                    </div>

                    {/* The Needle Pivot Container */}
                    <div className="absolute -bottom-4 w-full flex justify-center z-20">
                        <motion.div
                            className="absolute bottom-0 w-[1.5px] h-40 bg-[#e02020] origin-bottom shadow-sm"
                            animate={{ rotate: angle }}
                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                        >
                            {/* Red thin needle with point */}
                            <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[6px] border-transparent border-b-[#e02020]"></div>
                        </motion.div>

                        {/* Pivot Cover (Black with screw) */}
                        <div className="absolute -bottom-2 w-14 h-14 rounded-full bg-gradient-to-t from-[#0a0a0a] to-[#222] border-[3px] border-[#111] shadow-[0_5px_10px_rgba(0,0,0,0.5)] z-30 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full border border-white/10 shadow-inner p-1">
                                <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                                    <div className="w-6 h-0.5 bg-[#000] rotate-45 shadow-[0_1px_rgba(255,255,255,0.1)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D clear plastic cover effect overlay */}
                <div className="absolute inset-0 z-30 pointer-events-none ring-1 ring-inset ring-white/60 shadow-[inset_0_0_30px_rgba(255,255,255,0.2)] rounded-[10px]">
                    <div className="absolute top-0 inset-x-1 h-3 bg-gradient-to-b from-white/70 to-transparent rounded-t-[10px]"></div>
                    <div className="absolute top-1 left-1 w-full h-[150%] bg-gradient-to-bl from-white/10 to-transparent rotate-12 -translate-y-12"></div>
                </div>
            </div>

            {/* The Matte Black Lower Section */}
            <div className="absolute bottom-0 inset-x-0 h-[32%] bg-[#1c1c1c] rounded-b-[16px] z-40 border-t border-[#333] shadow-[0_-4px_20px_rgba(0,0,0,0.6)] flex flex-col p-4 pt-6">

                {/* Surface texture */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_0.5px,transparent_0.5px)] [background-size:4px_4px] pointer-events-none rounded-b-[16px]"></div>

                {/* Terminals (Placed on the front panel) */}
                <div className="flex justify-between px-4 mb-4 relative z-50">
                    {/* Red Post (A/+) */}
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full bg-[#cc1a1a] flex items-center justify-center border border-[#991515] shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] relative">
                            <div className="absolute inset-1 rounded-full border border-[#f87171]/40 border-dashed"></div>
                            <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-600 shadow-inner flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#111]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Black Post (B/-) */}
                    <div className="flex flex-col items-center gap-1 group">
                        <div className="w-10 h-10 rounded-full bg-[#0a0a0a] flex items-center justify-center border border-[#000] shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] relative">
                            <div className="absolute inset-1 rounded-full border border-[#333]/40 border-dashed"></div>
                            <div className="w-4 h-4 rounded-full bg-slate-300 border border-slate-600 shadow-inner flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#111]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Label Stripe */}
                <div className="mt-auto mx-1 h-8 bg-[#0a0a0c] border border-white/10 rounded-md flex items-center justify-between px-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                    <span className="text-white font-black text-[18px] pb-1">+</span>
                    <span className="text-white font-bold text-[11px] tracking-[0.2em]" style={{ fontFamily: 'Impact, sans-serif' }}>DC MOVING COIL</span>
                    <span className="text-white font-black text-[20px] pb-1">-</span>
                </div>
            </div>

            {/* Top bevel highlight */}
            <div className="absolute top-0 inset-x-6 h-[1.5px] bg-white/15 rounded-full blur-[0.5px]"></div>
        </div>
    );
};
