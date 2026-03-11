"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface VoltmeterProps {
    reading: number;
    scale?: number;
    unit?: string;
    isHovered?: boolean;
}

export const Voltmeter: React.FC<VoltmeterProps> = ({ reading, scale = 5, unit = "V", isHovered }) => {
    // Calculate percentage based on reading vs scale
    const percent = Math.min(100, Math.max(0, (reading / scale) * 100));
    // The arc in this specific YF-321 image is quite wide, roughly 100 degrees (-50 to +50)
    const angle = -50 + (percent / 100) * 100;

    const baseShadow = "drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]";
    const hoverShadow = "drop-shadow-[0_20px_35px_rgba(59,130,246,0.3)]";

    return (
        <div className={`relative w-72 h-64 bg-[#1a1a1a] rounded-[16px] flex flex-col items-center border border-[#333] ${isHovered ? hoverShadow : baseShadow} transition-shadow duration-300 p-1.5`}>

            {/* The Main Bezel / Outer Structure */}
            <div className="relative w-full h-[85%] rounded-[12px] overflow-hidden bg-white shadow-inner flex flex-col relative z-10 border-[3px] border-[#222]">

                {/* Dial Faceplate Details (Top 75%) */}
                <div className="absolute top-0 inset-x-0 h-full flex flex-col items-center">

                    {/* Scale Arc and Numbers */}
                    <div className="absolute top-8 w-full flex justify-center">
                        <svg width="240" height="120" viewBox="0 0 240 120" className="overflow-visible">
                            {/* Main Arc Line (Radius 100 at center 120, 120) */}
                            <path d="M 35,90 A 110,110 0 0,1 205,90" fill="none" stroke="#222" strokeWidth="2" />

                            {/* Tick Marks: 100 deg sweep. Divide into 10 major ticks and minor subdivisions */}
                            {Array.from({ length: 11 }).map((_, step) => {
                                const fraction = step / 10;
                                const val = fraction * scale;
                                const deg = -50 + fraction * 100;
                                // Draw major text every 2 integer steps, or every step for small scales
                                const isMajor = scale <= 10 ? true : step % 2 === 0;

                                return (
                                    <g key={step} transform={`translate(120, 140) rotate(${deg})`}>
                                        {/* Major Tick (pointing outwards from r=110 to r=118) */}
                                        <line x1="0" y1="-110" x2="0" y2="-118" stroke="#222" strokeWidth={isMajor ? "2" : "1.5"} />

                                        {/* Minor sub-ticks between steps (every 2 degrees) */}
                                        {step < 10 && [1, 2, 3, 4].map(minor => {
                                            return (
                                                <line
                                                    key={minor}
                                                    x1="0" y1="-110" x2="0" y2="-114"
                                                    stroke="#222" strokeWidth="1"
                                                    transform={`rotate(${minor * 2})`}
                                                />
                                            )
                                        })}

                                        {/* Text Label (Only on major ticks, positioned outside/above the arc) */}
                                        {isMajor && (
                                            <g transform="translate(0, -132)">
                                                <text
                                                    x="0"
                                                    y="0"
                                                    fontSize="12"
                                                    fontWeight="bold"
                                                    fill="#222"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fontFamily="Arial, sans-serif"
                                                    transform={`rotate(${-deg})`} // keeping upright
                                                >
                                                    {scale <= 10 && !Number.isInteger(val) ? val.toFixed(1).replace('0.', '.') : Math.round(val)}
                                                </text>
                                            </g>
                                        )}
                                    </g>
                                )
                            })}
                        </svg>
                    </div>

                    {/* Central "V" Label */}
                    <div className="absolute top-[85px] flex flex-col items-center">
                        <span className="text-4xl font-light font-sans text-[#111]">V</span>
                        <div className="w-8 h-[2px] bg-[#111] mt-1 pr-1 pl-1 relative">
                            {/* A bit of spacing logic to give that underline effect */}
                            <div className="w-full h-full bg-[#111]"></div>
                        </div>
                    </div>

                    {/* Sub Label */}
                    <div className="absolute top-[135px]">
                        <span className="text-[8px] font-bold text-slate-700 tracking-wider">ANALOG DC VOLTMETER</span>
                    </div>

                    {/* Left Bottom Label */}
                    <div className="absolute bottom-8 left-6">
                        <span className="text-[10px] font-bold text-slate-800 tracking-wider">YF-321</span>
                    </div>

                    {/* Right Bottom Label */}
                    <div className="absolute bottom-8 right-6">
                        <span className="text-[10px] font-bold text-slate-800 tracking-wider">CLASS 2.5</span>
                    </div>

                    {/* Inner Black Cutout for Pivot */}
                    <div className="absolute -bottom-6 w-24 h-12 bg-gradient-to-t from-[#222] to-[#3a3a3a] rounded-t-full flex justify-center overflow-hidden border-t-2 border-[#111] shadow-[inset_0_4px_6px_rgba(0,0,0,0.6)]">
                        {/* Faux coil/pivot depth inside */}
                        <div className="w-16 h-8 bg-[#111] rounded-t-full mt-2 border-t border-slate-700"></div>
                    </div>

                    {/* The Needle Pivot Container */}
                    <div className="absolute -bottom-2 w-full flex justify-center z-20">
                        <motion.div
                            className="absolute bottom-0 w-[1.5px] h-36 bg-[#e02020] origin-bottom shadow-sm"
                            animate={{ rotate: angle }}
                            transition={{ type: "spring", stiffness: 50, damping: 15 }}
                        >
                            {/* Arrow Tip */}
                            <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[6px] border-transparent border-b-[#e02020]"></div>
                        </motion.div>
                    </div>
                </div>

                {/* 3D clear plastic cover effect overlay on the viewing window */}
                <div className="absolute inset-0 z-30 pointer-events-none ring-1 ring-inset ring-white/60 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-[10px]">
                    {/* Top glare */}
                    <div className="absolute top-0 inset-x-1 h-3 bg-gradient-to-b from-white/70 to-transparent rounded-t-[10px]"></div>
                    {/* Side reflection */}
                    <div className="absolute top-1 left-1 w-full h-[150%] bg-gradient-to-bl from-white/10 to-transparent rotate-12 -translate-y-12"></div>
                </div>
            </div>

            {/* The Matte Black Lower Section (Raised over the clear cover) */}
            <div className="absolute bottom-0 inset-x-0 h-[30%] bg-[#222222] rounded-b-[16px] z-40 border-t border-[#444] shadow-[0_-2px_15px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 pt-2 pb-4">

                {/* Surface texture & styling */}
                <div className="absolute inset-0 opacity-10 bg-noise pointer-events-none rounded-b-[16px]"></div>

                {/* Left Mount Screw (Phillips) */}
                <div className="w-4 h-4 rounded-full bg-[#1a1a1a] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center relative">
                    <div className="w-2 h-px bg-[#0a0a0a] rotate-45 absolute shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                    <div className="w-2 h-px bg-[#0a0a0a] -rotate-45 absolute shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                </div>

                {/* Center Pivot Adjustment Screw (Flathead) */}
                <div className="self-end mb-2 w-5 h-5 rounded-full bg-[#1a1a1a] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center relative">
                    <div className="w-2.5 h-[1.5px] bg-[#050505] -rotate-12 absolute shadow-[0_1px_0_rgba(255,255,255,0.15)]"></div>
                </div>

                {/* Right Mount Screw (Phillips) */}
                <div className="w-4 h-4 rounded-full bg-[#1a1a1a] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center relative">
                    <div className="w-2 h-px bg-[#0a0a0a] rotate-45 absolute shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                    <div className="w-2 h-px bg-[#0a0a0a] -rotate-45 absolute shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                </div>

                {/* Function Terminals (Hanging slightly off the bottom) */}
                <div className="absolute -bottom-4 w-full inset-x-0 flex justify-center gap-16 z-0">
                    {/* Positive */}
                    <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-5 h-5 rounded-full bg-[#d01b1b] flex items-center justify-center border border-[#801010] shadow-md z-0 relative">
                            <div className="w-2 h-2 rounded-full bg-slate-300 shadow-inner"></div>
                        </div>
                        <span className="text-[8px] font-black text-white mt-0.5 shadow-sm">+</span>
                    </div>

                    {/* Negative */}
                    <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-5 h-5 rounded-full bg-[#111] flex items-center justify-center border border-black shadow-md z-0 relative">
                            <div className="w-2 h-2 rounded-full bg-slate-300 shadow-inner"></div>
                        </div>
                        <span className="text-[8px] font-black text-white mt-0.5 shadow-sm">-</span>
                    </div>
                </div>
            </div>

            {/* Top Bezel Highlight */}
            <div className="absolute top-0 inset-x-4 h-0.5 bg-white/10 rounded-full"></div>
        </div>
    );
};
