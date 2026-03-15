"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Instrument as InstrumentType, usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentVisuals } from './instruments/InstrumentVisuals';
import { WireConnectPanel } from './WireConnectPanel';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Trash2, Settings2, Check, RotateCcw, Copy, Info } from '@/lib/icons';

interface InstrumentProps {
    id: string;
    type: string;
    name: string;
    position: { x: number; y: number };
    properties: Record<string, any>;
    terminals: any[];
    onPositionChange: (id: string, x: number, y: number) => void;
    onTerminalPointerDown?: (id: string, type: string) => void;
    onTerminalPointerUp?: (id: string, type: string) => void;
    onTerminalHover?: (id: string | null) => void;
    onTerminalDoubleClick?: (id: string, type: string) => void;
    updateProperties: (id: string, props: any) => void;
    onInstrumentDoubleClick?: (instrumentId: string) => void;
    showWirePanel?: boolean;
    onWirePanelClose?: () => void;
    onWireConnect?: (fromTerminalId: string, toTerminalId: string) => void;
    onWireDisconnect?: (connectionId: string) => void;
    onDrag?: (id: string, x: number, y: number) => void;
    onDragEndLive?: (id: string) => void;
    activeConnectionFromId?: string | null;
    currentHoveredTerminalId?: string | null;
}

const InstrumentComponent: React.FC<InstrumentProps> = ({
    id,
    type,
    name,
    position,
    properties,
    terminals = [], // Default to empty array
    onPositionChange,
    onTerminalPointerDown,
    onTerminalPointerUp,
    onTerminalHover,
    onTerminalDoubleClick,
    updateProperties,
    onInstrumentDoubleClick,
    showWirePanel,
    onWirePanelClose,
    onWireConnect,
    onWireDisconnect,
    onDrag,
    onDragEndLive,
    activeConnectionFromId,
    currentHoveredTerminalId,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);
    const { connections, instruments, removeInstrument, addInstrument } = usePhysicsLab();

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
        if (onDragEndLive) onDragEndLive(id);
    };

    const handleDrag = (_e: any, info: any) => {
        if (onDrag) onDrag(id, info.offset.x, info.offset.y);
    };

    const handleInstrumentClick = () => {
        if (type === 'switch') {
            updateProperties(id, { closed: !properties.closed });
        }
        setContextMenu(null); // Close menu on regular click
    };

    const handleInstrumentDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (onInstrumentDoubleClick) {
            onInstrumentDoubleClick(id);
        }
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

    // Available scales by instrument type (realistic lab ranges)
    const getScaleOptions = () => {
        switch (type) {
            case 'ammeter': return [
                { label: "100 mA", unit: "mA", scale: 100 },
                { label: "500 mA", unit: "mA", scale: 500 },
                { label: "1 A", unit: "A", scale: 1 },
                { label: "5 A", unit: "A", scale: 5 },
                { label: "10 A", unit: "A", scale: 10 },
            ];
            case 'voltmeter': return [
                { label: "3 V", unit: "V", scale: 3 },
                { label: "5 V", unit: "V", scale: 5 },
                { label: "15 V", unit: "V", scale: 15 },
                { label: "20 V", unit: "V", scale: 20 },
                { label: "100 V", unit: "V", scale: 100 },
                { label: "300 V", unit: "V", scale: 300 },
            ];
            case 'galvanometer': return [
                { label: "30 µA", unit: "µA", scale: 30 },
                { label: "100 µA", unit: "µA", scale: 100 },
                { label: "500 µA", unit: "µA", scale: 500 },
            ];
            default: return null;
        }
    };
    const scaleOptions = getScaleOptions();

    // Whether this instrument is a meter (has a reading that can be zeroed)
    const isMeter = type === 'ammeter' || type === 'voltmeter' || type === 'galvanometer';

    // Get a human-readable summary of the current scale/range
    const currentScaleLabel = useMemo(() => {
        if (!scaleOptions) return null;
        const match = scaleOptions.find(opt => opt.unit === properties.unit && opt.scale === properties.scale);
        if (match) return match.label;
        // Fallback: construct from properties
        if (properties.scale !== null && properties.scale !== undefined && properties.unit) return `${properties.scale} ${properties.unit}`;
        return null;
    }, [scaleOptions, properties.unit, properties.scale]);

    const handleZeroReading = () => {
        updateProperties(id, { reading: 0 });
        setContextMenu(null);
    };

    const handleDuplicate = () => {
        const now = Date.now();
        addInstrument({
            type,
            name,
            position: { x: position.x + 40, y: position.y + 40 },
            properties: { ...properties },
            terminals: terminals.map((t, idx) => ({
                ...t,
                id: `${type}-t${idx}-${now}-${Math.random().toString(36).slice(2, 8)}`,
            })),
        });
        setContextMenu(null);
    };

    const dragControls = useDragControls();

    return (
        <motion.div
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            onDragStart={(e) => {
                setIsDragging(true);
            }}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            initial={false}
            animate={isDragging ? undefined : {
                x: position.x,
                y: position.y,
                scale: isHovered ? 1.02 : 1,
                rotate: 0,
                transition: { type: 'tween', duration: 0.15, ease: 'easeOut' }
            }}
            whileDrag={{
                scale: 1.02,
                rotate: 0,
                zIndex: 1000,
                cursor: "grabbing",
                filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.3))",
                transition: { duration: 0.1 }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onContextMenu={handleContextMenu}
            className="absolute"
            style={{ touchAction: 'none' } as any}
        >
            <div className="relative group" onDoubleClick={handleInstrumentDoubleClick}>
                {/* Drag Handle & Main Interaction Area */}
                <div 
                    className="cursor-grab active:cursor-grabbing"
                    onPointerDown={(e) => {
                        // Only start drag on left click or touch
                        if (e.button === 0 || e.pointerType !== 'mouse') {
                            dragControls.start(e);
                        }
                    }}
                    onClick={handleInstrumentClick}
                >
                    {/* Drag Handle Indicator */}
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-slate-700/30 rounded-full opacity-0 group-hover:opacity-100 transition-all ${isDragging ? 'opacity-0 scale-50' : 'scale-100'}`} />

                    {/* Instrument Visual */}
                    <InstrumentVisuals
                        type={type}
                        properties={properties}
                        isHovered={isHovered}
                        onPropertyChange={(props: any) => updateProperties(id, props)}
                    />

                    {/* Label */}
                    <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all bg-slate-900/90 border border-slate-700/50 px-3 py-1.5 rounded-lg shadow-2xl text-[10px] uppercase font-bold tracking-tight text-slate-100 pointer-events-none flex flex-col items-center gap-0.5 ${isHovered && !isDragging && !contextMenu ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-2 scale-90'}`}>
                        <span>{name}</span>
                        {isMeter && properties.reading !== undefined && (
                            <span className="text-[9px] text-blue-400 font-mono">
                                {Number(properties.reading).toFixed(2)} {properties.unit}
                            </span>
                        )}
                    </div>

                    {/* Scale Indicator Badge (visible when not hovered, for meters only) */}
                    {currentScaleLabel && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-300 pointer-events-none select-none">
                            {currentScaleLabel}
                        </div>
                    )}
                </div>

                {/* Terminals */}
                {terminals.map((t) => {
                    const isMechanicalTerminal = t.type === 'input' || t.type === 'output';
                    const isSource = activeConnectionFromId === t.id;
                    const isTarget = currentHoveredTerminalId === t.id;
                    const isPotentialTarget = activeConnectionFromId && !isSource;

                    return (
                        <button
                            key={t.id}
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                e.currentTarget.releasePointerCapture(e.pointerId);
                                if (onTerminalPointerDown) onTerminalPointerDown(t.id, t.type);
                            }}
                            onPointerEnter={() => {
                                if (onTerminalHover) onTerminalHover(t.id);
                            }}
                            onPointerLeave={() => {
                                if (onTerminalHover) onTerminalHover(null);
                            }}
                            onPointerUp={(e) => {
                                e.stopPropagation();
                                if (onTerminalPointerUp) onTerminalPointerUp(t.id, t.type);
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (onTerminalDoubleClick) onTerminalDoubleClick(t.id, t.type);
                            }}
                            className={`absolute w-5 h-5 rounded-full border-2 transition-all duration-200 z-20 
                                ${isMechanicalTerminal
                                    ? 'bg-amber-700 border-amber-600 shadow-[0_0_8px_rgba(180,130,80,0.4)]'
                                    : t.type === 'positive'
                                        ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                        : 'bg-black border-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                                } 
                                ${onTerminalHover && 'hover:scale-125 cursor-pointer'} 
                                ${connectedState.connectedTerminalIds.has(t.id) ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' : ''}
                                ${isSource ? 'animate-pulse scale-110 ring-4 ring-blue-500/50' : ''}
                                ${isTarget ? 'scale-150 ring-4 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.8)]' : ''}
                                ${isPotentialTarget && !isTarget ? 'ring-2 ring-blue-400/30' : ''}
                            `}
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
                            className="w-52 bg-slate-900 rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-slate-700 overflow-hidden flex flex-col py-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Title */}
                            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-300">{name}</span>
                                {currentScaleLabel && (
                                    <span className="text-[9px] font-medium text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                                        {currentScaleLabel}
                                    </span>
                                )}
                            </div>

                            {/* Scale Options (for meters) */}
                            {scaleOptions && (
                                <div className="py-1">
                                    <div className="px-3 py-1.5 flex items-center gap-2 text-slate-400">
                                        <Settings2 className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Update Scaling</span>
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

                            {scaleOptions && <div className="h-px bg-slate-800 my-1" />}

                            {/* Zero / Calibrate (for meters) */}
                            {isMeter && (
                                <div className="py-1">
                                    <button
                                        onClick={handleZeroReading}
                                        className="w-full px-3 py-1.5 text-left text-sm text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-200 transition-colors flex items-center gap-2"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        <span>Zero / Calibrate</span>
                                    </button>
                                </div>
                            )}

                            {/* Instrument Info */}
                            {isMeter && properties.reading != null && (
                                <div className="px-3 py-1.5 flex items-center gap-2 text-slate-500">
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="text-[10px]">
                                        Reading: {Number(properties.reading).toFixed(2)} {properties.unit || ''}
                                    </span>
                                </div>
                            )}

                            {isMeter && <div className="h-px bg-slate-800 my-1" />}

                            {/* Duplicate */}
                            <div className="py-1">
                                <button
                                    onClick={handleDuplicate}
                                    className="w-full px-3 py-1.5 text-left text-sm text-slate-300 hover:bg-purple-600/20 hover:text-purple-200 transition-colors flex items-center gap-2"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Duplicate Instrument</span>
                                </button>
                            </div>

                            <div className="h-px bg-slate-800 my-1" />

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
                                    <span>Remove</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Wire Connect Panel (shown on double-click) */}
            <AnimatePresence>
                {showWirePanel && onWirePanelClose && onWireConnect && onWireDisconnect && (
                    <WireConnectPanel
                        instrument={{ id, type, name, position, properties, terminals }}
                        allInstruments={instruments}
                        connections={connections}
                        onConnect={onWireConnect}
                        onDisconnect={onWireDisconnect}
                        onClose={onWirePanelClose}
                    />
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
        JSON.stringify(prev.properties) === JSON.stringify(next.properties) &&
        prev.showWirePanel === next.showWirePanel &&
        prev.activeConnectionFromId === next.activeConnectionFromId &&
        prev.currentHoveredTerminalId === next.currentHoveredTerminalId
    );
});
