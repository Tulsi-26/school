"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Instrument as InstrumentType, usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentVisuals } from './instruments/InstrumentVisuals';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Settings2, Check } from 'lucide-react';

interface InstrumentProps {
    id: string;
    type: string;
    name: string;
    position: { x: number; y: number };
    properties: Record<string, any>;
    terminals: any[];
    onPositionChange: (id: string, x: number, y: number) => void;
    onTerminalClick: (id: string, type: string) => void;
    onTerminalDoubleClick: (id: string, type: string) => void;
    updateProperties: (id: string, props: any) => void;
}

const InstrumentComponent: React.FC<InstrumentProps> = ({
    id,
    type,
    name,
    position,
    properties,
    terminals = [], // Default to empty array
    onPositionChange,
    onTerminalClick,
    onTerminalDoubleClick,
    updateProperties
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
    const { connections, instruments, removeInstrument } = usePhysicsLab();

    const connectedState = useMemo(() => {
        if (!terminals) return { connectedTerminalIds: new Set<string>(), connectedNames: [], count: 0 };
        const ownTerminalIds = new Set(terminals.filter(t => t).map((t) => t.id));

        const ownConnections = connections.filter(
            (conn) => conn && (ownTerminalIds.has(conn.from) || ownTerminalIds.has(conn.to))
        );

        const connectedTerminalIds = new Set<string>();
        ownConnections.forEach((conn) => {
            if (ownTerminalIds.has(conn.from)) {
                connectedTerminalIds.add(conn.from);
            }
            if (ownTerminalIds.has(conn.to)) {
                connectedTerminalIds.add(conn.to);
            }
        });

        const getInstrumentByTerminal = (terminalId: string) => {
            for (const inst of instruments) {
                if (inst?.terminals?.some((t) => t?.id === terminalId)) {
                    return inst;
                }
            }
            return null;
        };

        const connectedNames = new Set<string>();
        ownConnections.forEach((conn) => {
            const otherTerminal = ownTerminalIds.has(conn.from) ? conn.to : conn.from;
            const otherInst = getInstrumentByTerminal(otherTerminal);
            if (otherInst && otherInst.id !== id) {
                connectedNames.add(otherInst.name);
            }
        });

        return {
            connectedTerminalIds,
            connectedNames: Array.from(connectedNames),
            count: ownConnections.length,
        };
    }, [connections, instruments, id, terminals]);

    const handleDragEnd = (_e: any, info: any) => {
        setIsDragging(false);
        onPositionChange(id, position.x + info.offset.x, position.y + info.offset.y);
    };

    const handleInstrumentClick = () => {
        if (type === 'switch') {
            updateProperties(id, { closed: !properties.closed });
        }
        setContextMenu(null); // Close menu on regular click
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    // Close context menu when clicking elsewhere
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        if (contextMenu) {
            window.addEventListener('click', handleClickOutside);
            return () => window.removeEventListener('click', handleClickOutside);
        }
    }, [contextMenu]);

    // Available scales by instrument type
    const getScaleOptions = () => {
        switch (type) {
            case 'ammeter': return [{ label: "100 mA", unit: "mA", scale: 100 }, { label: "1 A", unit: "A", scale: 1 }, { label: "5 A", unit: "A", scale: 5 }];
            case 'voltmeter': return [{ label: "5 V", unit: "V", scale: 5 }, { label: "20 V", unit: "V", scale: 20 }, { label: "100 V", unit: "V", scale: 100 }];
            case 'galvanometer': return [{ label: "30 µA", unit: "µA", scale: 30 }, { label: "500 µA", unit: "µA", scale: 500 }];
            default: return null;
        }
    };
    const scaleOptions = getScaleOptions();

    return (
        <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            initial={false}
            animate={isDragging ? undefined : {
                x: position.x,
                y: position.y,
                scale: isHovered ? 1.02 : 1,
                transition: { type: 'spring', stiffness: 350, damping: 30 }
            }}
            whileDrag={{
                scale: 1.05,
                zIndex: 100,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(59,130,246,0.2)"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onContextMenu={handleContextMenu}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ touchAction: 'none' } as any}
        >
            <div className="relative group" onClick={handleInstrumentClick}>
                {/* Drag Handle Indicator */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-slate-700/30 rounded-full opacity-0 group-hover:opacity-100 transition-all ${isDragging ? 'opacity-0 scale-50' : 'scale-100'}`} />

                {/* Instrument Visual */}
                <InstrumentVisuals
                    type={type}
                    properties={properties}
                    isHovered={isHovered}
                    onPropertyChange={(props: any) => updateProperties(id, props)}
                />

                {/* Terminals */}
                {terminals.map((t) => {
                    const isMechanicalTerminal = t.type === 'input' || t.type === 'output';
                    return (
                        <button
                            key={t.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTerminalClick(t.id, t.type);
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                onTerminalDoubleClick(t.id, t.type);
                            }}
                            className={`absolute w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 z-20 ${isMechanicalTerminal
                                ? 'bg-amber-700 border-amber-600 shadow-[0_0_8px_rgba(180,130,80,0.4)]'
                                : t.type === 'positive'
                                    ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                    : 'bg-black border-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                                }`}
                            style={{
                                left: t.position.x,
                                top: t.position.y,
                                transform: 'translate(-50%, -50%)',
                                boxShadow: connectedState.connectedTerminalIds.has(t.id)
                                    ? isMechanicalTerminal
                                        ? '0 0 0 2px rgba(180,130,80,0.85), 0 0 16px rgba(180,130,80,0.65)'
                                        : '0 0 0 2px rgba(59,130,246,0.85), 0 0 16px rgba(59,130,246,0.65)'
                                    : undefined
                            }}
                            title={isMechanicalTerminal ? 'rope attachment point' : `${t.type} terminal`}
                        />
                    );
                })}

                {/* Label */}
                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all bg-slate-900/90 border border-slate-700/50 px-3 py-1 rounded shadow-xl text-[10px] uppercase font-bold tracking-tighter text-slate-300 pointer-events-none ${isHovered && !isDragging && !contextMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    {name}
                </div>
            </div>

            {/* Context Menu Portal / Overlay */}
            <AnimatePresence>
                {contextMenu && (
                    <div className="fixed inset-0 z-[9999]" style={{ pointerEvents: 'none' }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            style={{
                                position: 'absolute',
                                left: contextMenu.x,
                                top: contextMenu.y,
                                pointerEvents: 'auto'
                            }}
                            className="w-48 bg-slate-900 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-slate-700 overflow-hidden flex flex-col py-1"
                            onClick={(e) => e.stopPropagation()} // Prevent closing immediately when clicking inside
                        >
                            {/* Title */}
                            <div className="px-3 py-2 border-b border-slate-800">
                                <span className="text-xs font-semibold text-slate-300">{name}</span>
                            </div>

                            {/* Scale Options (if applicable) */}
                            {scaleOptions && (
                                <div className="py-1">
                                    <div className="px-3 py-1.5 flex items-center gap-2 text-slate-400">
                                        <Settings2 className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Range / Scale</span>
                                    </div>
                                    {scaleOptions.map(opt => (
                                        <button
                                            key={opt.label}
                                            onClick={() => {
                                                updateProperties(id, { scale: opt.scale, unit: opt.unit });
                                                setContextMenu(null);
                                            }}
                                            className="w-full px-3 py-1.5 text-left text-sm text-slate-300 hover:bg-blue-600/20 hover:text-blue-200 transition-colors flex items-center justify-between group"
                                        >
                                            <span>{opt.label}</span>
                                            {properties.unit === opt.unit && properties.scale === opt.scale && (
                                                <Check className="w-4 h-4 text-blue-400" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {scaleOptions && <div className="h-px bg-slate-800 my-1"></div>}

                            {/* Remove Option */}
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        removeInstrument(id);
                                        setContextMenu(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Remove Instrument</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const Instrument = React.memo(InstrumentComponent, (prev, next) => {
    if (!prev || !next) return false;
    return (
        prev.id === next.id &&
        prev.type === next.type &&
        prev.name === next.name &&
        prev.position.x === next.position.x &&
        prev.position.y === next.position.y &&
        (prev.terminals || []).length === (next.terminals || []).length &&
        JSON.stringify(prev.properties) === JSON.stringify(next.properties)
    );
});
