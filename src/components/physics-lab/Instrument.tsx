"use client";

import React, { useMemo, useState } from 'react';
import { Instrument as InstrumentType, usePhysicsLab } from '@/context/PhysicsLabContext';
import { InstrumentVisuals } from './instruments/InstrumentVisuals';
import { motion } from 'framer-motion';

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
    const { connections, instruments, removeInstrument } = usePhysicsLab();

    const connectedState = useMemo(() => {
        if (!terminals) return { connectedTerminalIds: new Set<string>(), connectedNames: [], count: 0 };
        const ownTerminalIds = new Set(terminals.map((t) => t.id));

        const ownConnections = connections.filter(
            (conn) => ownTerminalIds.has(conn.from) || ownTerminalIds.has(conn.to)
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
                if (inst.terminals.some((t) => t.id === terminalId)) {
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
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        removeInstrument(id);
    };

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
                {terminals.map((t) => (
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
                        className={`absolute w-4 h-4 rounded-full border-2 transition-transform hover:scale-125 z-20 ${t.type === 'positive'
                            ? 'bg-red-500 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                            : 'bg-black border-slate-700 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                            }`}
                        style={{
                            left: t.position.x,
                            top: t.position.y,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: connectedState.connectedTerminalIds.has(t.id)
                                ? '0 0 0 2px rgba(59,130,246,0.85), 0 0 16px rgba(59,130,246,0.65)'
                                : undefined
                        }}
                        title={`${t.type} terminal`}
                    />
                ))}

                {/* Label */}
                <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all bg-slate-900/90 border border-slate-700/50 px-3 py-1 rounded shadow-xl text-[10px] uppercase font-bold tracking-tighter text-slate-300 pointer-events-none ${isHovered && !isDragging ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    {name}
                </div>
            </div>
        </motion.div>
    );
};

export const Instrument = React.memo(InstrumentComponent, (prev, next) => {
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
