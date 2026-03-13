"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Battery } from './Battery';
import { Ammeter } from './Ammeter';
import { Voltmeter } from './Voltmeter';
import { Galvanometer } from './Galvanometer';
import { Rheostat } from './Rheostat';

interface InstrumentVisualsProps {
    type: string;
    properties: Record<string, any>;
    isHovered: boolean;
    onPropertyChange?: (props: any) => void;
}

export const InstrumentVisuals: React.FC<InstrumentVisualsProps> = ({
    type,
    properties,
    isHovered,
    onPropertyChange
}) => {
    const rheostatContainerRef = useRef<HTMLDivElement>(null);
    const glowShadow = "drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]";
    const activeGlow = "drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]";

    switch (type) {
        case 'battery':
            return (
                <div className={`relative w-[220px] h-[130px] ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-stone-100 to-slate-200 border border-slate-400 shadow-[0_10px_24px_rgba(2,6,23,0.35)]"></div>
                    <div className="absolute inset-x-3 top-3 h-9 rounded bg-stone-200 border border-stone-300"></div>

                    <div className="absolute left-[16px] top-[54px] w-[36px] h-[36px] rounded-full bg-gradient-to-b from-slate-300 to-slate-500 border border-slate-600 shadow-inner flex items-center justify-center">
                        <div className="w-[18px] h-[18px] rounded-full border border-slate-600 bg-slate-200"></div>
                    </div>

                    <div className="absolute left-[87px] top-[71px] w-[18px] h-[18px] rounded-full bg-gradient-to-b from-red-700 to-red-900 border border-red-950 shadow-[0_0_8px_rgba(127,29,29,0.55)]"></div>
                    <div className="absolute left-[90px] top-[74px] w-[12px] h-[12px] rounded-full bg-red-500"></div>

                    <div className="absolute left-[78px] top-[98px] w-[20px] h-[22px] rounded-sm bg-gradient-to-b from-red-400 to-red-700 border border-red-900"></div>
                    <div className="absolute left-[118px] top-[98px] w-[20px] h-[22px] rounded-sm bg-gradient-to-b from-slate-500 to-slate-800 border border-slate-900"></div>

                    <div className="absolute right-[16px] top-[54px] w-[34px] h-[34px] rounded-full bg-gradient-to-b from-red-400 to-red-700 border border-red-900 shadow-inner"></div>

                    <div className="absolute left-[84px] top-[60px] text-[10px] font-semibold text-slate-700 tracking-wide">INDICATOR</div>
                    <div className="absolute left-[75px] top-[90px] text-[7px] font-semibold text-slate-600 tracking-tight">OUTPUT</div>
                    <div className="absolute left-[152px] top-[62px] text-[9px] font-bold text-slate-600">MFD. BY</div>

                    <div className="absolute right-[33px] top-[75px] text-[16px] font-black italic text-red-700">TII</div>
                    <div className="absolute left-[8px] bottom-[6px] right-[8px] text-[8px] font-medium text-slate-600 tracking-tight text-center">
                        REGULATED DC POWER SUPPLY
                    </div>

                    <div className="absolute left-[84px] top-[102px] text-[8px] font-bold text-white">+</div>
                    <div className="absolute left-[125px] top-[102px] text-[8px] font-bold text-slate-200">-</div>

                    <div className="absolute left-2 top-2 bg-slate-900/70 text-[9px] font-mono text-blue-200 px-2 py-0.5 rounded">
                        {properties.voltage}V DC
                    </div>
                </div>
            );

        case 'ammeter':
            return <Ammeter reading={properties.reading || 0} scale={properties.scale || 100} unit={properties.unit || 'mA'} isHovered={isHovered} />;

        case 'voltmeter':
            return <Voltmeter reading={properties.reading || 0} scale={properties.scale || 100} unit={properties.unit || 'V'} isHovered={isHovered} />;

        case 'resistor':
            // Helper to get color code for 4-band resistor
            const getResistorColors = (val: number) => {
                const colors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'];
                const hexColors: Record<string, string> = {
                    black: '#171717', brown: '#78350f', red: '#dc2626', orange: '#ea580c', 
                    yellow: '#facc15', green: '#16a34a', blue: '#2563eb', violet: '#9333ea', 
                    gray: '#9ca3af', white: '#f9fafb', gold: '#ca8a04'
                };

                let str = val.toString();
                let first = parseInt(str[0]) || 0;
                let second = parseInt(str[1]) || 0;
                let multiplier = Math.max(0, str.length - 2);
                
                // For values < 10, handle separately
                if (val < 10) {
                    first = 0;
                    second = val;
                    multiplier = 0; // Black
                } else if (val >= 10 && val < 100) {
                    first = parseInt(str[0]);
                    second = parseInt(str[1]);
                    multiplier = 0;
                }

                return [
                    hexColors[colors[first]] || '#78350f', 
                    hexColors[colors[second]] || '#171717', 
                    hexColors[colors[multiplier]] || '#171717', 
                    hexColors['gold'] // Tolerance 5%
                ];
            };

            const bands = getResistorColors(properties.resistance || 0);

            return (
                <div className={`relative w-40 h-24 flex items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    
                    <svg className="absolute inset-0 w-full h-full drop-shadow-lg pointer-events-none" viewBox="0 0 160 96">
                        <defs>
                            <clipPath id="resistor-body-clip">
                                <path d="M 40 30 C 48 30, 50 35, 55 35 L 105 35 C 110 35, 112 30, 120 30 A 12 18 0 0 1 120 66 C 112 66, 110 61, 105 61 L 55 61 C 50 61, 48 66, 40 66 A 12 18 0 0 1 40 30 Z" />
                            </clipPath>
                            <linearGradient id="resistorShading" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
                                <stop offset="12%" stopColor="#ffffff" stopOpacity="0.4" />
                                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.95" />
                                <stop offset="38%" stopColor="#ffffff" stopOpacity="0.1" />
                                <stop offset="55%" stopColor="#000000" stopOpacity="0.0" />
                                <stop offset="75%" stopColor="#000000" stopOpacity="0.3" />
                                <stop offset="90%" stopColor="#000000" stopOpacity="0.75" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>

                        {/* Wire Caps (Where wire enters the ceramic body) */}
                        <path d="M 28 44 L 21 46 L 21 50 L 28 52 Z" fill="#b08d6a" />
                        <path d="M 132 44 L 139 46 L 139 50 L 132 52 Z" fill="#b08d6a" />

                        {/* Wires */}
                        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                            {/* Shadow */}
                            <path d="M 22 48 L 12 48 Q 6 48 6 54 L 6 85 M 138 48 L 148 48 Q 154 48 154 54 L 154 85" stroke="rgba(0,0,0,0.25)" strokeWidth="5" transform="translate(1, 2)" />
                            {/* Base dark wire */}
                            <path d="M 22 48 L 12 48 Q 6 48 6 54 L 6 85 M 138 48 L 148 48 Q 154 48 154 54 L 154 85" stroke="#64748b" strokeWidth="4" />
                            {/* Medium layer */}
                            <path d="M 22 48 L 12 48 Q 6 48 6 54 L 6 85 M 138 48 L 148 48 Q 154 48 154 54 L 154 85" stroke="#94a3b8" strokeWidth="2" />
                            {/* Highlight */}
                            <path d="M 22 48 L 12 48 Q 6 48 6 54 L 6 85 M 138 48 L 148 48 Q 154 48 154 54 L 154 85" stroke="#f1f5f9" strokeWidth="1" transform="translate(-0.5, -0.5)" />
                        </g>

                        {/* Resistor Body Group */}
                        <g clipPath="url(#resistor-body-clip)">
                            {/* Base Color (Tan/Beige) */}
                            <rect x="0" y="0" width="160" height="96" fill="#d2b48c" />
                            
                            {/* Color Bands */}
                            <rect x="35" y="0" width="8" height="96" fill={bands[0]} />
                            <rect x="62" y="0" width="8" height="96" fill={bands[1]} />
                            <rect x="85" y="0" width="8" height="96" fill={bands[2]} />
                            <rect x="115" y="0" width="8" height="96" fill={bands[3]} />

                            {/* Shading Overlay */}
                            <rect x="0" y="0" width="160" height="96" fill="url(#resistorShading)" />
                        </g>

                        {/* Edge Outline for crispness */}
                        <path d="M 40 30 C 48 30, 50 35, 55 35 L 105 35 C 110 35, 112 30, 120 30 A 12 18 0 0 1 120 66 C 112 66, 110 61, 105 61 L 55 61 C 50 61, 48 66, 40 66 A 12 18 0 0 1 40 30 Z" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.75" />
                    </svg>

                    {/* Value Badge (Appears on Hover) */}
                    {isHovered && (
                        <div className="absolute -top-6 bg-slate-800 text-slate-200 text-xs font-mono font-bold px-2 py-1 rounded shadow-lg border border-slate-600 whitespace-nowrap z-50">
                            {properties.resistance} Ω
                        </div>
                    )}
                </div>
            );

        case 'rheostat':
            return (
                <Rheostat 
                    resistance={properties.resistance || 0}
                    maxResistance={properties.maxResistance || 100}
                    isHovered={isHovered}
                    onPropertyChange={onPropertyChange}
                />
            );

        case 'switch':
            return (
                <div className={`relative w-[160px] h-[110px] ${isHovered ? activeGlow : glowShadow}`}>
                    <svg className="absolute inset-0 w-full h-full drop-shadow-xl" viewBox="0 0 160 110">
                        <defs>
                            <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#262626"/>
                                <stop offset="100%" stopColor="#0a0a0a"/>
                            </linearGradient>
                            <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fef08a"/>
                                <stop offset="25%" stopColor="#eab308"/>
                                <stop offset="50%" stopColor="#ca8a04"/>
                                <stop offset="80%" stopColor="#a16207"/>
                                <stop offset="100%" stopColor="#854d0e"/>
                            </linearGradient>
                            <linearGradient id="brassHighlight" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
                                <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
                                <stop offset="100%" stopColor="rgba(0,0,0,0.3)"/>
                            </linearGradient>
                            <linearGradient id="terminalScrew" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#f1f5f9"/>
                                <stop offset="30%" stopColor="#94a3b8"/>
                                <stop offset="70%" stopColor="#475569"/>
                                <stop offset="100%" stopColor="#1e293b"/>
                            </linearGradient>
                            <pattern id="knurl" x="0" y="0" width="2" height="10" patternUnits="userSpaceOnUse">
                                <rect x="0" y="0" width="1" height="10" fill="#1e293b"/>
                                <rect x="1" y="0" width="1" height="10" fill="#0f172a"/>
                            </pattern>
                        </defs>

                        {/* Bakelite Base */}
                        <rect x="10" y="25" width="140" height="75" rx="4" fill="url(#baseGrad)" stroke="#171717" strokeWidth="2"/>
                        <rect x="12" y="27" width="136" height="71" rx="3" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>

                        {/* Left Brass Block */}
                        <g transform="translate(30, 45)">
                            {/* Block base */}
                            <rect x="0" y="0" width="40" height="20" fill="url(#brass)"/>
                            {/* Bevels */}
                            <path d="M 0 0 L 40 0 L 38 2 L 2 2 Z" fill="#fef08a" opacity="0.8"/>
                            <path d="M 0 20 L 40 20 L 38 18 L 2 18 Z" fill="#713f12" opacity="0.8"/>
                            {/* Angled cut for plug */}
                            <path d="M 40 0 L 30 10 L 40 20 Z" fill="#854d0e"/>
                            <path d="M 40 0 L 30 10 L 40 20 Z" fill="url(#brassHighlight)"/>
                            {/* Terminal post base */}
                            <rect x="8" y="-12" width="14" height="12" fill="url(#brass)" rx="1"/>
                            <rect x="8" y="-12" width="14" height="12" fill="url(#brassHighlight)" rx="1"/>
                        </g>

                        {/* Right Brass Block */}
                        <g transform="translate(90, 45)">
                            {/* Block base */}
                            <rect x="0" y="0" width="40" height="20" fill="url(#brass)"/>
                            {/* Bevels */}
                            <path d="M 0 0 L 40 0 L 38 2 L 2 2 Z" fill="#fef08a" opacity="0.8"/>
                            <path d="M 0 20 L 40 20 L 38 18 L 2 18 Z" fill="#713f12" opacity="0.8"/>
                            {/* Angled cut for plug */}
                            <path d="M 0 0 L 10 10 L 0 20 Z" fill="#ca8a04"/>
                            <path d="M 0 0 L 10 10 L 0 20 Z" fill="url(#brassHighlight)"/>
                            {/* Terminal post base */}
                            <rect x="18" y="-12" width="14" height="12" fill="url(#brass)" rx="1"/>
                            <rect x="18" y="-12" width="14" height="12" fill="url(#brassHighlight)" rx="1"/>
                        </g>

                        {/* Left Terminal Screw */}
                        <g transform="translate(32, 12)">
                            {/* Threaded rod */}
                            <rect x="10" y="8" width="6" height="14" fill="#94a3b8"/>
                            {Array.from({length: 6}).map((_,i) => (
                                <line key={i} x1="10" y1={9+i*2} x2="16" y2={10+i*2} stroke="#475569" strokeWidth="1"/>
                            ))}
                            {/* Knurled nut */}
                            <path d="M 4 4 Q 13 -2 22 4 L 20 12 Q 13 14 6 12 Z" fill="url(#terminalScrew)"/>
                            <path d="M 4 4 Q 13 -2 22 4 L 20 12 Q 13 14 6 12 Z" fill="url(#knurl)" opacity="0.6"/>
                            <ellipse cx="13" cy="4" rx="9" ry="3" fill="#cbd5e1" stroke="#64748b"/>
                            <ellipse cx="13" cy="4" rx="6" ry="2" fill="#0f172a"/>
                        </g>

                        {/* Right Terminal Screw */}
                        <g transform="translate(102, 12)">
                            {/* Threaded rod */}
                            <rect x="10" y="8" width="6" height="14" fill="#94a3b8"/>
                            {Array.from({length: 6}).map((_,i) => (
                                <line key={i} x1="10" y1={9+i*2} x2="16" y2={10+i*2} stroke="#475569" strokeWidth="1"/>
                            ))}
                            {/* Knurled nut */}
                            <path d="M 4 4 Q 13 -2 22 4 L 20 12 Q 13 14 6 12 Z" fill="url(#terminalScrew)"/>
                            <path d="M 4 4 Q 13 -2 22 4 L 20 12 Q 13 14 6 12 Z" fill="url(#knurl)" opacity="0.6"/>
                            <ellipse cx="13" cy="4" rx="9" ry="3" fill="#cbd5e1" stroke="#64748b"/>
                            <ellipse cx="13" cy="4" rx="6" ry="2" fill="#0f172a"/>
                        </g>

                    </svg>

                    {/* The Plug (Animates in/out) */}
                    <motion.div 
                        initial={false}
                        animate={{ 
                            y: properties.closed ? 0 : -35,
                            opacity: properties.closed ? 1 : 0.8,
                            scale: properties.closed ? 1 : 1.05
                        }}
                        transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[34px] h-[65px] z-20 pointer-events-none drop-shadow-2xl"
                    >
                        <svg viewBox="0 0 34 65" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="plugBrass" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#ca8a04"/>
                                    <stop offset="50%" stopColor="#fef08a"/>
                                    <stop offset="100%" stopColor="#854d0e"/>
                                </linearGradient>
                            </defs>
                            
                            {/* Brass pin */}
                            <path d="M 12 35 L 22 35 L 20 60 Q 17 62 14 60 Z" fill="url(#plugBrass)"/>
                            
                            {/* Plastic Handle */}
                            {/* Shadow beneath top handle */}
                            <ellipse cx="17" cy="38" rx="14" ry="6" fill="#000" opacity="0.5"/>
                            
                            <g transform="rotate(-15, 17, 20)">
                                {/* Side walls of handle */}
                                <path d="M 4 10 L 4 35 C 4 38, 30 38, 30 35 L 30 10 Z" fill="#171717"/>
                                {/* Vertical ridges */}
                                {Array.from({length: 12}).map((_,i) => (
                                    <rect key={i} x={6 + i*2} y="10" width="1" height="26" fill="#262626"/>
                                ))}
                                {/* Top cap of handle */}
                                <ellipse cx="17" cy="10" rx="13" ry="5" fill="#0a0a0a" stroke="#262626" strokeWidth="1"/>
                                <ellipse cx="17" cy="10" rx="9" ry="3" fill="#000"/>
                            </g>
                        </svg>
                    </motion.div>

                    {/* Status LED/Indicator (Optional, for visual clarity) */}
                    <div className="absolute left-[70px] top-[90px] flex items-center gap-1.5 opacity-60">
                        <div className={`w-1.5 h-1.5 rounded-full ${properties.closed ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-red-500 shadow-[0_0_5px_#ef4444]'}`}></div>
                        <span className="text-[7px] font-bold tracking-widest text-slate-300">
                            {properties.closed ? 'CLOSED' : 'OPEN'}
                        </span>
                    </div>
                </div>
            );

        case 'galvanometer':
            return <Galvanometer reading={properties.reading || 0} scale={properties.scale || 30} unit={properties.unit || 'µA'} isHovered={isHovered} />;

        case 'lens':
            const isConvex = properties.type === 'convex';
            return (
                <div className={`relative w-16 h-48 flex items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="absolute inset-0 bg-blue-400/10 blur-xl opacity-20"></div>
                    <svg width="40" height="160" viewBox="0 0 40 160" className="drop-shadow-[0_0_15px_rgba(147,197,253,0.5)]">
                        <path
                            d={isConvex
                                ? "M20 0 Q40 80 20 160 Q0 80 20 0"
                                : "M0 0 Q20 80 0 160 L40 160 Q20 80 40 0 Z"}
                            fill="url(#lensGradient)"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="1"
                        />
                        <defs>
                            <linearGradient id="lensGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute bottom-0 text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center w-max">
                        f = {properties.focalLength}cm
                    </div>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow-xl text-[10px] font-bold whitespace-nowrap z-50 flex items-center gap-2"
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-200 animate-pulse"></div>
                            {isConvex ? 'Real Image' : 'Virtual Image'} Magnification
                        </motion.div>
                    )}
                </div>
            );

        case 'mirror':
            return (
                <div className={`relative w-8 h-48 flex items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="w-1.5 h-40 bg-slate-700 rounded-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-400 to-slate-200 opacity-50"></div>
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-slate-800/50"></div>
                    </div>
                    <div className="absolute -right-4 h-40 flex flex-col justify-around">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="w-3 h-0.5 bg-slate-700 -rotate-45"></div>
                        ))}
                    </div>
                    <div className="absolute bottom-0 text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center w-max">
                        Reflective
                    </div>
                </div>
            );

        case 'pulley':
            return (
                <div className={`relative w-24 h-24 flex items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Mounting bracket at top */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 bg-slate-600 border border-slate-500 rounded-t-sm"></div>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-slate-500"></div>
                    <div className="w-20 h-20 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center shadow-inner relative">
                        {/* Groove for rope */}
                        <div className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-amber-800/40 absolute"></div>
                        <div className="w-14 h-14 rounded-full border-2 border-slate-700/50 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-slate-600"></div>
                        </div>
                        {[0, 45, 90, 135].map(angle => (
                            <div
                                key={angle}
                                className="absolute w-16 h-0.5 bg-slate-700/30"
                                style={{ transform: `rotate(${angle}deg)` }}
                            ></div>
                        ))}
                    </div>
                    {/* Left rope attachment indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-700/60 border border-amber-600/40"></div>
                    {/* Right rope attachment indicator */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-700/60 border border-amber-600/40"></div>
                    <div className="absolute -top-5 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[8px] font-mono text-slate-400">
                        μ = {properties.friction || '0'}
                    </div>
                </div>
            );

        case 'block':
            return (
                <div className={`relative w-24 h-24 bg-slate-700 rounded-lg border-2 border-slate-600 flex flex-col items-center justify-center gap-1 ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Attachment hook at top for rope connection */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-slate-500 bg-slate-600"></div>
                    <div className="absolute top-1 left-1 opacity-20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                        </svg>
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-200">{properties.mass}</div>
                    <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-tighter">kg</div>
                </div>
            );

        case 'stopwatch':
            return (
                <div className={`relative w-24 h-[120px] flex flex-col items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Top button */}
                    <div className="w-4 h-3 bg-slate-600 rounded-t-sm border border-slate-500 mb-[-1px] z-10"></div>
                    {/* Watch body */}
                    <div className="w-20 h-20 rounded-full border-4 border-slate-600 bg-slate-800 flex items-center justify-center relative">
                        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex flex-col items-center justify-center">
                            <div className="text-sm font-bold font-mono text-emerald-400">
                                {(properties.time || 0).toFixed(1)}
                            </div>
                            <div className="text-[8px] font-mono text-slate-500 uppercase">sec</div>
                        </div>
                        {/* Dial hand */}
                        <div className="absolute w-0.5 h-6 bg-red-500 origin-bottom" style={{ bottom: '50%', left: 'calc(50% - 1px)', transform: `rotate(${((properties.time || 0) % 60) * 6}deg)` }}></div>
                    </div>
                    <div className="mt-1 text-[8px] font-mono text-slate-500 uppercase tracking-widest">Stopwatch</div>
                </div>
            );

        case 'meter-scale':
            return (
                <div className={`relative w-60 h-12 flex flex-col items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Scale body */}
                    <div className="w-56 h-6 bg-amber-900/80 border border-amber-800 rounded-sm relative overflow-hidden">
                        {/* Graduation marks */}
                        <div className="absolute inset-0 flex">
                            {Array.from({ length: 11 }).map((_, i) => (
                                <div key={i} className="flex-1 relative">
                                    <div className="absolute left-0 top-0 w-px h-full bg-amber-600/60"></div>
                                    <span className="absolute left-0.5 bottom-0 text-[6px] font-mono text-amber-400/80">{i * 10}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-0.5 text-[8px] font-mono text-slate-500 uppercase tracking-widest">cm</div>
                </div>
            );

        case 'screen':
            return (
                <div className={`relative w-12 h-48 flex items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Screen panel */}
                    <div className="w-8 h-40 bg-white/90 border-2 border-slate-400 rounded-sm shadow-inner relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"></div>
                        {/* Center crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-px h-4 bg-slate-400/50 absolute left-1/2 -translate-x-1/2"></div>
                            <div className="h-px w-4 bg-slate-400/50 absolute top-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>
                    {/* Stand */}
                    <div className="absolute bottom-0 w-12 h-2 bg-slate-700 rounded-sm"></div>
                    <div className="absolute -bottom-2 text-[8px] font-mono text-slate-500 uppercase tracking-widest">Screen</div>
                </div>
            );

        default:
            return (
                <div className="w-20 h-20 bg-slate-800 rounded-lg border-2 border-slate-700 flex items-center justify-center">
                    <span className="text-xs uppercase font-bold text-slate-500">{type}</span>
                </div>
            );
    }
};
