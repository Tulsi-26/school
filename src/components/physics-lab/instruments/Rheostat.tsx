"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export interface RheostatProps {
    resistance: number;
    maxResistance: number;
    isHovered?: boolean;
    onPropertyChange?: (props: any) => void;
}

export const Rheostat: React.FC<RheostatProps> = ({ 
    resistance, 
    maxResistance = 100, 
    isHovered, 
    onPropertyChange 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track width for the slider logic
    const trackWidth = 170;
    const trackStart = 75;
    
    // Calculate slider position from resistance
    const sliderX = (resistance / maxResistance) * trackWidth;

    const handleDrag = (event: any, info: any) => {
        const newX = Math.max(0, Math.min(trackWidth, sliderX + info.delta.x));
        const newResistance = Math.round((newX / trackWidth) * maxResistance);
        
        if (onPropertyChange && newResistance !== resistance) {
            onPropertyChange({ resistance: newResistance });
        }
    };

    return (
        <div 
            ref={containerRef}
            className={`relative w-[320px] h-[150px] select-none transition-all duration-300 ${isHovered ? 'drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]'}`}
        >
            {/* Base Shadow */}
            <div className="absolute inset-x-10 bottom-2 h-4 bg-black/20 blur-xl rounded-full"></div>

            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 150">
                <defs>
                    <linearGradient id="rheo-chrome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#cbd5e1"/>
                        <stop offset="15%" stopColor="#f8fafc"/>
                        <stop offset="40%" stopColor="#94a3b8"/>
                        <stop offset="70%" stopColor="#475569"/>
                        <stop offset="100%" stopColor="#1e293b"/>
                    </linearGradient>
                    
                    <linearGradient id="rheo-ceramic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e7e5e4"/>
                        <stop offset="20%" stopColor="#fafaf9"/>
                        <stop offset="50%" stopColor="#f5f5f4"/>
                        <stop offset="80%" stopColor="#d6d3d1"/>
                        <stop offset="100%" stopColor="#a8a29e"/>
                    </linearGradient>

                    <linearGradient id="rheo-wood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#262626"/>
                        <stop offset="100%" stopColor="#0a0a0a"/>
                    </linearGradient>

                    <pattern id="coilWires" x="0" y="0" width="2" height="70" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="70" stroke="#71717a" strokeWidth="1" />
                        <line x1="1" y1="0" x2="1" y2="70" stroke="#a1a1aa" strokeWidth="1" />
                    </pattern>

                    <linearGradient id="coilShadow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="black" stopOpacity="0.6"/>
                        <stop offset="20%" stopColor="white" stopOpacity="0.2"/>
                        <stop offset="45%" stopColor="white" stopOpacity="0.4"/>
                        <stop offset="65%" stopColor="black" stopOpacity="0.1"/>
                        <stop offset="90%" stopColor="black" stopOpacity="0.5"/>
                    </linearGradient>
                </defs>

                {/* Wooden/Plastic End Stands */}
                {/* Left Stand */}
                <path d="M 20 145 L 60 145 L 50 85 L 30 85 Z" fill="url(#rheo-wood)" />
                <rect x="35" y="20" width="10" height="65" fill="#171717" />
                <circle cx="40" cy="85" r="32" fill="#171717" />
                <circle cx="40" cy="85" r="26" fill="#262626" />
                
                {/* Right Stand */}
                <path d="M 260 145 L 300 145 L 290 85 L 270 85 Z" fill="url(#rheo-wood)" />
                <rect x="275" y="20" width="10" height="65" fill="#171717" />
                <circle cx="280" cy="85" r="32" fill="#171717" />
                <circle cx="280" cy="85" r="26" fill="#262626" />

                {/* Main Ceramic Tube */}
                <rect x="40" y="50" width="240" height="70" rx="4" fill="url(#rheo-ceramic)" />
                
                {/* Winding / Coil */}
                <rect x="75" y="50" width="170" height="70" fill="url(#coilWires)" />
                <rect x="75" y="50" width="170" height="70" fill="url(#coilShadow)" opacity="0.8" />

                {/* Chrome Caps */}
                <rect x="65" y="50" width="10" height="70" fill="url(#rheo-chrome)" />
                <rect x="245" y="50" width="10" height="70" fill="url(#rheo-chrome)" />

                {/* Top Slider Rod */}
                <rect x="30" y="25" width="260" height="10" rx="2" fill="url(#rheo-chrome)" />
                <circle cx="30" cy="30" r="4" fill="#64748b" />
                <circle cx="290" cy="30" r="4" fill="#64748b" />

                {/* Fixed Terminals (Base) */}
                {/* Left Terminal */}
                <g transform="translate(60, 115)">
                    <rect x="0" y="0" width="15" height="20" fill="url(#rheo-chrome)" />
                    <circle cx="7.5" cy="10" r="5" fill="#d97706" />
                    <circle cx="7.5" cy="10" r="2" fill="#78350f" />
                </g>

                {/* Right Terminal */}
                <g transform="translate(245, 115)">
                    <rect x="0" y="0" width="15" height="20" fill="url(#rheo-chrome)" />
                    <circle cx="7.5" cy="10" r="5" fill="#d97706" />
                    <circle cx="7.5" cy="10" r="2" fill="#78350f" />
                </g>
            </svg>

            {/* Draggable Slider (Jockey) */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: trackWidth }}
                dragElastic={0}
                dragMomentum={false}
                onDrag={handleDrag}
                animate={{ x: sliderX }}
                className="absolute left-[50px] top-[15px] w-[50px] h-[60px] cursor-grab active:cursor-grabbing z-30"
            >
                <div className="relative w-full h-full">
                    <svg viewBox="0 0 50 60" className="w-full h-full drop-shadow-lg">
                        {/* Upper Block */}
                        <rect x="0" y="0" width="50" height="25" rx="4" fill="#171717" />
                        <rect x="5" y="5" width="40" height="15" rx="2" fill="#262626" />
                        
                        {/* Connecting Stem */}
                        <rect x="15" y="25" width="20" height="20" fill="#171717" />
                        
                        {/* Contact Tip */}
                        <path d="M 20 45 L 30 45 L 25 55 Z" fill="#facc15" />
                        
                        {/* Movable Terminal (Top of Slider) */}
                        <circle cx="25" cy="12" r="7" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                        <circle cx="25" cy="12" r="3" fill="#7f1d1d" />

                        {/* Label on Slider */}
                        <text x="25" y="8" fontSize="4" fill="white" textAnchor="middle" fontWeight="bold">JOCKEY</text>
                    </svg>
                    
                    {/* Visual Indicator of Connection */}
                    {isHovered && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] px-2 py-1 rounded border border-slate-600 whitespace-nowrap">
                            Movable Contact (Terminal 3)
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Labels & Instructions */}
            <div className="absolute bottom-1 left-4 right-4 flex justify-between items-center pointer-events-none">
                <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-blue-300 border border-blue-500/30">
                    {resistance} Ω / {maxResistance} Ω
                </div>
                
                <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-[8px] font-medium text-slate-400 max-w-[150px] text-right">
                    Adjust slider to change effective length of wire
                </div>
            </div>

            {/* Connection Point Indicators (Subtle circles showing where wires go) */}
            <div className="absolute left-[67px] top-[125px] w-2 h-2 rounded-full bg-amber-500/50 animate-pulse pointer-events-none"></div>
            <div className="absolute left-[252px] top-[125px] w-2 h-2 rounded-full bg-amber-500/50 animate-pulse pointer-events-none"></div>
            
            {/* Movable terminal highlight on drag */}
            <motion.div 
                animate={{ 
                    scale: isHovered ? 1.2 : 1,
                    opacity: isHovered ? 1 : 0
                }}
                className="absolute w-4 h-4 rounded-full border-2 border-red-500 bg-red-500/20 pointer-events-none"
                style={{ 
                    left: sliderX + 50 + 25 - 8, // Adjust based on slider anchor
                    top: 15 + 12 - 8
                }}
            />
        </div>
    );
};
