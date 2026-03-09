"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface BatteryProps {
    voltage: number;
    isHovered?: boolean;
}

export const Battery: React.FC<BatteryProps> = ({ voltage, isHovered }) => {
    const baseShadow = "drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]";
    const hoverShadow = "drop-shadow-[0_20px_35px_rgba(59,130,246,0.3)]";

    return (
        <div className={`relative w-64 h-48 flex flex-col items-center justify-end ${isHovered ? hoverShadow : baseShadow} transition-shadow duration-300`}>

            {/* The 3D Top/Side Beige Casing */}
            {/* This uses border tricks to create the trapezoid angled roof effect seen in the photo */}
            <div className="absolute top-0 w-[95%] h-12 bg-[#d7d7c1] border-t border-[#e5e5cf] flex" style={{ perspective: '200px' }}>
                <div className="w-full h-full bg-[#d7d7c1] border-b border-[#c2c2a8] shadow-inner" style={{ transform: 'rotateX(30deg)', transformOrigin: 'bottom' }}></div>
            </div>
            {/* Left angled side */}
            <div className="absolute top-0 left-0 w-4 h-full bg-[#bcbcb2]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 80% 12px)' }}></div>
            {/* Right angled side */}
            <div className="absolute top-0 right-0 w-4 h-full bg-[#afafa5]" style={{ clipPath: 'polygon(0 0, 100% 12px, 100% 100%, 0 100%)' }}></div>


            {/* Main Front Faceplate (White/Silver) */}
            <div className="relative w-[96%] h-[120px] bg-gradient-to-b from-[#f2f2f2] to-[#e4e4e4] rounded-sm border border-[#ccc] shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] z-10 flex p-3 overflow-hidden">

                {/* Left Section (Switch & Knob) */}
                <div className="flex flex-col items-center justify-between w-1/3 h-full relative">
                    {/* Toggle Switch */}
                    <div className="flex flex-col items-center mt-2">
                        <div className="w-6 h-8 bg-gradient-to-b from-[#e0e0e0] to-[#b0b0b0] rounded-sm border border-[#999] p-0.5 shadow-inner flex justify-center items-start">
                            {/* The metal toggle lever */}
                            <div className="w-1.5 h-4 bg-gradient-to-r from-slate-300 via-white to-slate-400 rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.5)] border border-slate-400 rotate-12 origin-bottom"></div>
                        </div>
                        <span className="text-[7px] font-bold text-slate-700 mt-1 uppercase tracking-wider">ON</span>
                    </div>

                    {/* Voltage Control Knob */}
                    <div className="absolute bottom-1 flex flex-col items-center">
                        {/* Scale Arc & Numbers */}
                        <div className="absolute -top-5 w-12 h-12 flex items-center justify-center pointer-events-none">
                            {/* The arc line */}
                            <div className="absolute inset-1 border-t-[1.5px] border-r-[1.5px] border-slate-800 rounded-full rotate-[-45deg] border-l-transparent border-b-transparent"></div>

                            {/* Tick marks and numbers */}
                            {[0, 2, 4, 6, 8, 10, 12].map((val, i) => {
                                // 6 divisions across 90 degrees sweep (-45 deg to 45 deg)
                                const deg = -45 + (i / 6) * 90;
                                return (
                                    <div key={val} className="absolute flex justify-center items-center" style={{ transform: `rotate(${deg}deg) translateY(-20px)` }}>
                                        {/* Tick line */}
                                        <div className="w-[1px] h-1.5 bg-slate-800 absolute"></div>
                                        {/* Number text */}
                                        <span
                                            className="text-[4px] font-bold text-slate-800 absolute -top-[6px]"
                                            style={{ transform: `rotate(${-deg}deg)` }}
                                        >
                                            {val}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* The grey ribbed knob */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e0e0e0] to-[#b0b0b0] border border-[#888] flex items-center justify-center shadow-[0_3px_5px_rgba(0,0,0,0.4)] relative mt-2 group cursor-ew-resize">
                            {/* Inner indent */}
                            <div className="w-4 h-4 rounded-full bg-gradient-to-tl from-[#d0d0d0] to-[#efefef] shadow-inner flex items-center justify-center">
                                {/* Indicator line on knob */}
                                <div className="w-1 h-3 bg-white absolute top-1 rounded-full shadow-sm"></div>
                            </div>
                            {/* Ribs around edge */}
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="absolute w-[1px] h-[3px] bg-[#999] top-0.5" style={{ transform: `rotate(${i * 30}deg) translateY(-1px)` }}></div>
                            ))}
                        </div>
                        <span className="text-[6px] font-bold text-slate-700 mt-0.5 uppercase tracking-widest">CONTROL</span>

                        <div className="text-[5px] mt-1 border border-slate-400 px-1 py-0.5 text-center leading-tight w-16 bg-white/50">
                            VOLTS: {voltage.toFixed(1)}<br />
                            AMP: 1.5A
                        </div>
                    </div>
                </div>

                {/* Middle Section (LED & Terminals) */}
                <div className="flex flex-col justify-between items-center w-1/3 h-full relative">

                    {/* Glowing Red LED */}
                    <div className="flex flex-col items-center mt-3">
                        <div className="w-4 h-4 rounded-full bg-[#111] border border-[#333] flex items-center justify-center shadow-[top_0_1px_1px_rgba(255,255,255,0.4)]">
                            <div className="w-3 h-3 rounded-full bg-[#ff2a2a] shadow-[0_0_10px_#ff2a2a,inset_0_1px_3px_rgba(255,255,255,0.8)] border border-red-800"></div>
                        </div>
                        <span className="text-[6px] font-bold text-slate-700 mt-1 uppercase tracking-widest">INDICATOR</span>
                    </div>

                    {/* Terminals Label */}
                    <div className="absolute bottom-5 text-center flex flex-col items-center">
                        <span className="text-[6px] font-bold text-slate-800 tracking-widest mb-4">OUTPUT</span>
                    </div>

                    {/* Protruding Screw Terminals */}
                    <div className="absolute bottom-1 w-full flex justify-center gap-7">
                        {/* Red Positive Terminal */}
                        <div className="relative group cursor-pointer hover:scale-105 transition-transform">
                            {/* Base shadow/mount */}
                            <div className="absolute -inset-1 bg-black/20 rounded-full blur-[2px] translate-y-1"></div>
                            {/* Plastic ribbed column */}
                            <div className="w-5 h-7 bg-gradient-to-r from-[#b01010] via-[#e52020] to-[#800a0a] rounded-[3px] border border-[#600000] relative flex items-center justify-center overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] z-10">
                                {/* Horizontal ribs effect */}
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="absolute w-full h-px bg-[#400000]/50" style={{ top: `${(i + 1) * 20}%` }}></div>
                                ))}
                                {/* Metal core hole */}
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-500 shadow-inner flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-[#111] rounded-full shadow-inner"></div>
                                </div>
                            </div>
                        </div>

                        {/* Black Negative Terminal */}
                        <div className="relative group cursor-pointer hover:scale-105 transition-transform">
                            <div className="absolute -inset-1 bg-black/20 rounded-full blur-[2px] translate-y-1"></div>
                            <div className="w-5 h-7 bg-gradient-to-r from-[#333] via-[#555] to-[#111] rounded-[3px] border border-[#000] relative flex items-center justify-center overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] z-10">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="absolute w-full h-px bg-[#000]/80" style={{ top: `${(i + 1) * 20}%` }}></div>
                                ))}
                                {/* Metal core hole */}
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-500 shadow-inner flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-[#111] rounded-full shadow-inner"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section (Fuse & Logo Base Text) */}
                <div className="flex flex-col items-center justify-between w-1/3 h-full relative">

                    {/* Fuse Holder / Red Button Top Right */}
                    <div className="flex flex-col items-center mt-3">
                        <div className="w-6 h-6 rounded-full bg-[#111] border border-[#333] shadow-inner flex items-center justify-center relative shadow-[0_3px_5px_rgba(0,0,0,0.4)]">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#e03030] to-[#b01010] border border-[#800] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"></div>
                        </div>
                    </div>

                    {/* Logo Area */}
                    <div className="absolute bottom-2 flex flex-col items-center mt-2">
                        <span className="text-[5px] font-bold text-slate-700 tracking-widest mb-0.5 whitespace-nowrap">MFD. BY :-</span>

                        {/* Red TLI Hexagon Logo */}
                        <div className="w-10 h-10 relative flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
                                <polygon points="50,5 95,28 95,72 50,95 5,72 5,28" fill="none" stroke="#d01b1b" strokeWidth="6" />
                                <polygon points="50,12 88,32 88,68 50,88 12,68 12,32" fill="none" stroke="#d01b1b" strokeWidth="2" />
                            </svg>
                            <span className="absolute font-black text-[#d01b1b] text-base tracking-tighter" style={{ fontFamily: 'Impact, sans-serif' }}>TLI</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Center Text Box */}
                <div className="absolute bottom-0 inset-x-0 w-full flex justify-center pb-1">
                    <div className="text-[5px] text-center font-bold text-slate-600 leading-[6px]">
                        DC. REGULATED POWER SUPPLY<br />
                        TECHNO-LAB INSTRUMENTATION<br />
                        MODEL - TL/VPS/FPS
                    </div>
                </div>

            </div>
        </div>
    );
};
