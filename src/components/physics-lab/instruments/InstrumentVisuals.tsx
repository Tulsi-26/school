"use client";

import React from 'react';
import { motion } from 'framer-motion';

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
                <div className={`relative w-24 h-40 bg-slate-800 rounded-xl border-2 border-slate-700 p-2 overflow-hidden ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 3l-1.99 4.01L15 7l-5 9 2 1-3 4v-9l-2.01 .01L13 3z" />
                        </svg>
                    </div>
                    <div className="flex flex-col h-full justify-between items-center py-4">
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Power Supply</div>
                        <div className="text-xl font-bold font-mono text-blue-400">{properties.voltage}V</div>
                        <div className="w-12 h-1 bg-slate-700/50 rounded-full"></div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">Standard DC</div>
                    </div>
                </div>
            );

        case 'ammeter':
        case 'voltmeter':
            const isAmmeter = type === 'ammeter';
            return (
                <div className={`relative w-32 h-32 bg-slate-800 rounded-2xl border-2 border-slate-700 p-3 ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="flex flex-col h-full items-center justify-center gap-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isAmmeter ? 'Ammeter' : 'Voltmeter'}</div>
                        <div className="relative w-20 h-20 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                            <div className="text-xl font-mono font-bold text-white z-10">{properties.reading || 0}</div>
                            <div className="text-[8px] font-mono text-slate-500 z-10">{isAmmeter ? 'mA' : 'V'}</div>
                            {/* Radial Progress */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                <circle
                                    cx="40" cy="40" r="34"
                                    fill="none" stroke="currentColor" strokeWidth="2"
                                    className="text-slate-800"
                                />
                                <motion.circle
                                    cx="40" cy="40" r="34"
                                    fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeDasharray="213"
                                    initial={{ strokeDashoffset: 213 }}
                                    animate={{ strokeDashoffset: 213 - (213 * (properties.reading || 0) / (properties.scale || 100)) }}
                                    className="text-blue-500"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            );

        case 'resistor':
            return (
                <div className={`relative w-32 h-16 bg-slate-700/40 rounded-full border-2 border-slate-600/50 flex items-center justify-center p-2 ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="w-full flex justify-around items-center h-4 opacity-70">
                        <div className="w-1.5 h-full bg-blue-500"></div>
                        <div className="w-1.5 h-full bg-slate-400"></div>
                        <div className="w-1.5 h-full bg-red-400"></div>
                        <div className="w-1.5 h-full bg-yellow-400"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-mono font-bold text-slate-200 bg-slate-900/50 px-1 rounded">{properties.resistance} Ω</span>
                    </div>
                </div>
            );

        case 'rheostat':
            return (
                <div className={`relative w-40 h-24 bg-slate-800 border-2 border-slate-700 rounded-lg p-2 ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest text-center">Variable Resistor</div>
                    <div className="mt-2 h-8 w-full bg-slate-900/50 border border-slate-700 rounded relative overflow-hidden">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-600 -translate-y-1/2"></div>
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 120 }}
                            dragElastic={0}
                            dragMomentum={false}
                            onDrag={(e, info) => {
                                if (onPropertyChange) {
                                    const maxR = properties.maxResistance || 100;
                                    const newR = Math.round((info.point.x / 120) * maxR);
                                    onPropertyChange({ resistance: Math.max(0, Math.min(maxR, newR)) });
                                }
                            }}
                            className="absolute left-0 h-full w-2 bg-blue-500 border-x border-blue-400 cursor-ew-resize z-30"
                            style={{ x: (properties.resistance / (properties.maxResistance || 100)) * 120 } as any}
                        ></motion.div>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-center text-slate-400">{properties.resistance} Ω</div>
                </div>
            );

        case 'switch':
            return (
                <div className={`relative w-20 h-20 bg-slate-800 rounded-xl border-2 border-slate-700 flex items-center justify-center p-3 transition-colors ${properties.closed ? 'bg-emerald-500/10 border-emerald-500/30' : ''} ${isHovered ? activeGlow : glowShadow}`}>
                    <div className={`w-12 h-12 rounded-full border-2 border-slate-700 flex items-center justify-center transition-all ${properties.closed ? 'border-emerald-500' : ''}`}>
                        <div className={`w-8 h-2 bg-slate-500 origin-left transition-transform duration-300 ${properties.closed ? 'rotate-[30deg] bg-emerald-400' : '-rotate-45'}`}></div>
                    </div>
                    <div className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-slate-700 transition-colors" style={{ backgroundColor: properties.closed ? '#10b981' : '#334155' }}></div>
                </div>
            );

        case 'galvanometer':
            return (
                <div className={`relative w-32 h-32 bg-slate-800 rounded-2xl border-2 border-slate-700 p-3 ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="flex flex-col h-full items-center justify-center gap-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Galvanometer</div>
                        <div className="relative w-20 h-20 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                            <motion.div
                                className="w-0.5 h-12 bg-red-500 origin-bottom"
                                animate={{ rotate: properties.reading * 90 }}
                                transition={{ type: 'spring', stiffness: 100 }}
                            ></motion.div>
                            <div className="absolute bottom-2 text-[8px] font-bold text-slate-500">G</div>
                        </div>
                    </div>
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
