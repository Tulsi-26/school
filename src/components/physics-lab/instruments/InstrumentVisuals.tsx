"use client";

import { motion } from 'framer-motion';
import { Battery } from './Battery';
import { Ammeter } from './Ammeter';
import { Voltmeter } from './Voltmeter';
import { Galvanometer } from './Galvanometer';

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
    const glowShadow = "drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]";
    const activeGlow = "drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]";

    switch (type) {
        case 'battery':
            return (
                <div className={`relative w-[280px] h-[160px] ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Main Background & Base */}
                    <div className="absolute inset-0 bg-[#e6e4d8] rounded-sm shadow-[0_15px_30px_rgba(0,0,0,0.5)] border-b-2 border-r-2 border-[#b5ae9a] flex flex-col">

                        {/* Top Cover (Box lid effect) */}
                        <div className="absolute top-0 inset-x-0 h-[60px] bg-[#e6e4d8]">
                            {/* Slanted left edge */}
                            <div className="absolute left-0 top-0 w-[20px] h-[60px] bg-gradient-to-r from-[#cfcbc1] to-[#e6e4d8]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
                            {/* Slanted right edge */}
                            <div className="absolute right-0 top-0 w-[20px] h-[60px] bg-gradient-to-l from-[#bcbaa9] to-[#e6e4d8]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)' }}></div>
                            {/* Dark shading underneath lid edge */}
                            <div className="absolute bottom-0 inset-x-0 h-[2px] bg-black/10"></div>
                        </div>

                        {/* Front Panel (White with components) */}
                        <div className="absolute top-[60px] inset-x-[10px] bottom-0 bg-[#f8f9fa] border-t border-[#d1d5db] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),_0_-2px_6px_rgba(0,0,0,0.1)] pt-2 pb-1 px-4 relative flex flex-col items-center">

                            {/* Top Row: Switch, LED, Button */}
                            <div className="w-full flex justify-between items-start mt-1 px-4">
                                {/* Toggle Switch (ON) */}
                                <div className="flex flex-col items-center">
                                    <div className="w-[10px] h-[16px] bg-[#222] rounded-[2px] border border-[#111] shadow-inner relative flex justify-center mt-1">
                                        <div className="absolute top-[1px] w-[5px] h-[12px] bg-gradient-to-b from-[#f1f5f9] to-[#94a3b8] rounded-full border border-[#64748b] shadow-md origin-bottom transform rotate-12"></div>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-700 mt-1 tracking-wide uppercase">ON</span>
                                </div>

                                {/* LED Indicator */}
                                <div className="flex flex-col items-center px-4">
                                    <div className="w-[14px] h-[14px] rounded-full bg-red-600 border border-red-900 shadow-[0_0_12px_rgba(220,38,38,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] relative flex items-center justify-center">
                                        <div className="w-[5px] h-[5px] bg-white opacity-40 rounded-full absolute top-[1px]"></div>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-700 mt-1 tracking-widest uppercase">INDICATOR</span>
                                </div>

                                {/* Red Push Button */}
                                <div className="flex flex-col items-center pr-2">
                                    <div className="w-[22px] h-[22px] rounded-full bg-gradient-to-br from-[#dc2626] to-[#991b1b] border-[1.5px] border-[#7f1d1d] shadow-[0_3px_5px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)] relative group cursor-pointer active:scale-95 transition-transform flex items-center justify-center">
                                        <div className="w-[12px] h-[12px] rounded-full bg-gradient-to-br from-[#ef4444] to-[#b91c1c] shadow-inner"></div>
                                    </div>
                                    <span className="text-[7px] font-bold text-slate-700 mt-1 tracking-widest uppercase">MFD. BY :-</span>
                                    {/* Fake TLI logo */}
                                    <div className="mt-0.5 w-[28px] h-[20px] flex items-center justify-center relative shadow-sm" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', background: '#e02020' }}>
                                        <div className="absolute inset-[2px] bg-white flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                            <span className="text-[#e02020] font-black text-[10px] italic tracking-tighter">TLI</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Knob, Terminals, Text */}
                            <div className="w-full flex justify-between items-end pb-1 mt-1">
                                {/* Voltage Control */}
                                <div className="flex flex-col items-center w-[80px]">
                                    <span className="text-[8px] font-bold text-slate-700 mb-1">CONTROL</span>
                                    <div className="w-[20px] h-[20px] rounded-full bg-[#f1f5f9] border border-[#cbd5e1] shadow-[0_3px_5px_rgba(0,0,0,0.3)] flex justify-center relative cursor-move">
                                        <div className="absolute inset-[1px] rounded-full border border-[#cbd5e1] border-dashed opacity-50"></div>
                                        <div className="w-[2px] h-[8px] bg-[#dc2626] mt-[1px] rounded-full shadow-[0_0_2px_rgba(0,0,0,0.2)]"></div>
                                    </div>
                                    {/* Current UI Voltage Overlay box under knob */}
                                    <div className="mt-1 bg-white border border-slate-300 px-1 py-0.5 shadow-inner w-full text-center">
                                        <span className="text-[7px] font-bold text-slate-500 block">VOLT: {properties.voltage}</span>
                                    </div>
                                </div>

                                {/* Central Terminals */}
                                <div className="flex flex-col flex-1 items-center px-2">
                                    <span className="text-[8px] font-bold text-slate-700 tracking-widest uppercase mb-[2px]">OUTPUT</span>
                                    <div className="flex gap-[25px]">
                                        {/* Red Terminal (+) */}
                                        <div className="flex flex-col items-center z-10">
                                            <div className="w-[18px] h-[26px] rounded-sm bg-gradient-to-b from-[#ef4444] to-[#991b1b] border border-[#7f1d1d] shadow-[0_4px_6px_rgba(0,0,0,0.5)] relative flex flex-col justify-around py-1">
                                                {/* Fluting lines */}
                                                <div className="w-full h-px bg-black/20"></div>
                                                <div className="w-full h-px bg-black/30"></div>
                                                <div className="w-full h-px bg-black/20"></div>
                                                {/* Inner hole */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-[#450a0a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border border-[#f87171]/20"></div>
                                            </div>
                                        </div>

                                        {/* Black Terminal (-) */}
                                        <div className="flex flex-col items-center z-10">
                                            <div className="w-[18px] h-[26px] rounded-sm bg-gradient-to-b from-[#333] to-[#0a0a0a] border border-[#000] shadow-[0_4px_6px_rgba(0,0,0,0.5)] relative flex flex-col justify-around py-1">
                                                {/* Fluting lines */}
                                                <div className="w-full h-px bg-white/10"></div>
                                                <div className="w-full h-px bg-white/20"></div>
                                                <div className="w-full h-px bg-white/10"></div>
                                                {/* Inner hole */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-[#000] shadow-[inset_0_2px_4px_rgba(0,0,0,1)] border border-[#ffffff]/20"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Text below terminals */}
                                    <div className="text-center mt-1">
                                        <span className="text-[7px] font-bold text-slate-800 tracking-tight block">D.C. REGULATED POWER SUPPLY</span>
                                        <span className="text-[7px] font-bold text-slate-800 tracking-tight block">TECHNO-LAB INSTRUMENTATION</span>
                                        <span className="text-[6px] font-medium text-slate-600 tracking-tight block">MODEL - TL/VPS/FPS</span>
                                    </div>
                                </div>
                                <div className="w-[80px]"></div> {/* Spacer for balance */}
                            </div>
                        </div>
                    </div>
                    {/* Power Cord (Back left) */}
                    <div className="absolute -top-[10px] left-[50px] w-[3px] h-3 bg-[#222] z-[-1]"></div>
                    <svg className="absolute -top-[40px] left-[10px] w-20 h-10 z-[-1] overflow-visible" fill="none" stroke="#222" strokeWidth="2.5">
                        <path d="M 40,30 Q 50,-5 0,-10" />
                    </svg>

                </div>
            );

        case 'ammeter':
            return <Ammeter reading={properties.reading || 0} scale={properties.scale || 100} isHovered={isHovered} />;

        case 'voltmeter':
            return <Voltmeter reading={properties.reading || 0} scale={properties.scale || 20} isHovered={isHovered} />;

        case 'resistor':
            return (
                <div className={`relative w-[160px] h-[60px] flex items-center justify-center ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Left Wire Lead */}
                    <div className="absolute left-[8px] right-[50%] h-[4px] bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 rounded-l-full shadow-[0_2px_3px_rgba(0,0,0,0.4)] z-0"></div>

                    {/* Right Wire Lead */}
                    <div className="absolute left-[50%] right-[8px] h-[4px] bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 rounded-r-full shadow-[0_2px_3px_rgba(0,0,0,0.4)] z-0"></div>

                    {/* Resistor Main Body */}
                    <div className="relative w-[100px] h-[36px] flex items-center justify-center z-10 drop-shadow-xl">

                        {/* Base Beige Cylinder */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#f5dfc3] via-[#daae81] to-[#a4714e] rounded-[10px] shadow-[inset_0_-4px_8px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.6)]"></div>

                        {/* Left Bulge */}
                        <div className="absolute left-0 top-0 bottom-0 w-[18px] bg-gradient-to-b from-[#f5dfc3] via-[#d5a574] to-[#925f3c] rounded-l-[10px] shadow-[inset_2px_0_4px_rgba(255,255,255,0.3)]"></div>

                        {/* Right Bulge */}
                        <div className="absolute right-0 top-0 bottom-0 w-[18px] bg-gradient-to-b from-[#f5dfc3] via-[#d5a574] to-[#925f3c] rounded-r-[10px] shadow-[inset_-2px_0_4px_rgba(255,255,255,0.3)]"></div>

                        {/* Specular Highlight along the top */}
                        <div className="absolute top-[3px] left-[10px] right-[10px] h-[6px] bg-white/40 blur-[1px] rounded-full pointer-events-none z-20"></div>

                        {/* Specular Highlight along the bottom (bounce light) */}
                        <div className="absolute bottom-[2px] left-[15px] right-[15px] h-[4px] bg-white/20 blur-[2px] rounded-full pointer-events-none z-20"></div>

                        {/* Color Bands */}
                        <div className="absolute inset-y-0 left-[18px] right-[18px] flex justify-between items-center px-[4px] overflow-hidden drop-shadow-sm">
                            {/* Band 1: Red */}
                            <div className="w-[8px] h-full bg-gradient-to-b from-[#f87171] via-[#dc2626] to-[#7f1d1d] opacity-90 mix-blend-multiply relative">
                                <div className="absolute top-[3px] inset-x-0 h-[6px] bg-white/30 rounded-full"></div>
                            </div>
                            {/* Band 2: Black */}
                            <div className="w-[8px] h-full bg-gradient-to-b from-[#4b5563] via-[#111827] to-[#000000] opacity-90 mix-blend-multiply relative">
                                <div className="absolute top-[3px] inset-x-0 h-[6px] bg-white/20 rounded-full"></div>
                            </div>
                            {/* Band 3: Green */}
                            <div className="w-[8px] h-full bg-gradient-to-b from-[#4ade80] via-[#16a34a] to-[#14532d] opacity-90 mix-blend-multiply relative">
                                <div className="absolute top-[3px] inset-x-0 h-[6px] bg-white/30 rounded-full"></div>
                            </div>
                            {/* Spacer */}
                            <div className="flex-1"></div>
                            {/* Band 4: Gold (Tolerance) */}
                            <div className="w-[8px] h-full bg-gradient-to-b from-[#fde047] via-[#ca8a04] to-[#713f12] opacity-90 mix-blend-multiply relative">
                                <div className="absolute top-[3px] inset-x-0 h-[6px] bg-white/40 rounded-full"></div>
                            </div>
                        </div>

                    </div>

                    {/* Value Badge (Appears on Hover) */}
                    {isHovered && (
                        <div className="absolute -top-10 bg-slate-800 text-slate-200 text-xs font-mono font-bold px-2 py-1 rounded shadow-lg border border-slate-600 whitespace-nowrap z-50">
                            {properties.resistance} Ω
                        </div>
                    )}
                </div>
            );

        case 'rheostat':
            return (
                <div className={`relative w-[260px] h-[120px] ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Dark background base shadow */}
                    <div className="absolute inset-x-2 bottom-0 h-[6px] bg-black/40 blur-sm rounded-[100%]"></div>

                    {/* Left Stand */}
                    <div className="absolute left-0 bottom-0 w-[24px] h-[105px] flex flex-col items-center drop-shadow-xl z-10">
                        <div className="w-[10px] h-[12px] bg-gradient-to-b from-[#333] to-[#1a1a1a] rounded-t-[4px] border-x border-t border-[#444]"></div>
                        <div className="w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[#222] to-[#111] border-[2px] border-[#0a0a0a] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-center z-10 -my-1">
                            <div className="w-[8px] h-[8px] bg-gradient-to-b from-slate-300 to-slate-500 rounded-full shadow-sm"></div>
                        </div>
                        <div className="w-[24px] flex-1 bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#111] rounded-b-[4px] shadow-[inset_0_0_8px_rgba(0,0,0,1)] border-b border-[#333]" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)' }}></div>
                    </div>

                    {/* Right Stand */}
                    <div className="absolute right-0 bottom-0 w-[24px] h-[105px] flex flex-col items-center drop-shadow-xl z-10">
                        <div className="w-[10px] h-[12px] bg-gradient-to-b from-[#333] to-[#1a1a1a] rounded-t-[4px] border-x border-t border-[#444]"></div>
                        <div className="w-[20px] h-[20px] rounded-full bg-gradient-to-r from-[#222] to-[#111] border-[2px] border-[#0a0a0a] shadow-[inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center justify-center z-10 -my-1">
                            <div className="w-[8px] h-[8px] bg-gradient-to-b from-slate-300 to-slate-500 rounded-full shadow-sm"></div>
                        </div>
                        <div className="w-[24px] flex-1 bg-gradient-to-r from-[#111] via-[#2a2a2a] to-[#1a1a1a] rounded-b-[4px] shadow-[inset_0_0_8px_rgba(0,0,0,1)] border-b border-[#333]" style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)' }}></div>
                    </div>

                    {/* Guide Rod */}
                    <div className="absolute left-[12px] right-[12px] top-[24px] h-[6px] bg-gradient-to-b from-[#f8fafc] via-[#94a3b8] to-[#475569] shadow-[0_3px_4px_rgba(0,0,0,0.6)] z-0 transform -translate-y-1/2"></div>

                    {/* Ceramic Tube */}
                    <div className="absolute left-[20px] right-[20px] top-[48px] h-[48px] bg-[#e3dcd1] overflow-hidden shadow-[0_12px_15px_rgba(0,0,0,0.5)] border-y border-[#b5ad9a]">
                        {/* Wire Coils */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.25)_2px,rgba(0,0,0,0.25)_3px)] opacity-80"></div>
                        {/* Tube Shading for 3D Cylinder */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none"></div>
                        {/* Specular highlight */}
                        <div className="absolute inset-x-0 top-[8px] h-[6px] bg-white/20 pointer-events-none"></div>
                    </div>

                    {/* Left Metal Band & Terminal bracket */}
                    <div className="absolute left-[24px] top-[48px] w-[18px] h-[48px] bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#64748b] border-x border-[#475569] shadow-[3px_0_6px_rgba(0,0,0,0.4)] z-10">
                        {/* Band reflection */}
                        <div className="absolute inset-x-0 top-[2px] h-[10px] bg-white/40"></div>
                        {/* Lower bracket */}
                        <div className="absolute inset-x-0 bottom-[-14px] h-[14px] bg-gradient-to-b from-[#cbd5e1] to-[#64748b] mx-[2px] border border-[#475569] shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
                    </div>

                    {/* Right Metal Band & Terminal bracket */}
                    <div className="absolute right-[24px] top-[48px] w-[18px] h-[48px] bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#64748b] border-x border-[#475569] shadow-[-3px_0_6px_rgba(0,0,0,0.4)] z-10">
                        {/* Band reflection */}
                        <div className="absolute inset-x-0 top-[2px] h-[10px] bg-white/40"></div>
                        {/* Lower bracket */}
                        <div className="absolute inset-x-0 bottom-[-14px] h-[14px] bg-gradient-to-b from-[#cbd5e1] to-[#64748b] mx-[2px] border border-[#475569] shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}></div>
                    </div>

                    {/* Slider */}
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 172 }}
                        dragElastic={0}
                        dragMomentum={false}
                        onDrag={(e, info) => {
                            if (onPropertyChange) {
                                const maxR = properties.maxResistance || 100;
                                const newR = Math.round((info.point.x / 172) * maxR);
                                onPropertyChange({ resistance: Math.max(0, Math.min(maxR, newR)) });
                            }
                        }}
                        className="absolute left-[24px] top-[14px] w-[40px] h-[45px] cursor-ew-resize z-20 group"
                        style={{ x: (properties.resistance / (properties.maxResistance || 100)) * 172 } as any}
                    >
                        {/* Slider Upper Body */}
                        <div className="absolute top-0 inset-x-0 h-[20px] bg-gradient-to-b from-[#2a2a2a] to-[#111] rounded-t-[3px] shadow-[0_5px_10px_rgba(0,0,0,0.6)] border-t border-slate-600/30 border-x border-[#0a0a0a]">
                            <div className="absolute top-[2px] left-1 right-1 h-[8px] flex justify-between gap-1 opacity-80">
                                <div className="flex-1 bg-black/50 rounded-sm shadow-inner"></div>
                                <div className="flex-1 bg-black/50 rounded-sm shadow-inner"></div>
                                <div className="flex-1 bg-black/50 rounded-sm shadow-inner"></div>
                            </div>
                        </div>
                        {/* Slider Lower Body (Grip) */}
                        <div className="absolute top-[20px] left-[2px] right-[2px] h-[19px] bg-gradient-to-b from-[#111] to-[#1a1a1a]" style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)' }}></div>
                        {/* Brass Contact underneath */}
                        <div className="absolute top-[39px] left-[17px] w-[6px] h-[6px] bg-gradient-to-b from-[#fcd34d] to-[#b45309] rounded-b-full shadow-[0_2px_4px_rgba(0,0,0,0.6)] border border-yellow-700/80"></div>

                        {/* Hover hint */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 text-slate-200 text-[8px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap">
                            {properties.resistance} Ω
                        </div>
                    </motion.div>

                    {/* Terminals visually */}
                    {/* Left terminal post (A) */}
                    <div className="absolute left-[4px] top-[69px] w-[16px] h-[16px] flex items-center justify-center z-20">
                        <div className="w-[12px] h-[12px] rounded-full bg-gradient-to-b from-slate-100 to-slate-400 border border-slate-600 shadow-lg flex items-center justify-center">
                            <div className="w-[6px] h-[6px] rounded-full bg-gradient-to-t from-slate-400 to-slate-200 shadow-inner border border-slate-400"></div>
                        </div>
                    </div>

                    {/* Right terminal post (B) */}
                    <div className="absolute right-[4px] top-[69px] w-[16px] h-[16px] flex items-center justify-center z-20">
                        <div className="w-[12px] h-[12px] rounded-full bg-gradient-to-b from-slate-100 to-slate-400 border border-slate-600 shadow-lg flex items-center justify-center">
                            <div className="w-[6px] h-[6px] rounded-full bg-gradient-to-t from-slate-400 to-slate-200 shadow-inner border border-slate-400"></div>
                        </div>
                    </div>

                    {/* Right upper terminal post (C) - matching the guide rod */}
                    <div className="absolute right-[4px] top-[18px] w-[16px] h-[16px] flex items-center justify-center z-20">
                        <div className="w-[10px] h-[10px] rounded-full bg-gradient-to-b from-slate-100 to-slate-400 border border-slate-600 shadow-md flex items-center justify-center">
                            <div className="w-[4px] h-[4px] rounded-full bg-slate-500"></div>
                        </div>
                    </div>

                    {/* Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bg-[#0f172a]/90 border border-blue-900/50 text-[8px] font-bold text-blue-200 px-2 py-0.5 rounded shadow-sm opacity-80 z-30 pointer-events-none">
                        RHEOSTAT {properties.maxResistance}Ω
                    </div>
                </div>
            );

        case 'switch':
            return (
                <div className={`relative w-[180px] h-[120px] ${isHovered ? activeGlow : glowShadow}`}>
                    {/* Black Base */}
                    <div className="absolute inset-x-1 bottom-1 h-[40px] rounded-[4px] bg-gradient-to-b from-[#222] to-[#0a0a0a] border border-[#111] shadow-[0_15px_25px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)]"></div>

                    {/* Beveled edge for base */}
                    <div className="absolute inset-x-2 bottom-[40px] h-[10px] bg-gradient-to-b from-[#333] to-[#222]" style={{ clipPath: 'polygon(5% 0, 95% 0, 100% 100%, 0 100%)' }}></div>
                    <div className="absolute inset-x-[12px] bottom-[50px] h-[25px] bg-[#2a2a2a] shadow-[inset_0_10px_20px_rgba(0,0,0,0.5)]"></div>

                    {/* Brass Block Left */}
                    <div className="absolute left-[35px] top-[45px] w-[53px] h-[18px] bg-gradient-to-b from-[#fde047] via-[#ca8a04] to-[#854d0e] shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                        <div className="absolute top-0 right-0 border-t-[9px] border-l-[9px] border-b-[9px] border-transparent border-t-[#ca8a04] border-b-[#854d0e] border-l-[#fde047]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 20% 50%)' }}></div>
                    </div>
                    {/* Left block V-cut right side */}
                    <div className="absolute left-[88px] top-[45px] w-[4px] h-[18px] bg-gradient-to-l from-[#713f12] to-[#422006]" style={{ clipPath: 'polygon(0 0, 100% 0, 0 50%, 100% 100%, 0 100%)' }}></div>

                    {/* Brass Block Right */}
                    <div className="absolute right-[35px] top-[45px] w-[53px] h-[18px] bg-gradient-to-b from-[#fde047] via-[#ca8a04] to-[#854d0e] shadow-[0_4px_6px_rgba(0,0,0,0.6)]"></div>
                    {/* Right block V-cut left side */}
                    <div className="absolute right-[88px] top-[45px] w-[4px] h-[18px] bg-gradient-to-r from-[#713f12] to-[#422006]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 50%, 0 100%, 100% 100%)' }}></div>

                    {/* Left Terminal Post */}
                    <div className="absolute left-[45px] top-[15px] flex flex-col items-center pointer-events-none">
                        {/* Threaded Rod */}
                        <div className="w-[8px] h-[30px] bg-[repeating-linear-gradient(0deg,#94a3b8,#94a3b8_2px,#475569_2px,#475569_3px)] border-x border-slate-500 shadow-inner"></div>
                        {/* Knurled Nut */}
                        <div className="absolute top-[8px] w-[24px] h-[10px] bg-gradient-to-r from-[#eab308] via-[#fef08a] to-[#a16207] border border-[#713f12] rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex justify-around px-[1px]">
                            {/* Knurling approximation */}
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-[1px] h-full bg-[#713f12]/50"></div>
                            ))}
                        </div>
                        {/* Base Hex Nut */}
                        <div className="absolute top-[26px] w-[18px] h-[6px] bg-gradient-to-r from-[#eab308] via-[#fef08a] to-[#a16207] border border-[#854d0e] shadow-md"></div>
                    </div>

                    {/* Right Terminal Post */}
                    <div className="absolute right-[45px] top-[15px] flex flex-col items-center pointer-events-none">
                        {/* Threaded Rod */}
                        <div className="w-[8px] h-[30px] bg-[repeating-linear-gradient(0deg,#94a3b8,#94a3b8_2px,#475569_2px,#475569_3px)] border-x border-slate-500 shadow-inner"></div>
                        {/* Knurled Nut */}
                        <div className="absolute top-[8px] w-[24px] h-[10px] bg-gradient-to-r from-[#eab308] via-[#fef08a] to-[#a16207] border border-[#713f12] rounded-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex justify-around px-[1px]">
                            {/* Knurling approximation */}
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-[1px] h-full bg-[#713f12]/50"></div>
                            ))}
                        </div>
                        {/* Base Hex Nut */}
                        <div className="absolute top-[26px] w-[18px] h-[6px] bg-gradient-to-r from-[#eab308] via-[#fef08a] to-[#a16207] border border-[#854d0e] shadow-md"></div>
                    </div>

                    {/* The Plug (Key) */}
                    <motion.div
                        className="absolute left-[78px] top-[5px] w-[24px] flex flex-col items-center z-10"
                        animate={{
                            y: properties.closed ? 20 : -20,
                            scale: properties.closed ? 1 : 1.1,
                            opacity: properties.closed ? 1 : 0.6
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {/* Black Knurled Top Grip */}
                        <div className="w-[28px] h-[34px] bg-gradient-to-r from-[#1a1a1a] via-[#333] to-[#0a0a0a] rounded-t-[10px] rounded-b-[4px] border border-[#000] flex justify-around px-[2px] overflow-hidden shadow-[0_5px_10px_rgba(0,0,0,0.5)]">
                            {/* Knurling lines */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-[2px] h-full bg-[#000]/80 shadow-[1px_0_0_rgba(255,255,255,0.1)]"></div>
                            ))}
                        </div>
                        {/* Brass Pin Tapered */}
                        <div className="w-[8px] h-[16px] bg-gradient-to-r from-[#ca8a04] via-[#fdf08a] to-[#854d0e]" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }}></div>
                    </motion.div>

                    {/* State Text Overlay */}
                    <div className="absolute left-[70px] bottom-[25px] text-[10px] font-bold text-white uppercase opacity-80 z-20 pointer-events-none drop-shadow-md">
                        {properties.closed ? 'ON' : 'OFF'}
                    </div>
                </div>
            );

        case 'galvanometer':
            return <Galvanometer reading={properties.reading || 0} scale={properties.scale || 30} isHovered={isHovered} />;

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
                    <div className="w-20 h-20 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center shadow-inner relative">
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
                    <div className="absolute -top-2 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[8px] font-mono text-slate-400">
                        mu = {properties.friction || '0'}
                    </div>
                </div>
            );

        case 'block':
            return (
                <div className={`relative w-24 h-24 bg-slate-700 rounded-lg border-2 border-slate-600 flex flex-col items-center justify-center gap-1 ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="absolute top-1 left-1 opacity-20">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
                        </svg>
                    </div>
                    <div className="text-lg font-bold font-mono text-slate-200">{properties.mass}</div>
                    <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-tighter">kg</div>
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
