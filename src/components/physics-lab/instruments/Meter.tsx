"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface MeterProps {
    type: 'ammeter' | 'voltmeter';
    reading: number;
    scale: number;
    unit: string;
    label: string;
    isHovered?: boolean;
}

export const Meter: React.FC<MeterProps> = ({ type, reading, scale, unit, label, isHovered }) => {
    const isAmmeter = type === 'ammeter';
    // Calculate percentage based on reading vs scale
    const percent = Math.min(100, Math.max(0, (reading / scale) * 100));
    // The arc in the image looks to be about 90 degrees total sweep (-45 to +45)
    const angle = -45 + (percent / 100) * 90;

    const baseShadow = "drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]";
    const hoverShadow = "drop-shadow-[0_20px_35px_rgba(59,130,246,0.25)]";

    return (
        <div className={`relative w-56 h-72 bg-[#1a1c23] rounded-md flex flex-col items-center p-2 border-t border-l border-white/10 ${isHovered ? hoverShadow : baseShadow} transition-shadow duration-300`}>

            {/* Main Plastic Display Area */}
            <div className="relative w-full h-48 bg-white border-2 border-[#1a1c23] rounded-sm mt-1 overflow-hidden shadow-inner flex flex-col items-center">

                {/* Dial Faceplate Details */}
                <div className="absolute top-0 w-full h-full flex flex-col items-center z-10">

                    {/* Scale Numbers (e.g., 0, 0.5, 1, 1.5, 2, 2.5, 3) */}
                    <div className="absolute top-4 w-full flex justify-center">
                        <svg width="200" height="100" viewBox="0 0 200 100" className="overflow-visible">
                            {/* The Main Arc Line */}
                            <path d="M 20,80 A 100,100 0 0,1 180,80" fill="none" stroke="#111" strokeWidth="1.5" />

                            {/* Tick Marks and Text. Center of arc is (100, 140), Radius is 100.
                                Arc spans from ~ -53 to +53 degrees. We'll draw 10 intervals over 100 degrees (-50 to +50). */}
                            {Array.from({ length: 11 }).map((_, step) => {
                                // 10 major steps across 100 degrees = 10 degrees per step
                                const val = (step / 10) * scale;
                                const deg = -50 + (step / 10) * 100;

                                return (
                                    <g key={step} transform={`translate(100, 140) rotate(${deg})`}>
                                        {/* Major Tick (extends outwards from the arc r=100 to r=108) */}
                                        <line x1="0" y1="-100" x2="0" y2="-108" stroke="#111" strokeWidth="1.5" />

                                        {/* Minor ticks in between major steps */}
                                        {step < 10 && [1, 2, 3, 4].map(minor => (
                                            <line
                                                key={`minor-${step}-${minor}`}
                                                x1="0" y1="-100" x2="0" y2="-105"
                                                stroke="#111" strokeWidth="1"
                                                transform={`rotate(${(minor / 5) * 10})`}
                                            />
                                        ))}

                                        {/* Text Label - positioned outside/above the major ticks */}
                                        <g transform="translate(0, -118)">
                                            <text
                                                x="0"
                                                y="0"
                                                fontSize="10"
                                                fontWeight="700"
                                                fill="#111"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fontFamily="sans-serif, monospace"
                                                transform={`rotate(${-deg})`} // Keep text upright
                                            >
                                                {/* For scales <= 10, show 1 decimal point if not integer */}
                                                {scale <= 10 && !Number.isInteger(val) ? val.toFixed(1).replace('0.', '.') : Math.round(val)}
                                            </text>
                                        </g>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Left text (MR-80 and symbols) */}
                    <div className="absolute left-6 top-24 flex flex-col">
                        <span className="text-[#333] text-[9px] font-bold tracking-tight">MR-80</span>
                        <div className="flex items-center gap-0.5 mt-0.5 opacity-80">
                            {/* Approximation of the symbols on the left */}
                            <svg width="24" height="10" viewBox="0 0 24 10">
                                <path d="M 2 8 C 2 2, 6 2, 6 8 M 4 2 L 4 8" fill="none" stroke="#333" strokeWidth="0.8" />
                                <path d="M 10 2 L 10 8 M 8 8 L 12 8" fill="none" stroke="#333" strokeWidth="0.8" />
                                <polygon points="17,3 15,8 19,8" fill="none" stroke="#333" strokeWidth="0.8" />
                                <text x="21" y="8" fontSize="7" fill="#333">±2</text>
                            </svg>
                        </div>
                    </div>

                    {/* Center Large Label (V or A) */}
                    <div className="absolute top-20 flex flex-col items-center">
                        <span className="text-3xl font-bold font-serif text-[#111]">{label}</span>
                        <div className="w-8 h-0.5 bg-[#111] mt-0.5"></div>
                    </div>

                    {/* Right cursive stamp */}
                    <div className="absolute right-4 top-28 opacity-60">
                        <span className="font-serif text-[10px] italic">fun+learn</span>
                    </div>

                    {/* The Needle Pivot Container */}
                    <div className="absolute bottom-6 w-full flex justify-center">
                        <motion.div
                            className="absolute bottom-0 w-[1px] h-32 bg-red-500 origin-bottom"
                            animate={{ rotate: angle }}
                            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                        ></motion.div>

                        {/* Center Pivot Cover (The black circle with a slot) */}
                        <div className="absolute -bottom-3 w-8 h-8 rounded-full bg-[#111] border-[3px] border-[#333] flex items-center justify-center shadow-lg z-20">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#222] to-[#0a0a0a] flex items-center justify-center overflow-hidden">
                                <div className="w-full h-0.5 bg-[#000] rotate-45 shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D clear plastic cover effect overlay */}
                <div className="absolute inset-0 z-30 pointer-events-none ring-1 ring-inset ring-white/40 shadow-[inset_0_2px_15px_rgba(255,255,255,0.3)]">
                    {/* Top glass glare */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-white/40 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-bl from-white/10 to-transparent rotate-12 -translate-y-12"></div>

                    {/* The textured/frosted lower half of the plastic cover */}
                    <div className="absolute bottom-0 inset-x-0 h-16 bg-white/20 backdrop-blur-[1px] border-t border-white/20">
                        {/* Slanted stripe texture */}
                        <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]"></div>

                        {/* The two black mounting screws in the plastic */}
                        <div className="absolute bottom-3 left-4 w-4 h-4 rounded-full bg-[#111] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#0a0a0a]"></div>
                        </div>
                        <div className="absolute bottom-3 right-4 w-4 h-4 rounded-full bg-[#111] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#0a0a0a]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Terminals & Labels */}
            <div className="flex-1 w-full flex flex-col justify-end pb-3 relative z-10">

                {/* Terminals */}
                <div className="flex justify-between px-6 mb-2">
                    {/* Red Positive Terminal */}
                    <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-[#d01b1b] flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] border border-[#a01010] relative">
                            {/* Fluted edge effect */}
                            <div className="absolute inset-1 rounded-full border border-[#f03030]/50 border-dashed"></div>
                            {/* Metal center core */}
                            <div className="w-4 h-4 rounded-full bg-slate-300 border-[1.5px] border-slate-600 shadow-inner flex items-center justify-center z-10">
                                <div className="w-2 h-2 rounded-full bg-[#111] shadow-inner"></div>
                            </div>
                        </div>
                    </div>

                    {/* Black Negative Terminal */}
                    <div className="flex flex-col items-center group cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-[#000] relative">
                            {/* Fluted edge effect */}
                            <div className="absolute inset-1 rounded-full border border-[#333]/50 border-dashed"></div>
                            {/* Metal center core */}
                            <div className="w-4 h-4 rounded-full bg-slate-300 border-[1.5px] border-slate-600 shadow-inner flex items-center justify-center z-10">
                                <div className="w-2 h-2 rounded-full bg-[#111] shadow-inner"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Label Stripe */}
                <div className="w-11/12 mx-auto h-6 bg-[#0a0a0c] border border-white/20 rounded-sm flex items-center justify-between px-3 shadow-inner">
                    <span className="text-white font-bold text-[14px] leading-none">+</span>
                    <span className="text-white font-bold text-xs tracking-wider" style={{ fontFamily: 'Impact, sans-serif' }}>DC MOVING COIL</span>
                    <span className="text-white font-bold text-[16px] leading-none">-</span>
                </div>
            </div>

            {/* Top Casing Highlight for 3D effect */}
            <div className="absolute top-0 inset-x-0 h-1 bg-white/5 rounded-t-md"></div>
        </div>
    );
};
