"use client";

import { motion } from 'framer-motion';
import { Battery } from './Battery';
import { Ammeter } from './Ammeter';
import { Voltmeter } from './Voltmeter';

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
            return (
                <div className={`relative w-32 h-32 bg-slate-800 rounded-2xl border-2 border-slate-700 p-3 ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="flex flex-col h-full items-center justify-center gap-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Voltmeter</div>
                        <div className="relative w-20 h-20 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                            <div className="text-xl font-mono font-bold text-white z-10">{properties.reading || 0}</div>
                            <div className="text-[8px] font-mono text-slate-500 z-10">V</div>
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
                    <div className="absolute inset-x-2 bottom-1 h-[14px] bg-gradient-to-b from-slate-900 to-black rounded-sm border border-slate-700"></div>

                    <div className="absolute left-1 top-[22px] w-[28px] h-[82px] bg-gradient-to-b from-slate-700 to-slate-900 rounded-sm border border-slate-600"></div>
                    <div className="absolute right-1 top-[22px] w-[28px] h-[82px] bg-gradient-to-b from-slate-700 to-slate-900 rounded-sm border border-slate-600"></div>

                    <div className="absolute left-[25px] right-[25px] top-[28px] h-[10px] rounded bg-gradient-to-b from-slate-200 to-slate-500 border border-slate-500"></div>

                    <div className="absolute left-[28px] right-[28px] top-[45px] h-[32px] rounded-full bg-gradient-to-b from-slate-500 to-slate-800 border border-slate-700 overflow-hidden">
                        <div className="absolute inset-0 opacity-45 bg-[repeating-linear-gradient(90deg,rgba(226,232,240,0.25)_0px,rgba(226,232,240,0.25)_1px,transparent_2px,transparent_4px)]"></div>
                    </div>

                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 162 }}
                        dragElastic={0}
                        dragMomentum={false}
                        onDrag={(e, info) => {
                            if (onPropertyChange) {
                                const maxR = properties.maxResistance || 100;
                                const newR = Math.round((info.point.x / 162) * maxR);
                                onPropertyChange({ resistance: Math.max(0, Math.min(maxR, newR)) });
                            }
                        }}
                        className="absolute left-[49px] top-[28px] w-[22px] h-[46px] cursor-ew-resize"
                        style={{ x: (properties.resistance / (properties.maxResistance || 100)) * 162 } as any}
                    >
                        <div className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600 rounded-sm shadow-lg"></div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-red-900/70 rounded"></div>
                    </motion.div>

                    <div className="absolute left-[8px] top-[72px] w-[10px] h-[10px] rounded-full bg-gradient-to-b from-slate-300 to-slate-600 border border-slate-600"></div>
                    <div className="absolute right-[8px] top-[72px] w-[10px] h-[10px] rounded-full bg-gradient-to-b from-red-400 to-red-700 border border-red-900"></div>

                    <div className="absolute left-2 top-2 bg-slate-950/75 text-[9px] font-mono text-blue-200 px-2 py-0.5 rounded">
                        Rheostat
                    </div>
                    <div className="absolute right-2 top-2 bg-slate-950/75 text-[9px] font-mono text-slate-200 px-2 py-0.5 rounded">
                        {properties.resistance} ohm
                    </div>
                </div>
            );

        case 'switch':
            return (
                <div className={`relative w-[140px] h-[95px] ${isHovered ? activeGlow : glowShadow}`}>
                    <div className="absolute inset-x-2 bottom-2 h-[54px] rounded bg-gradient-to-b from-slate-900 to-black border border-slate-700"></div>

                    <div className="absolute left-[26px] top-[37px] w-[36px] h-[22px] rounded-sm bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-700"></div>
                    <div className="absolute right-[26px] top-[37px] w-[36px] h-[22px] rounded-sm bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-700"></div>

                    <div className="absolute left-[34px] top-[31px] w-[16px] h-[12px] rounded-full bg-gradient-to-b from-slate-100 to-slate-400 border border-slate-500"></div>
                    <div className="absolute right-[34px] top-[31px] w-[16px] h-[12px] rounded-full bg-gradient-to-b from-slate-100 to-slate-400 border border-slate-500"></div>

                    <div className="absolute left-1/2 -translate-x-1/2 top-[22px] w-[20px] h-[24px] rounded bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600"></div>
                    <motion.div
                        animate={{ rotate: properties.closed ? 0 : -25 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                        className="absolute left-1/2 top-[42px] -translate-x-1/2 origin-top w-[5px] h-[24px] rounded bg-gradient-to-b from-amber-100 to-amber-400 border border-amber-500"
                    ></motion.div>

                    <div className="absolute left-[58px] top-[66px] text-[8px] font-bold text-emerald-400">
                        {properties.closed ? 'ON' : 'OFF'}
                    </div>
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
